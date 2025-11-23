"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { authOptions } from "@/lib/auth";

/**
 * Task Server Actions
 * 
 * Purpose: Handle all task-related operations
 * - Create tasks
 * - Update tasks
 * - Delete tasks
 * - Assign tasks
 * - Update task status
 * - Reorder tasks
 */

// ==================== Helper Functions ====================

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  return user;
}

async function checkTaskAccess(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          team: {
            include: {
              members: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });
  
  if (!task || task.project.team.members.length === 0) {
    throw new Error("Access denied");
  }
  
  return task;
}

// ==================== Task Actions ====================

export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
}) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: {
        team: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });
    
    if (!project || project.team.members.length === 0) {
      return { success: false, error: "Access denied" };
    }
    
    // Get the highest position in the project
    const highestPosition = await prisma.task.findFirst({
      where: { projectId: data.projectId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    
    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status || TaskStatus.TODO,
        priority: data.priority || TaskPriority.MEDIUM,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        createdBy: user.id,
        position: (highestPosition?.position || 0) + 1,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: project.teamId,
        projectId: project.id,
        actionType: "TASK_CREATED",
        actionData: {
          taskTitle: task.title,
          projectName: project.name,
          userName: user.name,
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${data.projectId}`);
    return { success: true, task };
  } catch (error) {
    console.error("Create task error:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTask(data: {
  taskId: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date | null;
}) {
  try {
    const user = await getCurrentUser();
    const task = await checkTaskAccess(data.taskId, user.id);
    
    const updatedTask = await prisma.task.update({
      where: { id: data.taskId },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: task.project.teamId,
        projectId: task.projectId,
        actionType: "TASK_UPDATED",
        actionData: {
          taskTitle: updatedTask.title,
          projectName: task.project.name,
          userName: user.name,
          changes: {
            title: data.title ? { from: task.title, to: data.title } : undefined,
            priority: data.priority ? { from: task.priority, to: data.priority } : undefined,
          },
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Update task error:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function updateTaskStatus(data: {
  taskId: string;
  status: TaskStatus;
}) {
  try {
    const user = await getCurrentUser();
    const task = await checkTaskAccess(data.taskId, user.id);
    
    const updatedTask = await prisma.task.update({
      where: { id: data.taskId },
      data: { status: data.status },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: task.project.teamId,
        projectId: task.projectId,
        actionType: data.status === "DONE" ? "TASK_COMPLETED" : "TASK_UPDATED",
        actionData: {
          taskTitle: updatedTask.title,
          projectName: task.project.name,
          userName: user.name,
          oldStatus: task.status,
          newStatus: data.status,
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Update task status error:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function assignTask(data: {
  taskId: string;
  userId: string | null;
}) {
  try {
    const user = await getCurrentUser();
    const task = await checkTaskAccess(data.taskId, user.id);
    
    const updatedTask = await prisma.task.update({
      where: { id: data.taskId },
      data: { assignedTo: data.userId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: task.project.teamId,
        projectId: task.projectId,
        actionType: "TASK_ASSIGNED",
        actionData: {
          taskTitle: updatedTask.title,
          projectName: task.project.name,
          userName: user.name,
          assigneeName: updatedTask.assignee?.name || "Unassigned",
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Assign task error:", error);
    return { success: false, error: "Failed to assign task" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const user = await getCurrentUser();
    const task = await checkTaskAccess(taskId, user.id);
    
    await prisma.task.delete({
      where: { id: taskId },
    });

    // Create activity (we can't link to the deleted task, but we can link to the project)
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: task.project.teamId,
        projectId: task.projectId,
        actionType: "TASK_UPDATED", // Using UPDATED as there isn't a DELETED type in the enum shown, or we could add one.
        // Wait, looking at schema, there isn't TASK_DELETED. I'll use TASK_UPDATED with details.
        actionData: {
          taskTitle: task.title,
          projectName: task.project.name,
          userName: user.name,
          action: "deleted",
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete task error:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function reorderTasks(data: {
  projectId: string;
  taskId: string;
  newPosition: number;
  newStatus?: TaskStatus;
}) {
  try {
    const user = await getCurrentUser();
    
    // Check access to project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: {
        team: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });
    
    if (!project || project.team.members.length === 0) {
      return { success: false, error: "Access denied" };
    }
    
    // Use a transaction to reorder tasks
    await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id: data.taskId },
      });
      
      if (!task) {
        throw new Error("Task not found");
      }
      
      const oldPosition = task.position;
      const oldStatus = task.status;
      
      // If status changed, we need to handle positions in both columns
      if (data.newStatus && data.newStatus !== oldStatus) {
        // Decrease positions in old column
        await tx.task.updateMany({
          where: {
            projectId: data.projectId,
            status: oldStatus,
            position: { gt: oldPosition },
          },
          data: {
            position: { decrement: 1 },
          },
        });
        
        // Increase positions in new column
        await tx.task.updateMany({
          where: {
            projectId: data.projectId,
            status: data.newStatus,
            position: { gte: data.newPosition },
          },
          data: {
            position: { increment: 1 },
          },
        });
        
        // Update the task
        await tx.task.update({
          where: { id: data.taskId },
          data: {
            position: data.newPosition,
            status: data.newStatus,
          },
        });
      } else {
        // Reordering within the same column
        if (data.newPosition < oldPosition) {
          // Moving up
          await tx.task.updateMany({
            where: {
              projectId: data.projectId,
              status: task.status,
              position: {
                gte: data.newPosition,
                lt: oldPosition,
              },
            },
            data: {
              position: { increment: 1 },
            },
          });
        } else if (data.newPosition > oldPosition) {
          // Moving down
          await tx.task.updateMany({
            where: {
              projectId: data.projectId,
              status: task.status,
              position: {
                gt: oldPosition,
                lte: data.newPosition,
              },
            },
            data: {
              position: { decrement: 1 },
            },
          });
        }
        
        // Update the task position
        await tx.task.update({
          where: { id: data.taskId },
          data: { position: data.newPosition },
        });
      }
    });
    
    revalidatePath(`/dashboard/project/${data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Reorder tasks error:", error);
    return { success: false, error: "Failed to reorder tasks" };
  }
}

export async function getUserTasks(filters?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedOnly?: boolean;
}) {
  try {
    const user = await getCurrentUser();
    
    const tasks = await prisma.task.findMany({
      where: {
        ...(filters?.assignedOnly && { assignedTo: user.id }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.priority && { priority: filters.priority }),
        project: {
          team: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { dueDate: "asc" },
        { priority: "desc" },
      ],
    });
    
    return { success: true, tasks };
  } catch (error) {
    console.error("Get user tasks error:", error);
    return { success: false, error: "Failed to get tasks" };
  }
}
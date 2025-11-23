"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

/**
 * Comment Server Actions
 * 
 * Purpose: Handle all comment-related operations for tasks
 * - Create comments
 * - Update comments
 * - Delete comments
 * - Get task comments
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

async function checkCommentAccess(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      task: {
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
      },
    },
  });
  
  if (!comment || comment.task.project.team.members.length === 0) {
    throw new Error("Access denied");
  }
  
  return comment;
}

// ==================== Comment Actions ====================

export async function getTaskComments(taskId: string) {
  try {
    const user = await getCurrentUser();
    
    // Verify user has access to the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            team: {
              include: {
                members: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
      },
    });
    
    if (!task || task.project.team.members.length === 0) {
      return { success: false, error: "Access denied" };
    }
    
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    
    return { success: true, comments };
  } catch (error) {
    console.error("Get task comments error:", error);
    return { success: false, error: "Failed to get comments" };
  }
}

export async function createComment(data: {
  taskId: string;
  content: string;
}) {
  try {
    const user = await getCurrentUser();
    
    // Verify user has access to the task
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
      include: {
        project: {
          include: {
            team: {
              include: {
                members: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
      },
    });
    
    if (!task || task.project.team.members.length === 0) {
      return { success: false, error: "Access denied" };
    }
    
    const comment = await prisma.comment.create({
      data: {
        taskId: data.taskId,
        userId: user.id,
        content: data.content,
      },
      include: {
        user: {
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
        teamId: task.project.teamId,
        actionType: "TASK_COMMENTED",
        actionData: {
          taskTitle: task.title,
          projectName: task.project.name,
          userName: user.name,
          comment: data.content.substring(0, 100), // First 100 chars
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Create comment error:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function updateComment(data: {
  commentId: string;
  content: string;
}) {
  try {
    const user = await getCurrentUser();
    const comment = await checkCommentAccess(data.commentId, user.id);
    
    // Only the comment author can update it
    if (comment.userId !== user.id) {
      return { success: false, error: "You can only edit your own comments" };
    }
    
    const updatedComment = await prisma.comment.update({
      where: { id: data.commentId },
      data: { content: data.content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${comment.task.projectId}`);
    return { success: true, comment: updatedComment };
  } catch (error) {
    console.error("Update comment error:", error);
    return { success: false, error: "Failed to update comment" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const user = await getCurrentUser();
    const comment = await checkCommentAccess(commentId, user.id);
    
    // Only the comment author can delete it
    if (comment.userId !== user.id) {
      return { success: false, error: "You can only delete your own comments" };
    }
    
    await prisma.comment.delete({
      where: { id: commentId },
    });
    
    revalidatePath(`/dashboard/project/${comment.task.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

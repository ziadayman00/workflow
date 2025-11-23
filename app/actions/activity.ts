"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

/**
 * Activity & Comment Server Actions
 * 
 * Purpose: Handle activity feed and task comments
 * - Get team activities
 * - Get user activities
 * - Create comments
 * - Update comments
 * - Delete comments
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

// ==================== Activity Actions ====================

export async function getUserActivities(limit: number = 20) {
  try {
    const user = await getCurrentUser();
    
    const activities = await prisma.activity.findMany({
      where: {
        OR: [
          { userId: user.id }, // Activities by the user
          { 
            project: {
              team: {
                members: {
                  some: {
                    userId: user.id
                  }
                }
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return { success: true, activities };
  } catch (error) {
    console.error("Get user activities error:", error);
    return { success: false, error: "Failed to get activities" };
  }
}

export async function getTeamActivities(teamId: string, limit: number = 20) {
  try {
    const user = await getCurrentUser();
    
    // Check if user is a member of the team
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    });
    
    if (!membership) {
      return { success: false, error: "Access denied" };
    }
    
    const activities = await prisma.activity.findMany({
      where: { teamId },
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
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
    
    return { success: true, activities };
  } catch (error) {
    console.error("Get team activities error:", error);
    return { success: false, error: "Failed to get activities" };
  }
}

export async function getProjectActivities(projectId: string, limit: number = 20) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
    
    const activities = await prisma.activity.findMany({
      where: { projectId },
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
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
    
    return { success: true, activities };
  } catch (error) {
    console.error("Get project activities error:", error);
    return { success: false, error: "Failed to get activities" };
  }
}

export async function getTaskComments(taskId: string) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to the task
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
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return { success: true, comments };
  } catch (error) {
    console.error("Get task comments error:", error);
    return { success: false, error: "Failed to get comments" };
  }
}

export async function updateComment(data: {
  commentId: string;
  content: string;
}) {
  try {
    const user = await getCurrentUser();
    
    // Check if user owns the comment
    const comment = await prisma.comment.findUnique({
      where: { id: data.commentId },
    });
    
    if (!comment || comment.userId !== user.id) {
      return { success: false, error: "Access denied" };
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
        task: {
          select: {
            projectId: true,
          },
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${updatedComment.task.projectId}`);
    return { success: true, comment: updatedComment };
  } catch (error) {
    console.error("Update comment error:", error);
    return { success: false, error: "Failed to update comment" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const user = await getCurrentUser();
    
    // Check if user owns the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          select: {
            projectId: true,
          },
        },
      },
    });
    
    if (!comment || comment.userId !== user.id) {
      return { success: false, error: "Access denied" };
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
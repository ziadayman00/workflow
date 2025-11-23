"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

/**
 * Dashboard Server Actions
 * 
 * Purpose: Handle dashboard-specific data aggregation
 * - Get dashboard statistics
 * - Get overview data
 */

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

export async function getDashboardStats() {
  try {
    const user = await getCurrentUser();
    
    // Get all teams the user is a member of
    const userTeams = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    });
    
    const teamIds = userTeams.map(t => t.teamId);
    
    // Get all tasks from user's teams
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          teamId: {
            in: teamIds,
          },
        },
      },
      select: {
        id: true,
        status: true,
        dueDate: true,
      },
    });
    
    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;
    
    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < now && t.status !== TaskStatus.DONE
    ).length;
    
    // Get active projects count
    const projectsCount = await prisma.project.count({
      where: {
        teamId: {
          in: teamIds,
        },
      },
    });
    
    return {
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        activeProjects: projectsCount,
      },
    };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return { success: false, error: "Failed to get dashboard stats" };
  }
}

export async function ensureUserHasTeam() {
  try {
    const user = await getCurrentUser();
    
    // Check if user has any teams
    const teamsCount = await prisma.teamMember.count({
      where: { userId: user.id },
    });
    
    // If no teams, create a default one
    if (teamsCount === 0) {
      const defaultTeam = await prisma.team.create({
        data: {
          name: `${user.name}'s Team`,
          createdBy: user.id,
          members: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
      });
      
      // Create activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          teamId: defaultTeam.id,
          actionType: "MEMBER_JOINED",
          actionData: {
            teamName: defaultTeam.name,
            userName: user.name,
          },
        },
      });
      
      return { success: true, team: defaultTeam };
    }
    
    return { success: true, team: null };
  } catch (error) {
    console.error("Ensure user has team error:", error);
    return { success: false, error: "Failed to ensure user has team" };
  }
}
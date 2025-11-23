"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * Dashboard Statistics Server Actions
 * 
 * Purpose: Provide aggregated statistics for the dashboard
 * - Overall statistics
 * - Task statistics
 * - Project statistics
 * - Team statistics
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

// ==================== Dashboard Statistics ====================

export async function getDashboardStats() {
  try {
    const user = await getCurrentUser();
    
    // Get all teams the user is a member of
    const userTeams = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    });
    
    const teamIds = userTeams.map(t => t.teamId);
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Tasks completed today
    const tasksCompletedToday = await prisma.task.count({
      where: {
        project: {
          teamId: { in: teamIds },
        },
        status: "DONE",
        updatedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    
    // Tasks in progress
    const tasksInProgress = await prisma.task.count({
      where: {
        project: {
          teamId: { in: teamIds },
        },
        status: "IN_PROGRESS",
      },
    });
    
    // Overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        project: {
          teamId: { in: teamIds },
        },
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
      },
    });
    
    // Active projects
    const activeProjects = await prisma.project.count({
      where: {
        teamId: { in: teamIds },
        status: "ACTIVE",
      },
    });
    
    return {
      success: true,
      stats: {
        tasksCompletedToday,
        tasksInProgress,
        overdueTasks,
        activeProjects,
      },
    };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return { success: false, error: "Failed to get dashboard stats" };
  }
}

export async function getUserTaskStats() {
  try {
    const user = await getCurrentUser();
    
    // Get all teams the user is a member of
    const userTeams = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    });
    
    const teamIds = userTeams.map(t => t.teamId);
    
    // Get tasks assigned to user
    const assignedTasks = await prisma.task.findMany({
      where: {
        assignedTo: user.id,
        project: {
          teamId: { in: teamIds },
        },
      },
      select: {
        status: true,
        priority: true,
        dueDate: true,
      },
    });
    
    // Calculate statistics
    const totalAssigned = assignedTasks.length;
    const completed = assignedTasks.filter(t => t.status === "DONE").length;
    const inProgress = assignedTasks.filter(t => t.status === "IN_PROGRESS").length;
    const todo = assignedTasks.filter(t => t.status === "TODO").length;
    
    const overdue = assignedTasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    ).length;
    
    const highPriority = assignedTasks.filter(
      t => (t.priority === "HIGH" || t.priority === "URGENT") && t.status !== "DONE"
    ).length;
    
    // Calculate completion rate
    const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;
    
    // Get tasks due this week
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const dueThisWeek = assignedTasks.filter(
      t => t.dueDate && 
           new Date(t.dueDate) >= today && 
           new Date(t.dueDate) <= weekFromNow &&
           t.status !== "DONE"
    ).length;
    
    return {
      success: true,
      stats: {
        totalAssigned,
        completed,
        inProgress,
        todo,
        overdue,
        highPriority,
        dueThisWeek,
        completionRate,
      },
    };
  } catch (error) {
    console.error("Get user task stats error:", error);
    return { success: false, error: "Failed to get task stats" };
  }
}

export async function getTeamStats(teamId: string) {
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
    
    // Get team projects
    const projects = await prisma.project.findMany({
      where: { teamId },
      include: {
        tasks: {
          select: {
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
    });
    
    // Calculate project statistics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "ACTIVE").length;
    const completedProjects = projects.filter(p => p.status === "COMPLETED").length;
    
    // Calculate task statistics
    const allTasks = projects.flatMap(p => p.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === "DONE").length;
    const inProgressTasks = allTasks.filter(t => t.status === "IN_PROGRESS").length;
    
    const overdueTasks = allTasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    ).length;
    
    // Calculate completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Get member count
    const memberCount = await prisma.teamMember.count({
      where: { teamId },
    });
    
    // Get recent activity count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivityCount = await prisma.activity.count({
      where: {
        teamId,
        createdAt: { gte: sevenDaysAgo },
      },
    });
    
    return {
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        completionRate,
        memberCount,
        recentActivityCount,
      },
    };
  } catch (error) {
    console.error("Get team stats error:", error);
    return { success: false, error: "Failed to get team stats" };
  }
}

export async function getProductivityStats(timeframe: "week" | "month" | "year" = "week") {
  try {
    const user = await getCurrentUser();
    
    // Get all teams the user is a member of
    const userTeams = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    });
    
    const teamIds = userTeams.map(t => t.teamId);
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Get tasks completed in timeframe
    const completedTasks = await prisma.task.findMany({
      where: {
        project: {
          teamId: { in: teamIds },
        },
        status: "DONE",
        updatedAt: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        updatedAt: true,
        priority: true,
      },
    });
    
    // Group by day
    const tasksByDay: Record<string, number> = {};
    completedTasks.forEach(task => {
      const date = task.updatedAt.toISOString().split("T")[0];
      tasksByDay[date] = (tasksByDay[date] || 0) + 1;
    });
    
    // Calculate average tasks per day
    const totalDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const avgTasksPerDay = completedTasks.length / totalDays;
    
    // Get tasks created in timeframe
    const createdTasks = await prisma.task.count({
      where: {
        project: {
          teamId: { in: teamIds },
        },
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
    });
    
    return {
      success: true,
      stats: {
        completedTasks: completedTasks.length,
        createdTasks,
        avgTasksPerDay: Math.round(avgTasksPerDay * 10) / 10,
        tasksByDay,
        timeframe,
      },
    };
  } catch (error) {
    console.error("Get productivity stats error:", error);
    return { success: false, error: "Failed to get productivity stats" };
  }
}
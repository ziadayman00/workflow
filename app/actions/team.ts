"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TeamRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";

/**
 * Team Server Actions
 * 
 * Purpose: Handle all team-related operations
 * - Create teams
 * - Get team details
 * - Add/remove members
 * - Update team settings
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

async function checkTeamAccess(teamId: string, userId: string, requiredRole?: TeamRole) {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });
  
  if (!membership) {
    throw new Error("Access denied");
  }
  
  if (requiredRole === TeamRole.ADMIN && membership.role !== TeamRole.ADMIN) {
    throw new Error("Admin access required");
  }
  
  return membership;
}

// ==================== Team Actions ====================

export async function createTeam(data: { name: string }) {
  try {
    const user = await getCurrentUser();
    
    const team = await prisma.team.create({
      data: {
        name: data.name,
        createdBy: user.id,
        members: {
          create: {
            userId: user.id,
            role: TeamRole.ADMIN,
          },
        },
      },
      include: {
        members: {
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
        },
      },
    });
    
    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: team.id,
        actionType: "MEMBER_JOINED",
        actionData: {
          teamName: team.name,
          userName: user.name,
        },
      },
    });
    
    revalidatePath("/dashboard");
    return { success: true, team };
  } catch (error) {
    console.error("Create team error:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function getTeam(teamId: string) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(teamId, user.id);
    
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
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
        },
        projects: {
          include: {
            tasks: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });
    
    return { success: true, team };
  } catch (error) {
    console.error("Get team error:", error);
    return { success: false, error: "Failed to get team" };
  }
}

export async function getUserTeams() {
  try {
    const user = await getCurrentUser();
    
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
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
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return { success: true, teams };
  } catch (error) {
    console.error("Get user teams error:", error);
    return { success: false, error: "Failed to get teams" };
  }
}

export async function addTeamMember(data: {
  teamId: string;
  email: string;
  role?: TeamRole;
}) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(data.teamId, user.id, TeamRole.ADMIN);
    
    // Find user by email
    const newMember = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (!newMember) {
      return { success: false, error: "User not found" };
    }
    
    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: newMember.id,
        },
      },
    });
    
    if (existingMember) {
      return { success: false, error: "User is already a member" };
    }
    
    // Add member
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: data.teamId,
        userId: newMember.id,
        role: data.role || TeamRole.MEMBER,
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
        teamId: data.teamId,
        actionType: "MEMBER_JOINED",
        actionData: {
          userName: newMember.name,
          addedBy: user.name,
        },
      },
    });
    
    revalidatePath(`/dashboard/team/${data.teamId}`);
    return { success: true, member: teamMember };
  } catch (error) {
    console.error("Add team member error:", error);
    return { success: false, error: "Failed to add team member" };
  }
}

export async function removeTeamMember(data: {
  teamId: string;
  userId: string;
}) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(data.teamId, user.id, TeamRole.ADMIN);
    
    // Cannot remove yourself if you're the only admin
    if (data.userId === user.id) {
      const adminCount = await prisma.teamMember.count({
        where: {
          teamId: data.teamId,
          role: TeamRole.ADMIN,
        },
      });
      
      if (adminCount === 1) {
        return { success: false, error: "Cannot remove the only admin" };
      }
    }
    
    const removedMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: data.userId,
        },
      },
      include: {
        user: true,
      },
    });
    
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: data.userId,
        },
      },
    });
    
    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: data.teamId,
        actionType: "MEMBER_LEFT",
        actionData: {
          userName: removedMember?.user.name,
          removedBy: user.name,
        },
      },
    });
    
    revalidatePath(`/dashboard/team/${data.teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Remove team member error:", error);
    return { success: false, error: "Failed to remove team member" };
  }
}

export async function updateTeamMemberRole(data: {
  teamId: string;
  userId: string;
  role: TeamRole;
}) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(data.teamId, user.id, TeamRole.ADMIN);
    
    const teamMember = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: data.userId,
        },
      },
      data: {
        role: data.role,
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
    
    revalidatePath(`/dashboard/team/${data.teamId}`);
    return { success: true, member: teamMember };
  } catch (error) {
    console.error("Update team member role error:", error);
    return { success: false, error: "Failed to update member role" };
  }
}

export async function updateTeam(data: {
  teamId: string;
  name: string;
}) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(data.teamId, user.id, TeamRole.ADMIN);
    
    const team = await prisma.team.update({
      where: { id: data.teamId },
      data: {
        name: data.name,
      },
    });
    
    revalidatePath(`/dashboard/team/${data.teamId}`);
    return { success: true, team };
  } catch (error) {
    console.error("Update team error:", error);
    return { success: false, error: "Failed to update team" };
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(teamId, user.id, TeamRole.ADMIN);
    
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    
    if (team?.createdBy !== user.id) {
      return { success: false, error: "Only team creator can delete the team" };
    }
    
    await prisma.team.delete({
      where: { id: teamId },
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete team error:", error);
    return { success: false, error: "Failed to delete team" };
  }
}
"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TeamRole, InvitationStatus, ProjectRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";

/**
 * Invitation Server Actions
 * 
 * Purpose: Handle team invitation operations
 * - Create invitations
 * - Accept/reject invitations
 * - Get user/team invitations
 * - Cancel invitations
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

async function checkProjectAccess(projectId: string, userId: string) {
  // Check project membership first
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (projectMember && (projectMember.role === 'OWNER' || projectMember.role === 'ADMIN')) {
    return true;
  }

  // Fallback: Check team admin access
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      team: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
    },
  });

  if (project?.team.members[0]?.role === 'ADMIN') {
    return true;
  }

  throw new Error("Admin access required");
}

// ==================== Invitation Actions ====================

export async function createInvitation(data: {
  projectId: string;
  email: string;
  role?: ProjectRole;
}) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has project admin/owner access
    await checkProjectAccess(data.projectId, user.id);
    
    // Get project to get teamId
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });
    
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    
    // Check if email exists in database
    const invitedUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (!invitedUser) {
      return { success: false, error: "User not found. They need to sign up first." };
    }
    
    // Check if already a project member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: invitedUser.id,
        },
      },
    });
    
    if (existingMember) {
      return { success: false, error: "User is already a project member" };
    }
    
    // Check if invitation already exists for this project
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        projectId_email: {
          projectId: data.projectId,
          email: data.email,
        },
      },
    });
    
    if (existingInvitation && existingInvitation.status === InvitationStatus.PENDING) {
      return { success: false, error: "Invitation already sent for this project" };
    }
    
    // Create or update invitation
    const invitation = await prisma.invitation.upsert({
      where: {
        projectId_email: {
          projectId: data.projectId,
          email: data.email,
        },
      },
      update: {
        status: InvitationStatus.PENDING,
        role: data.role || "MEMBER",
        invitedBy: user.id,
        createdAt: new Date(),
      },
      create: {
        projectId: data.projectId,
        teamId: project.teamId,
        email: data.email,
        role: data.role || "MEMBER",
        invitedBy: user.id,
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });
    
    revalidatePath(`/dashboard/project/${data.projectId}`);
    return { success: true, invitation };
  } catch (error) {
    console.error("Create invitation error:", error);
    return { success: false, error: "Failed to create invitation" };
  }
}

export async function getUserInvitations() {
  try {
    const user = await getCurrentUser();
    
    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email!,
        status: InvitationStatus.PENDING,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return { success: true, invitations };
  } catch (error) {
    console.error("Get user invitations error:", error);
    return { success: false, error: "Failed to get invitations" };
  }
}


export async function acceptInvitation(invitationId: string) {
  try {
    const user = await getCurrentUser();
    
    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        team: true,
        project: true,
      },
    });
    
    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }
    
    if (invitation.email !== user.email) {
      return { success: false, error: "This invitation is not for you" };
    }
    
    if (invitation.status !== InvitationStatus.PENDING) {
      return { success: false, error: "Invitation is no longer valid" };
    }
    
    // Check if already a project member (race condition protection)
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: invitation.projectId,
          userId: user.id,
        },
      },
    });
    
    if (existingMember) {
      // Update invitation status anyway
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED },
      });
      return { success: false, error: "You are already a project member" };
    }
    
    // Add user to project and update invitation in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create ProjectMember
      await tx.projectMember.create({
        data: {
          projectId: invitation.projectId,
          userId: user.id,
          role: (invitation.role as ProjectRole) || "MEMBER",
        },
      });

      // 2. Ensure TeamMember exists for team-level visibility
      await tx.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: invitation.teamId,
            userId: user.id,
          },
        },
        update: {}, // Don't change existing role
        create: {
          teamId: invitation.teamId,
          userId: user.id,
          role: "MEMBER",
        },
      });

      // 3. Update invitation status
      await tx.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED },
      });

      // 4. Log activity
      await tx.activity.create({
        data: {
          userId: user.id,
          teamId: invitation.teamId,
          projectId: invitation.projectId,
          actionType: "MEMBER_JOINED",
          actionData: {
            userName: user.name,
            projectName: invitation.project.name,
          },
        },
      });
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/project/${invitation.projectId}`);
    return { success: true, projectId: invitation.projectId };
  } catch (error) {
    console.error("Accept invitation error:", error);
    return { success: false, error: "Failed to accept invitation" };
  }
}

export async function rejectInvitation(invitationId: string) {
  try {
    const user = await getCurrentUser();
    
    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });
    
    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }
    
    if (invitation.email !== user.email) {
      return { success: false, error: "This invitation is not for you" };
    }
    
    if (invitation.status !== InvitationStatus.PENDING) {
      return { success: false, error: "Invitation is no longer valid" };
    }
    
    // Update invitation status
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.REJECTED },
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Reject invitation error:", error);
    return { success: false, error: "Failed to reject invitation" };
  }
}

export async function cancelInvitation(invitationId: string) {
  try {
    const user = await getCurrentUser();
    
    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });
    
    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }
    
    // Check if user is project admin/owner
    await checkProjectAccess(invitation.projectId, user.id);
    
    // Delete invitation
    await prisma.invitation.delete({
      where: { id: invitationId },
    });
    
    revalidatePath(`/dashboard/project/${invitation.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Cancel invitation error:", error);
    return { success: false, error: "Failed to cancel invitation" };
  }
}

export async function getTeamInvitations(teamId: string) {
  try {
    const user = await getCurrentUser();
    await checkTeamAccess(teamId, user.id, TeamRole.ADMIN);
    
    const invitations = await prisma.invitation.findMany({
      where: {
        teamId,
        status: InvitationStatus.PENDING,
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return { success: true, invitations };
  } catch (error) {
    console.error("Get team invitations error:", error);
    return { success: false, error: "Failed to get team invitations" };
  }
}

export async function getProjectInvitations(projectId: string) {
  try {
    const user = await getCurrentUser();
    await checkProjectAccess(projectId, user.id);
    
    const invitations = await prisma.invitation.findMany({
      where: {
        projectId,
        status: InvitationStatus.PENDING,
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return { success: true, invitations };
  } catch (error) {
    console.error("Get project invitations error:", error);
    return { success: false, error: "Failed to get project invitations" };
  }
}

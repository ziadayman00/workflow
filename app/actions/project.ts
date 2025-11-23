"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";

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

async function checkProjectAccess(projectId: string, userId: string) {
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
  
  if (!project || project.team.members.length === 0) {
    throw new Error("Access denied");
  }
  
  return project;
}

export async function getOrCreateDefaultTeam() {
  const user = await getCurrentUser();
  
  const existingTeam = await prisma.team.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (existingTeam) {
    return existingTeam.id;
  }

  const team = await prisma.team.create({
    data: {
      name: `${user.name || "My"} Team`,
      createdBy: user.id,
      members: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
  });

  return team.id;
}

export async function getProjects() {
  try {
    const user = await getCurrentUser();
    
    const projects = await prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: user.id
            }
          }
        }
      },
      include: {
        team: {
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
          }
        },
        tasks: {
          select: {
            status: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return { success: true, projects };
  } catch (error) {
    console.error("Get projects error:", error);
    return { success: false, error: "Failed to get projects" };
  }
}

export async function getProject(projectId: string) {
  try {
    const user = await getCurrentUser();
    await checkProjectAccess(projectId, user.id);
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
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
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tasks: {
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
              },
            },
            comments: {
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
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
        sections: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!project) return { success: false, error: "Project not found" };

    return { success: true, project };
  } catch (error) {
    console.error("Get project error:", error);
    return { success: false, error: "Failed to get project" };
  }
}

export async function createProject(data: {
  teamId: string;
  name: string;
  description?: string;
  color?: string;
}) {
  try {
    const user = await getCurrentUser();
    
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: user.id,
        },
      },
    });
    
    if (!membership) {
      return { success: false, error: "Access denied" };
    }
    
    const project = await prisma.project.create({
      data: {
        teamId: data.teamId,
        name: data.name,
        description: data.description,
        color: data.color || "#4ade80",
        createdBy: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tasks: true,
      },
    });
    
    await prisma.activity.create({
      data: {
        userId: user.id,
        teamId: data.teamId,
        actionType: "PROJECT_CREATED",
        actionData: {
          projectName: project.name,
          userName: user.name,
        },
      },
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/team/${data.teamId}`);
    return { success: true, project };
  } catch (error) {
    console.error("Create project error:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const user = await getCurrentUser();
    const project = await checkProjectAccess(projectId, user.id);
    
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: project.teamId,
          userId: user.id,
        },
      },
    });
    
    if (project.createdBy !== user.id && membership?.role !== "ADMIN") {
      return { success: false, error: "Only project creator or team admin can delete" };
    }
    
    await prisma.project.delete({
      where: { id: projectId },
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/team/${project.teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getProjectStats(projectId: string) {
  try {
    const user = await getCurrentUser();
    await checkProjectAccess(projectId, user.id);
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          select: {
            status: true,
            priority: true,
          },
        },
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const stats = {
      totalTasks: project.tasks.length,
      completedTasks: project.tasks.filter(t => t.status === "DONE").length,
      inProgressTasks: project.tasks.filter(t => t.status === "IN_PROGRESS").length,
      todoTasks: project.tasks.filter(t => t.status === "TODO").length,
      teamMembers: project.team.members.length,
      highPriorityTasks: project.tasks.filter(t => t.priority === "HIGH").length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Get project stats error:", error);
    return { success: false, error: "Failed to get project stats" };
  }
}
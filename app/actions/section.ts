"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";

/**
 * Section Server Actions
 * 
 * Purpose: Handle section operations for organizing tasks
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

export async function createSection(data: {
  projectId: string;
  name: string;
  status: TaskStatus;
}) {
  try {
    const user = await getCurrentUser();
    
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        team: {
          members: {
            some: { userId: user.id }
          }
        }
      }
    });
    
    if (!project) {
      return { success: false, error: "Access denied" };
    }
    
    // Get the highest position for this status
    const lastSection = await prisma.section.findFirst({
      where: {
        projectId: data.projectId,
        status: data.status,
      },
      orderBy: { position: 'desc' },
    });
    
    const section = await prisma.section.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        status: data.status,
        position: (lastSection?.position ?? -1) + 1,
      },
    });
    
    revalidatePath(`/dashboard/project/${data.projectId}`);
    return { success: true, section };
  } catch (error) {
    console.error("Create section error:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function updateSection(data: {
  sectionId: string;
  name: string;
}) {
  try {
    const user = await getCurrentUser();
    
    // Verify access
    const section = await prisma.section.findFirst({
      where: {
        id: data.sectionId,
        project: {
          team: {
            members: {
              some: { userId: user.id }
            }
          }
        }
      },
      include: { project: true }
    });
    
    if (!section) {
      return { success: false, error: "Access denied" };
    }
    
    const updatedSection = await prisma.section.update({
      where: { id: data.sectionId },
      data: { name: data.name },
    });
    
    revalidatePath(`/dashboard/project/${section.projectId}`);
    return { success: true, section: updatedSection };
  } catch (error) {
    console.error("Update section error:", error);
    return { success: false, error: "Failed to update section" };
  }
}

export async function deleteSection(sectionId: string) {
  try {
    const user = await getCurrentUser();
    
    // Verify access
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        project: {
          team: {
            members: {
              some: { userId: user.id }
            }
          }
        }
      },
      include: { project: true }
    });
    
    if (!section) {
      return { success: false, error: "Access denied" };
    }
    
    // Delete section (tasks will have sectionId set to null due to onDelete: SetNull)
    await prisma.section.delete({
      where: { id: sectionId },
    });
    
    revalidatePath(`/dashboard/project/${section.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete section error:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

export async function assignTaskToSection(data: {
  taskId: string;
  sectionId: string | null;
}) {
  try {
    const user = await getCurrentUser();
    
    // Verify task access
    const task = await prisma.task.findFirst({
      where: {
        id: data.taskId,
        project: {
          team: {
            members: {
              some: { userId: user.id }
            }
          }
        }
      },
      include: { project: true }
    });
    
    if (!task) {
      return { success: false, error: "Access denied" };
    }
    
    await prisma.task.update({
      where: { id: data.taskId },
      data: { sectionId: data.sectionId },
    });
    
    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Assign task to section error:", error);
    return { success: false, error: "Failed to assign task" };
  }
}

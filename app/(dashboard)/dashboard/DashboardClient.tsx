'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import ActivityItem from '@/components/ActivityItem';
import CreateProjectModal from '../components/CreateProjectModal';

interface DashboardClientProps {
  userName: string;
  stats: Array<{
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }>;
  projects: any[];
  activities: any[];
}

export default function DashboardClient({
  userName,
  stats,
  projects,
  activities,
}: DashboardClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateProject = async (projectData: {
    name: string;
    description?: string;
    color?: string;
  }) => {
    const loadingToast = toast.loading('Creating project...');
    
    try {
      const { createProject } = await import("@/app/actions/project");
      const { getOrCreateDefaultTeam } = await import("@/app/actions/project");
      const teamId = await getOrCreateDefaultTeam();
      
      const result = await createProject({
        teamId,
        name: projectData.name,
        description: projectData.description,
        color: projectData.color,
      });

      if (result.success) {
        toast.success('Project created successfully!', { id: loadingToast });
        setIsModalOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create project', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error('An error occurred while creating the project', { id: loadingToast });
    }
  };

  const handleProjectClick = (id?: string) => {
    if (id) {
      router.push(`/dashboard/project/${id}`);
    }
  };

  const handleProjectMenu = (id?: string) => {
    console.log("Project menu clicked:", id);
  };
  
  const handleViewAllProjects = () => {
    router.push("/dashboard/projects");
  };

  return (
    <>
      {isModalOpen && (
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={handleCreateProject}
        />
      )}
      <div className="min-h-screen bg-[#222222] text-[#fffbdf]">
        <DashboardHeader onCreateProject={handleOpenModal} />

        <div className="px-6 py-8">
          <h2 className="font-light text-xl mb-2">
            Welcome{" "}
            <span className="text-2xl font-bold uppercase">{userName}</span>
          </h2>
          <p className="text-[#fffbdf]/60 text-sm">
            Here's what's happening with your projects today
          </p>
        </div>

        <div className="px-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>

        <div className="px-6 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Projects</h3>
              <button 
                onClick={handleViewAllProjects}
                className="text-sm text-[#fffbdf]/60 hover:text-[#fffbdf] transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    tasksTotal={project.tasks?.length || 0}
                    tasksCompleted={
                      project.tasks?.filter((t: any) => t.status === "DONE")
                        .length || 0
                    }
                    teamMembers={project.team?.members?.map((m: any) => m.user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)) || []}
                    onClick={handleProjectClick}
                    onMenuClick={handleProjectMenu}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-[#fffbdf]/40 border border-dashed border-[#fffbdf]/10 rounded-xl">
                  No projects found. Create one to get started!
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <ActivityItem 
                    key={index} 
                    user={activity.user?.name || "Unknown"}
                    action={activity.actionType.toLowerCase().replace('_', ' ')}
                    target={activity.actionData?.projectName || activity.actionData?.taskTitle || "something"}
                    time={new Date(activity.createdAt).toLocaleDateString()}
                    type={activity.actionType.includes("CREATED") ? "created" : activity.actionType.includes("COMPLETED") ? "completed" : "updated"}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-[#fffbdf]/40">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

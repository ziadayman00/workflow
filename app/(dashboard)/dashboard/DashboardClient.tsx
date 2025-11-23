'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import CreateProjectModal from '../components/CreateProjectModal';

interface DashboardClientProps {
  userName: string;
  children: React.ReactNode;
}

export default function DashboardClient({
  userName,
  children,
}: DashboardClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        {children}
      </div>
    </>
  );
}

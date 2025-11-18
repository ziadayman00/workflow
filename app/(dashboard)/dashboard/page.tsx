"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, Folder } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";
import ActivityItem from "../components/ActivityItem";
import CreateProjectModal from "../components/CreateProjectModal";

/**
 * Dashboard Page
 *
 * Main dashboard page showing:
 * - Welcome section with authenticated user
 * - Overview statistics
 * - Active projects
 * - Recent activity feed
 */

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#fffbdf]/30 border-t-[#fffbdf] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#fffbdf]/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!session) {
    return null;
  }

  // Mock data - Replace with real API calls later
  const stats = [
    {
      icon: CheckCircle,
      label: "Tasks Completed Today",
      value: "12",
      color: "#4ade80",
    },
    {
      icon: Clock,
      label: "Tasks In Progress",
      value: "8",
      color: "#fbbf24",
    },
    {
      icon: AlertCircle,
      label: "Overdue Tasks",
      value: "3",
      color: "#f87171",
    },
    {
      icon: Folder,
      label: "Active Projects",
      value: "5",
      color: "#fffbdf",
    },
  ];

  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      description:
        "Complete overhaul of company website with new branding and improved UX",
      tasksTotal: 24,
      tasksCompleted: 18,
      color: "#4ade80",
      teamMembers: ["JD", "SM", "KL"],
    },
    {
      id: "2",
      name: "Mobile App Launch",
      description: "Development and deployment of iOS and Android applications",
      tasksTotal: 32,
      tasksCompleted: 8,
      color: "#60a5fa",
      teamMembers: ["AB", "CD", "EF", "GH"],
    },
    {
      id: "3",
      name: "Marketing Campaign Q4",
      description:
        "Social media and email marketing strategy for fourth quarter",
      tasksTotal: 15,
      tasksCompleted: 12,
      color: "#f472b6",
      teamMembers: ["XY", "ZA"],
    },
    {
      id: "4",
      name: "Backend API Optimization",
      description: "Performance improvements and database query optimization",
      tasksTotal: 18,
      tasksCompleted: 5,
      color: "#fbbf24",
      teamMembers: ["BC", "DE"],
    },
  ];

  const activities = [
    {
      user: "Sarah Mitchell",
      action: "completed",
      target: "Design Homepage",
      time: "2 minutes ago",
      type: "completed" as const,
    },
    {
      user: "John Doe",
      action: "created",
      target: "Fix Login Bug",
      time: "15 minutes ago",
      type: "created" as const,
    },
    {
      user: "Kate Lee",
      action: "updated",
      target: "API Documentation",
      time: "1 hour ago",
      type: "updated" as const,
    },
    {
      user: "Mike Brown",
      action: "completed",
      target: "Database Migration",
      time: "2 hours ago",
      type: "completed" as const,
    },
    {
      user: "Emma Wilson",
      action: "created",
      target: "User Testing Plan",
      time: "3 hours ago",
      type: "created" as const,
    },
  ];

  // Handlers للمودال
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = (projectData: {
    name: string;
    description?: string;
  }) => {
    console.log("Create project:", projectData);
    // TODO: Add API call to create project with user session
    setIsModalOpen(false);
  };

  // Handlers للمشاريع
  const handleProjectClick = (id?: string) => {
    console.log("Project clicked:", id);
    // Navigate to project detail page
  };

  const handleProjectMenu = (id?: string) => {
    console.log("Project menu clicked:", id);
    // Open project menu options
  };

  // Extract user name from session
  const userName = session.user?.name?.split(" ")[0] || "User";

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
        {/* Dashboard Header */}
        <DashboardHeader onCreateProject={handleOpenModal} />

        {/* Welcome Section */}
        <div className="px-6 py-8">
          <h2 className="font-light text-xl mb-2">
            Welcome{" "}
            <span className="text-2xl font-bold uppercase">{userName}</span>
          </h2>
          <p className="text-[#fffbdf]/60 text-sm">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid Section */}
        <div className="px-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-6 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Projects</h3>
              <button className="text-sm text-[#fffbdf]/60 hover:text-[#fffbdf] transition-colors">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onClick={handleProjectClick}
                  onMenuClick={handleProjectMenu}
                />
              ))}
            </div>
          </div>

          {/* Activity Feed Section - Takes 1 column on large screens */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
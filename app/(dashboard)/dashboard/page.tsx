import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProjects } from "@/app/actions/project";
import { getUserActivities } from "@/app/actions/activity";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const [projectsResult, activitiesResult] = await Promise.all([
    getProjects(),
    getUserActivities()
  ]);

  const projects = projectsResult.success && projectsResult.projects ? projectsResult.projects : [];
  const activities = activitiesResult.success && activitiesResult.activities ? activitiesResult.activities : [];

  // Calculate stats
  const totalTasks = projects.reduce((acc: number, project: any) => acc + (project.tasks?.length || 0), 0);
  const completedTasks = projects.reduce((acc: number, project: any) => acc + (project.tasks?.filter((t: any) => t.status === "DONE").length || 0), 0);
  const inProgressTasks = projects.reduce((acc: number, project: any) => acc + (project.tasks?.filter((t: any) => t.status === "IN_PROGRESS").length || 0), 0);
  
  // Mock overdue for now as we don't fetch due dates in getProjects (add it if needed)
  const overdueTasks = 0; 

  const stats = [
    {
      icon: "CheckCircle",
      label: "Tasks Completed",
      value: completedTasks.toString(),
      color: "#4ade80",
    },
    {
      icon: "Clock",
      label: "Tasks In Progress",
      value: inProgressTasks.toString(),
      color: "#fbbf24",
    },
    {
      icon: "AlertCircle",
      label: "Overdue Tasks",
      value: overdueTasks.toString(),
      color: "#f87171",
    },
    {
      icon: "Folder",
      label: "Active Projects",
      value: projects.length.toString(),
      color: "#fffbdf",
    },
  ];

  return (
    <DashboardClient 
      projects={projects} 
      activities={activities} 
      stats={stats} 
      userName={session.user?.name?.split(" ")[0] || "User"} 
    />
  );
}
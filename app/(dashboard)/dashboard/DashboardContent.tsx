import { getProjects } from "@/app/actions/project";
import { getUserActivities } from "@/app/actions/activity";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";
import ActivityItem from "@/components/ActivityItem";

export default async function DashboardContent() {
  const [projectsResult, activitiesResult] = await Promise.all([
    getProjects(),
    getUserActivities(),
  ]);

  const projects =
    projectsResult.success && projectsResult.projects
      ? projectsResult.projects
      : [];
  const activities =
    activitiesResult.success && activitiesResult.activities
      ? activitiesResult.activities
      : [];

  // Calculate stats
  const totalTasks = projects.reduce(
    (acc: number, project: any) => acc + (project.tasks?.length || 0),
    0
  );
  const completedTasks = projects.reduce(
    (acc: number, project: any) =>
      acc +
      (project.tasks?.filter((t: any) => t.status === "DONE").length || 0),
    0
  );
  const inProgressTasks = projects.reduce(
    (acc: number, project: any) =>
      acc +
      (project.tasks?.filter((t: any) => t.status === "IN_PROGRESS").length ||
        0),
    0
  );

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
    <>
      {/* Stats */}
      <div className="px-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Projects and Activities */}
      <div className="px-6 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Projects</h3>
            <a
              href="/dashboard/projects"
              className="text-sm text-[#fffbdf]/60 hover:text-[#fffbdf] transition-colors"
            >
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length > 0 ? (
              projects.slice(0, 4).map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  description={project.description || "No description"}
                  tasksTotal={project.tasks?.length || 0}
                  tasksCompleted={
                    project.tasks?.filter((t: any) => t.status === "DONE")
                      .length || 0
                  }
                  teamMembers={
                    project.team?.members
                      ?.map((m: any) =>
                        m.user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2)
                      )
                      .filter(Boolean) || []
                  }
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
              activities.slice(0, 5).map((activity, index) => (
                <ActivityItem
                  key={index}
                  user={activity.user?.name || "Unknown"}
                  action={activity.actionType
                    .toLowerCase()
                    .replace("_", " ")}
                  target={
                    activity.actionData?.projectName ||
                    activity.actionData?.taskTitle ||
                    "something"
                  }
                  time={new Date(activity.createdAt).toLocaleDateString()}
                  type={
                    activity.actionType.includes("CREATED")
                      ? "created"
                      : activity.actionType.includes("COMPLETED")
                      ? "completed"
                      : "updated"
                  }
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
    </>
  );
}

import { getProject, getProjectStats } from "@/app/actions/project";
import { getProjectActivities } from "@/app/actions/activity";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar as CalendarIcon, 
  Activity, 
  Users, 
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import KanbanBoard from "@/components/kanban/Board";
import MemberManager from "@/components/team/MemberManager";
import ActivityItem from "@/components/ActivityItem";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const { id } = await params;

  // Fetch project data and activities in parallel
  const [projectResult, activitiesResult] = await Promise.all([
    getProject(id),
    getProjectActivities(id)
  ]);

  if (!projectResult.success || !projectResult.project) {
    notFound();
  }

  const project = projectResult.project;
  const activities = activitiesResult.success && activitiesResult.activities ? activitiesResult.activities : [];
  
  // Get current user ID from session
  const currentUserId = session.user?.email ? (
    await prisma.user.findUnique({ where: { email: session.user.email } })
  )?.id || '' : '';

  return (
    <div className="min-h-screen bg-[#222222] text-[#fffbdf]">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-[#fffbdf]/60">{project.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {project.team.members.map((member: any) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full bg-[#fffbdf]/10 border border-[#222222] flex items-center justify-center text-xs font-medium"
                  title={member.user.name}
                >
                  {member.user.image ? (
                    <img src={member.user.image} alt={member.user.name} className="w-full h-full rounded-full" />
                  ) : (
                    member.user.name?.charAt(0) || "?"
                  )}
                </div>
              ))}
            </div>
            <button className="p-2 hover:bg-[#fffbdf]/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Kanban Board (Takes 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                Tasks
              </h2>
            </div>
            
            {/* Kanban Board */}
            <div className="h-[600px]">
              <KanbanBoard 
                projectId={project.id} 
                tasks={project.tasks}
                teamMembers={project.team.members.map((m: any) => ({
                  id: m.user.id,
                  name: m.user.name,
                  email: m.user.email,
                  image: m.user.image,
                }))}
                currentUserId={currentUserId}
              />
            </div>
          </div>

          {/* Right Column: Activity & Team (Takes 1/3 width) */}
          <div className="space-y-8">
            {/* Activity Feed */}
            <div className="rounded-xl border border-[#fffbdf]/10 bg-[#2a2a2a] p-6">
              <h2 className="mb-6 text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity: any, index: number) => (
                    <ActivityItem 
                      key={index} 
                      user={activity.user?.name || "Unknown"}
                      action={activity.actionType.toLowerCase().replace('_', ' ')}
                      target={activity.actionData?.taskTitle || activity.actionData?.projectName || "something"}
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

            {/* Member Management */}
            <MemberManager 
              teamId={project.teamId} 
              members={project.team.members} 
              currentUserRole="ADMIN" // TODO: Get actual role
            />
          </div>
        </div>
      </div>
    </div>
  );
}

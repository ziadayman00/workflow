import { getProjects } from "@/app/actions/project";
import { Folder, Plus } from "lucide-react";
import Link from "next/link";

export default async function ProjectsContent() {
  const projectsResult = await getProjects();
  const projects = projectsResult.success && projectsResult.projects ? projectsResult.projects : [];

  return (
    <div className="px-6 py-8">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => {
            const totalTasks = project.tasks?.length || 0;
            const completedTasks = project.tasks?.filter((t: any) => t.status === "DONE").length || 0;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <Link
                key={project.id}
                href={`/dashboard/project/${project.id}`}
                className="group bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6 hover:border-[#fffbdf]/30 transition-all hover:shadow-lg"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${project.color || "#4ade80"}20` }}
                    >
                      <Folder
                        className="w-6 h-6"
                        style={{ color: project.color || "#4ade80" }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#fffbdf] group-hover:text-[#fff5b8] transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-[#fffbdf]/40">
                        {project.team?.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-[#fffbdf]/60 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[#fffbdf]/60 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#fffbdf]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: project.color || "#4ade80",
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="text-[#fffbdf]/60">
                    <span className="font-medium text-[#fffbdf]">{completedTasks}</span>
                    /{totalTasks} tasks
                  </div>
                  <div className="flex -space-x-2">
                    {project.team?.members?.slice(0, 3).map((member: any, idx: number) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-[#fffbdf]/10 border-2 border-[#2a2a2a] flex items-center justify-center text-xs font-medium"
                        title={member.user?.name}
                      >
                        {member.user?.image ? (
                          <img
                            src={member.user.image}
                            alt={member.user.name}
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          member.user?.name?.charAt(0) || "?"
                        )}
                      </div>
                    ))}
                    {(project.team?.members?.length || 0) > 3 && (
                      <div className="w-8 h-8 rounded-full bg-[#fffbdf]/10 border-2 border-[#2a2a2a] flex items-center justify-center text-xs font-medium">
                        +{(project.team?.members?.length || 0) - 3}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Folder className="w-16 h-16 mx-auto mb-4 text-[#fffbdf]/20" />
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-[#fffbdf]/60 mb-6">
            Create your first project to get started
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#fffbdf] text-[#222222] rounded-xl font-semibold hover:bg-[#fff5b8] transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </Link>
        </div>
      )}
    </div>
  );
}

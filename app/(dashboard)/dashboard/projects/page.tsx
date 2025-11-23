import { Suspense } from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProjectsContent from "./ProjectsContent";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-[#222222] text-[#fffbdf]">
      {/* Header */}
      <div className="px-6 py-8 border-b border-[#fffbdf]/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Projects</h1>
            <p className="text-[#fffbdf]/60">
              Manage and view all your projects in one place
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[#2a2a2a] border border-[#fffbdf]/20 text-[#fffbdf] rounded-lg hover:bg-[#333333] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Projects Grid with Suspense */}
      <Suspense fallback={<ProjectsContentSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}

function ProjectsContentSkeleton() {
  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-[#1a1a1a] rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-20 bg-[#1a1a1a] rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="h-4 w-full bg-[#1a1a1a] rounded animate-pulse mb-2"></div>
            <div className="h-4 w-3/4 bg-[#1a1a1a] rounded animate-pulse mb-4"></div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-3 w-16 bg-[#1a1a1a] rounded animate-pulse"></div>
                <div className="h-3 w-8 bg-[#1a1a1a] rounded animate-pulse"></div>
              </div>
              <div className="h-2 w-full bg-[#1a1a1a] rounded-full animate-pulse"></div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-[#1a1a1a] rounded animate-pulse"></div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

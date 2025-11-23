import { Suspense } from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const userName = session.user?.name?.split(" ")[0] || "User";

  return (
    <DashboardClient userName={userName}>
      <Suspense fallback={<DashboardContentSkeleton />}>
        <DashboardContent />
      </Suspense>
    </DashboardClient>
  );
}

function DashboardContentSkeleton() {
  return (
    <>
      {/* Stats Skeleton */}
      <div className="px-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-[#fffbdf]">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-28 bg-[#1a1a1a] rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-[#1a1a1a] rounded-lg animate-pulse"></div>
              </div>
              <div className="h-8 w-16 bg-[#1a1a1a] rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-[#1a1a1a] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-6 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#fffbdf]">Your Projects</h3>
            <div className="h-4 w-20 bg-[#1a1a1a] rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#1a1a1a] animate-pulse"></div>
                    <div className="h-6 w-32 bg-[#1a1a1a] rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-5 bg-[#1a1a1a] rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-[#1a1a1a] rounded animate-pulse mb-4"></div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 w-16 bg-[#1a1a1a] rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-[#1a1a1a] rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 w-full bg-[#1a1a1a] rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-[#1a1a1a] rounded animate-pulse"></div>
                  <div className="flex -space-x-2">
                    {[1, 2].map((j) => (
                      <div key={j} className="w-7 h-7 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#fffbdf]">Recent Activity</h3>
          <div className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] animate-pulse flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-[#1a1a1a] rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-1/2 bg-[#1a1a1a] rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
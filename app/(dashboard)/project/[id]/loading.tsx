export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#222222] p-6">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-8 w-8 bg-[#2a2a2a] rounded-lg animate-pulse"></div>
          <div className="h-8 w-64 bg-[#2a2a2a] rounded-lg animate-pulse"></div>
        </div>
        <div className="h-4 w-96 bg-[#2a2a2a] rounded-lg animate-pulse"></div>
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* Column Skeletons */}
        {['To Do', 'In Progress', 'Done'].map((col, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-80 bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-4"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#fffbdf]/10">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 bg-[#1a1a1a] rounded animate-pulse"></div>
                <div className="h-5 w-8 bg-[#1a1a1a] rounded-full animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-[#1a1a1a] rounded-lg animate-pulse"></div>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {[1, 2, 3].map((task) => (
                <div
                  key={task}
                  className="bg-[#1a1a1a] border border-[#fffbdf]/10 rounded-lg p-4"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className="h-4 w-4 bg-[#2a2a2a] rounded animate-pulse flex-shrink-0 mt-0.5"></div>
                    <div className="flex-1">
                      <div className="h-5 w-full bg-[#2a2a2a] rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-3/4 bg-[#2a2a2a] rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="h-6 w-16 bg-[#2a2a2a] rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-[#2a2a2a] rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { TaskPriority } from "@prisma/client";
import { Calendar, Flag, User, GripVertical } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: any;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: (task: any) => void;
}

export default function TaskCard({ task, onDragStart, onDragEnd, onClick }: TaskCardProps) {
  const priorityColors = {
    LOW: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    MEDIUM: { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20" },
    HIGH: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
    URGENT: { bg: "bg-orange-600/10", text: "text-orange-600", border: "border-orange-600/20" },
  };

  const priority = task.priority as TaskPriority;
  const colors = priorityColors[priority] || priorityColors.MEDIUM;

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click when dragging
    if (e.defaultPrevented) return;
    onClick?.(task);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      className="group cursor-pointer active:cursor-grabbing rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 hover:border-[#fffbdf]/40"
    >
      {/* Drag Handle */}
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2">
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Priority */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${colors.bg} ${colors.text} border ${colors.border}`}>
              <Flag className="h-3 w-3" />
              <span className="font-medium">{priority}</span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {task.assignee.image ? (
                  <img
                    src={task.assignee.image}
                    alt={task.assignee.name}
                    className="h-4 w-4 rounded-full"
                  />
                ) : (
                  <User className="h-3 w-3" />
                )}
                <span className="truncate max-w-[100px]">{task.assignee.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

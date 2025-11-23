"use client";

import { TaskStatus } from "@prisma/client";
import { Plus, MoreHorizontal } from "lucide-react";
import TaskCard from "./TaskCard";
import { useState } from "react";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: any[];
  sections?: any[];
  projectId: string;
  onAddTask?: () => void;
  onDragStart?: (task: any) => void;
  onDragEnd?: () => void;
  onDrop?: () => void;
  isDragging?: boolean;
  onTaskClick?: (task: any) => void;
}

export default function Column({ 
  title, 
  status, 
  tasks, 
  sections = [],
  projectId, 
  onAddTask,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging = false,
  onTaskClick
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop?.();
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    
    try {
      const { createSection } = await import("@/app/actions/section");
      await createSection({
        projectId,
        name: newSectionName.trim(),
        status,
      });
      setNewSectionName("");
      setIsAddingSection(false);
      window.location.reload(); // Simple refresh
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  // Group tasks by section
  const columnSections = sections.filter(s => s.status === status);
  const tasksWithoutSection = tasks.filter(t => !t.sectionId);
  const tasksBySection = columnSections.map(section => ({
    section,
    tasks: tasks.filter(t => t.sectionId === section.id)
  }));

  return (
    <div 
      className={`flex h-full min-w-[300px] flex-col gap-4 rounded-xl p-4 transition-all ${
        isDragOver 
          ? 'bg-[#fffbdf]/10 border-2 border-[#fffbdf]/40' 
          : 'bg-neutral-50/50 dark:bg-neutral-900/20 border-2 border-transparent'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-200 px-1.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onAddTask}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors"
            title="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            onDragStart={() => onDragStart?.(task)}
            onDragEnd={onDragEnd}
            onClick={onTaskClick}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className={`flex h-32 items-center justify-center rounded-lg border border-dashed text-sm transition-all ${
            isDragOver
              ? 'border-[#fffbdf] bg-[#fffbdf]/5 text-[#fffbdf]'
              : 'border-neutral-200 bg-transparent text-neutral-400 dark:border-neutral-800'
          }`}>
            {isDragging ? 'Drop here' : 'No tasks'}
          </div>
        )}
      </div>
    </div>
  );
}

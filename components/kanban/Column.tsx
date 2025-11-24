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
          : 'bg-[#2a2a2a] border border-[#fffbdf]/10'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#fffbdf]">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#fffbdf]/10 px-1.5 text-xs font-medium text-[#fffbdf]/80">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onAddTask}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#fffbdf]/60 hover:bg-[#fffbdf]/10 hover:text-[#fffbdf] transition-colors"
            title="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto scrollbar-hide">
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
              : 'border-[#fffbdf]/10 bg-transparent text-[#fffbdf]/40'
          }`}>
            {isDragging ? 'Drop here' : 'No tasks'}
          </div>
        )}
      </div>
    </div>
  );
}

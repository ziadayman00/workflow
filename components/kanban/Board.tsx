"use client";

import { useState } from "react";
import { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Column from "./Column";
import CreateTaskModal from "../tasks/CreateTaskModal";
import TaskDetailModal from "../tasks/TaskDetailModal";

interface KanbanBoardProps {
  projectId: string;
  tasks: any[];
  sections?: any[];
  teamMembers?: Array<{ id: string; name: string; email: string; image?: string }>;
  currentUserId: string;
}

export default function KanbanBoard({ projectId, tasks, sections = [], teamMembers = [], currentUserId }: KanbanBoardProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  const handleOpenCreateModal = (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    setDefaultStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    assigneeId?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }) => {
    const loadingToast = toast.loading('Creating task...');
    
    try {
      const { createTask } = await import("@/app/actions/task");
      
      const result = await createTask({
        projectId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status as any,
        priority: taskData.priority as any,
        assignedTo: taskData.assigneeId,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      });

      if (result.success) {
        toast.success('Task created successfully!', { id: loadingToast });
        setIsCreateModalOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create task', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error('An error occurred while creating the task', { id: loadingToast });
    }
  };

  const handleDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    const loadingToast = toast.loading('Updating task status...');

    try {
      const { updateTaskStatus } = await import("@/app/actions/task");
      
      const result = await updateTaskStatus({
        taskId: draggedTask.id,
        status: newStatus as any,
      });

      if (result.success) {
        toast.success(`Task moved to ${newStatus.replace('_', ' ').toLowerCase()}!`, { id: loadingToast });
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update task status', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error('An error occurred while updating the task', { id: loadingToast });
    } finally {
      setDraggedTask(null);
    }
  };

  return (
    <>
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
        projectId={projectId}
        defaultStatus={defaultStatus}
        teamMembers={teamMembers}
      />
      
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          currentUserId={currentUserId}
        />
      )}
      
      <div className="flex h-full gap-6 overflow-x-auto pb-4">
        <Column 
          title="To Do" 
          status="TODO" 
          tasks={todoTasks} 
          sections={sections}
          projectId={projectId}
          onAddTask={() => handleOpenCreateModal('TODO')}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDrop('TODO')}
          isDragging={!!draggedTask}
          onTaskClick={setSelectedTask}
        />
        <Column 
          title="In Progress" 
          status="IN_PROGRESS" 
          tasks={inProgressTasks} 
          sections={sections}
          projectId={projectId}
          onAddTask={() => handleOpenCreateModal('IN_PROGRESS')}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDrop('IN_PROGRESS')}
          isDragging={!!draggedTask}
          onTaskClick={setSelectedTask}
        />
        <Column 
          title="Done" 
          status="DONE" 
          tasks={doneTasks} 
          sections={sections}
          projectId={projectId}
          onAddTask={() => handleOpenCreateModal('DONE')}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDrop('DONE')}
          isDragging={!!draggedTask}
          onTaskClick={setSelectedTask}
        />
      </div>
    </>
  );
}

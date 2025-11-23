'use client'

import { X, Calendar, Flag, User, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import CommentSection from '../comments/CommentSection';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description?: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: Date | string | null;
    createdAt: Date | string;
    assignee?: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    } | null;
    creator: {
      id: string;
      name: string | null;
    };
    comments?: Array<{
      id: string;
      content: string;
      createdAt: Date | string;
      updatedAt: Date | string;
      user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
      };
    }>;
  };
  currentUserId: string;
}

export default function TaskDetailModal({ isOpen, onClose, task, currentUserId }: TaskDetailModalProps) {
  if (!isOpen) return null;

  const priorityColors = {
    LOW: { bg: '#60a5fa', label: 'Low' },
    MEDIUM: { bg: '#fbbf24', label: 'Medium' },
    HIGH: { bg: '#f87171', label: 'High' },
    URGENT: { bg: '#dc2626', label: 'Urgent' },
  };

  const statusLabels = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  const priority = priorityColors[task.priority] || priorityColors.MEDIUM;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-[#222222] border border-[#fffbdf]/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-6 border-b border-[#fffbdf]/10 flex-shrink-0">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-semibold text-[#fffbdf] mb-2">{task.title}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Status Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fffbdf]/10 text-[#fffbdf]">
                  {statusLabels[task.status]}
                </span>
                
                {/* Priority Badge */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${priority.bg}20`,
                    color: priority.bg,
                    border: `1px solid ${priority.bg}40`
                  }}
                >
                  <Flag className="w-3 h-3" />
                  {priority.label}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#fffbdf]/60 hover:text-[#fffbdf] hover:bg-[#2a2a2a] transition-all flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Task Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-[#fffbdf] mb-2">Description</h3>
                  {task.description ? (
                    <p className="text-[#fffbdf]/80 text-sm whitespace-pre-wrap">{task.description}</p>
                  ) : (
                    <p className="text-[#fffbdf]/40 text-sm italic">No description provided</p>
                  )}
                </div>

                {/* Comments Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-[#fffbdf]" />
                    <h3 className="text-sm font-semibold text-[#fffbdf]">
                      Comments ({task.comments?.length || 0})
                    </h3>
                  </div>
                  <div className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-4 min-h-[400px] flex flex-col">
                    <CommentSection
                      taskId={task.id}
                      comments={task.comments || []}
                      currentUserId={currentUserId}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Metadata */}
              <div className="space-y-4">
                {/* Assignee */}
                <div>
                  <h3 className="text-xs font-semibold text-[#fffbdf]/60 mb-2 uppercase tracking-wide">Assignee</h3>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      {task.assignee.image ? (
                        <img
                          src={task.assignee.image}
                          alt={task.assignee.name || 'Assignee'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#fffbdf]/10 flex items-center justify-center text-xs font-medium text-[#fffbdf]">
                          {task.assignee.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#fffbdf]">{task.assignee.name}</p>
                        <p className="text-xs text-[#fffbdf]/40">{task.assignee.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#fffbdf]/40">Unassigned</p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <h3 className="text-xs font-semibold text-[#fffbdf]/60 mb-2 uppercase tracking-wide">Due Date</h3>
                  {task.dueDate ? (
                    <div className="flex items-center gap-2 text-sm text-[#fffbdf]">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <p className="text-sm text-[#fffbdf]/40">No due date</p>
                  )}
                </div>

                {/* Created By */}
                <div>
                  <h3 className="text-xs font-semibold text-[#fffbdf]/60 mb-2 uppercase tracking-wide">Created By</h3>
                  <p className="text-sm text-[#fffbdf]">{task.creator.name || 'Unknown'}</p>
                  <p className="text-xs text-[#fffbdf]/40">
                    {format(new Date(task.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

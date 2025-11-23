'use client'

import React, { useState } from 'react';
import { X, Calendar, Flag, User } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    assigneeId?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }) => void;
  projectId: string;
  defaultStatus?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  teamMembers?: Array<{ id: string; name: string; email: string; image?: string }>;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  projectId,
  defaultStatus = 'TODO',
  teamMembers = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [errors, setErrors] = useState({ title: '' });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      assigneeId: assigneeId || undefined,
      status: defaultStatus,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setAssigneeId('');
    setErrors({ title: '' });
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setAssigneeId('');
    setErrors({ title: '' });
    onClose();
  };

  const priorityColors = {
    LOW: { bg: '#60a5fa', label: 'Low' },
    MEDIUM: { bg: '#fbbf24', label: 'Medium' },
    HIGH: { bg: '#f87171', label: 'High' },
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div 
          className="bg-[#222222] border border-[#fffbdf]/10 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto my-8 max-h-[calc(100vh-4rem)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#fffbdf]/10 flex-shrink-0">
            <h2 className="text-2xl font-semibold text-[#fffbdf]">Create New Task</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#fffbdf]/60 hover:text-[#fffbdf] hover:bg-[#2a2a2a] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
            
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-2">
                Task Title <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({ title: '' });
                }}
                placeholder="e.g., Design landing page"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder:text-[#fffbdf]/30 focus:outline-none focus:border-[#fffbdf]/60 focus:ring-1 focus:ring-[#fffbdf]/20 transition-all"
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-[#f87171]">{errors.title}</p>
              )}
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                rows={4}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder:text-[#fffbdf]/30 focus:outline-none focus:border-[#fffbdf]/60 focus:ring-1 focus:ring-[#fffbdf]/20 transition-all resize-none"
              />
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-3">
                Priority
              </label>
              <div className="flex items-center gap-3">
                {(Object.keys(priorityColors) as Array<keyof typeof priorityColors>).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                      priority === p
                        ? 'ring-2 ring-[#fffbdf] ring-offset-2 ring-offset-[#222222] scale-105'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: `${priorityColors[p].bg}20`,
                      color: priorityColors[p].bg,
                      border: `1px solid ${priorityColors[p].bg}40`
                    }}
                  >
                    <Flag className="w-4 h-4 inline mr-2" />
                    {priorityColors[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] focus:outline-none focus:border-[#fffbdf]/60 focus:ring-1 focus:ring-[#fffbdf]/20 transition-all"
              />
            </div>

            {/* Assignee Selection */}
            {teamMembers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#fffbdf] mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Assign To
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] focus:outline-none focus:border-[#fffbdf]/60 focus:ring-1 focus:ring-[#fffbdf]/20 transition-all"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-8 py-6 border-t border-[#fffbdf]/10 bg-[#1a1a1a] flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 text-[#fffbdf] rounded-xl font-medium hover:bg-[#333333] hover:border-[#fffbdf]/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-[#fffbdf] text-[#222222] rounded-xl font-semibold hover:bg-[#fff5b8] transition-all shadow-lg hover:shadow-xl"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;

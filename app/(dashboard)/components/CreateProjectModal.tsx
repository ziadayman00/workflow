'use client'

import React, { useState } from 'react';
import { X, Plus, Users } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: { 
    name: string; 
    description?: string;
    color?: string;
    teamMembers?: string[];
  }) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4ade80');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState({ name: '', members: '' });

  const projectColors = [
    { hex: '#4ade80', label: 'Green' },
    { hex: '#60a5fa', label: 'Blue' },
    { hex: '#f472b6', label: 'Pink' },
    { hex: '#fbbf24', label: 'Amber' },
    { hex: '#a78bfa', label: 'Purple' },
    { hex: '#fb923c', label: 'Orange' },
  ];

  if (!isOpen) return null;

  const handleAddMember = () => {
    const trimmed = memberInput.trim().toUpperCase();
    
    if (!trimmed) {
      setErrors({ ...errors, members: 'Please enter initials' });
      return;
    }
    
    if (trimmed.length > 3) {
      setErrors({ ...errors, members: 'Maximum 3 characters' });
      return;
    }
    
    if (members.includes(trimmed)) {
      setErrors({ ...errors, members: 'Member already added' });
      return;
    }
    
    if (members.length >= 6) {
      setErrors({ ...errors, members: 'Maximum 6 members allowed' });
      return;
    }

    setMembers([...members, trimmed]);
    setMemberInput('');
    setErrors({ ...errors, members: '' });
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  const handleSubmit = () => {
    if (!projectName.trim()) {
      setErrors({ ...errors, name: 'Project name is required' });
      return;
    }

    onCreate({
      name: projectName.trim(),
      description: projectDescription.trim() || undefined,
      color: selectedColor,
      teamMembers: members.length > 0 ? members : undefined
    });

    // Reset form
    setProjectName('');
    setProjectDescription('');
    setSelectedColor('#4ade80');
    setMembers([]);
    setMemberInput('');
    setErrors({ name: '', members: '' });
  };

  const handleClose = () => {
    setProjectName('');
    setProjectDescription('');
    setSelectedColor('#4ade80');
    setMembers([]);
    setMemberInput('');
    setErrors({ name: '', members: '' });
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div 
          className="bg-[#222222] border border-[#fffbdf]/10 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto my-8 max-h-[calc(100vh-4rem)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#fffbdf]/10 flex-shrink-0">
            <h2 className="text-2xl font-semibold text-[#fffbdf]">Create New Project</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#fffbdf]/60 hover:text-[#fffbdf] hover:bg-[#2a2a2a] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
            
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-2">
                Project Name <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g., Website Redesign"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder:text-[#fffbdf]/30 focus:outline-none focus:border-[#fffbdf]/60 focus:ring-1 focus:ring-[#fffbdf]/20 transition-all"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-[#f87171]">{errors.name}</p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-2">
                Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="What's this project about?"
                rows={3}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder:text-[#fffbdf]/30 focus:outline-none focus:border-[#fffbdf]/60 focus:ring-1 focus:ring-[#fffbdf]/20 transition-all resize-none"
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-[#fffbdf] mb-3">
                Project Color
              </label>
              <div className="flex items-center gap-3">
                {projectColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className="relative group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl transition-all ${
                        selectedColor === color.hex
                          ? 'ring-2 ring-[#fffbdf] ring-offset-2 ring-offset-[#222222] scale-110'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#fffbdf]/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {color.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
              Create Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProjectModal;
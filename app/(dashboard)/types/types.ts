/**
 * TypeScript Types for Dashboard Components
 * 
 * Centralized type definitions for better type safety and reusability
 */

import { LucideIcon } from 'lucide-react';

// Activity Types
export type ActivityType = 'completed' | 'created' | 'updated' | 'assigned' | 'commented';

// Stat Card Types
export interface Stat {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  tasksTotal: number;
  tasksCompleted: number;
  color: string;
  teamMembers: string[];
  status?: 'active' | 'completed' | 'on-hold';
  createdAt?: Date;
  updatedAt?: Date;
}

// Activity Types
export interface Activity {
  id?: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: ActivityType;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'member' | 'viewer';
}

// Team Types
export interface Team {
  id: string;
  name: string;
  members: User[];
  projects: Project[];
  createdAt: Date;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
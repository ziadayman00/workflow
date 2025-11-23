"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Mail, Shield, User, X } from "lucide-react";
import { TeamRole } from "@prisma/client";

interface Member {
  id: string;
  role: TeamRole;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface MemberManagerProps {
  teamId: string;
  members: Member[];
  currentUserRole: TeamRole;
}

export default function MemberManager({ teamId, members, currentUserRole }: MemberManagerProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invite logic
    console.log("Invite:", inviteEmail);
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b p-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Team Members</h2>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {isInviteOpen && (
        <div className="border-b bg-neutral-50 p-6 dark:bg-neutral-900/50 dark:border-neutral-800">
          <form onSubmit={handleInvite} className="flex gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                required
              />
            </div>
            <button 
              type="submit"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Send Invite
            </button>
            <button 
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="divide-y dark:divide-neutral-800">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                {member.user.image ? (
                  <img src={member.user.image} alt={member.user.name || ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    {member.user.name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">{member.user.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                member.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : member.role === 'MEMBER'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
              }`}>
                {member.role === 'ADMIN' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {member.role}
              </div>
              
              {currentUserRole === 'ADMIN' && (
                <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

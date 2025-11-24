"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Mail, Shield, User, X, Clock } from "lucide-react";
import { TeamRole } from "@prisma/client";
import { createInvitation, getTeamInvitations, cancelInvitation } from "@/app/actions/invitation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

interface Invitation {
  id: string;
  email: string;
  role: TeamRole;
  createdAt: Date;
  inviter: {
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
  const router = useRouter();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  // Fetch pending invitations
  useEffect(() => {
    if (currentUserRole === 'ADMIN') {
      fetchInvitations();
    }
  }, [teamId, currentUserRole]);

  const fetchInvitations = async () => {
    try {
      const result = await getTeamInvitations(teamId);
      if (result.success && result.invitations) {
        setPendingInvitations(result.invitations as any);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading('Sending invitation...');
    
    try {
      const result = await createInvitation({
        projectId: teamId, // teamId is actually the project ID in this context
        email: inviteEmail.trim(),
        role: TeamRole.MEMBER,
      });
      
      if (result.success) {
        toast.success(`Invitation sent to ${inviteEmail}!`, { id: loadingToast });
        setInviteEmail("");
        setIsInviteOpen(false);
        fetchInvitations(); // Refresh invitations list
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to send invitation', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error('An error occurred while sending invitation', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    const loadingToast = toast.loading('Cancelling invitation...');
    
    try {
      const result = await cancelInvitation(invitationId);
      
      if (result.success) {
        toast.success(`Invitation to ${email} cancelled`, { id: loadingToast });
        fetchInvitations(); // Refresh invitations list
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to cancel invitation', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b p-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Team Members</h2>
        {currentUserRole === 'ADMIN' && (
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
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
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </button>
            <button 
              type="button"
              onClick={() => setIsInviteOpen(false)}
              disabled={isLoading}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Pending Invitations */}
      {currentUserRole === 'ADMIN' && pendingInvitations.length > 0 && (
        <div className="border-b bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-neutral-800">
          <div className="p-4">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Invitations ({pendingInvitations.length})
            </h3>
            <div className="space-y-2">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{invitation.email}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Invited by {invitation.inviter.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
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

"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Mail, Shield, User, X, Clock, Crown } from "lucide-react";
import { ProjectRole } from "@prisma/client";
import { createInvitation, getProjectInvitations, cancelInvitation } from "@/app/actions/invitation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Member {
  id: string;
  role: ProjectRole;
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
  role: ProjectRole;
  createdAt: Date;
  inviter: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface MemberManagerProps {
  projectId: string;
  members: Member[];
  currentUserRole: ProjectRole;
}

export default function MemberManager({ projectId, members, currentUserRole }: MemberManagerProps) {
  const router = useRouter();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  // Fetch pending invitations
  useEffect(() => {
    if (currentUserRole === 'ADMIN' || currentUserRole === 'OWNER') {
      fetchInvitations();
    }
  }, [projectId, currentUserRole]);

  const fetchInvitations = async () => {
    try {
      const result = await getProjectInvitations(projectId);
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
        projectId,
        email: inviteEmail.trim(),
        role: "MEMBER",
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

  const getRoleBadge = (role: ProjectRole) => {
    switch (role) {
      case 'OWNER':
        return {
          bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          icon: <Crown className="h-3 w-3" />
        };
      case 'ADMIN':
        return {
          bg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
          icon: <Shield className="h-3 w-3" />
        };
      case 'MEMBER':
        return {
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          icon: <User className="h-3 w-3" />
        };
      case 'VIEWER':
        return {
          bg: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
          icon: <User className="h-3 w-3" />
        };
    }
  };

  return (
    <div className="rounded-xl border border-[#fffbdf]/10 bg-[#2a2a2a] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#fffbdf]/10 p-6">
        <h2 className="text-lg font-semibold text-[#fffbdf]">Project Members</h2>
        {(currentUserRole === 'ADMIN' || currentUserRole === 'OWNER') && (
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#fffbdf] px-4 py-2 text-sm font-medium text-[#222222] hover:bg-[#fff5b8] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      {isInviteOpen && (
        <div className="border-b border-[#fffbdf]/10 bg-[#fffbdf]/5 p-6">
          <form onSubmit={handleInvite} className="flex gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#fffbdf]/50" />
              <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-md border border-[#fffbdf]/20 bg-[#222222] py-2 pl-10 pr-4 text-sm outline-none focus:border-[#fffbdf]/50 text-[#fffbdf] placeholder-[#fffbdf]/30"
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-[#fffbdf] px-4 py-2 text-sm font-medium text-[#222222] hover:bg-[#fff5b8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </button>
            <button 
              type="button"
              onClick={() => setIsInviteOpen(false)}
              disabled={isLoading}
              className="rounded-md border border-[#fffbdf]/20 bg-transparent px-4 py-2 text-sm font-medium text-[#fffbdf] hover:bg-[#fffbdf]/10 disabled:opacity-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Pending Invitations */}
      {(currentUserRole === 'ADMIN' || currentUserRole === 'OWNER') && pendingInvitations.length > 0 && (
        <div className="border-b border-[#fffbdf]/10 bg-[#fffbdf]/5">
          <div className="p-4">
            <h3 className="text-sm font-medium text-[#fffbdf]/80 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Invitations ({pendingInvitations.length})
            </h3>
            <div className="space-y-2">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 rounded-lg bg-[#222222] border border-[#fffbdf]/10">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#fffbdf]/40" />
                    <div>
                      <p className="text-sm font-medium text-[#fffbdf]">{invitation.email}</p>
                      <p className="text-xs text-[#fffbdf]/50">
                        Invited by {invitation.inviter.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-[#fffbdf]/10">
        {members.map((member) => {
          const roleBadge = getRoleBadge(member.role);
          return (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-[#fffbdf]/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#fffbdf]/10 border border-[#fffbdf]/10">
                  {member.user.image ? (
                    <img src={member.user.image} alt={member.user.name || ""} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[#fffbdf]/70">
                      {member.user.name?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#fffbdf]">{member.user.name}</p>
                  <p className="text-sm text-[#fffbdf]/50">{member.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge.bg}`}>
                  {roleBadge.icon}
                  {member.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Mail, Check, X, Users, Clock, Folder } from "lucide-react";
import { getUserInvitations, acceptInvitation, rejectInvitation } from "@/app/actions/invitation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Invitation {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    description?: string | null;
  };
  team: {
    id: string;
    name: string;
  };
  inviter: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function InvitationsList() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const result = await getUserInvitations();
      if (result.success && result.invitations) {
        setInvitations(result.invitations as any);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string, projectName: string) => {
    setProcessingId(invitationId);
    const loadingToast = toast.loading('Accepting invitation...');
    
    try {
      const result = await acceptInvitation(invitationId);
      
      if (result.success) {
        toast.success(`You joined the project "${projectName}"!`, { id: loadingToast });
        fetchInvitations(); // Refresh list
        router.refresh(); // Refresh page to update team access
      } else {
        toast.error(result.error || 'Failed to accept invitation', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error('An error occurred', { id: loadingToast });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId: string, projectName: string) => {
    setProcessingId(invitationId);
    const loadingToast = toast.loading('Rejecting invitation...');
    
    try {
      const result = await rejectInvitation(invitationId);
      
      if (result.success) {
        toast.success(`Invitation to "${projectName}" rejected`, { id: loadingToast });
        fetchInvitations(); // Refresh list
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to reject invitation', { id: loadingToast });
      }
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      toast.error('An error occurred', { id: loadingToast });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800 p-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            No pending invitations
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            You don't have any team invitations at the moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
      <div className="border-b p-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Project Invitations ({invitations.length})
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Accept or reject invitations to join projects
        </p>
      </div>

      <div className="divide-y dark:divide-neutral-800">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {invitation.project.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {invitation.team.name} • Invited by {invitation.inviter.name || invitation.inviter.email}
                    </p>
                  </div>
                </div>
                
                {/* Project Description */}
                {invitation.project.description && (
                  <div className="ml-13 mb-2">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {invitation.project.description}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 ml-13">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(invitation.createdAt), 'MMM d, yyyy')}
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    {invitation.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccept(invitation.id, invitation.project.name)}
                  disabled={processingId === invitation.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleReject(invitation.id, invitation.project.name)}
                  disabled={processingId === invitation.id}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

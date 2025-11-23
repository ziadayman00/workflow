'use client'

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Comment {
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
}

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
  currentUserId: string;
}

export default function CommentSection({ taskId, comments, currentUserId }: CommentSectionProps) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Adding comment...');

    try {
      const { createComment } = await import('@/app/actions/comment');
      const result = await createComment({
        taskId,
        content: newComment.trim(),
      });

      if (result.success) {
        toast.success('Comment added!', { id: loadingToast });
        setNewComment('');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to add comment', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('An error occurred', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    const loadingToast = toast.loading('Updating comment...');

    try {
      const { updateComment } = await import('@/app/actions/comment');
      const result = await updateComment({
        commentId,
        content: editContent.trim(),
      });

      if (result.success) {
        toast.success('Comment updated!', { id: loadingToast });
        setEditingId(null);
        setEditContent('');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update comment', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const loadingToast = toast.loading('Deleting comment...');

    try {
      const { deleteComment } = await import('@/app/actions/comment');
      const result = await deleteComment(commentId);

      if (result.success) {
        toast.success('Comment deleted!', { id: loadingToast });
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete comment', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#fffbdf]/20 mb-3" />
            <p className="text-[#fffbdf]/40 text-sm">No comments yet</p>
            <p className="text-[#fffbdf]/30 text-xs mt-1">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.user.image ? (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#fffbdf]/10 flex items-center justify-center text-xs font-medium text-[#fffbdf]">
                    {comment.user.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#fffbdf] text-sm">
                    {comment.user.name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-[#fffbdf]/40">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] text-sm focus:outline-none focus:border-[#fffbdf]/60 resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="px-3 py-1 bg-[#fffbdf] text-[#222222] rounded text-xs font-medium hover:bg-[#fff5b8] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                        className="px-3 py-1 bg-[#2a2a2a] text-[#fffbdf] rounded text-xs font-medium hover:bg-[#333333] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[#fffbdf]/80 text-sm whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                    {comment.user.id === currentUserId && (
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-xs text-[#fffbdf]/50 hover:text-[#fffbdf] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs text-[#f87171]/50 hover:text-[#f87171] transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#fffbdf]/10 pt-4">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-3 bg-[#2a2a2a] border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder:text-[#fffbdf]/30 focus:outline-none focus:border-[#fffbdf]/60 resize-none"
            rows={3}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="self-end px-4 py-3 bg-[#fffbdf] text-[#222222] rounded-lg font-medium hover:bg-[#fff5b8] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

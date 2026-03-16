import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { ArticleComment } from '../types';
import { ArticleCommentItem } from './ArticleCommentItem';

interface ArticleCommentSectionProps {
  commentCount: number;
  comments: ArticleComment[];
  user: User | null;
  addComment: (content: string, parentId?: string) => Promise<boolean>;
  deleteComment: (commentId: string) => void;
}

export function ArticleCommentSection({
  commentCount,
  comments,
  user,
  addComment,
  deleteComment,
}: ArticleCommentSectionProps) {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const success = await addComment(newComment.trim());
    if (success) {
      setNewComment('');
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    const success = await addComment(replyContent.trim(), parentId);
    if (success) {
      setReplyContent('');
      setReplyingTo(null);
    }
    setSubmitting(false);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Bình luận ({commentCount})
      </h2>

      {/* New Comment Form */}
      {user ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Viết bình luận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submitting}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Gửi bình luận
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground mb-2">Đăng nhập để bình luận</p>
            <Button onClick={() => navigate('/auth')}>Đăng nhập</Button>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <ArticleCommentItem
            key={comment.id}
            comment={comment}
            currentUserId={user?.id}
            replyingTo={replyingTo}
            replyContent={replyContent}
            submitting={submitting}
            onSetReplyingTo={setReplyingTo}
            onSetReplyContent={setReplyContent}
            onSubmitReply={handleSubmitReply}
            onDeleteComment={deleteComment}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>
    </section>
  );
}

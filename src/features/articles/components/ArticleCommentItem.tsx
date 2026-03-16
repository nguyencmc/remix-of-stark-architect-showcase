import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Reply, MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ArticleComment } from '../types';

interface ArticleCommentItemProps {
  comment: ArticleComment;
  currentUserId: string | undefined;
  replyingTo: string | null;
  replyContent: string;
  submitting: boolean;
  onSetReplyingTo: (commentId: string | null) => void;
  onSetReplyContent: (content: string) => void;
  onSubmitReply: (parentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function ArticleCommentItem({
  comment,
  currentUserId,
  replyingTo,
  replyContent,
  submitting,
  onSetReplyingTo,
  onSetReplyContent,
  onSubmitReply,
  onDeleteComment,
}: ArticleCommentItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={comment.author?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {comment.author?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-medium">
                  {comment.author?.full_name || 'Ẩn danh'}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: vi
                  })}
                  {comment.is_edited && ' (đã chỉnh sửa)'}
                </span>
              </div>
              {currentUserId === comment.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bình luận này sẽ bị xóa vĩnh viễn.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteComment(comment.id)}
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="mt-1 text-foreground">{comment.content}</p>

            {currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-muted-foreground"
                onClick={() => onSetReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="w-3 h-3 mr-1" />
                Trả lời
              </Button>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 pl-4 border-l-2">
                <Textarea
                  placeholder="Viết trả lời..."
                  value={replyContent}
                  onChange={(e) => onSetReplyContent(e.target.value)}
                  rows={2}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || submitting}
                  >
                    Gửi
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onSetReplyingTo(null);
                      onSetReplyContent('');
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarImage src={reply.author?.avatar_url || ''} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {reply.author?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {reply.author?.full_name || 'Ẩn danh'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.created_at), {
                            addSuffix: true,
                            locale: vi
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

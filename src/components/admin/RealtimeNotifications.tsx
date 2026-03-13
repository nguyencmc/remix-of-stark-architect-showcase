import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, UserPlus, Shield, FileText, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'new_user' | 'audit_event' | 'role_change' | 'content_created';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: Notification = {
      ...notif,
      id: crypto.randomUUID(),
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    // Subscribe to profiles table for new users
    const channel = supabase
      .channel('admin-realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          const profile = payload.new as Record<string, unknown>;
          addNotification({
            type: 'new_user',
            title: 'Người dùng mới',
            description: String(profile.full_name || profile.email || 'Người dùng ẩn danh'),
            icon: UserPlus,
            color: 'text-blue-500',
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload) => {
          const log = payload.new as Record<string, unknown>;
          addNotification({
            type: 'audit_event',
            title: getAuditTitle(String(log.action)),
            description: `${log.entity_type} ${log.entity_id ? '(' + String(log.entity_id).substring(0, 8) + '...)' : ''}`,
            icon: getAuditIcon(String(log.action)),
            color: getAuditColor(String(log.action)),
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles' },
        (payload) => {
          const data = (payload.new || payload.old) as Record<string, unknown>;
          const eventType = payload.eventType;
          addNotification({
            type: 'role_change',
            title: eventType === 'INSERT' ? 'Gán quyền mới' : eventType === 'DELETE' ? 'Xóa quyền' : 'Cập nhật quyền',
            description: `${data?.role || 'unknown'} → ${String(data?.user_id || '').substring(0, 8)}...`,
            icon: Shield,
            color: 'text-orange-500',
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [addNotification]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}p trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h trước`;
    return `${Math.floor(hours / 24)}d trước`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("w-5 h-5", unreadCount > 0 && "text-primary")} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Thông báo</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount} mới
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-xs gap-1">
                <Check className="w-3 h-3" />
                Đọc hết
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs gap-1 text-destructive hover:text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Chưa có thông báo</p>
              <p className="text-xs mt-1">Thông báo realtime sẽ xuất hiện ở đây</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors",
                    !n.read && "bg-primary/5"
                  )}
                >
                  <div className={cn("mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    n.color.replace('text-', 'bg-').replace('500', '500/10')
                  )}>
                    <n.icon className={cn("w-4 h-4", n.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.timestamp)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <p className="text-center text-[10px] text-muted-foreground">
              🔴 Realtime • {notifications.length} thông báo
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function getAuditTitle(action: string): string {
  const map: Record<string, string> = {
    create: 'Tạo mới nội dung',
    update: 'Cập nhật nội dung',
    delete: 'Xóa nội dung',
    login: 'Đăng nhập hệ thống',
    export: 'Xuất dữ liệu',
    import: 'Nhập dữ liệu',
  };
  return map[action] || `Sự kiện: ${action}`;
}

function getAuditIcon(action: string) {
  if (action === 'delete') return Trash2;
  return FileText;
}

function getAuditColor(action: string): string {
  if (action === 'delete') return 'text-red-500';
  if (action === 'create') return 'text-green-500';
  return 'text-yellow-500';
}

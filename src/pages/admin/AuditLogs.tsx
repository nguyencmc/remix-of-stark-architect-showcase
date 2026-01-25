import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow, isToday, isYesterday, startOfDay, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Shield,
  User,
  Clock,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  FileText,
  UserPlus,
  UserMinus,
  Key,
  Trash2,
  Edit,
  Plus,
  Eye,
  Search,
  Calendar,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  ArrowUpDown,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { useAuditLogs, AuditLog } from '@/hooks/useAuditLogs';
import { useToast } from '@/hooks/use-toast';

const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; bgColor: string; textColor: string }> = {
  permission_granted: { 
    label: 'Cấp quyền', 
    icon: <Key className="w-4 h-4" />, 
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  permission_revoked: { 
    label: 'Thu hồi quyền', 
    icon: <Key className="w-4 h-4" />, 
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400'
  },
  role_assigned: { 
    label: 'Gán vai trò', 
    icon: <UserPlus className="w-4 h-4" />, 
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  role_removed: { 
    label: 'Xóa vai trò', 
    icon: <UserMinus className="w-4 h-4" />, 
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  user_created: { 
    label: 'Tạo người dùng', 
    icon: <UserPlus className="w-4 h-4" />, 
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  user_deleted: { 
    label: 'Xóa người dùng', 
    icon: <Trash2 className="w-4 h-4" />, 
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400'
  },
  user_updated: { 
    label: 'Cập nhật người dùng', 
    icon: <Edit className="w-4 h-4" />, 
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  login: { 
    label: 'Đăng nhập', 
    icon: <User className="w-4 h-4" />, 
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  logout: { 
    label: 'Đăng xuất', 
    icon: <User className="w-4 h-4" />, 
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-400'
  },
  create: { 
    label: 'Tạo mới', 
    icon: <Plus className="w-4 h-4" />, 
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  update: { 
    label: 'Cập nhật', 
    icon: <Edit className="w-4 h-4" />, 
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  delete: { 
    label: 'Xóa', 
    icon: <Trash2 className="w-4 h-4" />, 
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400'
  },
  view: { 
    label: 'Xem', 
    icon: <Eye className="w-4 h-4" />, 
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-400'
  },
};

const ENTITY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  role_permission: { label: 'Quyền vai trò', icon: <Key className="w-3 h-3" /> },
  user_role: { label: 'Vai trò người dùng', icon: <Shield className="w-3 h-3" /> },
  user: { label: 'Người dùng', icon: <User className="w-3 h-3" /> },
  course: { label: 'Khóa học', icon: <FileText className="w-3 h-3" /> },
  exam: { label: 'Đề thi', icon: <FileText className="w-3 h-3" /> },
  flashcard: { label: 'Flashcard', icon: <FileText className="w-3 h-3" /> },
  podcast: { label: 'Podcast', icon: <FileText className="w-3 h-3" /> },
  question_set: { label: 'Bộ câu hỏi', icon: <FileText className="w-3 h-3" /> },
  settings: { label: 'Cài đặt', icon: <FileText className="w-3 h-3" /> },
};

const TIME_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
];

type ViewMode = 'timeline' | 'table';

const getRelativeTime = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

const getActionBadge = (action: string) => {
  const config = ACTION_CONFIG[action] || { 
    label: action, 
    icon: <FileText className="w-4 h-4" />, 
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-400'
  };
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

const TimelineLogItem = ({ log }: { log: AuditLog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const actionConfig = ACTION_CONFIG[log.action] || { 
    label: log.action, 
    icon: <FileText className="w-4 h-4" />, 
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-400'
  };
  
  const entityConfig = ENTITY_LABELS[log.entity_type] || { label: log.entity_type, icon: <FileText className="w-3 h-3" /> };

  const getChangePreview = () => {
    if (log.new_value && typeof log.new_value === 'object' && !Array.isArray(log.new_value)) {
      const val = log.new_value as Record<string, unknown>;
      if (val.permission) return `Quyền: ${val.permission}`;
      if (val.role) return `Vai trò: ${val.role}`;
    }
    if (log.old_value && typeof log.old_value === 'object' && !Array.isArray(log.old_value)) {
      const val = log.old_value as Record<string, unknown>;
      if (val.permission) return `Quyền: ${val.permission}`;
      if (val.role) return `Vai trò: ${val.role}`;
    }
    return null;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="group relative pl-8 pb-6 last:pb-0">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border group-last:hidden" />
        
        {/* Timeline dot */}
        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${actionConfig.bgColor} ${actionConfig.textColor} flex items-center justify-center ring-4 ring-background`}>
          {actionConfig.icon}
        </div>

        <CollapsibleTrigger className="w-full text-left">
          <div className="bg-card hover:bg-muted/50 border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {getActionBadge(log.action)}
                  <Badge variant="secondary" className="gap-1 text-xs font-normal">
                    {entityConfig.icon}
                    {entityConfig.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {log.user_name || log.user_email || 'Hệ thống'}
                    </span>
                  </div>
                </div>

                {getChangePreview() && (
                  <p className="text-sm text-muted-foreground mt-2 truncate">
                    {getChangePreview()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(log.created_at)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {format(new Date(log.created_at), 'HH:mm:ss - dd/MM/yyyy', { locale: vi })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-2 ml-4 p-4 bg-muted/30 rounded-lg border space-y-4">
            {/* Change details */}
            <div className="grid gap-4 sm:grid-cols-2">
              {log.old_value && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                    <XCircle className="w-4 h-4" />
                    Giá trị cũ
                  </div>
                  <pre className="text-xs bg-rose-500/5 border border-rose-500/20 p-3 rounded-lg overflow-auto max-h-40">
                    {JSON.stringify(log.old_value, null, 2)}
                  </pre>
                </div>
              )}
              {log.new_value && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Giá trị mới
                  </div>
                  <pre className="text-xs bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg overflow-auto max-h-40">
                    {JSON.stringify(log.new_value, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  Metadata
                </div>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-32">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Footer info */}
            <div className="flex flex-wrap gap-4 pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="opacity-60">ID:</span>
                <code className="bg-muted px-1.5 py-0.5 rounded">{log.id.slice(0, 8)}...</code>
              </div>
              {log.entity_id && (
                <div className="flex items-center gap-1">
                  <span className="opacity-60">Entity:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded">{log.entity_id.slice(0, 8)}...</code>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(log.created_at), 'HH:mm:ss - dd/MM/yyyy', { locale: vi })}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const TableView = ({ logs }: { logs: AuditLog[] }) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[180px]">Thời gian</TableHead>
            <TableHead className="w-[140px]">Hành động</TableHead>
            <TableHead className="w-[140px]">Đối tượng</TableHead>
            <TableHead>Người thực hiện</TableHead>
            <TableHead className="w-[200px]">Chi tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const entityConfig = ENTITY_LABELS[log.entity_type] || { label: log.entity_type, icon: <FileText className="w-3 h-3" /> };
            
            const getQuickDetail = () => {
              if (log.new_value && typeof log.new_value === 'object' && !Array.isArray(log.new_value)) {
                const val = log.new_value as Record<string, unknown>;
                if (val.permission) return String(val.permission);
                if (val.role) return String(val.role);
              }
              if (log.old_value && typeof log.old_value === 'object' && !Array.isArray(log.old_value)) {
                const val = log.old_value as Record<string, unknown>;
                if (val.permission) return String(val.permission);
                if (val.role) return String(val.role);
              }
              return log.entity_id ? `${log.entity_id.slice(0, 8)}...` : '-';
            };

            return (
              <TableRow key={log.id} className="group hover:bg-muted/50">
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-left">
                        <div className="text-sm">{getRelativeTime(log.created_at)}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'HH:mm', { locale: vi })}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(log.created_at), 'HH:mm:ss - dd/MM/yyyy', { locale: vi })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="gap-1 text-xs font-normal">
                    {entityConfig.icon}
                    {entityConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm truncate max-w-[150px]">
                      {log.user_name || log.user_email || 'Hệ thống'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded truncate block max-w-[180px]">
                    {getQuickDetail()}
                  </code>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const AuditLogs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = usePermissionsContext();
  
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  const { logs, loading, error, refetch } = useAuditLogs({
    entityType: entityTypeFilter !== 'all' ? entityTypeFilter : undefined,
    action: actionFilter !== 'all' ? actionFilter : undefined,
    limit: 500,
  });

  // Apply additional filters
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      result = result.filter(log => {
        const logDate = new Date(log.created_at);
        switch (timeFilter) {
          case 'today':
            return isToday(logDate);
          case 'yesterday':
            return isYesterday(logDate);
          case '7days':
            return logDate >= subDays(startOfDay(now), 7);
          case '30days':
            return logDate >= subDays(startOfDay(now), 30);
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.user_email?.toLowerCase().includes(query) ||
        log.user_name?.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.entity_type.toLowerCase().includes(query) ||
        JSON.stringify(log.new_value).toLowerCase().includes(query) ||
        JSON.stringify(log.old_value).toLowerCase().includes(query)
      );
    }

    return result;
  }, [logs, timeFilter, searchQuery]);

  // Group logs by date for timeline view
  const groupedLogs = useMemo(() => {
    const groups: Record<string, AuditLog[]> = {};
    
    filteredLogs.forEach(log => {
      const date = startOfDay(new Date(log.created_at)).toISOString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, logs]) => ({
        date,
        label: isToday(new Date(date)) 
          ? 'Hôm nay' 
          : isYesterday(new Date(date)) 
            ? 'Hôm qua' 
            : format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi }),
        logs
      }));
  }, [filteredLogs]);

  // Stats
  const stats = useMemo(() => {
    const todayCount = logs.filter(l => isToday(new Date(l.created_at))).length;
    const permissionChanges = logs.filter(l => l.entity_type === 'role_permission').length;
    const roleChanges = logs.filter(l => l.entity_type === 'user_role').length;
    const criticalActions = logs.filter(l => ['delete', 'permission_revoked', 'role_removed'].includes(l.action)).length;
    
    return { todayCount, permissionChanges, roleChanges, criticalActions };
  }, [logs]);

  // Export logs as TXT
  const handleExport = () => {
    const lines = filteredLogs.map(log => {
      const actionLabel = ACTION_CONFIG[log.action]?.label || log.action;
      const entityLabel = ENTITY_LABELS[log.entity_type]?.label || log.entity_type;
      const user = log.user_name || log.user_email || 'Hệ thống';
      const time = format(new Date(log.created_at), 'HH:mm:ss dd/MM/yyyy', { locale: vi });
      
      let detail = '';
      if (log.new_value && typeof log.new_value === 'object') {
        const val = log.new_value as Record<string, unknown>;
        if (val.permission) detail = ` | Quyền: ${val.permission}`;
        else if (val.role) detail = ` | Vai trò: ${val.role}`;
      }
      if (!detail && log.old_value && typeof log.old_value === 'object') {
        const val = log.old_value as Record<string, unknown>;
        if (val.permission) detail = ` | Quyền: ${val.permission}`;
        else if (val.role) detail = ` | Vai trò: ${val.role}`;
      }
      
      return `[${time}] ${actionLabel} - ${entityLabel} | Người thực hiện: ${user}${detail}`;
    });
    
    const header = `=== NHẬT KÝ HỆ THỐNG ===\nXuất lúc: ${format(new Date(), 'HH:mm:ss dd/MM/yyyy', { locale: vi })}\nTổng số: ${filteredLogs.length} logs\n${'='.repeat(50)}\n\n`;
    const content = header + lines.join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd-HHmm')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Xuất file thành công', description: `${filteredLogs.length} logs đã được xuất` });
  };

  // Redirect non-admins
  if (!roleLoading && !isAdmin) {
    navigate('/');
    toast({
      title: 'Không có quyền truy cập',
      description: 'Chỉ admin mới có thể xem audit logs',
      variant: 'destructive',
    });
    return null;
  }

  if (roleLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const uniqueEntityTypes = [...new Set(logs.map((l) => l.entity_type))];
  const uniqueActions = [...new Set(logs.map((l) => l.action))];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nhật ký hệ thống</h1>
            <p className="text-muted-foreground text-sm">
              Theo dõi mọi thay đổi và hoạt động trong hệ thống
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất file
          </Button>
          <Button onClick={refetch} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng logs</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hôm nay</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.todayCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-violet-500/5 to-violet-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Thay đổi quyền</p>
                <p className="text-2xl font-bold text-violet-600">{stats.permissionChanges}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/5 to-rose-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hành động quan trọng</p>
                <p className="text-2xl font-bold text-rose-600">{stats.criticalActions}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <Card className="mb-6 border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Time Filter */}
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_FILTERS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Entity Type Filter */}
              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Đối tượng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đối tượng</SelectItem>
                  {uniqueEntityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {ENTITY_LABELS[type]?.label || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Action Filter */}
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hành động</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {ACTION_CONFIG[action]?.label || action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="ml-auto">
                <TabsList className="h-9">
                  <TabsTrigger value="timeline" className="gap-1.5 px-3">
                    <LayoutList className="w-4 h-4" />
                    <span className="hidden sm:inline">Timeline</span>
                  </TabsTrigger>
                  <TabsTrigger value="table" className="gap-1.5 px-3">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Bảng</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Active filters count */}
          {(entityTypeFilter !== 'all' || actionFilter !== 'all' || timeFilter !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <span className="text-sm text-muted-foreground">
                Đang hiển thị {filteredLogs.length} / {logs.length} logs
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setEntityTypeFilter('all');
                  setActionFilter('all');
                  setTimeFilter('all');
                  setSearchQuery('');
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Display */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center border-none shadow-sm">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-2">Có lỗi xảy ra</p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Thử lại
          </Button>
        </Card>
      ) : filteredLogs.length === 0 ? (
        <Card className="p-12 text-center border-none shadow-sm">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-medium mb-1">Không có audit log nào</p>
          <p className="text-muted-foreground text-sm">
            {searchQuery || entityTypeFilter !== 'all' || actionFilter !== 'all' 
              ? 'Thử thay đổi bộ lọc để xem thêm kết quả' 
              : 'Các hoạt động trong hệ thống sẽ được ghi lại ở đây'}
          </p>
        </Card>
      ) : viewMode === 'table' ? (
        <TableView logs={filteredLogs} />
      ) : (
        <ScrollArea className="h-[calc(100vh-420px)] min-h-[400px]">
          <div className="space-y-8 pr-4">
            {groupedLogs.map(({ date, label, logs: dayLogs }) => (
              <div key={date}>
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{label}</h3>
                      <p className="text-xs text-muted-foreground">{dayLogs.length} hoạt động</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-0">
                  {dayLogs.map((log) => (
                    <TimelineLogItem key={log.id} log={log} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default AuditLogs;

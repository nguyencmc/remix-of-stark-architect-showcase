import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format, isToday, isYesterday, startOfDay, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Shield,
  RefreshCw,
  ChevronRight,
  Activity,
  AlertCircle,
  Download,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useToast } from '@/hooks/useToast';
import { ACTION_CONFIG, ENTITY_LABELS } from '@/features/admin/constants/auditLogConfig';
import { AuditLogFilters } from '@/features/admin/components/AuditLogFilters';
import { AuditLogStats } from '@/features/admin/components/AuditLogStats';
import { AuditLogTimeline } from '@/features/admin/components/AuditLogTimeline';
import { AuditLogTable } from '@/features/admin/components/AuditLogTable';
import type { ViewMode } from '@/features/admin/types';

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
    const groups: Record<string, typeof logs> = {};
    
    filteredLogs.forEach(log => {
      const date = startOfDay(new Date(log.created_at)).toISOString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, dateLogs]) => ({
        date,
        label: isToday(new Date(date)) 
          ? 'Hôm nay' 
          : isYesterday(new Date(date)) 
            ? 'Hôm qua' 
            : format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi }),
        logs: dateLogs,
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
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Nhật ký hệ thống</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin" 
            className="w-10 h-10 rounded-lg border bg-background hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
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

      <AuditLogStats totalLogs={logs.length} stats={stats} />

      <AuditLogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        entityTypeFilter={entityTypeFilter}
        onEntityTypeFilterChange={setEntityTypeFilter}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        uniqueEntityTypes={uniqueEntityTypes}
        uniqueActions={uniqueActions}
        filteredCount={filteredLogs.length}
        totalCount={logs.length}
      />

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
        <AuditLogTable logs={filteredLogs} />
      ) : (
        <AuditLogTimeline groupedLogs={groupedLogs} />
      )}
    </div>
  );
};

export default AuditLogs;

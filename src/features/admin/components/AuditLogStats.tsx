import {
  FileText,
  TrendingUp,
  Key,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AuditLogStatsData } from '@/features/admin/types';

interface AuditLogStatsProps {
  totalLogs: number;
  stats: AuditLogStatsData;
}

export const AuditLogStats = ({ totalLogs, stats }: AuditLogStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-none shadow-sm bg-gradient-to-br from-blue-500/5 to-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng logs</p>
              <p className="text-2xl font-bold">{totalLogs}</p>
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
  );
};

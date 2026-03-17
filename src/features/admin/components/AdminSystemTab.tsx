import { Link } from 'react-router-dom';
import { DatabaseBackup } from '@/components/admin/databaseBackup';
import { SystemHealthCheck } from '@/components/admin/SystemHealthCheck';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Shield,
  Activity,
  GraduationCap,
  FolderOpen,
  ChevronRight,
  Newspaper,
} from 'lucide-react';

interface SystemLink {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bg: string;
}

const systemLinks: SystemLink[] = [
  { title: 'Quản lý người dùng', desc: 'Xem và quản lý tất cả users', icon: Users, href: '/admin/users', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { title: 'Duyệt bài viết', desc: 'Xem xét và phê duyệt bài viết', icon: Newspaper, href: '/admin/articles', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { title: 'Phân quyền RBAC', desc: 'Cấu hình vai trò và quyền', icon: Shield, href: '/admin/permissions', color: 'text-red-500', bg: 'bg-red-500/10' },
  { title: 'Audit Logs', desc: 'Theo dõi hoạt động hệ thống', icon: Activity, href: '/admin/audit-logs', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { title: 'Quản lý danh mục', desc: 'Phân loại nội dung', icon: FolderOpen, href: '/admin/categories', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { title: 'Lớp học', desc: 'Quản lý lớp học trực tuyến', icon: GraduationCap, href: '/classes', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

export function AdminSystemTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Quản lý hệ thống</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {systemLinks.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* System Health Check - Full */}
      <SystemHealthCheck />

      {/* Database Backup */}
      <DatabaseBackup />
    </div>
  );
}

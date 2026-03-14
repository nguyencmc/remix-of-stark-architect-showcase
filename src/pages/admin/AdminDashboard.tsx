import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import { RealtimeNotifications } from '@/components/admin/RealtimeNotifications';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Shield,
  Activity,
  Settings,
  FolderOpen,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { useAdminData } from '@/features/admin/hooks/useAdminData';
import { AdminOverviewTab } from '@/features/admin/components/AdminOverviewTab';
import { AdminUsersTab } from '@/features/admin/components/AdminUsersTab';
import { AdminContentTab } from '@/features/admin/components/AdminContentTab';
import { AdminSystemTab } from '@/features/admin/components/AdminSystemTab';
import type { AdminTab } from '@/features/admin/types';

const sidebarItems = [
  { id: 'overview' as const, label: 'Monitoring', icon: Activity, color: 'text-primary' },
  { id: 'users' as const, label: 'Người dùng', icon: Users, color: 'text-blue-500' },
  { id: 'content' as const, label: 'Nội dung', icon: FolderOpen, color: 'text-orange-500' },
  { id: 'system' as const, label: 'Hệ thống', icon: Settings, color: 'text-gray-500' },
];

const AdminDashboard = () => {
  const { isAdmin, loading: roleLoading } = usePermissionsContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const {
    stats,
    users,
    loading,
    refreshing,
    lastUpdated,
    fetchAllData,
    fetchUsers,
    handleRefresh,
    handleRoleChange,
  } = useAdminData();

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn cần quyền Admin để truy cập trang này",
        variant: "destructive",
      });
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin, fetchAllData]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AdminOverviewTab
            stats={stats}
            refreshing={refreshing}
            lastUpdated={lastUpdated}
            onRefresh={handleRefresh}
          />
        );
      case 'users':
        return (
          <AdminUsersTab
            users={users}
            loading={loading}
            onRoleChange={handleRoleChange}
            onRefreshUsers={fetchUsers}
          />
        );
      case 'content':
        return <AdminContentTab stats={stats} />;
      case 'system':
        return <AdminSystemTab />;
      default:
        return (
          <AdminOverviewTab
            stats={stats}
            refreshing={refreshing}
            lastUpdated={lastUpdated}
            onRefresh={handleRefresh}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitoring & Quản lý hệ thống</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RealtimeNotifications />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <nav className="space-y-1 sticky top-24">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", activeTab === item.id ? item.color : "")} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
              <TabsList className="grid w-full grid-cols-4">
                {sidebarItems.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} className="text-xs px-2">
                    <item.icon className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

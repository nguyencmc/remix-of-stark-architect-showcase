import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User,
  Bell,
  Moon,
  Shield,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

export function SettingsSection() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-500" />
          Cài đặt
        </h2>
        <Link to="/settings">
          <Button size="sm" variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Cài đặt đầy đủ
          </Button>
        </Link>
      </div>

      {/* Account Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5" />
            Tài khoản
          </CardTitle>
          <CardDescription>Quản lý thông tin cá nhân</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Link to="/settings">
              <Button variant="outline" size="sm">Chỉnh sửa</Button>
            </Link>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Hồ sơ công khai</p>
              <p className="text-sm text-muted-foreground">Cập nhật ảnh đại diện và thông tin</p>
            </div>
            <Link to={`/@${user?.email?.split('@')[0]}`}>
              <Button variant="outline" size="sm">Xem hồ sơ</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Moon className="w-5 h-5" />
            Giao diện
          </CardTitle>
          <CardDescription>Tùy chỉnh hiển thị</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-sm font-medium">Chế độ tối</Label>
              <p className="text-xs text-muted-foreground">Bật chế độ tối để bảo vệ mắt</p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="w-5 h-5" />
            Thông báo
          </CardTitle>
          <CardDescription>Quản lý thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-sm font-medium">Email thông báo</Label>
              <p className="text-xs text-muted-foreground">Nhận thông báo qua email</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="study-reminders" className="text-sm font-medium">Nhắc nhở học tập</Label>
              <p className="text-xs text-muted-foreground">Nhắc nhở ôn tập hàng ngày</p>
            </div>
            <Switch id="study-reminders" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-5 h-5" />
            Bảo mật
          </CardTitle>
          <CardDescription>Cài đặt bảo mật tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Đổi mật khẩu</p>
              <p className="text-sm text-muted-foreground">Cập nhật mật khẩu đăng nhập</p>
            </div>
            <Link to="/settings">
              <Button variant="outline" size="sm">Đổi mật khẩu</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-sm">Đăng xuất</p>
                <p className="text-xs text-muted-foreground">Đăng xuất khỏi tài khoản</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

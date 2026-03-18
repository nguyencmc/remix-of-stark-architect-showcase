import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Save } from "lucide-react";
import { useSecurity } from "../hooks/useSecurity";

export const SecurityForm = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    updating,
    handleUpdatePassword,
  } = useSecurity();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Mật khẩu & Bảo mật
        </CardTitle>
        <CardDescription>
          Đảm bảo tài khoản của bạn đang sử dụng mật khẩu an toàn và khó đoán
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={updating || !newPassword || !confirmPassword} className="min-w-36">
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Lưu mật khẩu
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";

interface LoginRegisterFormProps {
  mode: 'login' | 'register';
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  isLoading: boolean;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onToggleMode: () => void;
}

export function LoginRegisterForm({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  showPassword,
  setShowPassword,
  isLoading,
  errors,
  onSubmit,
  onForgotPassword,
  onToggleMode,
}: LoginRegisterFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full shadow-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : mode === 'login' ? (
            "Đăng nhập"
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          {mode === 'login' ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium"
          >
            {mode === 'login' ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </>
  );
}

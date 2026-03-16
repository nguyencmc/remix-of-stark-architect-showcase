import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({
  email,
  setEmail,
  isLoading,
  errors,
  onSubmit,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full shadow-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi email đặt lại mật khẩu"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-primary hover:underline font-medium"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </>
  );
}

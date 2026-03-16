import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/utils";
import { signInSchema, signUpSchema } from "../types";
import type { AuthMode } from "../types";

export function useAuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      if (error) throw error;
    } catch (error: unknown) {
      toast({
        title: "Đăng nhập thất bại",
        description: getErrorMessage(error) || "Không thể đăng nhập bằng Google",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "Vui lòng nhập email" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      toast({
        title: "Email đã được gửi",
        description: "Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.",
      });
      setMode('login');
    } catch (error: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(error) || "Không thể gửi email đặt lại mật khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = signInSchema.safeParse({ email, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Đăng nhập thất bại",
              description: "Email hoặc mật khẩu không đúng",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Đăng nhập thất bại",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Đăng nhập thành công",
            description: "Chào mừng bạn quay lại!",
          });
          navigate("/");
        }
      } else if (mode === 'register') {
        const result = signUpSchema.safeParse({ email, password, fullName });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "Đăng ký thất bại",
              description: "Email này đã được đăng ký. Vui lòng đăng nhập.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Đăng ký thất bại",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Đăng ký thành công",
            description: "Tài khoản của bạn đã được tạo!",
          });
          navigate("/");
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(error) || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    showPassword,
    setShowPassword,
    isLoading,
    isGoogleLoading,
    errors,
    setErrors,
    handleGoogleLogin,
    handleForgotPassword,
    handleSubmit,
  };
}

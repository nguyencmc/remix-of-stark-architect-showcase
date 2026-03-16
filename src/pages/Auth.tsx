import { useAuthPage } from "@/features/authPage/hooks";
import {
  AuthLogo,
  GoogleLoginButton,
  LoginRegisterForm,
  ForgotPasswordForm,
  AuthDivider,
} from "@/features/authPage/components";

const Auth = () => {
  const {
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
  } = useAuthPage();

  if (mode === 'forgot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-card p-8 border border-border/50">
            <AuthLogo
              title="Quên mật khẩu"
              subtitle="Nhập email để nhận link đặt lại mật khẩu"
            />
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              errors={errors}
              onSubmit={handleForgotPassword}
              onBackToLogin={() => setMode('login')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border/50">
          <AuthLogo
            title={mode === 'login' ? "Đăng nhập" : "Đăng ký"}
            subtitle={mode === 'login' ? "Chào mừng bạn quay lại!" : "Tạo tài khoản để bắt đầu học"}
          />
          <GoogleLoginButton
            isLoading={isGoogleLoading}
            onClick={handleGoogleLogin}
          />
          <AuthDivider />
          <LoginRegisterForm
            mode={mode as 'login' | 'register'}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            errors={errors}
            onSubmit={handleSubmit}
            onForgotPassword={() => setMode('forgot')}
            onToggleMode={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrors({});
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;

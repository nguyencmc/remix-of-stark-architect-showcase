import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSecurity = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success("Thay đổi mật khẩu thành công");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setUpdating(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    updating,
    handleUpdatePassword,
  };
};

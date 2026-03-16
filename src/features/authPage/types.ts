import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const signUpSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
});

export type AuthMode = 'login' | 'register' | 'forgot';

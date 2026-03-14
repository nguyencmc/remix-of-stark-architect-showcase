import {
  Key,
  UserPlus,
  UserMinus,
  Trash2,
  Edit,
  Plus,
  Eye,
  User,
  Shield,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { ActionConfigItem, EntityLabelItem, TimeFilterOption } from '@/features/admin/types';

export const ACTION_CONFIG: Record<string, ActionConfigItem> = {
  permission_granted: {
    label: 'Cấp quyền',
    icon: <Key className="w-4 h-4" />,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  permission_revoked: {
    label: 'Thu hồi quyền',
    icon: <Key className="w-4 h-4" />,
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  role_assigned: {
    label: 'Gán vai trò',
    icon: <UserPlus className="w-4 h-4" />,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  role_removed: {
    label: 'Xóa vai trò',
    icon: <UserMinus className="w-4 h-4" />,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
  user_created: {
    label: 'Tạo người dùng',
    icon: <UserPlus className="w-4 h-4" />,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  user_deleted: {
    label: 'Xóa người dùng',
    icon: <Trash2 className="w-4 h-4" />,
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  user_updated: {
    label: 'Cập nhật người dùng',
    icon: <Edit className="w-4 h-4" />,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  login: {
    label: 'Đăng nhập',
    icon: <User className="w-4 h-4" />,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  logout: {
    label: 'Đăng xuất',
    icon: <User className="w-4 h-4" />,
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-400',
  },
  create: {
    label: 'Tạo mới',
    icon: <Plus className="w-4 h-4" />,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  update: {
    label: 'Cập nhật',
    icon: <Edit className="w-4 h-4" />,
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  delete: {
    label: 'Xóa',
    icon: <Trash2 className="w-4 h-4" />,
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  view: {
    label: 'Xem',
    icon: <Eye className="w-4 h-4" />,
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-400',
  },
};

export const ENTITY_LABELS: Record<string, EntityLabelItem> = {
  role_permission: { label: 'Quyền vai trò', icon: <Key className="w-3 h-3" /> },
  user_role: { label: 'Vai trò người dùng', icon: <Shield className="w-3 h-3" /> },
  user: { label: 'Người dùng', icon: <User className="w-3 h-3" /> },
  course: { label: 'Khóa học', icon: <FileText className="w-3 h-3" /> },
  exam: { label: 'Đề thi', icon: <FileText className="w-3 h-3" /> },
  flashcard: { label: 'Flashcard', icon: <FileText className="w-3 h-3" /> },
  podcast: { label: 'Podcast', icon: <FileText className="w-3 h-3" /> },
  question_set: { label: 'Bộ câu hỏi', icon: <FileText className="w-3 h-3" /> },
  settings: { label: 'Cài đặt', icon: <FileText className="w-3 h-3" /> },
};

export const TIME_FILTERS: TimeFilterOption[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
];

const DEFAULT_ACTION_CONFIG: Omit<ActionConfigItem, 'label'> = {
  icon: <FileText className="w-4 h-4" />,
  bgColor: 'bg-slate-500/10',
  textColor: 'text-slate-600 dark:text-slate-400',
};

export const getRelativeTime = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

export const getActionBadge = (action: string) => {
  const config = ACTION_CONFIG[action] || { ...DEFAULT_ACTION_CONFIG, label: action };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

export const getDefaultActionConfig = (action: string): ActionConfigItem => {
  return ACTION_CONFIG[action] || { ...DEFAULT_ACTION_CONFIG, label: action };
};

export const getDefaultEntityConfig = (entityType: string): EntityLabelItem => {
  return ENTITY_LABELS[entityType] || { label: entityType, icon: <FileText className="w-3 h-3" /> };
};

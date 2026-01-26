-- Insert classroom permissions
INSERT INTO public.permissions (name, description, category) VALUES
  ('classes.create', 'Tạo lớp học mới', 'classes'),
  ('classes.edit', 'Chỉnh sửa mọi lớp học', 'classes'),
  ('classes.edit_own', 'Chỉnh sửa lớp học do mình tạo', 'classes'),
  ('classes.delete', 'Xóa mọi lớp học', 'classes'),
  ('classes.delete_own', 'Xóa lớp học do mình tạo', 'classes'),
  ('classes.view', 'Xem danh sách lớp học', 'classes'),
  ('classes.manage_members', 'Quản lý thành viên lớp học', 'classes'),
  ('classes.manage_assignments', 'Quản lý bài tập lớp học', 'classes')
ON CONFLICT (name) DO NOTHING;

-- Grant all classes permissions to admin role
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::app_role, id FROM public.permissions WHERE category = 'classes'
ON CONFLICT (role, permission_id) DO NOTHING;

-- Grant teacher permissions for classes
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'teacher'::app_role, id FROM public.permissions 
WHERE name IN ('classes.create', 'classes.edit_own', 'classes.delete_own', 'classes.view', 'classes.manage_members', 'classes.manage_assignments')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Grant user (student) view permission
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'user'::app_role, id FROM public.permissions WHERE name = 'classes.view'
ON CONFLICT (role, permission_id) DO NOTHING;
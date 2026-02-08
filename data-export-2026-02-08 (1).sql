-- =============================================
-- DATA EXPORT
-- Generated at: 2026-02-08T04:56:50.314Z
-- Tables: 6
-- =============================================

-- -----------------------------------------------
-- Table: permissions (78 rows)
-- -----------------------------------------------
INSERT INTO public.permissions (id, name, description, category, created_at) VALUES
  ('4afa69a0-1094-485d-8be3-40e1c256e6d4', 'users.view', 'Xem danh sách người dùng', 'users', '2026-01-24T01:01:55.58786+00:00'),
  ('cc63bd29-1a82-4bea-9469-47ee9d16be4a', 'users.create', 'Tạo người dùng mới', 'users', '2026-01-24T01:01:55.58786+00:00'),
  ('456a42b7-d36e-4970-b39c-a625aceecae2', 'users.edit', 'Chỉnh sửa người dùng', 'users', '2026-01-24T01:01:55.58786+00:00'),
  ('a4845e1c-cada-494f-a61f-c3f19bd4aae4', 'users.delete', 'Xóa người dùng', 'users', '2026-01-24T01:01:55.58786+00:00'),
  ('7c56682d-cf7b-49b4-9339-951635def569', 'users.manage_roles', 'Quản lý vai trò người dùng', 'users', '2026-01-24T01:01:55.58786+00:00'),
  ('7e4bbc31-934c-4c61-a9fe-1a7cf4c04b59', 'courses.view', 'Xem khóa học', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('69e8f276-7aba-4eb9-bf2f-c654cbcc4dcb', 'courses.create', 'Tạo khóa học mới', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('83393c36-17a2-46fb-9d09-f9b2dbcd8869', 'courses.edit', 'Chỉnh sửa tất cả khóa học', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('46869a60-9c82-4ccb-8af9-35a048245ef4', 'courses.edit_own', 'Chỉnh sửa khóa học của mình', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('c6f45e46-3c6e-4963-9f4a-b1b9e8b7edeb', 'courses.delete', 'Xóa tất cả khóa học', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('32aecb1d-483a-4aea-82ab-5a2f508eb0a3', 'courses.delete_own', 'Xóa khóa học của mình', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('918342fa-184b-4868-bc50-c80da81672f5', 'courses.publish', 'Xuất bản khóa học', 'courses', '2026-01-24T01:01:55.58786+00:00'),
  ('55ef8d2f-bb38-44e2-a66f-02260f8f3cce', 'exams.view', 'Xem đề thi', 'exams', '2026-01-24T01:01:55.58786+00:00'),
  ('7f51cf32-d5d6-485f-9923-41cd036273d6', 'exams.create', 'Tạo đề thi mới', 'exams', '2026-01-24T01:01:55.58786+00:00'),
  ('4645c944-5361-4f8e-9daf-2c3a4392272f', 'exams.edit', 'Chỉnh sửa tất cả đề thi', 'exams', '2026-01-24T01:01:55.58786+00:00'),
  ('8cecd87d-ee91-4032-b653-d06a471bcb63', 'exams.edit_own', 'Chỉnh sửa đề thi của mình', 'exams', '2026-01-24T01:01:55.58786+00:00'),
  ('9b0c00c3-e0d5-44ad-8e08-2c0a1cefbe46', 'exams.delete', 'Xóa tất cả đề thi', 'exams', '2026-01-24T01:01:55.58786+00:00'),
  ('2db2b044-e957-44dd-a597-7a86425f01e0', 'exams.delete_own', 'Xóa đề thi của mình', 'exams', '2026-01-24T01:01:55.58786+00:00'),
  ('98885897-0ac1-4817-9856-a81e1af8e29f', 'questions.view', 'Xem câu hỏi', 'questions', '2026-01-24T01:01:55.58786+00:00'),
  ('5ccf0aa8-dbc4-488f-993c-86a961cb7691', 'questions.create', 'Tạo câu hỏi mới', 'questions', '2026-01-24T01:01:55.58786+00:00'),
  ('6ee20ac4-10bd-47bb-bd59-8d1628f73138', 'questions.edit', 'Chỉnh sửa câu hỏi', 'questions', '2026-01-24T01:01:55.58786+00:00'),
  ('8543a5a6-bcd9-4d12-be4c-ede23053386f', 'questions.delete', 'Xóa câu hỏi', 'questions', '2026-01-24T01:01:55.58786+00:00'),
  ('28d3a960-acaa-4364-b7bf-c1bb235c089d', 'questions.import', 'Import câu hỏi', 'questions', '2026-01-24T01:01:55.58786+00:00'),
  ('97ac9e1c-c3b9-49b7-bd5c-491b4a220e38', 'questions.export', 'Export câu hỏi', 'questions', '2026-01-24T01:01:55.58786+00:00'),
  ('dcec02b2-a6b5-46bb-8830-22faf3288683', 'podcasts.view', 'Xem podcast', 'podcasts', '2026-01-24T01:01:55.58786+00:00'),
  ('34bfd575-6144-4916-92e9-8644fa912a5d', 'podcasts.create', 'Tạo podcast mới', 'podcasts', '2026-01-24T01:01:55.58786+00:00'),
  ('b06f3b4a-b628-4971-a74c-fc9b66815b76', 'podcasts.edit', 'Chỉnh sửa podcast', 'podcasts', '2026-01-24T01:01:55.58786+00:00'),
  ('ea5f5a7a-f0a6-4105-8f39-e4f59338fc96', 'podcasts.edit_own', 'Chỉnh sửa podcast của mình', 'podcasts', '2026-01-24T01:01:55.58786+00:00'),
  ('6b4553fe-98b7-4e79-b22d-144a33e637f4', 'podcasts.delete', 'Xóa podcast', 'podcasts', '2026-01-24T01:01:55.58786+00:00'),
  ('f291b646-8103-4b0d-914e-452333d8088b', 'podcasts.delete_own', 'Xóa podcast của mình', 'podcasts', '2026-01-24T01:01:55.58786+00:00'),
  ('908a3213-796e-4d35-afe4-78b190244b73', 'books.view', 'Xem sách', 'books', '2026-01-24T01:01:55.58786+00:00'),
  ('31d21e24-6fa6-48dd-9fbe-d5b66d22ce42', 'books.create', 'Tạo sách mới', 'books', '2026-01-24T01:01:55.58786+00:00'),
  ('a421eea6-348f-4725-85f7-2242f628a380', 'books.edit', 'Chỉnh sửa sách', 'books', '2026-01-24T01:01:55.58786+00:00'),
  ('bcf05666-ce2a-47fa-8c0a-3af475590795', 'books.edit_own', 'Chỉnh sửa sách của mình', 'books', '2026-01-24T01:01:55.58786+00:00'),
  ('0e21acd0-de09-4695-81ae-8cb286d05a1e', 'books.delete', 'Xóa sách', 'books', '2026-01-24T01:01:55.58786+00:00'),
  ('9880a487-7d78-445a-b924-6d0705677fad', 'books.delete_own', 'Xóa sách của mình', 'books', '2026-01-24T01:01:55.58786+00:00'),
  ('d7c33f78-f687-4923-af6e-d44f2ded8110', 'flashcards.view', 'Xem flashcard', 'flashcards', '2026-01-24T01:01:55.58786+00:00'),
  ('2585aed2-38e9-449a-b550-781b2b440616', 'flashcards.create', 'Tạo bộ flashcard', 'flashcards', '2026-01-24T01:01:55.58786+00:00'),
  ('fb9c3410-875c-4359-a383-83171524af16', 'flashcards.edit', 'Chỉnh sửa flashcard', 'flashcards', '2026-01-24T01:01:55.58786+00:00'),
  ('d8664751-b79c-4323-ab44-d37f94401a83', 'flashcards.delete', 'Xóa flashcard', 'flashcards', '2026-01-24T01:01:55.58786+00:00'),
  ('78ccdb12-2185-452c-b8d0-ca9e1192bc06', 'categories.view', 'Xem danh mục', 'categories', '2026-01-24T01:01:55.58786+00:00'),
  ('9564c9c1-1292-4a5e-9aa5-4d8cb1069a89', 'categories.create', 'Tạo danh mục mới', 'categories', '2026-01-24T01:01:55.58786+00:00'),
  ('b97fd998-e0c3-486a-8b5e-faf3ed49dcdf', 'categories.edit', 'Chỉnh sửa danh mục', 'categories', '2026-01-24T01:01:55.58786+00:00'),
  ('da8837c2-ad51-4876-99c8-f1bc3685f0ef', 'categories.delete', 'Xóa danh mục', 'categories', '2026-01-24T01:01:55.58786+00:00'),
  ('9f4e43be-34a7-4533-9056-be57b13f33d2', 'study_groups.view', 'Xem nhóm học', 'study_groups', '2026-01-24T01:01:55.58786+00:00'),
  ('9bea5104-c3b0-4407-8cb3-6ef28a09c842', 'study_groups.create', 'Tạo nhóm học', 'study_groups', '2026-01-24T01:01:55.58786+00:00'),
  ('11edcc8c-f3fd-4939-908e-ac0728f87e81', 'study_groups.edit', 'Chỉnh sửa nhóm học', 'study_groups', '2026-01-24T01:01:55.58786+00:00'),
  ('fc122c13-f79b-4eb4-b1bb-9a14df57abd2', 'study_groups.delete', 'Xóa nhóm học', 'study_groups', '2026-01-24T01:01:55.58786+00:00'),
  ('654287a7-ecd7-4ef0-927d-9806748dc2bc', 'study_groups.moderate', 'Kiểm duyệt nhóm học', 'study_groups', '2026-01-24T01:01:55.58786+00:00'),
  ('3ffa3feb-1f39-403f-9fe9-9efc7ecc7023', 'analytics.view', 'Xem thống kê', 'analytics', '2026-01-24T01:01:55.58786+00:00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  created_at = EXCLUDED.created_at;

INSERT INTO public.permissions (id, name, description, category, created_at) VALUES
  ('44c21f1d-bf09-43eb-8af2-745fbb26cc4b', 'analytics.export', 'Xuất báo cáo', 'analytics', '2026-01-24T01:01:55.58786+00:00'),
  ('53fe869f-18cc-4189-a141-90be250ae2b5', 'audit_logs.view', 'Xem nhật ký hoạt động', 'analytics', '2026-01-24T01:01:55.58786+00:00'),
  ('d430c21e-d37d-4853-88d3-ff614ffe2295', 'settings.view', 'Xem cài đặt hệ thống', 'settings', '2026-01-24T01:01:55.58786+00:00'),
  ('afcf301a-1328-44c1-b89e-f8aa21f36f13', 'settings.edit', 'Chỉnh sửa cài đặt', 'settings', '2026-01-24T01:01:55.58786+00:00'),
  ('ab4e64b1-a4a3-4a4b-82d2-cbb02a0da777', 'permissions.manage', 'Quản lý quyền hạn', 'settings', '2026-01-24T01:01:55.58786+00:00'),
  ('88c7630d-2b45-4f93-9f32-478ab172fd42', 'moderation.reviews', 'Kiểm duyệt đánh giá', 'moderation', '2026-01-24T01:01:55.58786+00:00'),
  ('51eea2c6-2442-4f28-a590-2bcb2177d06a', 'moderation.comments', 'Kiểm duyệt bình luận', 'moderation', '2026-01-24T01:01:55.58786+00:00'),
  ('addd9214-5ff2-4130-aefe-a945edb7c6c3', 'moderation.reports', 'Xử lý báo cáo vi phạm', 'moderation', '2026-01-24T01:01:55.58786+00:00'),
  ('b97988e4-4598-44ec-852f-143bc5102348', 'question_sets.view', 'Xem bộ câu hỏi', 'question_sets', '2026-01-23T07:29:54.86383+00:00'),
  ('85175939-334a-4550-a2f0-e973ee21e6ed', 'question_sets.create', 'Tạo bộ câu hỏi', 'question_sets', '2026-01-23T07:29:54.86383+00:00'),
  ('2c98f680-112b-4e15-88b0-4a381211a730', 'admin.dashboard', 'Truy cập trang quản trị Admin', 'admin', '2026-01-23T07:29:54.86383+00:00'),
  ('029fa13f-d486-4123-8a79-33ef60a4766c', 'question_sets.edit', 'Chỉnh sửa bộ câu hỏi', 'question_sets', '2026-01-23T07:29:54.86383+00:00'),
  ('ac0cb957-ecc7-4b88-acde-84dc2be869d7', 'admin.export_data', 'Xuất dữ liệu hệ thống', 'admin', '2026-01-23T07:29:54.86383+00:00'),
  ('2cd00314-cb3b-4b90-9cb2-9f75d0acd736', 'question_sets.edit_own', 'Chỉnh sửa bộ câu hỏi của mình', 'question_sets', '2026-01-23T07:29:54.86383+00:00'),
  ('3bbb293d-ac3e-4ff2-a719-94e9eafb21eb', 'admin.view_stats', 'Xem thống kê hệ thống', 'admin', '2026-01-23T07:29:54.86383+00:00'),
  ('a75804c5-97fd-4176-8df7-519693be3fb4', 'question_sets.delete', 'Xóa bộ câu hỏi', 'question_sets', '2026-01-23T07:29:54.86383+00:00'),
  ('3db50b71-5dba-4ab4-86f5-c5ade91106cc', 'teacher.dashboard', 'Truy cập trang quản trị Teacher', 'teacher', '2026-01-23T07:29:54.86383+00:00'),
  ('b713cd77-cf80-4494-9833-d264dc685129', 'question_sets.delete_own', 'Xóa bộ câu hỏi của mình', 'question_sets', '2026-01-23T07:29:54.86383+00:00'),
  ('3b8f0a93-ecf4-494f-a93f-ce2fb06485d1', 'flashcards.edit_own', 'Chỉnh sửa flashcard của mình', 'flashcards', '2026-01-23T07:29:54.86383+00:00'),
  ('ef355ae8-affb-47c9-bd8b-6f6a4d88c173', 'flashcards.delete_own', 'Xóa flashcard của mình', 'flashcards', '2026-01-23T07:29:54.86383+00:00'),
  ('ee8cd5c1-2ce1-4151-8a24-e7646f3360b1', 'classes.create', 'Tạo lớp học mới', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('51dab6c2-293e-4334-b023-42b417d33690', 'classes.edit', 'Chỉnh sửa mọi lớp học', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('b79901ff-4663-4420-9969-86549b811cdb', 'classes.edit_own', 'Chỉnh sửa lớp học do mình tạo', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('3da1fddc-5593-4ced-b4e4-7e42c23b87b3', 'classes.delete', 'Xóa mọi lớp học', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('b5c1408a-ed16-4cf1-9206-1a917903a932', 'classes.delete_own', 'Xóa lớp học do mình tạo', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('2dbfbef4-9bed-4b3d-85af-70726fb80154', 'classes.view', 'Xem danh sách lớp học', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('ffb55364-0957-4a34-9290-eb5301a631fc', 'classes.manage_members', 'Quản lý thành viên lớp học', 'classes', '2026-01-26T06:36:09.804629+00:00'),
  ('98bf7ec4-c126-40ee-a488-2a003bb9c5b3', 'classes.manage_assignments', 'Quản lý bài tập lớp học', 'classes', '2026-01-26T06:36:09.804629+00:00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  created_at = EXCLUDED.created_at;

-- -----------------------------------------------
-- Table: user_roles (1 rows)
-- -----------------------------------------------
INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES
  ('989380c8-d0b9-4978-8645-e8a468adf461', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'admin', '2026-01-24T00:44:59.033591+00:00')
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  role = EXCLUDED.role,
  created_at = EXCLUDED.created_at;

-- -----------------------------------------------
-- Table: role_permissions (115 rows)
-- -----------------------------------------------
INSERT INTO public.role_permissions (id, role, permission_id, created_at) VALUES
  ('af4fdfd0-de79-45bb-a161-47a26748e69c', 'admin', '4afa69a0-1094-485d-8be3-40e1c256e6d4', '2026-01-24T07:07:58.067652+00:00'),
  ('827ed95b-833c-4912-a0ae-0f7acc7d140d', 'admin', 'cc63bd29-1a82-4bea-9469-47ee9d16be4a', '2026-01-24T07:07:58.067652+00:00'),
  ('90db1c2a-a4df-427c-b13f-7de8906e9fe9', 'admin', '456a42b7-d36e-4970-b39c-a625aceecae2', '2026-01-24T07:07:58.067652+00:00'),
  ('9ceee5a0-3279-4a81-9834-fda075fb96ba', 'admin', 'a4845e1c-cada-494f-a61f-c3f19bd4aae4', '2026-01-24T07:07:58.067652+00:00'),
  ('c1d2d886-4872-4642-bfcc-61d32b1717d1', 'admin', '7c56682d-cf7b-49b4-9339-951635def569', '2026-01-24T07:07:58.067652+00:00'),
  ('164e7344-fe3a-4cd4-bc60-411d5b095f6b', 'admin', '7e4bbc31-934c-4c61-a9fe-1a7cf4c04b59', '2026-01-24T07:07:58.067652+00:00'),
  ('76ab6722-3197-471f-8b07-0c20a4023705', 'admin', '69e8f276-7aba-4eb9-bf2f-c654cbcc4dcb', '2026-01-24T07:07:58.067652+00:00'),
  ('aec13bbf-7d71-4778-897a-ad8c4f2e233f', 'admin', '83393c36-17a2-46fb-9d09-f9b2dbcd8869', '2026-01-24T07:07:58.067652+00:00'),
  ('89b45c60-98e8-4f37-a99a-bd83c6dd792f', 'admin', '46869a60-9c82-4ccb-8af9-35a048245ef4', '2026-01-24T07:07:58.067652+00:00'),
  ('e91ced7e-0db5-4a3a-ae1c-b089e93d3783', 'admin', 'c6f45e46-3c6e-4963-9f4a-b1b9e8b7edeb', '2026-01-24T07:07:58.067652+00:00'),
  ('fc63165d-4f4a-4cff-b7f2-9776c6f71356', 'admin', '32aecb1d-483a-4aea-82ab-5a2f508eb0a3', '2026-01-24T07:07:58.067652+00:00'),
  ('5e12031d-c6eb-4570-9bbd-11e82b779483', 'admin', '918342fa-184b-4868-bc50-c80da81672f5', '2026-01-24T07:07:58.067652+00:00'),
  ('dfc7c9d1-0bf7-4c3e-97d2-98f26120a7fd', 'admin', '55ef8d2f-bb38-44e2-a66f-02260f8f3cce', '2026-01-24T07:07:58.067652+00:00'),
  ('c695a2d6-0835-404e-8764-b438ca0df164', 'admin', '7f51cf32-d5d6-485f-9923-41cd036273d6', '2026-01-24T07:07:58.067652+00:00'),
  ('f753a2f3-c5be-4c30-9b41-946326a607cb', 'admin', '4645c944-5361-4f8e-9daf-2c3a4392272f', '2026-01-24T07:07:58.067652+00:00'),
  ('ae68a37c-2599-4810-b520-6c67141a47a0', 'admin', '8cecd87d-ee91-4032-b653-d06a471bcb63', '2026-01-24T07:07:58.067652+00:00'),
  ('36a4e3a6-eaa1-43de-aa82-21044a70b195', 'admin', '9b0c00c3-e0d5-44ad-8e08-2c0a1cefbe46', '2026-01-24T07:07:58.067652+00:00'),
  ('6c9eb4f1-d20f-46b1-91e8-1e87222abb69', 'admin', '2db2b044-e957-44dd-a597-7a86425f01e0', '2026-01-24T07:07:58.067652+00:00'),
  ('28075d3c-f2d9-497c-b027-b567994c080e', 'admin', '98885897-0ac1-4817-9856-a81e1af8e29f', '2026-01-24T07:07:58.067652+00:00'),
  ('0a2519b1-4b73-4ddd-a2b0-18139c5c58a1', 'admin', '5ccf0aa8-dbc4-488f-993c-86a961cb7691', '2026-01-24T07:07:58.067652+00:00'),
  ('a48df17e-8a40-4ffc-a900-0e707a8c4556', 'admin', '6ee20ac4-10bd-47bb-bd59-8d1628f73138', '2026-01-24T07:07:58.067652+00:00'),
  ('7f59f7da-34bc-4d10-a936-cb6c89758685', 'admin', '8543a5a6-bcd9-4d12-be4c-ede23053386f', '2026-01-24T07:07:58.067652+00:00'),
  ('5e6bca43-ae99-4401-bce4-a51101894094', 'admin', '28d3a960-acaa-4364-b7bf-c1bb235c089d', '2026-01-24T07:07:58.067652+00:00'),
  ('933d3b3d-2904-4c42-b28c-4311a91b12ae', 'admin', '97ac9e1c-c3b9-49b7-bd5c-491b4a220e38', '2026-01-24T07:07:58.067652+00:00'),
  ('c714d384-f432-46ce-bf4e-7ba637ff9d65', 'admin', 'dcec02b2-a6b5-46bb-8830-22faf3288683', '2026-01-24T07:07:58.067652+00:00'),
  ('93c65a1e-6d45-4a32-9555-dbe1ddebb580', 'admin', '34bfd575-6144-4916-92e9-8644fa912a5d', '2026-01-24T07:07:58.067652+00:00'),
  ('6af85eb3-5311-4200-b3db-83bb964078c2', 'admin', 'b06f3b4a-b628-4971-a74c-fc9b66815b76', '2026-01-24T07:07:58.067652+00:00'),
  ('a1e2ca41-4392-4533-bb2e-32870231779a', 'admin', 'ea5f5a7a-f0a6-4105-8f39-e4f59338fc96', '2026-01-24T07:07:58.067652+00:00'),
  ('2e508f7b-01b4-4048-85ff-d9b55295c8d0', 'admin', '6b4553fe-98b7-4e79-b22d-144a33e637f4', '2026-01-24T07:07:58.067652+00:00'),
  ('5385794a-54c1-41ba-aaa9-6709c5e49062', 'admin', 'f291b646-8103-4b0d-914e-452333d8088b', '2026-01-24T07:07:58.067652+00:00'),
  ('32c621f1-3633-4a58-90cc-ce866560f694', 'admin', '908a3213-796e-4d35-afe4-78b190244b73', '2026-01-24T07:07:58.067652+00:00'),
  ('ef40053c-ede1-40db-a1d6-29af4b66e2be', 'admin', '31d21e24-6fa6-48dd-9fbe-d5b66d22ce42', '2026-01-24T07:07:58.067652+00:00'),
  ('8939bc00-b9df-42fd-928a-e658901019dd', 'admin', 'a421eea6-348f-4725-85f7-2242f628a380', '2026-01-24T07:07:58.067652+00:00'),
  ('0fd5df0f-5dc0-4d1d-99ce-4362ad15914c', 'admin', 'bcf05666-ce2a-47fa-8c0a-3af475590795', '2026-01-24T07:07:58.067652+00:00'),
  ('1b4e4d5e-c028-4247-b6c1-a7b0ee2c0761', 'admin', '0e21acd0-de09-4695-81ae-8cb286d05a1e', '2026-01-24T07:07:58.067652+00:00'),
  ('22ea7c4b-4fbb-4919-bad5-026ac8be287b', 'admin', '9880a487-7d78-445a-b924-6d0705677fad', '2026-01-24T07:07:58.067652+00:00'),
  ('21478007-69dd-404a-ac08-d7049834a96d', 'admin', 'd7c33f78-f687-4923-af6e-d44f2ded8110', '2026-01-24T07:07:58.067652+00:00'),
  ('84d1fa1c-9004-4614-8ac4-052baf6ca623', 'admin', '2585aed2-38e9-449a-b550-781b2b440616', '2026-01-24T07:07:58.067652+00:00'),
  ('becf769e-7f4a-476f-bcd0-dfe1774e74d3', 'admin', 'fb9c3410-875c-4359-a383-83171524af16', '2026-01-24T07:07:58.067652+00:00'),
  ('ed207d2e-0691-4d3e-8089-361570de8aa8', 'admin', 'd8664751-b79c-4323-ab44-d37f94401a83', '2026-01-24T07:07:58.067652+00:00'),
  ('3f9007f2-a45b-4d9e-a05a-d4e884758497', 'admin', '78ccdb12-2185-452c-b8d0-ca9e1192bc06', '2026-01-24T07:07:58.067652+00:00'),
  ('53cfc072-58d0-49f3-a50f-1fbbe179860c', 'admin', '9564c9c1-1292-4a5e-9aa5-4d8cb1069a89', '2026-01-24T07:07:58.067652+00:00'),
  ('b93c994a-672c-4aea-a4fd-e36f7c9b1578', 'admin', 'b97fd998-e0c3-486a-8b5e-faf3ed49dcdf', '2026-01-24T07:07:58.067652+00:00'),
  ('5e031689-ae70-4deb-aa43-460ed892b404', 'admin', 'da8837c2-ad51-4876-99c8-f1bc3685f0ef', '2026-01-24T07:07:58.067652+00:00'),
  ('e125d94e-5eff-44c5-b3fb-cfe05a3833b9', 'admin', '9f4e43be-34a7-4533-9056-be57b13f33d2', '2026-01-24T07:07:58.067652+00:00'),
  ('2775ba1f-2733-4465-8fad-13294d01f077', 'admin', '9bea5104-c3b0-4407-8cb3-6ef28a09c842', '2026-01-24T07:07:58.067652+00:00'),
  ('c96c40c6-b7c3-4d40-ac3d-c28a582a7e3a', 'admin', '11edcc8c-f3fd-4939-908e-ac0728f87e81', '2026-01-24T07:07:58.067652+00:00'),
  ('0f688371-0d3c-4159-bdd6-82c0dabd01f0', 'teacher', '3b8f0a93-ecf4-494f-a93f-ce2fb06485d1', '2026-01-23T07:29:54.86383+00:00'),
  ('447c5295-bd21-4053-997f-b41f64253423', 'teacher', 'ef355ae8-affb-47c9-bd8b-6f6a4d88c173', '2026-01-23T07:29:54.86383+00:00'),
  ('8e9d36fb-c8f3-489a-ab40-bae0a8be7355', 'teacher', 'b97988e4-4598-44ec-852f-143bc5102348', '2026-01-23T07:29:54.86383+00:00')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  permission_id = EXCLUDED.permission_id,
  created_at = EXCLUDED.created_at;

INSERT INTO public.role_permissions (id, role, permission_id, created_at) VALUES
  ('472067d0-b6e8-4ee9-967d-2e9a9a4fcf9d', 'teacher', '85175939-334a-4550-a2f0-e973ee21e6ed', '2026-01-23T07:29:54.86383+00:00'),
  ('97cb7424-b241-4c7f-9765-219a3e5a8097', 'teacher', '2cd00314-cb3b-4b90-9cb2-9f75d0acd736', '2026-01-23T07:29:54.86383+00:00'),
  ('a5c01f86-9630-4d26-94e5-088f6e8db34b', 'teacher', 'b713cd77-cf80-4494-9833-d264dc685129', '2026-01-23T07:29:54.86383+00:00'),
  ('b27f38c8-0375-41a4-be0d-944a0dfb7c43', 'admin', 'fc122c13-f79b-4eb4-b1bb-9a14df57abd2', '2026-01-24T07:07:58.067652+00:00'),
  ('ac932386-9fef-49ce-aac8-8ca63f1eb14a', 'admin', '654287a7-ecd7-4ef0-927d-9806748dc2bc', '2026-01-24T07:07:58.067652+00:00'),
  ('84f66313-ffce-4217-80b5-56e39f61c1dd', 'teacher', '3db50b71-5dba-4ab4-86f5-c5ade91106cc', '2026-01-23T07:29:54.86383+00:00'),
  ('110fa55c-bc35-4e23-ac72-003b3d966e1e', 'admin', '3ffa3feb-1f39-403f-9fe9-9efc7ecc7023', '2026-01-24T07:07:58.067652+00:00'),
  ('dfffceda-aebe-4738-96e0-b55a03dbad46', 'admin', '44c21f1d-bf09-43eb-8af2-745fbb26cc4b', '2026-01-24T07:07:58.067652+00:00'),
  ('9b77b80a-50d1-4dd0-8969-1d567cb0922d', 'admin', '53fe869f-18cc-4189-a141-90be250ae2b5', '2026-01-24T07:07:58.067652+00:00'),
  ('49e23bae-bf95-4c96-a06a-77e90521f824', 'admin', 'd430c21e-d37d-4853-88d3-ff614ffe2295', '2026-01-24T07:07:58.067652+00:00'),
  ('cd68bdbe-2458-4948-b21f-883ef39d4a91', 'admin', 'afcf301a-1328-44c1-b89e-f8aa21f36f13', '2026-01-24T07:07:58.067652+00:00'),
  ('facf6ad2-3fb6-4f28-8ef0-42c18128b160', 'admin', 'ab4e64b1-a4a3-4a4b-82d2-cbb02a0da777', '2026-01-24T07:07:58.067652+00:00'),
  ('5c59b4ae-0a55-4d61-aa7d-e70c45bee24b', 'admin', '88c7630d-2b45-4f93-9f32-478ab172fd42', '2026-01-24T07:07:58.067652+00:00'),
  ('36e54db2-38b6-4ea8-89f7-f7a8f96e5838', 'admin', '51eea2c6-2442-4f28-a590-2bcb2177d06a', '2026-01-24T07:07:58.067652+00:00'),
  ('dd7f2a39-ae74-4a71-9fd1-215959526544', 'admin', 'addd9214-5ff2-4130-aefe-a945edb7c6c3', '2026-01-24T07:07:58.067652+00:00'),
  ('7805a847-fdac-4a8d-8849-084e016442e3', 'admin', 'b97988e4-4598-44ec-852f-143bc5102348', '2026-01-24T07:07:58.067652+00:00'),
  ('1cac6267-65e0-4f83-bb00-abd072fc0b50', 'moderator', 'b97988e4-4598-44ec-852f-143bc5102348', '2026-01-23T07:29:54.86383+00:00'),
  ('838ed7dd-8109-48d4-ade0-b85669317879', 'moderator', '029fa13f-d486-4123-8a79-33ef60a4766c', '2026-01-23T07:29:54.86383+00:00'),
  ('ffa42274-d362-4beb-b36e-09eac2b50038', 'admin', '85175939-334a-4550-a2f0-e973ee21e6ed', '2026-01-24T07:07:58.067652+00:00'),
  ('8f4d6559-2016-4fb5-bead-45df0b918e53', 'admin', '2c98f680-112b-4e15-88b0-4a381211a730', '2026-01-24T07:07:58.067652+00:00'),
  ('fc1d702d-6950-4bc1-a526-48c68302917c', 'admin', '029fa13f-d486-4123-8a79-33ef60a4766c', '2026-01-24T07:07:58.067652+00:00'),
  ('7b3e6a0e-d9ed-4562-805a-c61c233f2f2e', 'admin', 'ac0cb957-ecc7-4b88-acde-84dc2be869d7', '2026-01-24T07:07:58.067652+00:00'),
  ('c0c8741f-0f6c-46fa-a5fd-9a18db6be868', 'admin', '2cd00314-cb3b-4b90-9cb2-9f75d0acd736', '2026-01-24T07:07:58.067652+00:00'),
  ('04aab856-bf61-4b42-b5a3-32e37705eec5', 'admin', '3bbb293d-ac3e-4ff2-a719-94e9eafb21eb', '2026-01-24T07:07:58.067652+00:00'),
  ('103b8388-c6f3-43a5-9e12-d0be3df8c479', 'admin', 'a75804c5-97fd-4176-8df7-519693be3fb4', '2026-01-24T07:07:58.067652+00:00'),
  ('ba2f8d30-850f-4688-9052-8130b8a43259', 'user', '3b8f0a93-ecf4-494f-a93f-ce2fb06485d1', '2026-01-23T07:29:54.86383+00:00'),
  ('466cc6fc-e0f9-4d79-9da3-3ab56c5e7684', 'user', 'ef355ae8-affb-47c9-bd8b-6f6a4d88c173', '2026-01-23T07:29:54.86383+00:00'),
  ('eb6eb961-13d2-4895-955b-db977df2094e', 'user', 'b97988e4-4598-44ec-852f-143bc5102348', '2026-01-23T07:29:54.86383+00:00'),
  ('438c0cba-ae1a-4b8d-b5db-e12f77dfad46', 'admin', '3db50b71-5dba-4ab4-86f5-c5ade91106cc', '2026-01-24T07:07:58.067652+00:00'),
  ('2942f0aa-a486-488d-b156-c4ca02424aee', 'admin', 'b713cd77-cf80-4494-9833-d264dc685129', '2026-01-24T07:07:58.067652+00:00'),
  ('b9583c29-dfd0-4ab5-8ceb-e4a9e666e80d', 'admin', '3b8f0a93-ecf4-494f-a93f-ce2fb06485d1', '2026-01-24T07:07:58.067652+00:00'),
  ('3e21319a-ec74-473e-b5dd-14d3aa4ad378', 'admin', 'ef355ae8-affb-47c9-bd8b-6f6a4d88c173', '2026-01-24T07:07:58.067652+00:00'),
  ('12e0b3e1-295f-49c9-97c7-ea5dd19839e6', 'teacher', '98885897-0ac1-4817-9856-a81e1af8e29f', '2026-01-24T07:16:02.358784+00:00'),
  ('40bd1d67-084d-4c01-abe8-82326dc84d2d', 'teacher', '3bbb293d-ac3e-4ff2-a719-94e9eafb21eb', '2026-01-24T07:20:15.298484+00:00'),
  ('79486d1c-85e6-49d8-a03a-752e9d870f01', 'teacher', '3ffa3feb-1f39-403f-9fe9-9efc7ecc7023', '2026-01-24T07:20:15.298484+00:00'),
  ('f1f4ad7b-661a-4029-86a4-bea27b22835b', 'teacher', '53fe869f-18cc-4189-a141-90be250ae2b5', '2026-01-24T07:20:15.298484+00:00'),
  ('ef5e1b1e-06d0-4c28-8069-017a412d97a7', 'teacher', '31d21e24-6fa6-48dd-9fbe-d5b66d22ce42', '2026-01-24T07:20:15.298484+00:00'),
  ('6fecc8cd-fb9d-421a-b0ad-364debe6c764', 'teacher', '9880a487-7d78-445a-b924-6d0705677fad', '2026-01-24T07:20:15.298484+00:00'),
  ('e907973a-d49b-4f1c-a60d-64bc19d42742', 'teacher', 'bcf05666-ce2a-47fa-8c0a-3af475590795', '2026-01-24T07:20:15.298484+00:00'),
  ('706c47e4-04e3-41b8-8f3d-4ccb46fa8661', 'teacher', '32aecb1d-483a-4aea-82ab-5a2f508eb0a3', '2026-01-24T07:20:15.298484+00:00'),
  ('01bf2f80-8765-4d7c-81f5-369e9f5227d3', 'teacher', '7e4bbc31-934c-4c61-a9fe-1a7cf4c04b59', '2026-01-24T07:20:15.298484+00:00'),
  ('ed684b9d-4e0b-43d4-8841-763b53184fe6', 'user', '908a3213-796e-4d35-afe4-78b190244b73', '2026-01-25T17:04:21.576184+00:00'),
  ('43712188-e9c0-47e9-9bfe-107113c7f7da', 'user', '7e4bbc31-934c-4c61-a9fe-1a7cf4c04b59', '2026-01-25T17:04:21.576184+00:00'),
  ('d1ffa901-b3e4-4c07-845d-f46c7df8b3c2', 'user', '55ef8d2f-bb38-44e2-a66f-02260f8f3cce', '2026-01-25T17:04:21.576184+00:00'),
  ('d8a105db-445e-4ab3-be21-1f3f237e0d7b', 'user', 'd7c33f78-f687-4923-af6e-d44f2ded8110', '2026-01-25T17:04:21.576184+00:00'),
  ('1a516c40-cb42-495d-8449-1809dd8cfcd7', 'user', 'dcec02b2-a6b5-46bb-8830-22faf3288683', '2026-01-25T17:04:21.576184+00:00'),
  ('febd8476-578f-4bed-93e3-829df94eefff', 'user', '98885897-0ac1-4817-9856-a81e1af8e29f', '2026-01-25T17:04:21.576184+00:00'),
  ('6b6e7dbb-f07f-4401-a084-ed18389320bc', 'user', '9f4e43be-34a7-4533-9056-be57b13f33d2', '2026-01-25T17:04:21.576184+00:00'),
  ('a93847bd-e6df-4a11-bbf7-1d15dcb7b446', 'user', '9bea5104-c3b0-4407-8cb3-6ef28a09c842', '2026-01-25T17:04:21.576184+00:00'),
  ('78d09235-d52f-4ae7-a3a9-8da809f7ce5c', 'user', '11edcc8c-f3fd-4939-908e-ac0728f87e81', '2026-01-25T17:04:21.576184+00:00')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  permission_id = EXCLUDED.permission_id,
  created_at = EXCLUDED.created_at;

INSERT INTO public.role_permissions (id, role, permission_id, created_at) VALUES
  ('271fde1d-caeb-4a77-98ff-1658e50b8d20', 'admin', 'ee8cd5c1-2ce1-4151-8a24-e7646f3360b1', '2026-01-26T06:36:09.804629+00:00'),
  ('f290796f-de99-4e3c-a0cf-8e37762252a3', 'admin', '51dab6c2-293e-4334-b023-42b417d33690', '2026-01-26T06:36:09.804629+00:00'),
  ('5d1ccddd-feef-4714-bb6b-62400f2c0b2b', 'admin', 'b79901ff-4663-4420-9969-86549b811cdb', '2026-01-26T06:36:09.804629+00:00'),
  ('40a4057f-1311-4154-8280-11691e457785', 'admin', '3da1fddc-5593-4ced-b4e4-7e42c23b87b3', '2026-01-26T06:36:09.804629+00:00'),
  ('87b89524-dba2-4b9a-847c-5fdb7c50b6ef', 'admin', 'b5c1408a-ed16-4cf1-9206-1a917903a932', '2026-01-26T06:36:09.804629+00:00'),
  ('5d3eddb4-5989-42c0-8625-58364fa3acba', 'admin', '2dbfbef4-9bed-4b3d-85af-70726fb80154', '2026-01-26T06:36:09.804629+00:00'),
  ('a611a790-d499-4d48-9d7f-f0421eae1079', 'admin', 'ffb55364-0957-4a34-9290-eb5301a631fc', '2026-01-26T06:36:09.804629+00:00'),
  ('3afebe35-18b9-4c6f-af92-df4877a8028e', 'admin', '98bf7ec4-c126-40ee-a488-2a003bb9c5b3', '2026-01-26T06:36:09.804629+00:00'),
  ('201965df-ee97-43b4-a91c-0aabd72f3123', 'teacher', 'ee8cd5c1-2ce1-4151-8a24-e7646f3360b1', '2026-01-26T06:36:09.804629+00:00'),
  ('28da370f-668b-443f-bbbd-7bb9e5beb08c', 'teacher', 'b79901ff-4663-4420-9969-86549b811cdb', '2026-01-26T06:36:09.804629+00:00'),
  ('31f48731-2fb0-44f6-89b1-cd3121d5c57a', 'teacher', 'b5c1408a-ed16-4cf1-9206-1a917903a932', '2026-01-26T06:36:09.804629+00:00'),
  ('6825e030-156b-4460-b992-006624151d24', 'teacher', '2dbfbef4-9bed-4b3d-85af-70726fb80154', '2026-01-26T06:36:09.804629+00:00'),
  ('e29217f7-d81f-4c10-98d9-0765ddfa696b', 'teacher', 'ffb55364-0957-4a34-9290-eb5301a631fc', '2026-01-26T06:36:09.804629+00:00'),
  ('4bab57a0-d744-4072-9ce7-5431d542c0ff', 'teacher', '98bf7ec4-c126-40ee-a488-2a003bb9c5b3', '2026-01-26T06:36:09.804629+00:00'),
  ('264d6064-a51c-4062-94fe-3f56c76270f4', 'user', '2dbfbef4-9bed-4b3d-85af-70726fb80154', '2026-01-26T06:36:09.804629+00:00')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  permission_id = EXCLUDED.permission_id,
  created_at = EXCLUDED.created_at;

-- -----------------------------------------------
-- Table: achievements (18 rows)
-- -----------------------------------------------
INSERT INTO public.achievements (id, name, description, icon, category, requirement_type, requirement_value, points_reward, badge_color, display_order, created_at) VALUES
  ('21dfb239-4313-43ab-a365-189ac947ab2e', 'Người mới bắt đầu', 'Hoàn thành bài thi đầu tiên', '🎯', 'exam', 'exams_completed', 1, 10, 'bronze', 1, '2025-12-23T05:53:45.875388+00:00'),
  ('17e255f3-537f-410d-a97b-6a010976d100', 'Học sinh chăm chỉ', 'Hoàn thành 10 bài thi', '📚', 'exam', 'exams_completed', 10, 50, 'silver', 2, '2025-12-23T05:53:45.875388+00:00'),
  ('f850e00b-89d1-4e9f-8a2d-bf4a0d1119a5', 'Chiến binh kiến thức', 'Hoàn thành 50 bài thi', '⚔️', 'exam', 'exams_completed', 50, 200, 'gold', 3, '2025-12-23T05:53:45.875388+00:00'),
  ('7b857e6f-3e2e-444c-a079-55b045bf8322', 'Bậc thầy thi cử', 'Hoàn thành 100 bài thi', '👑', 'exam', 'exams_completed', 100, 500, 'platinum', 4, '2025-12-23T05:53:45.875388+00:00'),
  ('722fc586-cfd4-4671-991f-ea5bbd31b2b1', 'Điểm hoàn hảo', 'Đạt 100% trong một bài thi', '💯', 'exam', 'perfect_score', 1, 25, 'gold', 5, '2025-12-23T05:53:45.875388+00:00'),
  ('ce50f007-f381-4f3d-9cb6-c1b10ff455c5', 'Thiên tài', 'Đạt 100% trong 5 bài thi', '🧠', 'exam', 'perfect_score', 5, 100, 'platinum', 6, '2025-12-23T05:53:45.875388+00:00'),
  ('98097e1e-d39b-424c-9fbd-469af22300f0', '3 ngày liên tiếp', 'Học 3 ngày liên tiếp', '🔥', 'streak', 'streak_days', 3, 15, 'bronze', 7, '2025-12-23T05:53:45.875388+00:00'),
  ('3012d814-0379-4299-8831-1161c149d56b', 'Tuần lễ cần cù', 'Học 7 ngày liên tiếp', '🌟', 'streak', 'streak_days', 7, 50, 'silver', 8, '2025-12-23T05:53:45.875388+00:00'),
  ('505a0b0b-4bbb-422a-89fc-8f3bf42f1714', 'Tháng kỷ luật', 'Học 30 ngày liên tiếp', '🏅', 'streak', 'streak_days', 30, 300, 'gold', 9, '2025-12-23T05:53:45.875388+00:00'),
  ('8cb1bd44-b6a2-4d64-baad-7a03b97529d5', '100 câu hỏi', 'Trả lời 100 câu hỏi', '✍️', 'questions', 'questions_answered', 100, 30, 'bronze', 10, '2025-12-23T05:53:45.875388+00:00'),
  ('f4f225cb-f5c7-4315-9afa-a23673aedaa1', '500 câu hỏi', 'Trả lời 500 câu hỏi', '📝', 'questions', 'questions_answered', 500, 100, 'silver', 11, '2025-12-23T05:53:45.875388+00:00'),
  ('0a114430-2155-42e5-a868-def7f396522e', '1000 câu hỏi', 'Trả lời 1000 câu hỏi', '🎓', 'questions', 'questions_answered', 1000, 300, 'gold', 12, '2025-12-23T05:53:45.875388+00:00'),
  ('829b8ab0-bf37-43b5-b21d-0a099e44b5f1', '100 điểm', 'Đạt 100 điểm tích lũy', '⭐', 'points', 'points_earned', 100, 10, 'bronze', 13, '2025-12-23T05:53:45.875388+00:00'),
  ('94657f8f-5073-4eb5-9204-2f588edef89b', '500 điểm', 'Đạt 500 điểm tích lũy', '🌙', 'points', 'points_earned', 500, 25, 'silver', 14, '2025-12-23T05:53:45.875388+00:00'),
  ('05d1324a-201f-4092-ba11-205871f26637', '1000 điểm', 'Đạt 1000 điểm tích lũy', '☀️', 'points', 'points_earned', 1000, 50, 'gold', 15, '2025-12-23T05:53:45.875388+00:00'),
  ('b9224dc0-5444-4efd-89cc-1bd906f1a8de', 'Nhớ 10 thẻ', 'Nhớ 10 flashcards', '🃏', 'flashcard', 'flashcards_mastered', 10, 20, 'bronze', 16, '2025-12-23T05:53:45.875388+00:00'),
  ('02f877fd-89d9-45cf-8830-e6480932da03', 'Nhớ 50 thẻ', 'Nhớ 50 flashcards', '🎴', 'flashcard', 'flashcards_mastered', 50, 75, 'silver', 17, '2025-12-23T05:53:45.875388+00:00'),
  ('61aae27d-f9cb-40b1-9b69-d45e39b3385f', 'Nhớ 100 thẻ', 'Nhớ 100 flashcards', '🎪', 'flashcard', 'flashcards_mastered', 100, 150, 'gold', 18, '2025-12-23T05:53:45.875388+00:00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value,
  points_reward = EXCLUDED.points_reward,
  badge_color = EXCLUDED.badge_color,
  display_order = EXCLUDED.display_order,
  created_at = EXCLUDED.created_at;

-- -----------------------------------------------
-- Table: audit_logs (25 rows)
-- -----------------------------------------------
INSERT INTO public.audit_logs (id, user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent, metadata, created_at) VALUES
  ('541433ba-8013-4411-b85e-918cb5aa2868', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '3bbb293d-ac3e-4ff2-a719-94e9eafb21eb', NULL, '{"role":"teacher","permission":"admin.view_stats"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:15.828302+00:00'),
  ('fed5e1eb-56c1-4f4b-9b1b-2bb559bf1cd2', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '3ffa3feb-1f39-403f-9fe9-9efc7ecc7023', NULL, '{"role":"teacher","permission":"analytics.view"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:16.266346+00:00'),
  ('ed49d3ea-3318-4b04-824e-48abb136bb98', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '53fe869f-18cc-4189-a141-90be250ae2b5', NULL, '{"role":"teacher","permission":"audit_logs.view"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:16.691296+00:00'),
  ('96e6ca66-710e-45b8-b2f9-46fe03c003cc', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '31d21e24-6fa6-48dd-9fbe-d5b66d22ce42', NULL, '{"role":"teacher","permission":"books.create"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:17.054225+00:00'),
  ('f873fe09-8e45-4227-9845-ffe7d2a835ef', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '9880a487-7d78-445a-b924-6d0705677fad', NULL, '{"role":"teacher","permission":"books.delete_own"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:17.53761+00:00'),
  ('fc001885-cac0-4b0d-923a-957069cbeeaf', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', 'bcf05666-ce2a-47fa-8c0a-3af475590795', NULL, '{"role":"teacher","permission":"books.edit_own"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:17.938055+00:00'),
  ('275ed595-43bd-41fb-a0cc-22cbaf27e33d', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '32aecb1d-483a-4aea-82ab-5a2f508eb0a3', NULL, '{"role":"teacher","permission":"courses.delete_own"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:18.336087+00:00'),
  ('261c8721-7f5a-4cde-ab47-8d7786c43892', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '7e4bbc31-934c-4c61-a9fe-1a7cf4c04b59', NULL, '{"role":"teacher","permission":"courses.view"}'::jsonb, NULL, NULL, '{"role":"teacher"}'::jsonb, '2026-01-24T07:20:18.696817+00:00'),
  ('afad4d6d-dc3d-40c6-a803-1d9e5e87932c', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'delete', 'exam', '565f36f8-d92a-4fc5-903a-4bd5a8685381', '{"slug":"azure-de-3","title":"Đề thi Microsoft Azure - Đề số 3","question_count":40}'::jsonb, NULL, NULL, NULL, '{}'::jsonb, '2026-01-25T08:25:26.210283+00:00'),
  ('2b8f6684-797c-4be2-a530-e0411d896a33', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '908a3213-796e-4d35-afe4-78b190244b73', NULL, '{"role":"user","permission":"books.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:22.189177+00:00'),
  ('184bcf89-a5a7-4108-ba14-cecf13d4e71b', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '7e4bbc31-934c-4c61-a9fe-1a7cf4c04b59', NULL, '{"role":"user","permission":"courses.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:22.746903+00:00'),
  ('10fc1256-7913-4059-a603-e555e17d8e38', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '55ef8d2f-bb38-44e2-a66f-02260f8f3cce', NULL, '{"role":"user","permission":"exams.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:23.347635+00:00'),
  ('77a9eb43-f85f-4f72-9be5-f00329016c50', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', 'd7c33f78-f687-4923-af6e-d44f2ded8110', NULL, '{"role":"user","permission":"flashcards.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:23.656424+00:00'),
  ('623014b7-2813-4023-9b74-74bb71987638', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', 'dcec02b2-a6b5-46bb-8830-22faf3288683', NULL, '{"role":"user","permission":"podcasts.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:23.957564+00:00'),
  ('f91b93a9-6e52-47bc-96be-0b9b5cfb2312', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '98885897-0ac1-4817-9856-a81e1af8e29f', NULL, '{"role":"user","permission":"questions.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:24.233815+00:00'),
  ('5c25718c-e0a2-455c-a937-4634c362d881', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '9f4e43be-34a7-4533-9056-be57b13f33d2', NULL, '{"role":"user","permission":"study_groups.view"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:24.521963+00:00'),
  ('4bbc20ed-c9da-4f44-b75a-059f890d1b57', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '9bea5104-c3b0-4407-8cb3-6ef28a09c842', NULL, '{"role":"user","permission":"study_groups.create"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:24.789993+00:00'),
  ('e65d1ba5-e7c8-4292-841a-d90d85312314', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'permission_granted', 'role_permission', '11edcc8c-f3fd-4939-908e-ac0728f87e81', NULL, '{"role":"user","permission":"study_groups.edit"}'::jsonb, NULL, NULL, '{"role":"user"}'::jsonb, '2026-01-25T17:04:25.063504+00:00'),
  ('54ecd9dc-52ba-4122-bcd2-a47158806c7a', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'create', 'question_set', '5df65acb-740e-4170-83ac-9e358aeb5099', NULL, '{"level":"medium","title":"aws","is_published":true,"question_count":27}'::jsonb, NULL, NULL, '{}'::jsonb, '2026-01-25T17:22:19.221932+00:00'),
  ('21f20b54-12d5-47e1-8a4d-109d9a0a37c7', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'create', 'user', 'c07c6714-c07b-48cc-8a30-a000e3c9bf8a', NULL, '{"role":"teacher","email":"nguyenvnu.uet@gmail.com","full_name":"Teacher"}'::jsonb, NULL, NULL, '{}'::jsonb, '2026-01-26T06:32:38.755438+00:00'),
  ('8b1a7dc6-68d3-428f-aa3c-12a8828c2c84', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'update_role', 'user', 'c07c6714-c07b-48cc-8a30-a000e3c9bf8a', '{"roles":["teacher"]}'::jsonb, '{"roles":["user"]}'::jsonb, NULL, NULL, '{"email":"nguyenvnu.uet@gmail.com"}'::jsonb, '2026-01-26T06:47:00.999688+00:00'),
  ('c486bd1c-0a59-4895-9494-565eeeff9541', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'create', 'podcast', NULL, NULL, '{"slug":"tieng-anh-lop-3","title":"Tiếng anh lớp 3","difficulty":"intermediate","duration_seconds":20}'::jsonb, NULL, NULL, '{}'::jsonb, '2026-01-27T04:09:24.748346+00:00'),
  ('8e06f11a-ee3b-48f4-a6cd-f7226a54a481', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'update', 'course', '11111111-1111-1111-1111-111111111111', '{"slug":"lap-trinh-python-co-ban-nang-cao","title":"Lập trình Python từ cơ bản đến nâng cao"}'::jsonb, '{"slug":"lap-trinh-python-co-ban-nang-cao","title":"Lập trình Python từ cơ bản đến nâng cao","is_published":true,"lesson_count":7,"section_count":3}'::jsonb, NULL, NULL, '{}'::jsonb, '2026-02-01T06:52:02.637295+00:00'),
  ('e99fec7d-ff1e-459b-a1aa-cdc54d5c300a', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'update', 'course', '22222222-2222-2222-2222-222222222222', '{"slug":"reactjs-xay-dung-ung-dung-web","title":"ReactJS - Xây dựng ứng dụng web hiện đại"}'::jsonb, '{"slug":"reactjs-xay-dung-ung-dung-web","title":"ReactJS - Xây dựng ứng dụng web hiện đại","is_published":true,"lesson_count":4,"section_count":2}'::jsonb, NULL, NULL, '{}'::jsonb, '2026-02-02T02:24:22.370167+00:00'),
  ('eb65bb52-6794-4dab-b70f-d256f4c52a9a', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', 'update_role', 'user', 'c07c6714-c07b-48cc-8a30-a000e3c9bf8a', '{"roles":["teacher"]}'::jsonb, '{"roles":["user"]}'::jsonb, NULL, NULL, '{"email":"nguyenvnu.uet@gmail.com"}'::jsonb, '2026-02-07T18:01:43.887918+00:00')
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  action = EXCLUDED.action,
  entity_type = EXCLUDED.entity_type,
  entity_id = EXCLUDED.entity_id,
  old_value = EXCLUDED.old_value,
  new_value = EXCLUDED.new_value,
  ip_address = EXCLUDED.ip_address,
  user_agent = EXCLUDED.user_agent,
  metadata = EXCLUDED.metadata,
  created_at = EXCLUDED.created_at;

-- -----------------------------------------------
-- Table: user_achievements (2 rows)
-- -----------------------------------------------
INSERT INTO public.user_achievements (id, user_id, achievement_id, earned_at) VALUES
  ('c3eadf97-8dda-4602-b450-9bcd736d325e', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', '21dfb239-4313-43ab-a365-189ac947ab2e', '2026-01-25T17:53:27.984329+00:00'),
  ('5162e5cb-b77f-4a31-9098-450454fc0e6b', 'bd8a70eb-ecbe-433d-817f-c3f2bf2f94a7', '98097e1e-d39b-424c-9fbd-469af22300f0', '2026-01-26T02:59:14.154283+00:00')
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  achievement_id = EXCLUDED.achievement_id,
  earned_at = EXCLUDED.earned_at;


-- =============================================
-- SUMMARY: 239 total rows from 6 tables
-- =============================================
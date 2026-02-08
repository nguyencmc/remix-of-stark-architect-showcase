-- Demo Courses Seed Data
-- Includes complete courses with YouTube video links, preview videos, and course images
-- Run on Supabase after creating tables

-- First, insert course categories if not exists
INSERT INTO public.course_categories (name, slug, description, display_order, is_featured) VALUES
('Lập Trình', 'lap-trinh', 'Khóa học lập trình từ cơ bản đến nâng cao', 1, true),
('Tiếng Anh', 'tieng-anh', 'Học tiếng Anh hiệu quả', 2, true),
('Marketing', 'marketing', 'Marketing và kinh doanh online', 3, true),
('Kỹ Năng Mềm', 'ky-nang-mem', 'Phát triển kỹ năng mềm', 4, false)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- COURSE 1: React.js Cơ Bản đến Nâng Cao
-- =============================================
DO $$
DECLARE
  course_id_1 UUID;
  section_1_id UUID;
  section_2_id UUID;
  section_3_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM course_categories WHERE slug = 'lap-trinh' LIMIT 1;
  
  INSERT INTO public.courses (
    title, slug, description, image_url, category, category_id,
    price, original_price, duration_hours, lesson_count, level, language,
    rating, rating_count, student_count, is_published, is_featured,
    preview_video_url, creator_name,
    requirements, what_you_learn
  ) VALUES (
    'React.js Cơ Bản đến Nâng Cao',
    'react-js-co-ban-den-nang-cao',
    'Khóa học React.js toàn diện giúp bạn xây dựng ứng dụng web hiện đại. Từ JSX, Components, Hooks đến Redux và triển khai thực tế.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    'languages',
    category_id,
    499000, 999000, 25, 45, 'beginner', 'vi',
    4.8, 256, 1234, true, true,
    'https://www.youtube.com/watch?v=SqcY0GlETPk',
    'The Best Study',
    ARRAY['Biết cơ bản HTML, CSS, JavaScript', 'Máy tính có cài Node.js'],
    ARRAY['Xây dựng ứng dụng web với React.js', 'Hiểu và sử dụng React Hooks', 'Quản lý state với Redux Toolkit', 'Triển khai ứng dụng lên Vercel/Netlify']
  ) RETURNING id INTO course_id_1;

  -- Section 1: Giới thiệu React
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_1, 'Giới thiệu React.js', 'Tìm hiểu React là gì và tại sao nên học', 1)
  RETURNING id INTO section_1_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_1_id, 'React là gì?', 'Giới thiệu tổng quan về React.js', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 15, 1, true),
  (section_1_id, 'Cài đặt môi trường', 'Cài Node.js và VS Code', 'https://www.youtube.com/watch?v=Ke90Tje7VS0', 12, 2, true),
  (section_1_id, 'Tạo dự án React đầu tiên', 'Sử dụng Create React App và Vite', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 18, 3, false);

  -- Section 2: JSX và Components
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_1, 'JSX và Components', 'Học cách tạo và sử dụng components', 2)
  RETURNING id INTO section_2_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_2_id, 'JSX cơ bản', 'Hiểu cú pháp JSX', 'https://www.youtube.com/watch?v=9YkUCxvaLEk', 20, 1, false),
  (section_2_id, 'Function Components', 'Tạo functional components', 'https://www.youtube.com/watch?v=dGcsHMXbSOA', 22, 2, false),
  (section_2_id, 'Props và State', 'Truyền dữ liệu giữa components', 'https://www.youtube.com/watch?v=dpw9EHDh2bM', 25, 3, false),
  (section_2_id, 'Conditional Rendering', 'Render có điều kiện', 'https://www.youtube.com/watch?v=4oCVDkb_EIs', 18, 4, false);

  -- Section 3: React Hooks
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_1, 'React Hooks', 'Làm việc với Hooks', 3)
  RETURNING id INTO section_3_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_3_id, 'useState Hook', 'Quản lý state với useState', 'https://www.youtube.com/watch?v=O6P86uwfdR0', 20, 1, true),
  (section_3_id, 'useEffect Hook', 'Side effects với useEffect', 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', 25, 2, false),
  (section_3_id, 'useContext Hook', 'Chia sẻ state global', 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', 22, 3, false),
  (section_3_id, 'Custom Hooks', 'Tạo hooks riêng', 'https://www.youtube.com/watch?v=Jl4q2cccwf0', 20, 4, false);
END $$;

-- =============================================
-- COURSE 2: Tiếng Anh Giao Tiếp
-- =============================================
DO $$
DECLARE
  course_id_2 UUID;
  section_1_id UUID;
  section_2_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM course_categories WHERE slug = 'tieng-anh' LIMIT 1;
  
  INSERT INTO public.courses (
    title, slug, description, image_url, category, category_id,
    price, original_price, duration_hours, lesson_count, level, language,
    rating, rating_count, student_count, is_published, is_featured,
    preview_video_url, creator_name,
    requirements, what_you_learn
  ) VALUES (
    'Tiếng Anh Giao Tiếp Hàng Ngày',
    'tieng-anh-giao-tiep-hang-ngay',
    'Khóa học tiếng Anh giao tiếp thực tế. Luyện phát âm chuẩn, học từ vựng theo chủ đề và đàm thoại tự tin.',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=450&fit=crop',
    'languages',
    category_id,
    299000, 599000, 20, 30, 'beginner', 'vi',
    4.9, 412, 2567, true, true,
    'https://www.youtube.com/watch?v=DHvZLI7Db8E',
    'English Master',
    ARRAY['Không cần biết tiếng Anh trước', 'Có smartphone hoặc máy tính'],
    ARRAY['Giao tiếp tự tin trong các tình huống hàng ngày', 'Phát âm chuẩn giọng Mỹ/Anh', 'Vocabulary 2000+ từ thông dụng', 'Nghe hiểu 80% các cuộc hội thoại']
  ) RETURNING id INTO course_id_2;

  -- Section 1: Chào hỏi và giới thiệu
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_2, 'Chào Hỏi và Giới Thiệu', 'Cách chào hỏi và self-introduction', 1)
  RETURNING id INTO section_1_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_1_id, 'Greeting - Chào hỏi', 'Hello, Hi, Good morning...', 'https://www.youtube.com/watch?v=DHvZLI7Db8E', 15, 1, true),
  (section_1_id, 'Self Introduction', 'Giới thiệu bản thân bằng tiếng Anh', 'https://www.youtube.com/watch?v=EFwyJOBREmA', 18, 2, true),
  (section_1_id, 'Small Talk', 'Trò chuyện xã giao', 'https://www.youtube.com/watch?v=sQgd6MccwZc', 20, 3, false);

  -- Section 2: Đi mua sắm
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_2, 'Shopping - Mua Sắm', 'Giao tiếp khi mua sắm', 2)
  RETURNING id INTO section_2_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_2_id, 'At the Store', 'Hội thoại tại cửa hàng', 'https://www.youtube.com/watch?v=kYvO_Y6QaJE', 22, 1, false),
  (section_2_id, 'Asking for Price', 'Hỏi giá và trả giá', 'https://www.youtube.com/watch?v=J75oIBuCdJY', 18, 2, false),
  (section_2_id, 'Payment', 'Thanh toán bằng tiếng Anh', 'https://www.youtube.com/watch?v=Qrt6l2Mj0X8', 15, 3, false);
END $$;

-- =============================================
-- COURSE 3: Digital Marketing A-Z
-- =============================================
DO $$
DECLARE
  course_id_3 UUID;
  section_1_id UUID;
  section_2_id UUID;
  section_3_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM course_categories WHERE slug = 'marketing' LIMIT 1;
  
  INSERT INTO public.courses (
    title, slug, description, image_url, category, category_id,
    price, original_price, duration_hours, lesson_count, level, language,
    rating, rating_count, student_count, is_published, is_featured,
    preview_video_url, creator_name,
    requirements, what_you_learn
  ) VALUES (
    'Digital Marketing A-Z',
    'digital-marketing-a-z',
    'Khóa học Digital Marketing toàn diện từ Facebook Ads, Google Ads, SEO đến Content Marketing. Thực hành với dự án thực tế.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    'languages',
    category_id,
    799000, 1499000, 35, 55, 'intermediate', 'vi',
    4.7, 189, 890, true, true,
    'https://www.youtube.com/watch?v=bixR-KIJKYM',
    'Marketing Pro VN',
    ARRAY['Có máy tính kết nối internet', 'Biết sử dụng cơ bản Facebook/Google'],
    ARRAY['Tạo và tối ưu Facebook Ads', 'Chạy Google Ads hiệu quả', 'SEO website lên top Google', 'Xây dựng Content Marketing strategy']
  ) RETURNING id INTO course_id_3;

  -- Section 1: Facebook Ads
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_3, 'Facebook Ads Master', 'Làm chủ quảng cáo Facebook', 1)
  RETURNING id INTO section_1_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_1_id, 'Tổng quan Facebook Ads', 'Hiểu cách hoạt động của Facebook Ads', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 20, 1, true),
  (section_1_id, 'Tạo Business Manager', 'Setup BM chuyên nghiệp', 'https://www.youtube.com/watch?v=7qfqZDFGqaE', 18, 2, true),
  (section_1_id, 'Targeting đúng đối tượng', 'Nhắm target chính xác', 'https://www.youtube.com/watch?v=r8ClNqPx_XE', 25, 3, false),
  (section_1_id, 'Tạo Creative hấp dẫn', 'Thiết kế ads thu hút', 'https://www.youtube.com/watch?v=WQnVpHC0b5Y', 22, 4, false);

  -- Section 2: Google Ads
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_3, 'Google Ads Foundation', 'Nền tảng Google Ads', 2)
  RETURNING id INTO section_2_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_2_id, 'Google Ads vs Facebook Ads', 'So sánh 2 nền tảng', 'https://www.youtube.com/watch?v=qf5xNKCaVrk', 15, 1, false),
  (section_2_id, 'Search Ads', 'Quảng cáo tìm kiếm', 'https://www.youtube.com/watch?v=c9-jVJ7J-No', 28, 2, false),
  (section_2_id, 'Display Network', 'Quảng cáo hiển thị', 'https://www.youtube.com/watch?v=HdqWdv0DhME', 22, 3, false);

  -- Section 3: SEO
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_3, 'SEO Cơ Bản', 'Tối ưu hóa công cụ tìm kiếm', 3)
  RETURNING id INTO section_3_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_3_id, 'SEO là gì?', 'Giới thiệu về SEO', 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', 15, 1, true),
  (section_3_id, 'Keyword Research', 'Nghiên cứu từ khóa', 'https://www.youtube.com/watch?v=d_IIEnSPOgY', 25, 2, false),
  (section_3_id, 'On-page SEO', 'Tối ưu nội bộ website', 'https://www.youtube.com/watch?v=BNHR6IQJGzs', 30, 3, false);
END $$;

-- =============================================
-- COURSE 4: Python Cho Người Mới Bắt Đầu
-- =============================================
DO $$
DECLARE
  course_id_4 UUID;
  section_1_id UUID;
  section_2_id UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM course_categories WHERE slug = 'lap-trinh' LIMIT 1;
  
  INSERT INTO public.courses (
    title, slug, description, image_url, category, category_id,
    price, original_price, duration_hours, lesson_count, level, language,
    rating, rating_count, student_count, is_published, is_featured,
    preview_video_url, creator_name,
    requirements, what_you_learn
  ) VALUES (
    'Python Cho Người Mới Bắt Đầu',
    'python-cho-nguoi-moi-bat-dau',
    'Học Python từ con số 0. Khóa học lập trình Python căn bản nhất dành cho người chưa biết gì về lập trình.',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop',
    'languages',
    category_id,
    399000, 799000, 18, 35, 'beginner', 'vi',
    4.8, 523, 3421, true, true,
    'https://www.youtube.com/watch?v=rfscVS0vtbw',
    'Code With VN',
    ARRAY['Không cần kinh nghiệm lập trình', 'Máy tính Windows/Mac/Linux'],
    ARRAY['Hiểu tư duy lập trình', 'Viết chương trình Python hoàn chỉnh', 'Làm việc với files, databases', 'Tự động hóa công việc hàng ngày']
  ) RETURNING id INTO course_id_4;

  -- Section 1: Làm quen Python
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_4, 'Làm Quen Python', 'Bước đầu làm quen với Python', 1)
  RETURNING id INTO section_1_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_1_id, 'Python là gì?', 'Giới thiệu về Python', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 12, 1, true),
  (section_1_id, 'Cài đặt Python', 'Cài đặt môi trường Python', 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', 15, 2, true),
  (section_1_id, 'Hello World', 'Chương trình đầu tiên', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 10, 3, false);

  -- Section 2: Biến và Kiểu dữ liệu
  INSERT INTO public.course_sections (course_id, title, description, section_order)
  VALUES (course_id_4, 'Biến và Kiểu Dữ Liệu', 'Học về variables và data types', 2)
  RETURNING id INTO section_2_id;

  INSERT INTO public.course_lessons (section_id, title, description, video_url, duration_minutes, lesson_order, is_preview) VALUES
  (section_2_id, 'Variables trong Python', 'Biến và cách sử dụng', 'https://www.youtube.com/watch?v=cQT33yu9pY8', 18, 1, false),
  (section_2_id, 'Numbers và Strings', 'Kiểu số và chuỗi', 'https://www.youtube.com/watch?v=khKv-8q7YmY', 22, 2, false),
  (section_2_id, 'Lists và Dictionaries', 'Danh sách và từ điển', 'https://www.youtube.com/watch?v=W8KRzm-HUcc', 25, 3, false);
END $$;

-- Update lesson and student counts
UPDATE courses SET 
  lesson_count = (SELECT COUNT(*) FROM course_lessons cl JOIN course_sections cs ON cs.id = cl.section_id WHERE cs.course_id = courses.id)
WHERE true;

-- Demo courses imported successfully!

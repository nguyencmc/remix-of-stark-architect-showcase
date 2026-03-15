# 📚 Nền Tảng Học Tập Trực Tuyến

Một nền tảng học tập toàn diện được xây dựng với React, TypeScript và Lovable Cloud, cung cấp đa dạng các tính năng học tập từ khóa học, bài thi, flashcard đến podcast.

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation

## 📁 Cấu Trúc Thư Mục

```
src/
├── components/          # Components dùng chung
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Components quản trị
│   ├── ai/             # Components AI (Tutor, Generator)
│   ├── auth/           # Components xác thực & phân quyền
│   ├── course/         # Components khóa học
│   ├── exam/           # Components bài thi
│   └── podcast/        # Components podcast
├── contexts/           # React Context providers
├── features/           # Feature modules
│   ├── classroom/      # Hệ thống lớp học
│   ├── flashcards/     # Flashcard với SRS (Spaced Repetition)
│   └── practice/       # Luyện tập câu hỏi
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   └── admin/          # Trang quản trị
├── integrations/       # Tích hợp bên ngoài
│   └── supabase/       # Supabase client & types
└── lib/                # Utilities
```

## ✨ Tính Năng Chính

### 📖 Khóa Học (Courses)
- Xem và học các khóa học với video bài giảng
- Theo dõi tiến độ học tập
- Bài kiểm tra cuối khóa
- Chứng chỉ hoàn thành
- Hệ thống Q&A và đánh giá

### 📝 Bài Thi (Exams)
- Thi thử với thời gian giới hạn
- Nhiều danh mục và độ khó
- Xem lại lịch sử thi
- Giải thích đáp án bằng AI
- Hỗ trợ giám sát thi (Proctoring)

### 🃏 Flashcards
- Tạo bộ thẻ học cá nhân
- Thuật toán lặp lại ngắt quãng (SM-2)
- Tự động nhắc ôn tập hàng ngày
- Tạo flashcard bằng AI

### 🎯 Luyện Tập (Practice)
- Ngân hàng câu hỏi cá nhân
- Nhiều chế độ luyện tập
- Ôn lại câu sai
- Thống kê chi tiết

### 🎧 Podcast
- Nghe podcast học tập
- Đánh dấu thời điểm quan trọng
- Lặp lại đoạn A-B
- Transcript đồng bộ

### 📚 Sách Điện Tử (Books)
- Đọc sách trực tuyến
- Đánh dấu và ghi chú
- Theo dõi tiến độ đọc

### 🏫 Lớp Học (Classroom)
- Giáo viên tạo và quản lý lớp học
- Gán khóa học và bài tập
- Theo dõi tiến độ học sinh
- Sổ điểm (Gradebook)

### 👥 Nhóm Học Tập (Study Groups)
- Tạo nhóm học tập
- Chat realtime
- Chia sẻ tài nguyên

### 🏆 Gamification
- Hệ thống điểm và cấp độ
- Thành tích (Achievements)
- Bảng xếp hạng (Leaderboard)

## 🔐 Hệ Thống Phân Quyền (RBAC)

### Vai Trò (Roles)
| Vai trò | Mô tả |
|---------|-------|
| `admin` | Toàn quyền quản trị hệ thống |
| `teacher` | Quản lý nội dung, lớp học của mình |
| `moderator` | Duyệt và kiểm duyệt nội dung |
| `user` | Học viên, sử dụng các tính năng học tập |

### Quyền Hạn Chính
- **Khóa học**: `courses.create`, `courses.edit`, `courses.delete`, `courses.view`
- **Bài thi**: `exams.create`, `exams.edit`, `exams.delete`, `exams.view`
- **Lớp học**: `classes.create`, `classes.manage_members`, `classes.manage_assignments`
- **Người dùng**: `users.manage`, `users.view`, `users.assign_roles`

## 🗄️ Cơ Sở Dữ Liệu

### Bảng Chính
- `profiles` - Thông tin người dùng
- `courses`, `course_sections`, `course_lessons` - Khóa học
- `exams`, `questions`, `exam_attempts` - Bài thi
- `flashcard_decks`, `user_flashcards`, `flashcard_reviews` - Flashcards
- `question_sets`, `practice_questions`, `practice_attempts` - Luyện tập
- `classes`, `class_members`, `class_assignments` - Lớp học
- `podcasts`, `podcast_bookmarks` - Podcast
- `books`, `book_chapters` - Sách

### Bảo Mật (RLS)
Tất cả các bảng đều được bảo vệ bằng Row Level Security:
- Người dùng chỉ xem/sửa dữ liệu của mình
- Admin có quyền truy cập toàn bộ
- Teacher quản lý nội dung mình tạo ra

## 🤖 Tích Hợp AI

### Edge Functions
| Function | Mô tả |
|----------|-------|
| `ai-tutor` | Gia sư AI hỗ trợ học tập |
| `explain-answer` | Giải thích đáp án chi tiết |
| `generate-questions` | Tạo câu hỏi tự động |
| `generate-flashcards` | Tạo flashcard từ nội dung |
| `smart-recommendations` | Gợi ý học tập thông minh |

## 🛠️ Cài Đặt & Chạy

### Yêu Cầu
- Node.js >= 18
- npm hoặc bun

### Cài Đặt
```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Di chuyển vào thư mục dự án
cd <YOUR_PROJECT_NAME>

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Biến Môi Trường
File `.env` được tự động cấu hình bởi Lovable Cloud:
```
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

## 🌐 Deploy lên DigitalOcean App Platform

### Triển khai lần đầu
1. Truy cập [DigitalOcean App Platform](https://cloud.digitalocean.com/apps) → **Create App**
2. Chọn **Import from GitHub** và chọn repository `nguyencmc/ai-learn-and-exams-online-11921`
3. DigitalOcean sẽ tự động nhận diện file `.do/app.yaml`
4. Thêm các biến môi trường BUILD_TIME trong App Settings:
   - `VITE_SUPABASE_URL` — URL dự án Supabase
   - `VITE_SUPABASE_ANON_KEY` — Anon key của Supabase
5. Nhấn **Deploy**

### Khắc phục lỗi deploy sau khi đổi tên repository trên GitHub

> ⚠️ **Lưu ý quan trọng**: Khi bạn đổi tên repository trên GitHub, DigitalOcean App Platform sẽ **ngừng nhận webhook** từ GitHub. Điều này khiến `deploy_on_push` không còn hoạt động và các commit mới sẽ không được deploy tự động.

**Cách khắc phục:**
1. Truy cập [DigitalOcean App Platform](https://cloud.digitalocean.com/apps) → chọn app của bạn
2. Vào **Settings** → cuộn đến phần **App Source**
3. Nhấn **Edit** bên cạnh source repository
4. Chọn lại repository với tên mới từ danh sách GitHub
   - Nếu không thấy repo, có thể cần cấp lại quyền cho DigitalOcean GitHub App tại [GitHub Settings → Applications](https://github.com/settings/installations)
5. Lưu và trigger **Force Rebuild & Deploy**

**Cách thay thế** — tạo app mới:
1. Xóa app cũ trên DigitalOcean
2. Tạo app mới từ repository đã đổi tên (DigitalOcean sẽ tự nhận `.do/app.yaml`)
3. Thêm lại các biến môi trường BUILD_TIME

## 📦 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # Kiểm tra linting
```

## 🔗 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Lovable Documentation](https://docs.lovable.dev)

## 📄 License

© 2024 - All rights reserved.

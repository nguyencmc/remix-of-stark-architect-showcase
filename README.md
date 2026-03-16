# 📚 Nền Tảng Học Tập Trực Tuyến

Một nền tảng học tập toàn diện được xây dựng với React, TypeScript và Supabase, cung cấp đa dạng các tính năng học tập từ khóa học, bài thi, flashcard, podcast đến bài viết và nhóm học tập.

## 🚀 Công Nghệ Sử Dụng

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | React 18, TypeScript, Vite 5 (SWC) |
| **Styling** | Tailwind CSS 3, shadcn/ui (Radix UI) |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **State Management** | TanStack Query 5 (React Query) |
| **Routing** | React Router DOM v6 |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Deployment** | DigitalOcean App Platform (Docker + Nginx) |

## 📁 Cấu Trúc Thư Mục

```
src/
├── components/          # Components dùng chung (209 files)
│   ├── ui/             # shadcn/ui components (Radix UI)
│   ├── admin/          # Components quản trị
│   ├── ai/             # Components AI (Tutor, Generator)
│   ├── auth/           # Components xác thực & phân quyền
│   ├── course/         # Components khóa học
│   ├── dashboard/      # Components dashboard
│   ├── editor/         # Rich text editor
│   ├── exam/           # Components bài thi
│   ├── landing/        # Components trang chủ
│   ├── layouts/        # Layout wrappers, ErrorBoundary
│   ├── podcast/        # Components podcast (MiniPlayer)
│   ├── theme/          # Dark mode / theme toggle
│   └── achievements/   # Components thành tích
├── contexts/           # React Context providers
│   ├── AuthContext      # Xác thực người dùng
│   ├── PermissionsContext # Phân quyền RBAC
│   └── MiniPlayerContext  # Podcast mini player
├── features/           # Feature modules (26 modules)
│   ├── admin/          # Quản trị hệ thống
│   ├── articles/       # Bài viết người dùng
│   ├── authPage/       # Giao diện xác thực
│   ├── bookEditor/     # Quản lý sách (CRUD)
│   ├── bookReader/     # Đọc sách & ghi chú
│   ├── categoryManagement/ # Quản lý danh mục
│   ├── classroom/      # Hệ thống lớp học
│   ├── courseDetail/    # Chi tiết khóa học
│   ├── courseEditor/    # Quản lý khóa học (CRUD)
│   ├── courseManagement/ # Quản lý khóa học (admin)
│   ├── courseTest/      # Kiểm tra khóa học
│   ├── courseViewer/    # Giao diện học khóa học
│   ├── courses/        # Danh sách khóa học
│   ├── examDetail/     # Chi tiết bài thi
│   ├── examEditor/     # Quản lý bài thi (CRUD)
│   ├── examManagement/ # Quản lý bài thi (admin)
│   ├── exams/          # Hệ thống thi
│   ├── flashcardStudy/ # Giao diện học flashcard
│   ├── flashcards/     # Quản lý flashcard
│   ├── myCourses/      # Khóa học đã đăng ký
│   ├── podcastDetail/  # Chi tiết podcast
│   ├── podcastEditor/  # Quản lý podcast (CRUD)
│   ├── podcasts/       # Danh sách podcast
│   ├── practice/       # Luyện tập câu hỏi
│   ├── questionSetEditor/ # Quản lý bộ câu hỏi
│   └── settings/       # Cài đặt người dùng
├── hooks/              # Custom React hooks
│   ├── useAchievements # Quản lý thành tích
│   ├── useAuditLogs    # Nhật ký hệ thống
│   ├── useMobile       # Responsive detection
│   ├── useStudyGroups  # Nhóm học tập
│   ├── useToast        # Thông báo toast
│   └── useWishlist     # Danh sách yêu thích
├── pages/              # Page components (46 pages)
│   └── admin/          # Trang quản trị (19 pages)
├── routes/             # Route configuration (7 modules)
│   ├── coreRoutes      # Routes chính
│   ├── adminRoutes     # Routes quản trị
│   ├── practiceRoutes  # Routes luyện tập
│   ├── flashcardRoutes # Routes flashcard
│   ├── classroomRoutes # Routes lớp học
│   └── articleRoutes   # Routes bài viết
├── integrations/       # Tích hợp bên ngoài
│   └── supabase/       # Supabase client & types
├── lib/                # Utilities
│   ├── env.ts          # Kiểm tra biến môi trường
│   ├── logger.ts       # Logging utility
│   ├── sanitize.ts     # XSS/HTML sanitization
│   └── utils.ts        # General utilities
└── types/              # TypeScript definitions
```

## ✨ Tính Năng Chính

### 📖 Khóa Học (Courses)
- Xem và học các khóa học với video bài giảng
- Theo dõi tiến độ học tập
- Bài kiểm tra cuối khóa
- Chứng chỉ hoàn thành (xác minh trực tuyến)
- Hệ thống Q&A và đánh giá
- Trang hồ sơ giảng viên

### 📝 Bài Thi (Exams)
- Thi thử với thời gian giới hạn
- Nhiều danh mục và độ khó
- Xem lại lịch sử thi chi tiết
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
- Quản lý bộ câu hỏi (Question Sets)

### 🎧 Podcast
- Nghe podcast học tập
- Đánh dấu thời điểm quan trọng
- Lặp lại đoạn A-B
- Transcript đồng bộ
- Mini player liên tục khi chuyển trang
- Phiên âm tự động (AI Transcription)

### 📚 Sách Điện Tử (Books)
- Đọc sách trực tuyến với giao diện reader
- Đánh dấu và ghi chú (annotations)
- Theo dõi tiến độ đọc

### ✍️ Bài Viết (Articles)
- Người dùng tạo và chia sẻ bài viết
- Rich text editor & markdown
- Hệ thống kiểm duyệt (moderation)
- Trang bài viết cá nhân

### 🏫 Lớp Học (Classroom)
- Giáo viên tạo và quản lý lớp học
- Gán khóa học và bài tập
- Theo dõi tiến độ học sinh
- Sổ điểm (Gradebook)
- Tham gia lớp bằng mã mời

### 👥 Nhóm Học Tập (Study Groups)
- Tạo nhóm học tập
- Chat realtime
- Chia sẻ tài nguyên
- Quản lý thành viên

### 🏆 Gamification
- Hệ thống điểm và cấp độ
- Thành tích (Achievements)
- Bảng xếp hạng (Leaderboard)

### 🛡️ Quản Trị (Admin)
- Dashboard tổng quan
- Quản lý người dùng & phân quyền
- Quản lý nội dung (khóa học, bài thi, podcast, sách, flashcard, bộ câu hỏi)
- Quản lý danh mục
- Kiểm duyệt bài viết
- Nhật ký hệ thống (Audit Logs)

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

### Supabase Edge Functions
| Function | Mô tả |
|----------|-------|
| `ai-tutor` | Gia sư AI hỗ trợ học tập |
| `explain-answer` | Giải thích đáp án chi tiết |
| `generate-questions` | Tạo câu hỏi tự động |
| `generate-flashcards` | Tạo flashcard từ nội dung |
| `smart-recommendations` | Gợi ý học tập thông minh |
| `transcribe-audio` | Phiên âm audio tự động |
| `admin-users` | Quản lý người dùng (admin) |
| `export-database` | Xuất dữ liệu toàn bộ |
| `export-schema` | Xuất schema cơ sở dữ liệu |
| `import-rbac-data` | Nhập dữ liệu phân quyền |

## 🛠️ Cài Đặt & Chạy

### Yêu Cầu
- Node.js >= 18 (xem `.nvmrc`)
- npm

### Cài Đặt
```bash
# Clone repository
git clone https://github.com/nguyencmc/ai-learn-and-exams-online-11921.git

# Di chuyển vào thư mục dự án
cd ai-learn-and-exams-online-11921

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Biến Môi Trường
Tạo file `.env` dựa trên `.env.example`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Lưu ý**: Các biến `VITE_*` được nhúng vào bundle tại thời điểm build (BUILD_TIME) vì Vite xử lý chúng khi biên dịch.

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
npm run dev        # Chạy development server (port 8080)
npm run build      # Build production (tsc --noEmit && vite build)
npm run build:dev  # Build development mode
npm run preview    # Preview production build
npm run lint       # Kiểm tra linting (ESLint)
npm run lint:fix   # Tự động sửa lỗi lint
npm run typecheck  # Kiểm tra TypeScript types
npm run clean      # Xóa dist và cache
```

## 📊 Thống Kê Dự Án

| Hạng mục | Số lượng |
|----------|----------|
| Feature Modules | 26 |
| Page Components | 46 (27 user + 19 admin) |
| Component Files | 209 |
| Custom Hooks | 6 |
| Route Modules | 7 (~78 routes) |
| Context Providers | 3 |
| Edge Functions | 10 |

## 🔗 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Supabase Documentation](https://supabase.com/docs)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)

## 📄 License

© 2024 - All rights reserved.

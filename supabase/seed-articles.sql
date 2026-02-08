-- =====================================================
-- SEED DATA CHO TRANG BÀI VIẾT (Fixed version)
-- Chạy file này trong Supabase SQL Editor
-- =====================================================

-- 1. Tạo các chuyên mục bài viết (nếu chưa có)
INSERT INTO public.article_categories (name, slug, description, display_order, is_featured) VALUES
  ('Linux', 'linux', 'Bài viết về hệ điều hành Linux, tips & tricks', 1, true),
  ('DevOps', 'devops', 'CI/CD, Automation, Infrastructure as Code', 2, true),
  ('Docker', 'docker', 'Container hóa ứng dụng với Docker', 3, true),
  ('Kubernetes', 'kubernetes', 'Orchestration và quản lý container', 4, false),
  ('Security', 'security', 'Bảo mật hệ thống và ứng dụng', 5, false),
  ('Cloud', 'cloud', 'AWS, GCP, Azure và Cloud Native', 6, false),
  ('Programming', 'programming', 'Lập trình và phát triển phần mềm', 7, false),
  ('Database', 'database', 'PostgreSQL, MySQL, MongoDB, Redis', 8, false)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured;

-- 2. Thêm bài viết mẫu (lookup category by slug)
DO $$
DECLARE
  author_uuid UUID;
  cat_linux UUID;
  cat_devops UUID;
  cat_docker UUID;
  cat_kubernetes UUID;
  cat_security UUID;
  cat_cloud UUID;
  cat_programming UUID;
  cat_database UUID;
BEGIN
  -- Lấy user đầu tiên làm tác giả
  SELECT user_id INTO author_uuid FROM public.profiles LIMIT 1;
  
  IF author_uuid IS NULL THEN
    RAISE NOTICE 'Không tìm thấy user nào. Vui lòng đăng ký tài khoản trước.';
    RETURN;
  END IF;

  -- Lookup category IDs by slug
  SELECT id INTO cat_linux FROM public.article_categories WHERE slug = 'linux';
  SELECT id INTO cat_devops FROM public.article_categories WHERE slug = 'devops';
  SELECT id INTO cat_docker FROM public.article_categories WHERE slug = 'docker';
  SELECT id INTO cat_kubernetes FROM public.article_categories WHERE slug = 'kubernetes';
  SELECT id INTO cat_security FROM public.article_categories WHERE slug = 'security';
  SELECT id INTO cat_cloud FROM public.article_categories WHERE slug = 'cloud';
  SELECT id INTO cat_programming FROM public.article_categories WHERE slug = 'programming';
  SELECT id INTO cat_database FROM public.article_categories WHERE slug = 'database';

  -- ===== BÀI VIẾT NỔI BẬT =====
  INSERT INTO public.articles (title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, comment_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES
    -- Bài 1: Linux Featured
    (
      'TuxMate: Trình quản lý cài đặt app tập trung cho Linux',
      'tuxmate-trinh-quan-ly-cai-dat-app-tap-trung-cho-linux-' || extract(epoch from now())::text,
      '<h2>🐧 Giới thiệu TuxMate</h2>
<p>TuxMate là một công cụ quản lý ứng dụng tập trung cho Linux, giúp bạn dễ dàng cài đặt, cập nhật và gỡ bỏ các ứng dụng từ nhiều nguồn khác nhau.</p>

<h2>✨ Tính năng nổi bật</h2>
<ul>
<li>🎨 Giao diện đồ họa trực quan</li>
<li>📦 Hỗ trợ APT, Flatpak, Snap, AppImage</li>
<li>🔄 Tự động cập nhật ứng dụng</li>
</ul>

<h2>🚀 Cài đặt</h2>
<pre><code class="language-bash">curl -fsSL https://tuxmate.io/install.sh | bash</code></pre>',
      'TuxMate là công cụ quản lý ứng dụng tập trung cho Linux.',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
      cat_linux,
      author_uuid,
      'approved',
      1245, 32, true,
      ARRAY['Linux', 'Tools', 'Package Manager'],
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '2 days'
    ),

    -- Bài 2: DevOps Featured
    (
      'CI/CD Pipeline hoàn chỉnh với GitHub Actions và ArgoCD',
      'cicd-github-actions-argocd-' || extract(epoch from now())::text,
      '<h2>🔄 CI/CD hiện đại</h2>
<p>Xây dựng pipeline với GitHub Actions và ArgoCD theo mô hình GitOps.</p>

<h2>⚡ Cấu hình GitHub Actions</h2>
<pre><code class="language-yaml">name: CI Pipeline
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test && npm run build</code></pre>',
      'Hướng dẫn xây dựng CI/CD pipeline với GitHub Actions và ArgoCD.',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
      cat_devops,
      author_uuid,
      'approved',
      2156, 45, true,
      ARRAY['DevOps', 'CI/CD', 'GitHub Actions', 'ArgoCD'],
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '3 days'
    ),

    -- Bài 3: Docker Featured
    (
      'Docker Multi-stage Build: Tối ưu image size',
      'docker-multi-stage-build-' || extract(epoch from now())::text,
      '<h2>🐳 Multi-stage Build</h2>
<p>Giảm image size từ 800MB xuống 10MB với multi-stage build.</p>

<h2>🔧 Dockerfile tối ưu</h2>
<pre><code class="language-dockerfile">FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs20-debian12
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["index.js"]</code></pre>',
      'Hướng dẫn Docker Multi-stage Build để giảm kích thước image.',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
      cat_docker,
      author_uuid,
      'approved',
      1823, 28, true,
      ARRAY['Docker', 'Container', 'Optimization'],
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '4 days'
    ),

    -- Bài 4: Security Featured
    (
      'Bảo mật SSH Server: Best Practices',
      'bao-mat-ssh-server-' || extract(epoch from now())::text,
      '<h2>🔐 SSH Security</h2>
<p>SSH là cửa ngõ chính vào server. Cấu hình đúng để tránh bị tấn công.</p>

<h2>📋 Best Practices</h2>
<pre><code class="language-bash"># /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
AllowUsers deploy admin</code></pre>',
      'Best practices bảo mật SSH Server.',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      cat_security,
      author_uuid,
      'approved',
      3245, 67, true,
      ARRAY['Security', 'SSH', 'Linux'],
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '6 days',
      NOW() - INTERVAL '5 days'
    ),

    -- Bài 5: Kubernetes
    (
      'Kubernetes HPA: Tự động scale ứng dụng',
      'kubernetes-hpa-autoscaling-' || extract(epoch from now())::text,
      '<h2>📈 Horizontal Pod Autoscaler</h2>
<p>HPA tự động tăng/giảm số lượng Pod dựa trên CPU, Memory.</p>

<h2>🔧 Cấu hình HPA</h2>
<pre><code class="language-yaml">apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70</code></pre>',
      'Hướng dẫn Kubernetes HPA để tự động scale ứng dụng.',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
      cat_kubernetes,
      author_uuid,
      'approved',
      856, 19, false,
      ARRAY['Kubernetes', 'Autoscaling', 'HPA'],
      NOW() - INTERVAL '6 days',
      NOW() - INTERVAL '7 days',
      NOW() - INTERVAL '6 days'
    ),

    -- Bài 6: Cloud
    (
      'AWS Lambda + API Gateway: Serverless API',
      'aws-lambda-api-gateway-' || extract(epoch from now())::text,
      '<h2>☁️ Serverless</h2>
<p>Chạy code mà không cần quản lý server.</p>

<h2>🚀 Lambda Function</h2>
<pre><code class="language-python">def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    name = body.get("name", "World")
    return {
        "statusCode": 200,
        "body": json.dumps({"message": f"Hello, {name}!"})
    }</code></pre>',
      'Hướng dẫn tạo Serverless API với AWS Lambda và API Gateway.',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      cat_cloud,
      author_uuid,
      'approved',
      945, 12, false,
      ARRAY['AWS', 'Lambda', 'Serverless'],
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '9 days',
      NOW() - INTERVAL '8 days'
    ),

    -- Bài 7: Database
    (
      'PostgreSQL: 10 Query tối ưu performance',
      'postgresql-query-optimization-' || extract(epoch from now())::text,
      '<h2>🐘 Tối ưu PostgreSQL</h2>
<p>Query chậm là nguyên nhân chính gây bottleneck.</p>

<h2>1️⃣ EXPLAIN ANALYZE</h2>
<pre><code class="language-sql">EXPLAIN ANALYZE SELECT * FROM users WHERE email = ''test@example.com'';

-- Tạo Index
CREATE INDEX idx_users_email ON users(email);</code></pre>',
      '10 kỹ thuật tối ưu performance PostgreSQL.',
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      cat_database,
      author_uuid,
      'approved',
      1567, 23, false,
      ARRAY['PostgreSQL', 'Database', 'Performance'],
      NOW() - INTERVAL '9 days',
      NOW() - INTERVAL '10 days',
      NOW() - INTERVAL '9 days'
    ),

    -- Bài 8: Programming
    (
      'TypeScript 5.4: Tính năng mới',
      'typescript-5-4-features-' || extract(epoch from now())::text,
      '<h2>🔷 TypeScript 5.4</h2>
<p>Những cải tiến về type inference và developer experience.</p>

<h2>✨ Preserved Narrowing in Closures</h2>
<pre><code class="language-typescript">function example(x: string | number) {
  if (typeof x === "string") {
    setTimeout(() => {
      // x is STILL string in TS 5.4!
      console.log(x.toUpperCase());
    }, 100);
  }
}</code></pre>',
      'Tổng hợp các tính năng mới trong TypeScript 5.4.',
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      cat_programming,
      author_uuid,
      'approved',
      1089, 18, false,
      ARRAY['TypeScript', 'JavaScript', 'Programming'],
      NOW() - INTERVAL '10 days',
      NOW() - INTERVAL '11 days',
      NOW() - INTERVAL '10 days'
    );

  RAISE NOTICE '✅ Đã tạo thành công 8 bài viết mẫu!';
END $$;

-- 3. Cập nhật số lượng bài viết cho mỗi category
UPDATE public.article_categories ac
SET article_count = (
  SELECT COUNT(*) FROM public.articles a 
  WHERE a.category_id = ac.id AND a.status = 'approved'
);

-- 4. Kiểm tra kết quả
SELECT 
  ac.name as "Chuyên mục",
  ac.article_count as "Số bài viết"
FROM public.article_categories ac
ORDER BY ac.display_order;

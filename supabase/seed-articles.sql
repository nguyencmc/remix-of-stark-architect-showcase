-- =====================================================
-- SEED DATA CHO TRANG BÀI VIẾT
-- Chạy file này trong Supabase SQL Editor
-- =====================================================

-- 1. Tạo các chuyên mục bài viết
INSERT INTO public.article_categories (id, name, slug, description, display_order, is_featured) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Linux', 'linux', 'Bài viết về hệ điều hành Linux, tips & tricks', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'DevOps', 'devops', 'CI/CD, Automation, Infrastructure as Code', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'Docker', 'docker', 'Container hóa ứng dụng với Docker', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'Kubernetes', 'kubernetes', 'Orchestration và quản lý container', 4, false),
  ('55555555-5555-5555-5555-555555555555', 'Security', 'security', 'Bảo mật hệ thống và ứng dụng', 5, false),
  ('66666666-6666-6666-6666-666666666666', 'Cloud', 'cloud', 'AWS, GCP, Azure và Cloud Native', 6, false),
  ('77777777-7777-7777-7777-777777777777', 'Programming', 'programming', 'Lập trình và phát triển phần mềm', 7, false),
  ('88888888-8888-8888-8888-888888888888', 'Database', 'database', 'PostgreSQL, MySQL, MongoDB, Redis', 8, false)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured;

-- 2. Thêm bài viết mẫu
DO $$
DECLARE
  author_uuid UUID;
BEGIN
  -- Lấy user đầu tiên làm tác giả
  SELECT user_id INTO author_uuid FROM public.profiles LIMIT 1;
  
  IF author_uuid IS NULL THEN
    RAISE NOTICE 'Không tìm thấy user nào. Vui lòng đăng ký tài khoản trước.';
    RETURN;
  END IF;

  -- Xóa bài viết cũ nếu cần (optional - comment nếu muốn giữ lại)
  -- DELETE FROM public.articles WHERE slug LIKE '%sample%';

  -- ===== BÀI VIẾT NỔI BẬT =====
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, comment_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES
    -- Bài 1: Linux Featured
    (
      gen_random_uuid(),
      'TuxMate: Trình quản lý cài đặt app tập trung cho Linux',
      'tuxmate-trinh-quan-ly-cai-dat-app-tap-trung-cho-linux-' || extract(epoch from now())::text,
      '<h2>🐧 Giới thiệu TuxMate</h2>
<p>TuxMate là một công cụ quản lý ứng dụng tập trung cho Linux, giúp bạn dễ dàng cài đặt, cập nhật và gỡ bỏ các ứng dụng từ nhiều nguồn khác nhau như <strong>APT, Flatpak, Snap và AppImage</strong>.</p>

<h2>✨ Tính năng nổi bật</h2>
<ul>
<li>🎨 Giao diện đồ họa trực quan, dễ sử dụng</li>
<li>📦 Hỗ trợ đa nguồn package: APT, Flatpak, Snap, AppImage</li>
<li>🔄 Tự động cập nhật ứng dụng theo lịch</li>
<li>🧠 Quản lý phụ thuộc thông minh</li>
<li>🔍 Tìm kiếm nhanh trong tất cả các nguồn</li>
</ul>

<h2>🚀 Cài đặt TuxMate</h2>
<pre><code class="language-bash"># Cài đặt nhanh
curl -fsSL https://tuxmate.io/install.sh | bash

# Hoặc dùng pip
pip install tuxmate</code></pre>

<h2>📖 Cách sử dụng cơ bản</h2>
<pre><code class="language-bash"># Tìm kiếm ứng dụng
tuxmate search vscode

# Cài đặt
tuxmate install vscode --source=snap

# Cập nhật tất cả
tuxmate upgrade --all</code></pre>

<blockquote>
<p>💡 <strong>Tip:</strong> TuxMate là lựa chọn tuyệt vời cho những ai muốn đơn giản hóa việc quản lý ứng dụng trên Linux mà không cần nhớ nhiều lệnh khác nhau.</p>
</blockquote>',
      'TuxMate là công cụ quản lý ứng dụng tập trung cho Linux, hỗ trợ APT, Flatpak, Snap và AppImage trong một giao diện thống nhất.',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1280&h=720&fit=crop',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      1245,
      32,
      true,
      ARRAY['Linux', 'Tools', 'Package Manager', 'Productivity'],
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '2 days'
    ),

    -- Bài 2: DevOps Featured
    (
      gen_random_uuid(),
      'CI/CD Pipeline hoàn chỉnh với GitHub Actions và ArgoCD',
      'cicd-pipeline-hoan-chinh-voi-github-actions-va-argocd-' || extract(epoch from now())::text,
      '<h2>🔄 Tổng quan về CI/CD hiện đại</h2>
<p>Trong bài viết này, chúng ta sẽ xây dựng một <strong>CI/CD pipeline hoàn chỉnh</strong> sử dụng GitHub Actions cho Continuous Integration và ArgoCD cho Continuous Deployment theo mô hình GitOps.</p>

<h2>🏗️ Kiến trúc hệ thống</h2>
<pre><code>Developer → GitHub → GitHub Actions (CI) → Container Registry → ArgoCD (CD) → Kubernetes</code></pre>

<h2>📋 Yêu cầu</h2>
<ul>
<li>GitHub repository</li>
<li>Kubernetes cluster (có thể dùng kind/minikube để test)</li>
<li>ArgoCD đã cài đặt</li>
<li>Container Registry (Docker Hub, GHCR, ECR...)</li>
</ul>

<h2>⚡ Cấu hình GitHub Actions</h2>
<pre><code class="language-yaml">name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and test
        run: |
          npm ci
          npm test
          npm run build
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: myapp:${{ github.sha }}</code></pre>

<h2>🎯 Cấu hình ArgoCD Application</h2>
<pre><code class="language-yaml">apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myapp-k8s
    targetRevision: HEAD
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true</code></pre>

<blockquote>
<p>🚀 <strong>Best Practice:</strong> Luôn tách biệt repo code và repo Kubernetes manifests để có GitOps flow rõ ràng.</p>
</blockquote>',
      'Hướng dẫn chi tiết xây dựng CI/CD pipeline hoàn chỉnh với GitHub Actions và ArgoCD theo mô hình GitOps.',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1280&h=720&fit=crop',
      '22222222-2222-2222-2222-222222222222',
      author_uuid,
      'approved',
      2156,
      45,
      true,
      ARRAY['DevOps', 'CI/CD', 'GitHub Actions', 'ArgoCD', 'GitOps'],
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '3 days'
    ),

    -- Bài 3: Docker Featured
    (
      gen_random_uuid(),
      'Docker Multi-stage Build: Tối ưu image size xuống còn 10MB',
      'docker-multi-stage-build-toi-uu-image-size-xuong-con-10mb-' || extract(epoch from now())::text,
      '<h2>🐳 Vấn đề với Docker image lớn</h2>
<p>Docker image lớn gây ra nhiều vấn đề: tốn bandwidth, deploy chậm, tốn storage. Với <strong>Multi-stage Build</strong>, bạn có thể giảm image size đáng kể.</p>

<h2>📊 So sánh kích thước</h2>
<table>
<tr><th>Phương pháp</th><th>Kích thước</th></tr>
<tr><td>Image thông thường</td><td>~800MB</td></tr>
<tr><td>Multi-stage build</td><td>~50MB</td></tr>
<tr><td>Multi-stage + Distroless</td><td>~10MB</td></tr>
</table>

<h2>🔧 Dockerfile tối ưu cho Node.js</h2>
<pre><code class="language-dockerfile"># Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["index.js"]</code></pre>

<h2>🔧 Dockerfile tối ưu cho Go</h2>
<pre><code class="language-dockerfile"># Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o main .

# Stage 2: Production (scratch = 0 bytes base!)
FROM scratch
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]</code></pre>

<h2>💡 Tips bổ sung</h2>
<ul>
<li>Sử dụng <code>.dockerignore</code> để loại bỏ file không cần thiết</li>
<li>Nhóm các RUN commands để giảm layers</li>
<li>Sắp xếp COPY từ ít thay đổi đến nhiều thay đổi</li>
</ul>',
      'Hướng dẫn sử dụng Docker Multi-stage Build để giảm kích thước image từ 800MB xuống còn 10MB.',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1280&h=720&fit=crop',
      '33333333-3333-3333-3333-333333333333',
      author_uuid,
      'approved',
      1823,
      28,
      true,
      ARRAY['Docker', 'Container', 'Optimization', 'Best Practices'],
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '4 days'
    ),

    -- Bài 4: Security Featured
    (
      gen_random_uuid(),
      'Bảo mật SSH Server: 15 Best Practices không thể bỏ qua',
      'bao-mat-ssh-server-15-best-practices-khong-the-bo-qua-' || extract(epoch from now())::text,
      '<h2>🔐 Tại sao SSH Security quan trọng?</h2>
<p>SSH là cửa ngõ chính vào server của bạn. Một cấu hình yếu có thể dẫn đến việc bị <strong>brute force</strong>, <strong>man-in-the-middle attack</strong> hoặc thậm chí là mất toàn quyền kiểm soát server.</p>

<h2>📋 15 Best Practices</h2>

<h3>1. Disable Root Login</h3>
<pre><code class="language-bash"># /etc/ssh/sshd_config
PermitRootLogin no</code></pre>

<h3>2. Chỉ dùng SSH Key Authentication</h3>
<pre><code class="language-bash">PasswordAuthentication no
PubkeyAuthentication yes</code></pre>

<h3>3. Đổi port mặc định</h3>
<pre><code class="language-bash">Port 2222</code></pre>

<h3>4. Giới hạn users được SSH</h3>
<pre><code class="language-bash">AllowUsers deploy admin</code></pre>

<h3>5. Enable Two-Factor Authentication</h3>
<pre><code class="language-bash">AuthenticationMethods publickey,keyboard-interactive</code></pre>

<h3>6-15. Các cấu hình khác</h3>
<pre><code class="language-bash"># Timeout settings
ClientAliveInterval 300
ClientAliveCountMax 2

# Protocol & Encryption
Protocol 2
Ciphers aes256-gcm@openssh.com,chacha20-poly1305@openssh.com
MACs hmac-sha2-512-etm@openssh.com

# Logging
LogLevel VERBOSE

# Rate limiting with fail2ban
# Install: apt install fail2ban</code></pre>

<h2>🛡️ File cấu hình hoàn chỉnh</h2>
<pre><code class="language-bash"># /etc/ssh/sshd_config
Port 2222
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AllowUsers deploy admin
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
LogLevel VERBOSE</code></pre>

<blockquote>
<p>⚠️ <strong>Quan trọng:</strong> Luôn test cấu hình SSH mới trong một session khác trước khi đóng session hiện tại!</p>
</blockquote>',
      '15 best practices bảo mật SSH Server mà mọi System Administrator cần biết và áp dụng ngay.',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop',
      '55555555-5555-5555-5555-555555555555',
      author_uuid,
      'approved',
      3245,
      67,
      true,
      ARRAY['Security', 'SSH', 'Linux', 'Best Practices', 'Server'],
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '6 days',
      NOW() - INTERVAL '5 days'
    );

  -- ===== BÀI VIẾT THƯỜNG =====
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, comment_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES
    -- Bài 5: Kubernetes
    (
      gen_random_uuid(),
      'Kubernetes HPA: Tự động scale ứng dụng theo traffic',
      'kubernetes-hpa-tu-dong-scale-ung-dung-theo-traffic-' || extract(epoch from now())::text,
      '<h2>📈 Horizontal Pod Autoscaler là gì?</h2>
<p>HPA tự động tăng/giảm số lượng Pod replicas dựa trên CPU, Memory hoặc custom metrics.</p>

<h2>🔧 Cấu hình HPA cơ bản</h2>
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
        averageUtilization: 70</code></pre>

<h2>📊 Monitoring HPA</h2>
<pre><code class="language-bash">kubectl get hpa
kubectl describe hpa myapp-hpa</code></pre>',
      'Hướng dẫn sử dụng Kubernetes HPA để tự động scale ứng dụng dựa trên CPU và custom metrics.',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1280&h=720&fit=crop',
      '44444444-4444-4444-4444-444444444444',
      author_uuid,
      'approved',
      856,
      19,
      false,
      ARRAY['Kubernetes', 'Autoscaling', 'HPA', 'Cloud Native'],
      NOW() - INTERVAL '6 days',
      NOW() - INTERVAL '7 days',
      NOW() - INTERVAL '6 days'
    ),

    -- Bài 6: Linux Tool
    (
      gen_random_uuid(),
      'Btop++: Monitor hệ thống Linux đẹp nhất 2026',
      'btop-monitor-he-thong-linux-dep-nhat-2026-' || extract(epoch from now())::text,
      '<h2>🖥️ Btop++ là gì?</h2>
<p>Btop++ là tool monitor system resources với giao diện TUI cực đẹp, thay thế hoàn hảo cho htop.</p>

<h2>⚡ Cài đặt</h2>
<pre><code class="language-bash"># Ubuntu/Debian
sudo apt install btop

# Arch
sudo pacman -S btop

# macOS
brew install btop</code></pre>

<h2>✨ Tính năng nổi bật</h2>
<ul>
<li>Giao diện đồ họa đẹp mắt với Unicode/Braille</li>
<li>Hiển thị CPU, Memory, Disk, Network real-time</li>
<li>Hỗ trợ mouse interaction</li>
<li>Customizable themes</li>
<li>Process tree view</li>
</ul>

<h2>🎨 Themes</h2>
<p>Btop++ hỗ trợ nhiều themes: Default, TTY, Low Color, Dracula, Nord, Gruvbox...</p>',
      'Btop++ - công cụ monitor hệ thống Linux với giao diện đẹp nhất, thay thế hoàn hảo cho htop.',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1280&h=720&fit=crop',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      1234,
      15,
      false,
      ARRAY['Linux', 'Tools', 'Monitoring', 'Terminal'],
      NOW() - INTERVAL '7 days',
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '7 days'
    ),

    -- Bài 7: Cloud
    (
      gen_random_uuid(),
      'AWS Lambda + API Gateway: Serverless API trong 10 phút',
      'aws-lambda-api-gateway-serverless-api-trong-10-phut-' || extract(epoch from now())::text,
      '<h2>☁️ Serverless là gì?</h2>
<p>Serverless cho phép bạn chạy code mà không cần quản lý server. Bạn chỉ trả tiền khi function chạy.</p>

<h2>🚀 Tạo Lambda Function</h2>
<pre><code class="language-python"># handler.py
import json

def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    name = body.get("name", "World")
    
    return {
        "statusCode": 200,
        "body": json.dumps({"message": f"Hello, {name}!"})
    }</code></pre>

<h2>⚙️ Cấu hình với Serverless Framework</h2>
<pre><code class="language-yaml"># serverless.yml
service: my-api

provider:
  name: aws
  runtime: python3.11
  region: ap-southeast-1

functions:
  hello:
    handler: handler.lambda_handler
    events:
      - http:
          path: /hello
          method: post</code></pre>

<h2>🎯 Deploy</h2>
<pre><code class="language-bash">npm install -g serverless
serverless deploy</code></pre>',
      'Hướng dẫn tạo Serverless API với AWS Lambda và API Gateway chỉ trong 10 phút.',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop',
      '66666666-6666-6666-6666-666666666666',
      author_uuid,
      'approved',
      945,
      12,
      false,
      ARRAY['AWS', 'Lambda', 'Serverless', 'API Gateway', 'Cloud'],
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '9 days',
      NOW() - INTERVAL '8 days'
    ),

    -- Bài 8: Database
    (
      gen_random_uuid(),
      'PostgreSQL: 10 Query tối ưu performance bạn cần biết',
      'postgresql-10-query-toi-uu-performance-ban-can-biet-' || extract(epoch from now())::text,
      '<h2>🐘 Tại sao cần tối ưu PostgreSQL?</h2>
<p>Query chậm là nguyên nhân chính gây bottleneck trong ứng dụng. Hãy học cách tối ưu!</p>

<h2>1️⃣ Sử dụng EXPLAIN ANALYZE</h2>
<pre><code class="language-sql">EXPLAIN ANALYZE SELECT * FROM users WHERE email = ''test@example.com'';</code></pre>

<h2>2️⃣ Tạo Index phù hợp</h2>
<pre><code class="language-sql">-- B-tree index cho equality & range
CREATE INDEX idx_users_email ON users(email);

-- Partial index cho queries có điều kiện
CREATE INDEX idx_active_users ON users(status) WHERE status = ''active'';</code></pre>

<h2>3️⃣ Sử dụng Connection Pooling</h2>
<pre><code class="language-bash"># PgBouncer config
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20</code></pre>

<h2>4️⃣ Vacuum & Analyze thường xuyên</h2>
<pre><code class="language-sql">VACUUM ANALYZE users;

-- Hoặc auto vacuum
ALTER TABLE users SET (autovacuum_vacuum_scale_factor = 0.1);</code></pre>',
      '10 kỹ thuật tối ưu performance PostgreSQL mà developer và DBA cần nắm vững.',
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1280&h=720&fit=crop',
      '88888888-8888-8888-8888-888888888888',
      author_uuid,
      'approved',
      1567,
      23,
      false,
      ARRAY['PostgreSQL', 'Database', 'Performance', 'SQL', 'Optimization'],
      NOW() - INTERVAL '9 days',
      NOW() - INTERVAL '10 days',
      NOW() - INTERVAL '9 days'
    ),

    -- Bài 9: Programming
    (
      gen_random_uuid(),
      'TypeScript 5.4: Những tính năng mới đáng chú ý',
      'typescript-5-4-nhung-tinh-nang-moi-dang-chu-y-' || extract(epoch from now())::text,
      '<h2>🔷 TypeScript 5.4 có gì mới?</h2>
<p>TypeScript 5.4 mang đến nhiều cải tiến về type inference và developer experience.</p>

<h2>✨ Preserved Narrowing in Closures</h2>
<pre><code class="language-typescript">function example(x: string | number) {
  if (typeof x === "string") {
    // x is now string
    setTimeout(() => {
      // x is STILL string in TS 5.4!
      console.log(x.toUpperCase());
    }, 100);
  }
}</code></pre>

<h2>✨ NoInfer Utility Type</h2>
<pre><code class="language-typescript">function createStreetLight<C extends string>(
  colors: C[],
  defaultColor: NoInfer<C>
) {
  // defaultColor must be one of colors
}

createStreetLight(["red", "yellow", "green"], "red"); // OK
createStreetLight(["red", "yellow", "green"], "blue"); // Error!</code></pre>

<h2>⚡ Performance Improvements</h2>
<ul>
<li>Faster type checking</li>
<li>Reduced memory usage</li>
<li>Better IDE responsiveness</li>
</ul>',
      'Tổng hợp các tính năng mới trong TypeScript 5.4: NoInfer, Preserved Narrowing và nhiều hơn nữa.',
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1280&h=720&fit=crop',
      '77777777-7777-7777-7777-777777777777',
      author_uuid,
      'approved',
      1089,
      18,
      false,
      ARRAY['TypeScript', 'JavaScript', 'Programming', 'Web Development'],
      NOW() - INTERVAL '10 days',
      NOW() - INTERVAL '11 days',
      NOW() - INTERVAL '10 days'
    ),

    -- Bài 10: DevOps
    (
      gen_random_uuid(),
      'Terraform vs Pulumi: So sánh chi tiết 2026',
      'terraform-vs-pulumi-so-sanh-chi-tiet-2026-' || extract(epoch from now())::text,
      '<h2>🏗️ Infrastructure as Code Battle</h2>
<p>Terraform và Pulumi là hai công cụ IaC phổ biến nhất. Hãy so sánh để chọn tool phù hợp!</p>

<h2>📊 So sánh tổng quan</h2>
<table>
<tr><th>Tiêu chí</th><th>Terraform</th><th>Pulumi</th></tr>
<tr><td>Ngôn ngữ</td><td>HCL</td><td>Python, TS, Go, C#</td></tr>
<tr><td>State Management</td><td>File/Remote</td><td>Pulumi Cloud/Self-hosted</td></tr>
<tr><td>Learning Curve</td><td>Trung bình</td><td>Thấp (nếu biết ngôn ngữ)</td></tr>
<tr><td>Community</td><td>Rất lớn</td><td>Đang phát triển</td></tr>
</table>

<h2>💻 Ví dụ: Tạo S3 Bucket</h2>
<h3>Terraform</h3>
<pre><code class="language-hcl">resource "aws_s3_bucket" "example" {
  bucket = "my-bucket"
  
  tags = {
    Environment = "production"
  }
}</code></pre>

<h3>Pulumi (TypeScript)</h3>
<pre><code class="language-typescript">import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("my-bucket", {
    tags: { Environment: "production" }
});</code></pre>

<h2>🎯 Khi nào dùng gì?</h2>
<ul>
<li><strong>Terraform:</strong> Team DevOps thuần, cần community lớn</li>
<li><strong>Pulumi:</strong> Team dev muốn dùng ngôn ngữ quen thuộc</li>
</ul>',
      'So sánh chi tiết Terraform và Pulumi - hai công cụ Infrastructure as Code phổ biến nhất 2026.',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1280&h=720&fit=crop',
      '22222222-2222-2222-2222-222222222222',
      author_uuid,
      'approved',
      1345,
      21,
      false,
      ARRAY['DevOps', 'Terraform', 'Pulumi', 'IaC', 'Cloud'],
      NOW() - INTERVAL '11 days',
      NOW() - INTERVAL '12 days',
      NOW() - INTERVAL '11 days'
    ),

    -- Bài 11: Docker
    (
      gen_random_uuid(),
      'Docker Compose Watch: Hot Reload cho Development',
      'docker-compose-watch-hot-reload-cho-development-' || extract(epoch from now())::text,
      '<h2>🔥 Vấn đề khi develop với Docker</h2>
<p>Mỗi khi thay đổi code, phải rebuild image và restart container. Docker Compose Watch giải quyết điều này!</p>

<h2>⚙️ Cấu hình docker-compose.yml</h2>
<pre><code class="language-yaml">services:
  web:
    build: .
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json</code></pre>

<h2>🚀 Chạy với Watch mode</h2>
<pre><code class="language-bash">docker compose watch</code></pre>

<h2>📋 Các action types</h2>
<ul>
<li><strong>sync:</strong> Copy files vào container (không restart)</li>
<li><strong>rebuild:</strong> Rebuild image khi file thay đổi</li>
<li><strong>sync+restart:</strong> Sync và restart container</li>
</ul>',
      'Docker Compose Watch - tính năng hot reload giúp development với Docker nhanh hơn.',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1280&h=720&fit=crop',
      '33333333-3333-3333-3333-333333333333',
      author_uuid,
      'approved',
      789,
      14,
      false,
      ARRAY['Docker', 'Docker Compose', 'Development', 'Hot Reload'],
      NOW() - INTERVAL '12 days',
      NOW() - INTERVAL '13 days',
      NOW() - INTERVAL '12 days'
    ),

    -- Bài 12: Linux Troubleshooting
    (
      gen_random_uuid(),
      'Debug "No space left on device" khi disk còn trống 40%',
      'debug-no-space-left-on-device-khi-disk-con-trong-40-' || extract(epoch from now())::text,
      '<h2>❓ Vấn đề lạ</h2>
<p>Bạn gặp lỗi "No space left on device" nhưng <code>df -h</code> hiển thị disk còn 40% trống. Chuyện gì đang xảy ra?</p>

<h2>🔍 Nguyên nhân: Hết Inode!</h2>
<p>Mỗi file trên Linux cần một inode. Khi hết inode, dù còn dung lượng, bạn vẫn không thể tạo file mới.</p>

<h2>📊 Kiểm tra Inode</h2>
<pre><code class="language-bash">df -i

# Output:
# Filesystem      Inodes  IUsed   IFree IUse% Mounted on
# /dev/sda1      1000000 999999       1  100% /</code></pre>

<h2>🔧 Cách khắc phục</h2>
<pre><code class="language-bash"># Tìm thư mục có nhiều file nhỏ
find / -xdev -type f | cut -d "/" -f 2-3 | sort | uniq -c | sort -rn | head -20

# Thường là thư mục session, cache
rm -rf /var/lib/php/sessions/*
rm -rf /tmp/*</code></pre>

<h2>🛡️ Phòng tránh</h2>
<ul>
<li>Setup log rotation</li>
<li>Dọn session files định kỳ</li>
<li>Monitor inode usage với Prometheus/Grafana</li>
</ul>',
      'Hướng dẫn debug và khắc phục lỗi "No space left on device" do hết inode trên Linux.',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1280&h=720&fit=crop',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      2345,
      31,
      false,
      ARRAY['Linux', 'Troubleshooting', 'Disk', 'Inode', 'SysAdmin'],
      NOW() - INTERVAL '13 days',
      NOW() - INTERVAL '14 days',
      NOW() - INTERVAL '13 days'
    );

  RAISE NOTICE '✅ Đã tạo thành công 12 bài viết mẫu!';
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

SELECT 
  title as "Tiêu đề",
  is_featured as "Nổi bật",
  view_count as "Lượt xem",
  comment_count as "Bình luận"
FROM public.articles
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 15;

-- =====================================================
-- SEED 10 BÀI VIẾT TỪ DEVOPS.VN
-- Chạy file này trong Supabase SQL Editor
-- =====================================================

-- Tạo danh mục DevOps nếu chưa có
INSERT INTO public.article_categories (name, slug, description, display_order, is_featured) VALUES
  ('DevOps', 'devops', 'Kiến thức và thực hành DevOps', 1, true),
  ('Docker', 'docker', 'Container hóa ứng dụng với Docker', 2, true),
  ('Database', 'database', 'PostgreSQL, MySQL và các hệ quản trị CSDL', 3, false),
  ('Security', 'security', 'Bảo mật hệ thống và ứng dụng', 4, false),
  ('Linux', 'linux', 'Linux và quản trị hệ thống', 5, false)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Thêm 10 bài viết
DO $$
DECLARE
  author_uuid UUID;
  cat_devops UUID;
  cat_docker UUID;
  cat_database UUID;
  cat_security UUID;
  cat_linux UUID;
BEGIN
  -- Lấy user đầu tiên làm tác giả
  SELECT user_id INTO author_uuid FROM public.profiles LIMIT 1;
  
  IF author_uuid IS NULL THEN
    SELECT id INTO author_uuid FROM auth.users LIMIT 1;
  END IF;
  
  IF author_uuid IS NULL THEN
    RAISE NOTICE 'Không tìm thấy user nào. Vui lòng đăng ký tài khoản trước.';
    RETURN;
  END IF;

  -- Lấy category IDs từ slug
  SELECT id INTO cat_devops FROM public.article_categories WHERE slug = 'devops';
  SELECT id INTO cat_docker FROM public.article_categories WHERE slug = 'docker';
  SELECT id INTO cat_database FROM public.article_categories WHERE slug = 'database';
  SELECT id INTO cat_security FROM public.article_categories WHERE slug = 'security';
  SELECT id INTO cat_linux FROM public.article_categories WHERE slug = 'linux';

  -- Bài 1: Nợ hạ tầng nguy hiểm hơn Nợ kỹ thuật
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Nợ hạ tầng nguy hiểm hơn Nợ kỹ thuật gấp nhiều lần?',
    'no-ha-tang-nguy-hiem-hon-no-ky-thuat-' || extract(epoch from now())::text,
    '<h2>Infrastructure Debt vs Technical Debt</h2>
<p>Nay cuối tuần đàm đạo chút về vấn đề <strong>Debt (nợ)</strong>. Tết nhất đến nơi... Đi đâu cũng thấy tuần này là tuần để ra tết rồi làm.</p>

<h3>1. Chọn sai CIDR cho VPC</h3>
<p>Là món nợ cực khó trả nhưng không phải lúc nào cũng nghiêm trọng. Khi cần mở rộng network hoặc peering VPC thì mới thấy đau.</p>

<h3>2. Chọn sai Primary Key với DynamoDB/Cassandra</h3>
<p>Càng để lâu càng trả giá. Hot partition làm latency tăng, throughput giảm, scale không nổi.</p>

<h3>3. Terraform và IaC không phải cứ đụng là xóa tạo mới</h3>
<p>Nhưng nó phũ ở chỗ làm đúng y như plan. State drift là ác mộng thực sự.</p>

<h3>4. Restore vài TB dữ liệu có thể mất nhiều giờ</h3>
<p>Đó là lý do incident DB luôn đắt. RTO và RPO không phải con số trên giấy.</p>

<h3>5. ClickOps làm hệ thống drift</h3>
<p>Nhưng IaC viết ẩu cũng y chang. Infrastructure Debt là loại nợ trả bằng migration, không trả bằng refactor nhẹ.</p>

<h3>3 việc thực tế để giảm Infrastructure Debt</h3>
<ul>
<li>Document tất cả quyết định kiến trúc (ADR)</li>
<li>Review IaC như review code</li>
<li>Chạy drift detection định kỳ</li>
</ul>',
    'Infrastructure Debt nguy hiểm hơn Technical Debt vì trả bằng migration, không phải refactor nhẹ.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    cat_devops,
    author_uuid,
    'approved',
    1245,
    true,
    ARRAY['DevOps', 'Infrastructure', 'Debt'],
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day'
  );

  -- Bài 2: Tấn công tinh vi vào Nginx
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Cảnh Báo: Tấn công tinh vi vào máy chủ Nginx để điều hướng lưu lượng',
    'canh-bao-tan-cong-nginx-' || extract(epoch from now())::text,
    '<h2>Tổng quan về cuộc tấn công</h2>
<p>DataDog Security Labs vừa phát hiện chiến dịch tấn công mạng mới nhắm vào các máy chủ Nginx.</p>

<h3>Cơ chế tấn công: Configuration Injection</h3>
<p>Kẻ tấn công chèn các directive độc hại vào cấu hình Nginx.</p>

<h3>Bộ công cụ tấn công</h3>
<ul>
<li><strong>zx.sh</strong>: Trình điều khiển khởi tạo</li>
<li><strong>bt.sh</strong>: Tấn công nền tảng Baota</li>
<li><strong>4zdh.sh</strong>: Xử lý cấu hình nâng cao</li>
</ul>

<h3>Hướng dẫn rà soát</h3>
<pre><code>grep -r "include" /etc/nginx/conf.d/</code></pre>',
    'DataDog Security Labs phát hiện chiến dịch tấn công tinh vi nhắm vào Nginx servers.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    cat_security,
    author_uuid,
    'approved',
    2156,
    true,
    ARRAY['Security', 'Nginx', 'Attack'],
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days'
  );

  -- Bài 3: Senior DevOps Interview
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Tâm sự sau buổi phỏng vấn: Giá trị của Senior DevOps là biết dùng nhiều tool?',
    'tam-su-senior-devops-' || extract(epoch from now())::text,
    '<h2>Câu chuyện phỏng vấn</h2>
<p>CV rất wow: K8s, Istio, Linkerd, HashiCorp Vault, ArgoCD, Prometheus...</p>

<h3>1. Nghệ thuật của Senior là Lấy ra, không phải Thêm vào</h3>
<p>Senior thực sự biết khi nào KHÔNG dùng tool.</p>

<h3>2. Càng nhiều tool, diện tích với outage càng rộng</h3>
<p>Mỗi tool thêm vào là thêm một failure point.</p>

<h3>Case study: Bye bye Istio</h3>
<p>Company X có 50 microservices. Deploy Istio để "modern". 6 tháng sau: latency tăng 40ms.</p>',
    'Giá trị của Senior DevOps không phải biết nhiều tool, mà là biết khi nào KHÔNG dùng tool.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    cat_devops,
    author_uuid,
    'approved',
    1823,
    false,
    ARRAY['DevOps', 'Career', 'Interview'],
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '3 days'
  );

  -- Bài 4: TuxMate
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'TuxMate: Trình quản lý cài đặt app tập trung cho Linux',
    'tuxmate-linux-' || extract(epoch from now())::text,
    '<h2>TuxMate có gì?</h2>
<p>TuxMate là công cụ quản lý ứng dụng tập trung cho Linux, hỗ trợ APT, Flatpak, Snap và AppImage.</p>

<h3>Tính năng nổi bật</h3>
<ul>
<li>Giao diện đồ họa trực quan</li>
<li>Hỗ trợ đa nguồn package</li>
<li>Tự động cập nhật theo lịch</li>
</ul>

<h3>Cách dùng</h3>
<pre><code>curl -fsSL https://tuxmate.io/install.sh | bash
tuxmate search vscode
tuxmate install vscode --source=snap</code></pre>',
    'TuxMate - công cụ quản lý ứng dụng tập trung cho Linux.',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
    cat_linux,
    author_uuid,
    'approved',
    987,
    false,
    ARRAY['Linux', 'Tools'],
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '4 days'
  );

  -- Bài 5: Git Commit Convention
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Cách Viết Git Commit Convention Chuẩn Chỉnh',
    'git-commit-convention-' || extract(epoch from now())::text,
    '<h2>Tại Sao Cần Git Commit Convention?</h2>
<ul>
<li>Dễ trace bug, rollback</li>
<li>Auto generate changelog</li>
<li>Team dễ review hơn</li>
</ul>

<h3>Các Loại Commit Phổ Biến</h3>
<p><strong>feat</strong>: Tính năng mới</p>
<p><strong>fix</strong>: Sửa bug</p>
<p><strong>docs</strong>: Thay đổi documentation</p>
<p><strong>refactor</strong>: Refactor code</p>

<h3>Công Cụ Hỗ Trợ</h3>
<ul>
<li><strong>commitlint</strong>: Validate commit message</li>
<li><strong>husky</strong>: Git hooks</li>
</ul>',
    'Hướng dẫn viết Git Commit Convention chuẩn.',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
    cat_devops,
    author_uuid,
    'approved',
    1567,
    false,
    ARRAY['Git', 'DevOps', 'Convention'],
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '5 days'
  );

  -- Bài 6: Windows on Docker
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Cách chạy Windows trên Docker (Container/Kubernetes)',
    'windows-tren-docker-' || extract(epoch from now())::text,
    '<h2>Lợi ích khi sử dụng Windows trên Docker</h2>
<ul>
<li>Testing ứng dụng Windows trong CI/CD</li>
<li>Không cần máy vật lý Windows</li>
<li>Dễ dàng spawn/destroy môi trường test</li>
</ul>

<h3>Cài đặt</h3>
<pre><code>sudo apt install qemu-kvm libvirt-daemon-system
sudo modprobe kvm</code></pre>

<h3>Docker Compose</h3>
<pre><code>services:
  windows:
    image: dockurr/windows
    environment:
      VERSION: "win11"
    devices:
      - /dev/kvm</code></pre>',
    'Hướng dẫn cài đặt Windows trên Docker sử dụng KVM/QEMU virtualization.',
    'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800',
    cat_docker,
    author_uuid,
    'approved',
    2345,
    false,
    ARRAY['Docker', 'Windows', 'Virtualization'],
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days'
  );

  -- Bài 7: PostgreSQL HA with Patroni
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Triển khai PostgreSQL High Availability với Patroni trên Ubuntu',
    'postgresql-ha-patroni-' || extract(epoch from now())::text,
    '<h2>PostgreSQL HA với Patroni</h2>
<p>Tài liệu thực tế về thiết lập cụm PostgreSQL high availability.</p>

<h3>Kiến trúc</h3>
<ul>
<li>3 node PostgreSQL (1 leader, 2 replica)</li>
<li>etcd cluster cho consensus</li>
<li>HAProxy cho load balancing</li>
<li>Keepalived cho VIP</li>
</ul>

<h3>Cài đặt PostgreSQL 15</h3>
<pre><code>sudo apt install postgresql-15</code></pre>

<h3>Configure Patroni</h3>
<pre><code>scope: postgres-cluster
namespace: /db/
name: postgres1

restapi:
  listen: 0.0.0.0:8008</code></pre>',
    'Hướng dẫn chi tiết triển khai PostgreSQL High Availability với Patroni.',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    cat_database,
    author_uuid,
    'approved',
    3456,
    true,
    ARRAY['PostgreSQL', 'Database', 'High Availability'],
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '7 days'
  );

  -- Bài 8: macOS on Docker
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Cách cài đặt macOS bằng Docker',
    'macos-tren-docker-' || extract(epoch from now())::text,
    '<h2>macOS trên Docker?</h2>
<p>Nếu bạn muốn có macOS để dùng vài tiếng mà không cần máy Mac thật.</p>

<h3>Lợi ích</h3>
<ul>
<li>Testing iOS/macOS apps</li>
<li>Build Xcode projects trong CI/CD</li>
</ul>

<h3>Cài đặt</h3>
<pre><code>services:
  macos:
    image: dockurr/macos
    environment:
      VERSION: "sonoma"
    devices:
      - /dev/kvm
    ports:
      - 8006:8006</code></pre>',
    'Hướng dẫn cài đặt macOS trên Docker sử dụng KVM virtualization.',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    cat_docker,
    author_uuid,
    'approved',
    1890,
    false,
    ARRAY['Docker', 'macOS', 'Development'],
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '8 days'
  );

  -- Bài 9: PruneMate
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'PruneMate: Tool dọn rác Docker an toàn, tự động theo lịch',
    'prunemate-docker-' || extract(epoch from now())::text,
    '<h2>PruneMate là gì?</h2>
<p>Web UI gọn nhẹ giúp dọn rác Docker không sợ toang.</p>

<h3>Tính năng</h3>
<ul>
<li>Prune preview - xem trước</li>
<li>Lên lịch dọn rác tự động</li>
<li>Thống kê dung lượng đã giải phóng</li>
<li>Gửi thông báo (Slack, Discord)</li>
</ul>

<h3>Cài đặt</h3>
<pre><code>services:
  prunemate:
    image: prunemate/prunemate
    ports:
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock</code></pre>',
    'PruneMate - web UI dọn rác Docker an toàn với preview và lên lịch tự động.',
    'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    cat_docker,
    author_uuid,
    'approved',
    1234,
    false,
    ARRAY['Docker', 'Tools', 'Cleanup'],
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '9 days'
  );

  -- Bài 10: JWT Benchmark
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'HS256 vs RS256 vs ES256: Benchmark JWT verification',
    'jwt-benchmark-' || extract(epoch from now())::text,
    '<h2>Tại sao benchmark JWT?</h2>
<p>Cần câu trả lời cho production, không cần độ chính xác như paper.</p>

<h3>Thời gian verify</h3>
<p><strong>HS256</strong>: ~5μs</p>
<p><strong>RS256</strong>: ~50μs</p>
<p><strong>ES256</strong>: ~100μs</p>

<h3>Kết quả ở 30k rps</h3>
<ul>
<li><strong>HS256</strong>: p99 = 2ms, CPU 40%</li>
<li><strong>RS256</strong>: p99 = 15ms, CPU 85%</li>
<li><strong>ES256</strong>: p99 = 25ms, CPU 95%</li>
</ul>

<h3>Khi nào dùng gì?</h3>
<ul>
<li><strong>HS256</strong>: Internal services</li>
<li><strong>RS256</strong>: External APIs</li>
<li><strong>ES256</strong>: High security</li>
</ul>',
    'Benchmark chi tiết HS256 vs RS256 vs ES256 cho JWT verification.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    cat_security,
    author_uuid,
    'approved',
    2678,
    false,
    ARRAY['Security', 'JWT', 'Benchmark'],
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '11 days',
    NOW() - INTERVAL '10 days'
  );

  RAISE NOTICE '✅ Đã import thành công 10 bài viết từ devops.vn!';
END $$;

-- Cập nhật số lượng bài viết cho mỗi category
UPDATE public.article_categories ac
SET article_count = (
  SELECT COUNT(*) FROM public.articles a 
  WHERE a.category_id = ac.id AND a.status = 'approved'
);

-- Kiểm tra kết quả
SELECT 
  title as "Tiêu đề",
  status as "Trạng thái",
  view_count as "Lượt xem"
FROM public.articles
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 12;

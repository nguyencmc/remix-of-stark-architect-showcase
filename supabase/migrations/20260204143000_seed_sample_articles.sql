-- Seed sample articles from DevOps.vn style content

-- First, create article categories
INSERT INTO public.article_categories (id, name, slug, description, display_order, is_featured) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Linux', 'linux', 'Bài viết về hệ điều hành Linux', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'DevOps', 'devops', 'CI/CD, Automation, Infrastructure', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'Docker', 'docker', 'Container và Docker', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'Kubernetes', 'kubernetes', 'Orchestration với K8s', 4, false),
  ('55555555-5555-5555-5555-555555555555', 'Security', 'security', 'Bảo mật hệ thống', 5, false),
  ('66666666-6666-6666-6666-666666666666', 'Cloud', 'cloud', 'AWS, GCP, Azure', 6, false)
ON CONFLICT (id) DO NOTHING;

-- Get a sample author_id (use first admin user or create placeholder)
DO $$
DECLARE
  author_uuid UUID;
BEGIN
  -- Try to get an existing user
  SELECT user_id INTO author_uuid FROM public.profiles LIMIT 1;
  
  -- If no user exists, we'll use a placeholder (requires at least one user in system)
  IF author_uuid IS NULL THEN
    RAISE NOTICE 'No users found in profiles table. Please create a user first.';
    RETURN;
  END IF;

  -- Insert sample articles
  INSERT INTO public.articles (id, title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, comment_count, is_featured, tags, published_at)
  VALUES
    -- Article 1 - Featured
    (
      gen_random_uuid(),
      'TuxMate: Trình quản lý cài đặt app tập trung cho Linux',
      'tuxmate-trinh-quan-ly-cai-dat-app-tap-trung-cho-linux',
      '<h2>Giới thiệu TuxMate</h2>
<p>TuxMate là một công cụ quản lý ứng dụng tập trung cho Linux, giúp bạn dễ dàng cài đặt, cập nhật và gỡ bỏ các ứng dụng từ nhiều nguồn khác nhau như APT, Flatpak, Snap và AppImage.</p>

<h2>Tính năng nổi bật</h2>
<ul>
<li>Giao diện đồ họa trực quan, dễ sử dụng</li>
<li>Hỗ trợ đa nguồn package: APT, Flatpak, Snap, AppImage</li>
<li>Tự động cập nhật ứng dụng</li>
<li>Quản lý phụ thuộc thông minh</li>
</ul>

<h2>Cài đặt</h2>
<pre><code>curl -fsSL https://tuxmate.io/install.sh | bash</code></pre>

<p>TuxMate là lựa chọn tuyệt vời cho những ai muốn đơn giản hóa việc quản lý ứng dụng trên Linux.</p>',
      'TuxMate là công cụ quản lý ứng dụng tập trung cho Linux, hỗ trợ APT, Flatpak, Snap và AppImage.',
      'https://devops.vn/uploads/images/2026/01/019bf0af-b7d5-74ef-92c1-44b43abbe2aa.webp',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      245,
      12,
      true,
      ARRAY['Linux', 'Tools', 'Package Manager'],
      NOW() - INTERVAL '2 days'
    ),
    
    -- Article 2
    (
      gen_random_uuid(),
      'Updo: Tool monitoring gọn nhẹ ngay trong terminal',
      'updo-tool-monitoring-gon-nhe-ngay-trong-terminal',
      '<h2>Updo là gì?</h2>
<p>Updo là một công cụ monitoring nhẹ nhàng, chạy trực tiếp trong terminal, giúp bạn theo dõi tình trạng các services và endpoints một cách dễ dàng.</p>

<h2>Cài đặt Updo</h2>
<pre><code>go install github.com/Owloops/updo@latest</code></pre>

<h2>Cách sử dụng</h2>
<pre><code>updo --urls https://api.example.com,https://web.example.com</code></pre>

<p>Updo hiển thị realtime status của các URL, thời gian phản hồi và lịch sử uptime.</p>',
      'Updo là tool monitoring gọn nhẹ chạy trong terminal, giúp theo dõi services và endpoints.',
      'https://devops.vn/uploads/images/2026/01/019bebb1-eb88-7821-b6ef-3d836e802eff.webp',
      '22222222-2222-2222-2222-222222222222',
      author_uuid,
      'approved',
      189,
      8,
      false,
      ARRAY['Monitoring', 'DevOps', 'Terminal'],
      NOW() - INTERVAL '3 days'
    ),
    
    -- Article 3
    (
      gen_random_uuid(),
      'Vanish: Dọn rác không run tay, chuyển vào cache rồi muốn thì restore',
      'vanish-don-rac-khong-run-tay-chuyen-vao-cache-roi-muon-thi-restore',
      '<h2>Vanish - Safe Delete Tool</h2>
<p>Vanish là công cụ giúp bạn xóa file an toàn bằng cách di chuyển vào cache thay vì xóa vĩnh viễn. Bạn có thể restore lại bất cứ lúc nào.</p>

<h2>Tại sao nên dùng Vanish?</h2>
<ul>
<li>Tránh xóa nhầm file quan trọng</li>
<li>Dễ dàng khôi phục</li>
<li>Tự động dọn dẹp cache theo thời gian</li>
</ul>

<h2>Sử dụng</h2>
<pre><code>vanish remove myfile.txt
vanish list
vanish restore myfile.txt</code></pre>',
      'Vanish giúp xóa file an toàn bằng cách di chuyển vào cache, có thể restore lại khi cần.',
      'https://devops.vn/uploads/images/2026/01/923bb80d-f6bd-4908-8933-9ccef19a29f7.webp',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      156,
      5,
      false,
      ARRAY['Linux', 'Tools', 'Utilities'],
      NOW() - INTERVAL '4 days'
    ),
    
    -- Article 4 - Featured
    (
      gen_random_uuid(),
      'Asahi Linux: Chạy mượt Linux trên Apple M3, M4 và M5',
      'asahi-linux-chay-muot-linux-tren-apple-m3-m4-va-m5',
      '<h2>Asahi Linux cho Apple Silicon</h2>
<p>Asahi Linux đã đạt được milestone quan trọng với việc hỗ trợ đầy đủ chip Apple M3, M4 và thậm chí là M5. Đây là tin vui cho những ai muốn chạy Linux trên MacBook.</p>

<h2>Tính năng được hỗ trợ</h2>
<ul>
<li>GPU acceleration hoàn chỉnh</li>
<li>Thunderbolt/USB4</li>
<li>WiFi và Bluetooth</li>
<li>Touch Bar (trên model hỗ trợ)</li>
<li>Speakers và microphone</li>
</ul>

<h2>Cài đặt</h2>
<pre><code>curl https://alx.sh | sh</code></pre>

<p>Với Asahi Linux, bạn có thể tận dụng sức mạnh của Apple Silicon cùng với tự do của Linux.</p>',
      'Asahi Linux đã hỗ trợ đầy đủ Apple M3, M4 và M5 với GPU acceleration, WiFi, Bluetooth.',
      'https://devops.vn/uploads/images/2026/01/c5a7e2a3-5d31-48d7-8662-98a3cf5680f5.webp',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      523,
      34,
      true,
      ARRAY['Linux', 'Apple', 'Hardware'],
      NOW() - INTERVAL '5 days'
    ),
    
    -- Article 5
    (
      gen_random_uuid(),
      'Snitch: Debug network trên Linux nhanh và trực quan',
      'snitch-debug-network-linux',
      '<h2>Snitch - Network Debugging Tool</h2>
<p>Snitch là công cụ giúp bạn debug các vấn đề network trên Linux một cách nhanh chóng và trực quan. Thay vì phải dùng nhiều lệnh phức tạp, Snitch tổng hợp tất cả thông tin cần thiết.</p>

<h2>Tính năng</h2>
<ul>
<li>Hiển thị tất cả connections đang hoạt động</li>
<li>Filter theo process, port, protocol</li>
<li>Realtime monitoring</li>
<li>Export kết quả</li>
</ul>

<pre><code>snitch --process nginx
snitch --port 443 --protocol tcp</code></pre>',
      'Snitch giúp debug network trên Linux nhanh chóng với giao diện trực quan.',
      'https://devops.vn/uploads/images/2025/12/c61b04fb-abd2-4e07-95ba-fc5778515e75.webp',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      201,
      15,
      false,
      ARRAY['Linux', 'Network', 'Debugging'],
      NOW() - INTERVAL '6 days'
    ),
    
    -- Article 6
    (
      gen_random_uuid(),
      'Jenkins thay đổi Signing Key cho Linux Repository',
      'jenkins-thay-doi-signing-key-cho-linux-repository',
      '<h2>Thông báo quan trọng từ Jenkins</h2>
<p>Jenkins đã thông báo thay đổi Signing Key cho Linux Repository. Nếu bạn đang sử dụng Jenkins qua apt hoặc yum, cần cập nhật key mới.</p>

<h2>Cách cập nhật</h2>
<h3>Debian/Ubuntu</h3>
<pre><code>curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2026.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null</code></pre>

<h3>RHEL/CentOS</h3>
<pre><code>sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io-2026.key</code></pre>

<p>Hãy cập nhật ngay để tránh lỗi khi update Jenkins.</p>',
      'Jenkins thay đổi Signing Key - hướng dẫn cập nhật cho Debian/Ubuntu và RHEL/CentOS.',
      'https://devops.vn/uploads/images/2025/12/1aa129aa-88de-4e5c-b24c-afae7c9ae95a.webp',
      '22222222-2222-2222-2222-222222222222',
      author_uuid,
      'approved',
      312,
      18,
      false,
      ARRAY['Jenkins', 'DevOps', 'CI/CD'],
      NOW() - INTERVAL '7 days'
    ),
    
    -- Article 7
    (
      gen_random_uuid(),
      'Hệ thống báo lỗi "No space left on device" dù Disk Space còn trống 40%',
      'he-thong-bao-loi-no-space-left-on-device-du-disk-space-con-trong-40',
      '<h2>Vấn đề</h2>
<p>Bạn gặp lỗi "No space left on device" nhưng khi kiểm tra df -h thì disk vẫn còn 40% trống. Đây là vấn đề phổ biến liên quan đến inode.</p>

<h2>Nguyên nhân</h2>
<p>Mỗi filesystem có giới hạn số lượng inode. Khi hết inode, dù còn dung lượng, bạn vẫn không thể tạo file mới.</p>

<h2>Kiểm tra inode</h2>
<pre><code>df -i</code></pre>

<h2>Giải pháp</h2>
<ol>
<li>Tìm và xóa các file nhỏ không cần thiết</li>
<li>Xóa các session/cache files cũ</li>
<li>Dọn dẹp thư mục /tmp</li>
</ol>

<pre><code>find /var -xdev -type f | cut -d "/" -f 2-3 | sort | uniq -c | sort -rn | head -20</code></pre>',
      'Giải thích và khắc phục lỗi "No space left on device" khi disk vẫn còn trống do hết inode.',
      'https://devops.vn/uploads/images/2025/12/efa3f0d7-a847-4918-9d25-0cb28b73e674.webp',
      '11111111-1111-1111-1111-111111111111',
      author_uuid,
      'approved',
      478,
      25,
      true,
      ARRAY['Linux', 'Troubleshooting', 'Disk'],
      NOW() - INTERVAL '8 days'
    ),
    
    -- Article 8
    (
      gen_random_uuid(),
      'Docker Compose v2: Những thay đổi quan trọng cần biết',
      'docker-compose-v2-nhung-thay-doi-quan-trong-can-biet',
      '<h2>Docker Compose v2 là gì?</h2>
<p>Docker Compose v2 được viết lại bằng Go (thay vì Python) và tích hợp trực tiếp vào Docker CLI với lệnh "docker compose" (không còn dấu gạch ngang).</p>

<h2>Những thay đổi chính</h2>
<ul>
<li>Lệnh mới: docker compose thay cho docker-compose</li>
<li>Hiệu năng tốt hơn</li>
<li>Build context improvements</li>
<li>Profiles support</li>
</ul>

<h2>Migration</h2>
<pre><code># Cũ
docker-compose up -d

# Mới
docker compose up -d</code></pre>

<p>Nên migrate sớm vì docker-compose (v1) đã không còn được maintain.</p>',
      'Hướng dẫn migrate từ Docker Compose v1 sang v2 và những thay đổi quan trọng.',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1280&h=720&fit=crop',
      '33333333-3333-3333-3333-333333333333',
      author_uuid,
      'approved',
      289,
      16,
      false,
      ARRAY['Docker', 'DevOps', 'Container'],
      NOW() - INTERVAL '9 days'
    ),
    
    -- Article 9
    (
      gen_random_uuid(),
      'Kubernetes 1.30: Những tính năng mới đáng chú ý',
      'kubernetes-1-30-nhung-tinh-nang-moi-dang-chu-y',
      '<h2>Kubernetes 1.30 Release</h2>
<p>Kubernetes 1.30 mang đến nhiều cải tiến quan trọng về performance, security và developer experience.</p>

<h2>Tính năng mới</h2>
<ul>
<li><strong>Structured Authentication Config</strong>: Cấu hình authentication dễ dàng hơn</li>
<li><strong>CEL for Admission Control</strong>: Sử dụng CEL thay vì webhook</li>
<li><strong>Pod Scheduling Readiness</strong>: Improved scheduling</li>
<li><strong>VolumeAttributesClass</strong>: Dynamic volume provisioning</li>
</ul>

<h2>Upgrade</h2>
<pre><code>kubectl version
kubeadm upgrade plan
kubeadm upgrade apply v1.30.0</code></pre>',
      'Tổng hợp các tính năng mới trong Kubernetes 1.30 và hướng dẫn upgrade.',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1280&h=720&fit=crop',
      '44444444-4444-4444-4444-444444444444',
      author_uuid,
      'approved',
      345,
      22,
      false,
      ARRAY['Kubernetes', 'DevOps', 'Cloud'],
      NOW() - INTERVAL '10 days'
    ),
    
    -- Article 10
    (
      gen_random_uuid(),
      'Bảo mật SSH: 10 Best Practices không thể bỏ qua',
      'bao-mat-ssh-10-best-practices-khong-the-bo-qua',
      '<h2>Tại sao cần bảo mật SSH?</h2>
<p>SSH là cửa ngõ chính vào server. Một cấu hình SSH yếu có thể dẫn đến bị tấn công toàn bộ hệ thống.</p>

<h2>10 Best Practices</h2>
<ol>
<li>Disable root login</li>
<li>Sử dụng SSH key thay vì password</li>
<li>Đổi port mặc định (22)</li>
<li>Giới hạn users được phép SSH</li>
<li>Enable 2FA</li>
<li>Set connection timeout</li>
<li>Disable empty passwords</li>
<li>Use SSH Protocol 2 only</li>
<li>Enable logging</li>
<li>Regular key rotation</li>
</ol>

<h2>Cấu hình mẫu /etc/ssh/sshd_config</h2>
<pre><code>PermitRootLogin no
PasswordAuthentication no
Port 2222
AllowUsers devops admin</code></pre>',
      '10 best practices bảo mật SSH mà mọi sysadmin cần biết.',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop',
      '55555555-5555-5555-5555-555555555555',
      author_uuid,
      'approved',
      567,
      31,
      true,
      ARRAY['Security', 'SSH', 'Linux'],
      NOW() - INTERVAL '11 days'
    );

  RAISE NOTICE 'Successfully seeded 10 sample articles!';
END $$;

-- Update article counts for categories
UPDATE public.article_categories ac
SET article_count = (
  SELECT COUNT(*) FROM public.articles a 
  WHERE a.category_id = ac.id AND a.status = 'approved'
);

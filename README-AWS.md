# Deploy lên AWS S3 + CloudFront

App này là **React SPA thuần tĩnh** (Vite build) — không có server-side code.  
Supabase xử lý toàn bộ backend (DB, Auth, Storage) qua JS SDK.

---

## Kiến trúc

```
User → CloudFront (HTTPS, SSL) → S3 Bucket (static files)
```

> **Bắt buộc dùng CloudFront** vì:
> 1. S3 không hỗ trợ HTTPS với custom domain
> 2. App dùng `BrowserRouter` — khi refresh URL như `/exam/abc/take`, S3 trả 403.  
>    CloudFront Custom Error Pages sẽ redirect về `index.html` để React Router xử lý.

---

## Bước 1: Tạo S3 Bucket

```bash
aws s3 mb s3://TEN_BUCKET_CUA_BAN --region ap-southeast-1
```

### Cấu hình Static Website Hosting

```bash
aws s3 website s3://TEN_BUCKET_CUA_BAN \
  --index-document index.html \
  --error-document index.html
```

> `error-document` trỏ về `index.html` để React Router xử lý 404.

### Bucket Policy (cho phép CloudFront đọc)

Vào **S3 → Bucket → Permissions → Bucket Policy**, dán:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::TEN_BUCKET_CUA_BAN/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/CLOUDFRONT_ID"
        }
      }
    }
  ]
}
```

**Lưu ý**: Nếu dùng OAI (cũ hơn) thay vì OAC:
```json
"Principal": { "CanonicalUser": "CLOUDFRONT_OAI_S3_CANONICAL_USER_ID" }
```

---

## Bước 2: Tạo CloudFront Distribution

Vào **CloudFront → Create Distribution**:

| Setting | Giá trị |
|---------|---------|
| **Origin Domain** | `TEN_BUCKET.s3.ap-southeast-1.amazonaws.com` |
| **Origin Access** | Origin access control (OAC) — tạo mới |
| **Viewer Protocol Policy** | Redirect HTTP to HTTPS |
| **Allowed HTTP Methods** | GET, HEAD |
| **Cache Policy** | CachingOptimized |
| **Compress objects** | Yes |
| **Alternate domain names (CNAMEs)** | `yourdomain.com`, `www.yourdomain.com` |
| **Custom SSL Certificate** | Chọn cert từ ACM (phải tạo ở region **us-east-1**) |
| **Default Root Object** | `index.html` |

### ⚠️ Custom Error Pages — Quan trọng nhất

Vào tab **Error Pages** → **Create custom error response**:

| HTTP Error Code | TTL | Response Page Path | HTTP Response Code |
|----------------|-----|-------------------|-------------------|
| 403 | 0 | `/index.html` | 200 |
| 404 | 0 | `/index.html` | 200 |

> Đây là cấu hình giúp React Router hoạt động đúng khi user **refresh** hoặc **truy cập URL trực tiếp**.

---

## Bước 3: SSL Certificate (ACM)

1. Vào **AWS Certificate Manager** → **region us-east-1** (bắt buộc cho CloudFront)
2. **Request a certificate** → nhập domain
3. Validate qua DNS (thêm CNAME vào DNS của bạn)
4. Quay lại CloudFront chọn cert vừa tạo

---

## Bước 4: Deploy

### Cài AWS CLI

```bash
# macOS
brew install awscli

# Cấu hình credentials
aws configure
# AWS Access Key ID: ...
# AWS Secret Access Key: ...
# Default region: ap-southeast-1
# Default output format: json
```

### Thêm vào `.env`

```env
AWS_S3_BUCKET=ten-bucket-cua-ban
AWS_CLOUDFRONT_ID=E1XXXXXXXXXXX
AWS_REGION=ap-southeast-1
```

### Chạy deploy

```bash
chmod +x deploy-s3.sh
./deploy-s3.sh
```

Hoặc không dùng `.env`:

```bash
S3_BUCKET=ten-bucket CDN_ID=E1XXXXX ./deploy-s3.sh
```

---

## Chiến lược Cache

Script tự động phân loại:

| File | Cache-Control | Lý do |
|------|--------------|-------|
| `index.html` | `no-cache` | Luôn lấy mới nhất để load đúng JS chunk |
| `assets/*.js`, `*.css` | `public, max-age=31536000, immutable` | Vite đặt content hash vào tên file |
| Ảnh, fonts | `public, max-age=31536000, immutable` | Không thay đổi nếu content không đổi |

---

## So sánh với setup Nginx hiện tại

| | Nginx (VPS) | S3 + CloudFront |
|--|-------------|----------------|
| Chi phí | ~$5–20/tháng VPS | ~$1–5/tháng (tùy traffic) |
| Scale | Manual | Tự động, global CDN |
| SSL | Let's Encrypt (tự gia hạn) | ACM (miễn phí, tự gia hạn) |
| Config SPA routing | `try_files $uri /index.html` | CloudFront Custom Error Pages |
| Deploy | `scp` + `rsync` | `aws s3 sync` |
| Uptime SLA | Phụ thuộc VPS | 99.99% CloudFront |

---

## Troubleshooting

### Refresh trang bị 403/404
→ Kiểm tra **Custom Error Pages** trong CloudFront đã cấu hình chưa.

### Sau deploy vẫn thấy code cũ
→ Chờ CloudFront invalidation hoàn thành (~30–60 giây), hoặc:
```bash
aws cloudfront create-invalidation --distribution-id E1XXXXX --paths "/*"
```

### Supabase CORS error
→ Vào Supabase Dashboard → Settings → API → thêm CloudFront domain vào **Allowed Origins**.

### Ảnh upload lên Supabase Storage không hiển thị
→ Kiểm tra Supabase Storage bucket policy cho phép public read.

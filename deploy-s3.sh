#!/bin/bash
# =============================================================================
# Deploy Script for AWS S3 + CloudFront
# =============================================================================
# Prerequisites:
#   - AWS CLI installed & configured (aws configure)
#   - S3 bucket created
#   - CloudFront distribution created (see README-AWS.md)
#
# Usage:
#   S3_BUCKET=my-bucket CDN_ID=E1XXXXX ./deploy-s3.sh
# Or set vars in .env:
#   AWS_S3_BUCKET=...
#   AWS_CLOUDFRONT_ID=...
# =============================================================================

set -e

# ── Colors ──
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

# ── Load .env if exists ──
if [ -f ".env" ]; then
  set -a; source .env; set +a
fi

# ── Config (env vars override) ──
BUCKET="${S3_BUCKET:-${AWS_S3_BUCKET:-}}"
CDN_ID="${CDN_ID:-${AWS_CLOUDFRONT_ID:-}}"
BUILD_DIR="dist"
REGION="${AWS_REGION:-ap-southeast-1}"

# ── Validate ──
if [ -z "$BUCKET" ]; then
  echo -e "${RED}Error: S3_BUCKET or AWS_S3_BUCKET is not set.${NC}"
  echo "Usage: S3_BUCKET=my-bucket CDN_ID=E1XXXXX ./deploy-s3.sh"
  exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy → S3: s3://$BUCKET${NC}"
[ -n "$CDN_ID" ] && echo -e "${GREEN}  Invalidate CloudFront: $CDN_ID${NC}"
echo -e "${GREEN}========================================${NC}"

# ── Step 1: Build ──
echo -e "\n${YELLOW}[1/4] Building production bundle...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"

# ── Step 2: Sync to S3 ──
echo -e "\n${YELLOW}[2/4] Uploading to S3...${NC}"

# Upload index.html with no-cache (always fresh)
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html" \
  --region "$REGION"

# Upload all assets with long-term cache (Vite adds content hash to filenames)
aws s3 sync "$BUILD_DIR" "s3://$BUCKET" \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable" \
  --delete \
  --region "$REGION"

echo -e "${GREEN}✓ Upload complete${NC}"

# ── Step 3: CloudFront Invalidation ──
if [ -n "$CDN_ID" ]; then
  echo -e "\n${YELLOW}[3/4] Invalidating CloudFront cache...${NC}"
  INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CDN_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)
  echo -e "${GREEN}✓ Invalidation created: $INVALIDATION_ID${NC}"
else
  echo -e "\n${YELLOW}[3/4] Skipping CloudFront invalidation (CDN_ID not set)${NC}"
fi

# ── Step 4: Done ──
echo -e "\n${YELLOW}[4/4] Summary${NC}"
echo -e "${GREEN}✓ Deployed to: https://$BUCKET.s3-website-$REGION.amazonaws.com${NC}"
[ -n "$CDN_ID" ] && echo -e "${GREEN}✓ CloudFront will serve updates within ~1 minute${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy successful!${NC}"
echo -e "${GREEN}========================================${NC}"

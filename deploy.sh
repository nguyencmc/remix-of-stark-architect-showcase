#!/bin/bash

# =============================================================================
# Deploy Script for MyExamTest
# =============================================================================
# Usage: ./deploy.sh [environment]
# Environments: production (default), staging
# =============================================================================

set -e  # Exit on error

# Ensure sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo "sshpass could not be found. Please install it first."
    echo "Mac: brew install sshpass"
    echo "Linux: sudo apt-get install sshpass"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BUILD_DIR="dist"
REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-your-server.com}"
REMOTE_PORT="${DEPLOY_PORT:-22}"
REMOTE_PASS="${DEPLOY_PASS:-}"
REMOTE_PATH="${DEPLOY_PATH:-/var/www/myexamtest}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploying MyExamTest - ${ENVIRONMENT}${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Check environment file
echo -e "\n${YELLOW}[1/5] Checking environment...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Verify Supabase variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}Error: Supabase environment variables not set!${NC}"
    echo "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}"

# Step 2: Install dependencies
echo -e "\n${YELLOW}[2/5] Installing dependencies...${NC}"
npm ci --silent

# Step 3: Build the project
echo -e "\n${YELLOW}[3/5] Building project...${NC}"
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Error: Build failed - $BUILD_DIR directory not found!${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"

# Step 4: Deploy to server
echo -e "\n${YELLOW}[4/5] Deploying to server...${NC}"

# Check if we have SSH access
if [ -z "$DEPLOY_HOST" ] || [ "$DEPLOY_HOST" == "your-server.com" ]; then
    echo -e "${YELLOW}Skipping remote deploy - DEPLOY_HOST not configured${NC}"
    echo "Set environment variables: DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH"
    echo -e "\nBuild output is ready in: ${GREEN}./$BUILD_DIR${NC}"
else
    # Check if password is provided
    if [ -n "$REMOTE_PASS" ]; then
        echo -e "${YELLOW}Using password authentication...${NC}"
        export SSHPASS="$REMOTE_PASS"
        SSH_CMD="sshpass -e ssh -p $REMOTE_PORT"
        RSYNC_CMD="sshpass -e rsync"
    else
        echo -e "${YELLOW}Using key-based authentication...${NC}"
        SSH_CMD="ssh -p $REMOTE_PORT"
        RSYNC_CMD="rsync"
    fi

    # Create remote directory if not exists
    $SSH_CMD ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_PATH}"
    
    # Sync build files to server
    if [ -n "$REMOTE_PASS" ]; then
         # For sshpass, we need to pass the ssh command with port inside -e
         $RSYNC_CMD -avz --delete \
            --exclude '.git' \
            --exclude 'node_modules' \
            -e "ssh -p $REMOTE_PORT" \
            ./${BUILD_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
    else
         $RSYNC_CMD -avz --delete \
            --exclude '.git' \
            --exclude 'node_modules' \
            -e "ssh -p $REMOTE_PORT" \
            ./${BUILD_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
    fi
     
    echo -e "${GREEN}Files synced to ${REMOTE_HOST}:${REMOTE_PATH}${NC}"
fi

# Step 5: Done
echo -e "\n${YELLOW}[5/5] Deployment complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment finished successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

# Print deployment info
echo -e "\n${YELLOW}Deployment Info:${NC}"
echo "  Environment: $ENVIRONMENT"
echo "  Build Dir:   $BUILD_DIR"
if [ ! -z "$DEPLOY_HOST" ] && [ "$DEPLOY_HOST" != "your-server.com" ]; then
    echo "  Server:      ${REMOTE_USER}@${REMOTE_HOST}"
    echo "  Path:        ${REMOTE_PATH}"
fi

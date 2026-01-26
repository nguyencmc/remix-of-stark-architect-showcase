#!/bin/bash

# =============================================================================
# Install Git Hooks Script
# =============================================================================
# Cài đặt git hooks cho dự án
# Usage: ./install-hooks.sh
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Installing Git Hooks${NC}"
echo -e "${BLUE}========================================${NC}"

# Get repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$REPO_ROOT" ]; then
    echo -e "${RED}Error: Not a git repository!${NC}"
    exit 1
fi

cd "$REPO_ROOT"

# Method 1: Configure git to use custom hooks directory
echo -e "\n${YELLOW}Setting up git hooks directory...${NC}"
git config core.hooksPath .githooks

# Make hooks executable
echo -e "${YELLOW}Making hooks executable...${NC}"
chmod +x .githooks/*

echo -e "\n${GREEN}✓ Git hooks installed successfully!${NC}"
echo -e "\n${YELLOW}Available hooks:${NC}"
ls -la .githooks/

echo -e "\n${YELLOW}Configuration:${NC}"
echo -e "  • ${GREEN}AUTO_DEPLOY=true${NC}     - Enable auto deploy on commit"
echo -e "  • ${GREEN}AUTO_DEPLOY_ON_PUSH=true${NC} - Enable auto deploy on push (default)"
echo -e "  • ${GREEN}DEPLOY_BRANCH=main${NC}  - Branch to deploy from"

echo -e "\n${YELLOW}Environment variables for deploy.sh:${NC}"
echo -e "  • ${GREEN}DEPLOY_USER${NC}  - SSH username (default: root)"
echo -e "  • ${GREEN}DEPLOY_HOST${NC}  - Server hostname"
echo -e "  • ${GREEN}DEPLOY_PATH${NC}  - Remote path (default: /var/www/myexamtest)"

echo -e "\n${YELLOW}Usage:${NC}"
echo -e "  1. Set environment variables in .env or export them"
echo -e "  2. Commit as normal - deploy will run automatically"
echo -e "  3. Add ${GREEN}[skip deploy]${NC} to commit message to skip deployment"
echo -e "  4. Add ${GREEN}[deploy]${NC} to commit message to force deployment"

echo -e "\n${BLUE}========================================${NC}"

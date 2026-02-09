#!/bin/bash

# Deployment Preparation Script
# This script helps prepare your website for deployment

set -e

echo "🚀 Preparing website for deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if build works
echo -e "${YELLOW}Step 1: Verifying build...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Please fix errors before deploying.${NC}"
    exit 1
fi
echo ""

# Step 2: Check if .env is in .gitignore
echo -e "${YELLOW}Step 2: Checking .gitignore...${NC}"
if grep -q "^\.env$" .gitignore || grep -q "^\.env\*" .gitignore; then
    echo -e "${GREEN}✅ .env is properly ignored${NC}"
else
    echo -e "${RED}❌ Warning: .env might not be in .gitignore${NC}"
fi
echo ""

# Step 3: Check Prisma schema
echo -e "${YELLOW}Step 3: Checking Prisma schema...${NC}"
if grep -q 'provider = "sqlite"' prisma/schema.prisma; then
    echo -e "${YELLOW}⚠️  Warning: Prisma schema is still using SQLite${NC}"
    echo -e "${YELLOW}   For production, you should switch to PostgreSQL${NC}"
    echo -e "${YELLOW}   Update prisma/schema.prisma: change 'sqlite' to 'postgresql'${NC}"
else
    echo -e "${GREEN}✅ Prisma schema is configured for PostgreSQL${NC}"
fi
echo ""

# Step 4: Check environment variables
echo -e "${YELLOW}Step 4: Checking environment variables...${NC}"
if [ -f .env.example ]; then
    echo -e "${GREEN}✅ .env.example exists${NC}"
    echo -e "${YELLOW}   Make sure to set these in your hosting platform:${NC}"
    cat .env.example | grep -v "^#" | grep "=" | sed 's/^/   - /'
else
    echo -e "${RED}❌ .env.example not found${NC}"
fi
echo ""

# Step 5: Generate NEXTAUTH_SECRET if needed
echo -e "${YELLOW}Step 5: Generate production secrets...${NC}"
echo -e "${YELLOW}   Run this to generate NEXTAUTH_SECRET:${NC}"
echo -e "   ${GREEN}openssl rand -base64 32${NC}"
echo ""

# Step 6: Check Git status
echo -e "${YELLOW}Step 6: Checking Git status...${NC}"
if [ -d .git ]; then
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✅ Working directory is clean${NC}"
    else
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
        echo -e "${YELLOW}   Consider committing before deploying:${NC}"
        echo -e "   ${GREEN}git add . && git commit -m 'Prepare for deployment'${NC}"
    fi
    
    # Check if remote exists
    if git remote | grep -q origin; then
        echo -e "${GREEN}✅ Git remote 'origin' is configured${NC}"
    else
        echo -e "${YELLOW}⚠️  No Git remote configured${NC}"
        echo -e "${YELLOW}   Add remote: git remote add origin <your-repo-url>${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Not a Git repository${NC}"
    echo -e "${YELLOW}   Initialize: git init && git add . && git commit -m 'Initial commit'${NC}"
fi
echo ""

# Step 7: Check Node version
echo -e "${YELLOW}Step 7: Checking Node.js version...${NC}"
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js version: ${NODE_VERSION}${NC}"
echo -e "${YELLOW}   Vercel uses Node.js 18.x by default${NC}"
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment preparation check complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review DEPLOYMENT_CHECKLIST.md for detailed instructions"
echo "2. Set up PostgreSQL database (Neon, Supabase, or Vercel Postgres)"
echo "3. Update Prisma schema to use PostgreSQL"
echo "4. Prepare all environment variables"
echo "5. Deploy to Vercel (or your chosen platform)"
echo ""
echo -e "${GREEN}Good luck with your deployment! 🚀${NC}"

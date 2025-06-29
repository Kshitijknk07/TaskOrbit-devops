#!/bin/bash

# TaskOrbit CI/CD Pipeline Monitor
# This script helps you monitor your GitHub Actions CI/CD pipeline

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}🚀 TaskOrbit CI/CD Pipeline Monitor${NC}"
echo "=============================================="
echo ""

# Get the latest commit hash
LATEST_COMMIT=$(git rev-parse HEAD)
SHORT_COMMIT=$(git rev-parse --short HEAD)

echo -e "${CYAN}📋 Pipeline Information:${NC}"
echo "Repository: https://github.com/Kshitijknk07/TaskOrbit-devops"
echo "Latest Commit: $SHORT_COMMIT"
echo "Branch: $(git branch --show-current)"
echo ""

echo -e "${BLUE}🔍 How to View CI/CD Logs (Like Jenkins):${NC}"
echo ""
echo "1. ${GREEN}Web Interface (Recommended for Demo):${NC}"
echo "   • Go to: https://github.com/Kshitijknk07/TaskOrbit-devops/actions"
echo "   • Click on the latest workflow run"
echo "   • Click on any job to see detailed logs"
echo "   • Real-time updates as pipeline runs"
echo ""
echo "2. ${GREEN}Direct Workflow URL:${NC}"
echo "   • https://github.com/Kshitijknk07/TaskOrbit-devops/actions/runs"
echo ""

echo -e "${YELLOW}📊 What You'll See in the Pipeline:${NC}"
echo ""
echo "🔧 Jobs in your CI/CD pipeline:"
echo "1. test-backend    - Go testing and linting"
echo "2. test-frontend   - Node.js testing and build"
echo "3. build-and-push  - Docker builds and registry push"
echo "4. deploy          - Kubernetes deployment (main branch only)"
echo "5. notify          - Deployment status notification"
echo ""

echo -e "${CYAN}🎯 Pipeline Stages Explained:${NC}"
echo ""
echo "📋 Stage 1: Code Analysis & Testing"
echo "   • Backend: Go tests, linting, static analysis"
echo "   • Frontend: Node.js tests, linting, build verification"
echo "   • Status: ✅ Pass / ❌ Fail"
echo ""
echo "🏗️ Stage 2: Build & Package"
echo "   • Docker image building for backend and frontend"
echo "   • Container registry push (GitHub Container Registry)"
echo "   • Status: ✅ Pass / ❌ Fail"
echo ""
echo "🚀 Stage 3: Deploy (Main branch only)"
echo "   • Kubernetes deployment"
echo "   • Health checks and monitoring"
echo "   • Status: ✅ Pass / ❌ Fail"
echo ""

echo -e "${GREEN}📱 Quick Access Links:${NC}"
echo ""
echo "🔗 Repository: https://github.com/Kshitijknk07/TaskOrbit-devops"
echo "🔗 Actions: https://github.com/Kshitijknk07/TaskOrbit-devops/actions"
echo "🔗 Latest Run: https://github.com/Kshitijknk07/TaskOrbit-devops/actions/runs"
echo ""

echo -e "${YELLOW}💡 Tips for Your Teacher Demo:${NC}"
echo ""
echo "1. ${GREEN}Show the Web Interface:${NC}"
echo "   • Open the Actions tab in your browser"
echo "   • Show real-time logs as they appear"
echo "   • Demonstrate job dependencies and parallel execution"
echo ""
echo "2. ${GREEN}Explain the Pipeline:${NC}"
echo "   • Code push triggers automatic testing"
echo "   • Tests must pass before building"
echo "   • Docker images are built and pushed"
echo "   • Automatic deployment to production"
echo ""
echo "3. ${GREEN}Highlight Key Features:${NC}"
echo "   • Parallel job execution"
echo "   • Caching for faster builds"
echo "   • Conditional deployment (only main branch)"
echo "   • Comprehensive error handling"
echo ""

echo -e "${PURPLE}🎉 Your CI/CD Pipeline is Running!${NC}"
echo ""
echo "Check the web interface to see your pipeline in action:"
echo "https://github.com/Kshitijknk07/TaskOrbit-devops/actions"
echo ""
echo -e "${CYAN}Happy demonstrating! 🚀${NC}" 
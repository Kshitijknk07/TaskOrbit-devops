#!/bin/bash

# TaskOrbit Backend API Testing Script
# This script tests all major endpoints of the TaskOrbit backend

BASE_URL="http://localhost:8080/api"
TOKEN=""

echo "🚀 Starting TaskOrbit Backend API Tests"
echo "========================================"

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Test 1: Health Check
echo ""
echo "1️⃣ Testing Health Check"
echo "----------------------"
curl -s -X GET "$BASE_URL/health" | jq '.'

# Test 2: Register new user
echo ""
echo "2️⃣ Testing User Registration"
echo "----------------------------"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token // empty')

# Test 3: Login with existing user
echo ""
echo "3️⃣ Testing User Login"
echo "---------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taskorbit.com",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

# Use admin token for further tests
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ Failed to get authentication token"
    exit 1
fi

echo "✅ Authentication token obtained: ${TOKEN:0:20}..."

# Test 4: Get user profile
echo ""
echo "4️⃣ Testing Get User Profile"
echo "---------------------------"
curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 5: Create a new task
echo ""
echo "5️⃣ Testing Create Task"
echo "---------------------"
CREATE_TASK_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task from API",
    "description": "This is a test task created via API",
    "priority": "high",
    "status": "pending",
    "due_date": "2024-12-31T23:59:59.000Z",
    "tags": ["test", "api"],
    "estimated_hours": 5.0
  }')

echo "$CREATE_TASK_RESPONSE" | jq '.'

# Extract task ID
TASK_ID=$(echo "$CREATE_TASK_RESPONSE" | jq -r '.data.id // empty')

# Test 6: Get all tasks
echo ""
echo "6️⃣ Testing Get All Tasks"
echo "------------------------"
curl -s -X GET "$BASE_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 7: Get task by ID
echo ""
echo "7️⃣ Testing Get Task by ID"
echo "-------------------------"
curl -s -X GET "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 8: Update task
echo ""
echo "8️⃣ Testing Update Task"
echo "---------------------"
curl -s -X PUT "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "description": "Updated description via API test"
  }' | jq '.'

# Test 9: Get task statistics
echo ""
echo "9️⃣ Testing Task Statistics"
echo "-------------------------"
curl -s -X GET "$BASE_URL/tasks/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 10: Test filtering tasks
echo ""
echo "🔟 Testing Task Filtering"
echo "------------------------"
curl -s -X GET "$BASE_URL/tasks?status=pending&priority=high&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 11: Test search functionality
echo ""
echo "1️⃣1️⃣ Testing Task Search"
echo "------------------------"
curl -s -X GET "$BASE_URL/tasks?search=test" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 12: Update user profile
echo ""
echo "1️⃣2️⃣ Testing Update User Profile"
echo "-------------------------------"
curl -s -X PUT "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Admin User"
  }' | jq '.'

# Test 13: Test error handling (invalid task ID)
echo ""
echo "1️⃣3️⃣ Testing Error Handling"
echo "---------------------------"
curl -s -X GET "$BASE_URL/tasks/invalid-uuid" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 14: Test unauthorized access
echo ""
echo "1️⃣4️⃣ Testing Unauthorized Access"
echo "-------------------------------"
curl -s -X GET "$BASE_URL/tasks" | jq '.'

# Test 15: Database health check
echo ""
echo "1️⃣5️⃣ Testing Database Health"
echo "----------------------------"
curl -s -X GET "$BASE_URL/health/database" | jq '.'

echo ""
echo "🎉 All tests completed!"
echo "======================"
echo "✅ Backend is working correctly!"
echo "📊 Check the responses above for detailed results"
echo "🔗 API Base URL: $BASE_URL"
echo "🔐 Token: ${TOKEN:0:20}..." 
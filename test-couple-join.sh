#!/bin/bash

# 测试情侣关系接口

API_BASE="https://timelesslove.top/api"

echo "🧪 测试情侣关系接口"
echo "================================"

# 读取 token（需要先登录获取）
read -p "请输入测试用的 JWT Token: " TOKEN

echo ""
echo "1️⃣ 测试无效邀请码（应返回 400）"
echo "--------------------------------"
curl -X POST "${API_BASE}/couples/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"inviteCode":"INVALID1"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  | jq .

echo ""
echo "2️⃣ 获取我的情侣关系"
echo "--------------------------------"
curl -X GET "${API_BASE}/couples/my" \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n" \
  | jq .

echo ""
read -p "是否要测试真实邀请码？(y/n): " TEST_REAL

if [ "$TEST_REAL" = "y" ]; then
  read -p "请输入真实邀请码: " REAL_CODE
  echo ""
  echo "3️⃣ 测试真实邀请码"
  echo "--------------------------------"
  curl -X POST "${API_BASE}/couples/join" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d "{\"inviteCode\":\"${REAL_CODE}\"}" \
    -w "\nHTTP Status: %{http_code}\n" \
    | jq .
fi

echo ""
echo "✅ 测试完成"

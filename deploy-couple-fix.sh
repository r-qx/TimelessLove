#!/bin/bash

# 情侣关系接口修复 - 部署脚本

echo "🔧 开始部署修复..."

# 1. 打包修改的文件
cd /Users/qxxxr/Documents/my/TimelessLove
tar -czf couple-fix.tar.gz \
  backend/src/modules/couple/couple.service.ts

echo "📦 文件打包完成"

# 2. 上传到服务器
echo "📤 上传文件到服务器..."
scp couple-fix.tar.gz ubuntu@124.222.234.56:~/

# 3. 在服务器上解压并重启
echo "🚀 在服务器上部署..."
ssh ubuntu@124.222.234.56 << 'EOF'
cd ~/TimelessLove-backend
tar -xzf ~/couple-fix.tar.gz
rm ~/couple-fix.tar.gz

echo "📋 重启后端服务..."
pm2 restart timeless-love-backend

echo "📊 查看服务状态..."
pm2 status

echo "📝 查看最近日志..."
pm2 logs timeless-love-backend --lines 30 --nostream
EOF

echo "✅ 部署完成"

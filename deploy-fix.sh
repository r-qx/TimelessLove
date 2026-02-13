#!/bin/bash

# 情侣关系接口修复 - 正确的部署流程

set -e

echo "🔧 开始部署修复..."

cd /Users/qxxxr/Documents/my/TimelessLove

# 1. 上传到服务器
echo "📤 上传文件到服务器..."
scp couple-service-fix.tar.gz ubuntu@124.222.234.56:~/

echo ""
echo "📋 请手动执行以下命令完成部署："
echo "================================"
echo ""
echo "ssh ubuntu@124.222.234.56"
echo ""
echo "cd ~/TimelessLove-backend"
echo "tar -xzf ~/couple-service-fix.tar.gz"
echo "rm ~/couple-service-fix.tar.gz"
echo ""
echo "pm2 restart timeless-love-backend"
echo "pm2 logs timeless-love-backend --lines 30"
echo ""
echo "================================"

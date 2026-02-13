#!/bin/bash

# TimelessLove 一键部署脚本（在服务器上执行）

set -e

echo "🚀 开始部署 TimelessLove 后端..."

# 停止服务
echo "⏸️  停止服务..."
pm2 stop timeless-love-backend || true

# 备份旧代码
echo "💾 备份旧代码..."
cd /var/www/TimelessLove
BACKUP_NAME="backend.backup.$(date +%Y%m%d_%H%M%S)"
if [ -d "backend" ]; then
  cp -r backend "$BACKUP_NAME"
  echo "✅ 已备份到: $BACKUP_NAME"
fi

# 解压新代码
echo "📦 解压新代码..."
rm -rf backend
tar -xzf ~/backend.tar.gz

# 进入目录
cd backend

# 安装依赖
echo "📥 安装依赖..."
npm install

# 构建
echo "🔨 构建项目..."
npm run build

# 重启服务
echo "▶️  重启服务..."
pm2 restart timeless-love-backend

# 查看状态
echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 服务状态："
pm2 status

echo ""
echo "📝 最近日志："
pm2 logs timeless-love-backend --lines 20 --nostream

echo ""
echo "🎉 部署成功！请检查上方日志确认服务正常运行。"

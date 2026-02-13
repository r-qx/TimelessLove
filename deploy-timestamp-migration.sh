#!/bin/bash

# TimelessLove 日期时间标准化部署脚本

set -e

echo "🚀 TimelessLove 日期时间标准化部署"
echo "======================================"
echo ""

# 1. 上传文件到服务器
echo "📤 步骤 1: 上传文件到服务器..."
scp timestamp-migration.tar.gz ubuntu@124.222.234.56:~/
scp migrate-dates-to-timestamps.sh ubuntu@124.222.234.56:~/

echo ""
echo "✅ 文件上传完成"
echo ""
echo "📋 请在服务器上执行以下命令："
echo "======================================"
cat << 'SERVEREOF'

# SSH 连接服务器
ssh ubuntu@124.222.234.56

# 1. 备份数据库（重要！）
mongodump --db=timeless_love --out=/tmp/timeless_love_backup_$(date +%Y%m%d_%H%M%S)

# 2. 解压后端代码
cd /var/www/TimelessLove
tar -xzf ~/timestamp-migration.tar.gz
rm ~/timestamp-migration.tar.gz

# 3. 重新编译后端
cd backend
npm run build

# 4. 执行数据库迁移
chmod +x ~/migrate-dates-to-timestamps.sh
~/migrate-dates-to-timestamps.sh

# 5. 重启后端服务
pm2 restart timeless-love

# 6. 查看日志确认启动成功
pm2 logs timeless-love --lines 50

# 7. 测试接口
curl -X GET http://localhost:3000/api -H "Content-Type: application/json"

SERVEREOF

echo ""
echo "======================================"
echo ""
echo "📝 部署后验证："
echo "1. 检查后端日志是否有错误"
echo "2. 调用 /api/users/profile 查看时间戳格式"
echo "3. 小程序端测试日期显示"
echo ""
echo "📚 详细文档: TIMESTAMP_MIGRATION.md"
echo ""

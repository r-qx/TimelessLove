#!/bin/bash

# MongoDB 数据库诊断脚本

echo "🔍 MongoDB 数据库诊断"
echo "================================"
echo ""

echo "📋 请在服务器上执行以下命令："
echo ""
echo "ssh ubuntu@124.222.234.56"
echo ""

echo "# 1. 查看后端环境变量"
echo "cat ~/TimelessLove-backend/.env | grep MONGODB"
echo ""

echo "# 2. 查看后端日志中的数据库连接信息"
echo "pm2 logs timeless-love-backend --lines 100 | grep -i mongo"
echo ""

echo "# 3. 查看 MongoDB 状态"
echo "sudo systemctl status mongod"
echo ""

echo "# 4. 连接 MongoDB 查看数据库列表"
echo "mongosh --eval 'show dbs'"
echo ""

echo "# 5. 查看用户集合（如果数据库名是 timeless_love）"
echo "mongosh timeless_love --eval 'db.users.find().limit(5)'"
echo ""

echo "# 6. 查看所有集合名称"
echo "mongosh timeless_love --eval 'db.getCollectionNames()'"
echo ""

echo "# 7. 统计用户数量"
echo "mongosh timeless_love --eval 'db.users.countDocuments()'"
echo ""

echo "================================"
echo ""
echo "📝 常见原因："
echo "1. 数据库名称不匹配（可能是 timeless_love 或 timelesslove 或其他）"
echo "2. 集合名称不匹配（Mongoose 会自动将 User 转换为 users）"
echo "3. SSH 隧道连接的是错误的数据库实例"
echo "4. 服务器有多个 MongoDB 实例运行"
echo ""
echo "🔑 关键点："
echo "- Mongoose Schema 'User' 会自动创建集合 'users'"
echo "- 需要确认 MONGODB_URI 环境变量中的数据库名"
echo ""

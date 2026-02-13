# 🔄 服务端代码更新指南

## 📋 完整更新流程

### 第一步：本地开发和测试

```bash
1. 修改代码
2. 本地测试（如果有本地环境）
3. 提交到 Git（可选，建议）
```

---

### 第二步：打包代码

**在本地电脑终端执行**：

```bash
cd /Users/qxxxr/Documents/my/TimelessLove

# 删除旧的打包文件
rm -f backend.tar.gz

# 重新打包（排除不需要的文件）
tar -czf backend.tar.gz \
  --exclude='backend/node_modules' \
  --exclude='backend/dist' \
  --exclude='backend/uploads' \
  --exclude='backend/.env' \
  backend/

# 验证文件大小
ls -lh backend.tar.gz
```

---

### 第三步：上传到服务器

```bash
# 上传到服务器
scp backend.tar.gz ubuntu@124.222.234.56:~/

# 验证上传成功
ssh ubuntu@124.222.234.56 "ls -lh ~/backend.tar.gz"
```

---

### 第四步：在服务器上部署

**SSH 连接到服务器**：

```bash
ssh ubuntu@124.222.234.56
```

**然后执行部署命令**：

```bash
# 1. 停止服务
pm2 stop timeless-love

# 2. 备份旧代码（可选但推荐）
cd /var/www/TimelessLove
cp -r backend backend.backup.$(date +%Y%m%d_%H%M%S)

# 3. 解压新代码
cd /var/www/TimelessLove
rm -rf backend
tar -xzf ~/backend.tar.gz

# 4. 进入目录
cd backend

# 5. 安装依赖（如果 package.json 有变化）
npm install

# 6. 重新构建
npm run build

# 7. 检查环境变量文件（确保存在）
ls -la .env

# 8. 如果 .env 不存在，创建
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/timeless_love
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=timeless-love-production-secret-2024
JWT_EXPIRES_IN=7d
WECHAT_APPID=wxde70635b078e0629
WECHAT_SECRET=a64515e1ad594b9fb61e7707589f0aab
BASE_URL=http://124.222.234.56
UPLOAD_DIR=/var/www/uploads
MAX_FILE_SIZE=10485760
EOF

# 9. 重启服务
pm2 restart timeless-love

# 10. 查看服务状态
pm2 status

# 11. 查看日志（确保启动成功）
pm2 logs timeless-love --lines 30

# 12. 测试接口
curl http://localhost:3000/api
```

---

### 第五步：验证更新

```bash
# 在服务器上测试
curl http://localhost:3000/api

# 在本地测试（如果网络允许）
curl http://124.222.234.56/api

# 在小程序中测试
# 编译运行，测试新功能
```

---

## 🚀 快速更新脚本

### 本地执行（打包上传）

创建文件 `deploy-update.sh`：

```bash
#!/bin/bash

cd /Users/qxxxr/Documents/my/TimelessLove

echo "📦 打包代码..."
rm -f backend.tar.gz
tar -czf backend.tar.gz \
  --exclude='backend/node_modules' \
  --exclude='backend/dist' \
  --exclude='backend/uploads' \
  --exclude='backend/.env' \
  backend/

echo "📤 上传到服务器..."
scp backend.tar.gz ubuntu@124.222.234.56:~/

echo "✅ 上传完成！"
echo "请在服务器执行部署命令"
```

**使用**：
```bash
chmod +x deploy-update.sh
./deploy-update.sh
```

---

### 服务器执行（部署更新）

创建服务器脚本 `/home/ubuntu/update.sh`：

```bash
#!/bin/bash

echo "🔄 开始更新..."

cd /var/www/TimelessLove

# 停止服务
pm2 stop timeless-love

# 备份
cp -r backend backend.backup.$(date +%Y%m%d_%H%M%S)

# 部署
rm -rf backend
tar -xzf ~/backend.tar.gz

cd backend
npm install
npm run build

# 检查环境变量
if [ ! -f .env ]; then
  echo "⚠️ .env 不存在，请手动创建"
  exit 1
fi

# 重启
pm2 restart timeless-love
pm2 status

echo "✅ 更新完成！"
echo "查看日志："
pm2 logs timeless-love --lines 20
```

**使用**：
```bash
ssh ubuntu@124.222.234.56
bash ~/update.sh
```

---

## ⚠️ 注意事项

### 1. 环境变量文件

`.env` 文件**不会**被打包上传，需要确保服务器上有：

```bash
# 检查
ls -la /var/www/TimelessLove/backend/.env

# 如果没有，手动创建
```

### 2. 依赖变化

如果修改了 `package.json`：
```bash
# 必须重新安装依赖
npm install
```

如果只改了代码：
```bash
# 可以跳过 npm install
# 直接 npm run build
```

### 3. 数据库迁移

如果修改了 Schema（数据结构）：
```bash
# 可能需要数据迁移
# 或清空测试数据重新开始
```

### 4. 重启服务

**必须重启** PM2 才能生效：
```bash
pm2 restart timeless-love

# 或者重新加载（0秒停机）
pm2 reload timeless-love
```

---

## 🧪 验证更新成功

### 检查清单

- [ ] PM2 状态显示 `online`
- [ ] 日志中看到启动成功信息
- [ ] 测试接口返回正确数据
- [ ] 小程序能正常调用新接口
- [ ] 没有报错

---

## 📊 常用运维命令

### 查看服务状态
```bash
pm2 status
pm2 logs timeless-love
pm2 monit  # 实时监控
```

### 重启服务
```bash
pm2 restart timeless-love  # 重启
pm2 reload timeless-love   # 热重载
pm2 stop timeless-love     # 停止
pm2 start timeless-love    # 启动
```

### 查看日志
```bash
pm2 logs timeless-love              # 实时日志
pm2 logs timeless-love --lines 100  # 最近100行
pm2 logs timeless-love --err        # 只看错误
```

### 数据库
```bash
# MongoDB
sudo systemctl status mongod
mongosh  # 连接数据库

# Redis
sudo systemctl status redis-server
redis-cli  # 连接Redis
```

### Nginx
```bash
sudo systemctl status nginx
sudo nginx -t  # 测试配置
sudo systemctl reload nginx  # 重新加载配置
```

---

## 🎯 总结

**每次更新服务端代码的步骤**：

```
1. 本地打包（tar）
2. 上传服务器（scp）
3. 服务器停止服务（pm2 stop）
4. 解压代码
5. 安装依赖（如需要）
6. 构建项目（npm run build）
7. 重启服务（pm2 restart）
8. 查看日志验证
9. 测试接口
```

---

**以后更新代码就按这个流程操作！**

需要我帮你创建自动化脚本吗？🚀

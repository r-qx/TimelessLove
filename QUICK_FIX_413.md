# 🚨 快速修复 413 错误指南

## 问题

上传图片时出现 `413 Request Entity Too Large` 错误。

## 已修改的代码

✅ 已更新后端代码增加上传限制到 50MB
✅ 已优化前端图片上传逻辑
✅ 已打包好代码：`backend.tar.gz`

---

## 🔧 修复步骤

### 步骤 1: 上传代码（在本地执行）

```bash
# 上传打包好的代码
scp backend.tar.gz ubuntu@124.222.234.56:~/
```

如果遇到 SSH 权限问题，运行：

```bash
chmod 600 ~/.ssh/id_ed25519
scp backend.tar.gz ubuntu@124.222.234.56:~/
```

---

### 步骤 2: SSH 连接服务器

```bash
ssh ubuntu@124.222.234.56
```

---

### 步骤 3: 部署后端代码（在服务器执行）

```bash
# 停止服务
pm2 stop timeless-love-backend

# 备份旧代码
cd /var/www/TimelessLove
cp -r backend backend.backup.$(date +%Y%m%d_%H%M%S)

# 解压新代码
rm -rf backend
tar -xzf ~/backend.tar.gz

# 安装依赖
cd backend
npm install

# 构建
npm run build

# 重启服务
pm2 restart timeless-love-backend

# 查看日志确认启动成功
pm2 logs timeless-love-backend --lines 20
```

---

### 步骤 4: 修改 Nginx 配置（在服务器执行）

```bash
# 备份配置
sudo cp /etc/nginx/sites-available/timelesslove.top /etc/nginx/sites-available/timelesslove.top.backup

# 编辑配置
sudo nano /etc/nginx/sites-available/timelesslove.top
```

在 `server` 块中添加这一行（在 `listen 443 ssl;` 下方）：

```nginx
    # 设置上传文件大小限制为 50MB
    client_max_body_size 50M;
```

完整配置示例：

```nginx
server {
    listen 443 ssl;
    server_name timelesslove.top;
    
    # 添加这行 ⬇️
    client_max_body_size 50M;
    
    ssl_certificate /etc/letsencrypt/live/timelesslove.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timelesslove.top/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 上传超时时间设置
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}

server {
    listen 80;
    server_name timelesslove.top;
    return 301 https://$server_name$request_uri;
}
```

保存：`Ctrl + O` -> `Enter` -> `Ctrl + X`

---

### 步骤 5: 重新加载 Nginx（在服务器执行）

```bash
# 测试配置
sudo nginx -t

# 如果显示 ok，则重新加载
sudo systemctl reload nginx

# 查看 Nginx 状态
sudo systemctl status nginx
```

---

### 步骤 6: 验证修复（在服务器执行）

```bash
# 查看服务状态
pm2 status

# 测试 API
curl http://localhost:3000/api
```

---

## ✅ 测试

在小程序中重新尝试上传头像：

1. 打开个人中心
2. 点击编辑资料
3. 选择头像上传
4. 应该可以正常上传了

---

## 🔍 故障排查

### 如果还是 413 错误

1. **检查 Nginx 配置是否生效**

```bash
sudo nginx -t
grep -n "client_max_body_size" /etc/nginx/sites-available/timelesslove.top
```

1. **查看 Nginx 错误日志**

```bash
sudo tail -f /var/log/nginx/error.log
```

1. **查看后端日志**

```bash
pm2 logs timeless-love-backend
```

1. **确认后端服务正常**

```bash
pm2 status
curl http://localhost:3000/api
```

### 如果后端启动失败

```bash
# 查看详细日志
pm2 logs timeless-love-backend --lines 50

# 手动启动测试
cd /var/www/TimelessLove/backend
npm run start:prod
```

### 恢复旧配置

如果出现问题需要回滚：

```bash
# 恢复 Nginx 配置
sudo cp /etc/nginx/sites-available/timelesslove.top.backup /etc/nginx/sites-available/timelesslove.top
sudo systemctl reload nginx

# 恢复后端代码
cd /var/www/TimelessLove
pm2 stop timeless-love-backend
rm -rf backend
cp -r backend.backup.XXXXXXXX backend  # 使用实际的备份目录名
pm2 restart timeless-love-backend
```

---

## 📝 修改内容总结

### 后端修改

1. `main.ts`: 增加 body-parser 限制到 50MB
2. `upload.controller.ts`: 上传文件大小限制改为 50MB

### 前端修改

3. `edit.js`: 增加文件大小检查，超过 10MB 提示

### Nginx 配置

4. 增加 `client_max_body_size 50M`

---

## 联系信息

如有问题，请检查日志或联系开发团队。

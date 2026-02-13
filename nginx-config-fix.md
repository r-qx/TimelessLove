# Nginx 配置修复 - 解决 413 错误

## 问题原因

413 Request Entity Too Large 错误是因为 Nginx 默认的上传限制是 1MB，需要增加到 50MB。

## 修复步骤

### 1. SSH 连接到服务器

```bash
ssh ubuntu@124.222.234.56
```

### 2. 备份当前 Nginx 配置

```bash
sudo cp /etc/nginx/sites-available/timelesslove.top /etc/nginx/sites-available/timelesslove.top.backup
```

### 3. 编辑 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/timelesslove.top
```

### 4. 在 server 块中添加上传大小限制

找到这一行：

```nginx
server {
    listen 443 ssl;
    server_name timelesslove.top;
```

在其下方添加：

```nginx
    # 设置上传文件大小限制为 50MB
    client_max_body_size 50M;
```

完整示例：

```nginx
server {
    listen 443 ssl;
    server_name timelesslove.top;
    
    # 设置上传文件大小限制为 50MB
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
```

### 5. 测试 Nginx 配置

```bash
sudo nginx -t
```

如果输出 "syntax is ok" 和 "test is successful"，则配置正确。

### 6. 重新加载 Nginx

```bash
sudo systemctl reload nginx
```

### 7. 验证修复

从本地测试上传接口：

```bash
# 测试小文件
curl -X POST https://timelesslove.top/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg"
```

## 额外优化（可选）

### 在 http 块中全局设置（影响所有站点）

```bash
sudo nano /etc/nginx/nginx.conf
```

在 http 块中添加：

```nginx
http {
    # 全局设置
    client_max_body_size 50M;
    client_body_timeout 300s;
    
    # 其他配置...
}
```

## 故障排查

### 如果还是 413 错误

1. 检查是否有多个 Nginx 配置文件覆盖了设置

```bash
grep -r "client_max_body_size" /etc/nginx/
```

1. 检查 Nginx 错误日志

```bash
sudo tail -f /var/log/nginx/error.log
```

1. 确认后端服务已重启

```bash
pm2 restart timeless-love-backend
pm2 logs timeless-love-backend
```

### 如果 Nginx 配置测试失败

```bash
# 恢复备份
sudo cp /etc/nginx/sites-available/timelesslove.top.backup /etc/nginx/sites-available/timelesslove.top
sudo systemctl reload nginx
```

## 完成后测试

在小程序中重新尝试上传头像，应该可以正常上传了。

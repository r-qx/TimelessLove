# 🚀 TimelessLove 部署信息

## 🌐 生产环境

### 服务器信息

- **提供商**: 腾讯云轻量应用服务器
- **IP 地址**: 124.222.234.56
- **实例 ID**: lhins-3ih63p2d
- **操作系统**: Ubuntu 24.04 LTS

### 域名和访问地址

- **域名**: timelesslove.top
- **API 地址**: <https://timelesslove.top/api>
- **上传地址**: <https://timelesslove.top/uploads>
- **SSL 证书**: Let's Encrypt（自动续期）

### 小程序信息

- **AppID**: wxde70635b078e0629
- **版本**: 1.0.0
- **状态**: 已部署

---

## 🛠️ 服务架构

```
用户 → 微信小程序
      ↓
https://timelesslove.top/api (HTTPS)
      ↓
Nginx (124.222.234.56:443)
      ↓
后端服务 (localhost:3000)
      ↓
MongoDB (localhost:27017) + Redis (localhost:6379)
```

---

## 📦 部署的服务

| 服务 | 状态 | 端口 | 管理命令 |
|------|------|------|---------|
| 后端服务 | ✅ 运行中 | 3000 | `pm2 status` |
| MongoDB | ✅ 运行中 | 27017 | `sudo systemctl status mongod` |
| Redis | ✅ 运行中 | 6379 | `sudo systemctl status redis-server` |
| Nginx | ✅ 运行中 | 80, 443 | `sudo systemctl status nginx` |

---

## 🔧 常用运维命令

### SSH 连接服务器

```bash
ssh ubuntu@124.222.234.56
```

### 查看服务状态

```bash
pm2 status
pm2 logs timeless-love-backend
sudo systemctl status mongod
sudo systemctl status redis-server
sudo systemctl status nginx
```

### 重启服务

```bash
pm2 restart timeless-love-backend
sudo systemctl restart nginx
sudo systemctl restart mongod
sudo systemctl restart redis-server
```

### 更新代码

```bash
# 1. 本地打包
cd /Users/qxxxr/Documents/my/TimelessLove
tar -czf backend.tar.gz backend/

# 2. 上传
scp backend.tar.gz ubuntu@124.222.234.56:/tmp/

# 3. 在服务器上部署
ssh ubuntu@124.222.234.56
cd /var/www/TimelessLove
tar -xzf /tmp/backend.tar.gz
cd backend
npm install
npm run build
pm2 restart timeless-love-backend
```

### 查看日志

```bash
# 实时日志
pm2 logs timeless-love-backend

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔐 SSL 证书管理

### 证书位置

```bash
证书：/etc/letsencrypt/live/timelesslove.top/fullchain.pem
私钥：/etc/letsencrypt/live/timelesslove.top/privkey.pem
```

### 自动续期

Let's Encrypt 证书有效期 90 天，已配置自动续期。

### 手动续期（如需要）

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### 查看证书信息

```bash
sudo certbot certificates
```

---

## 📁 服务器目录结构

```
/var/www/TimelessLove/
├── backend/              # 后端代码
│   ├── dist/            # 编译后的代码
│   ├── src/             # 源代码
│   ├── .env             # 环境变量
│   └── package.json
└── /var/www/uploads/    # 用户上传文件
```

---

## 🔒 安全配置

### 防火墙规则（腾讯云安全组）

- ✅ SSH (22)
- ✅ HTTP (80)
- ✅ HTTPS (443)

### 环境变量

重要配置已存储在 `/var/www/TimelessLove/backend/.env`

⚠️ **不要提交 .env 文件到 Git！**

---

## 📊 监控和维护

### 定期检查（建议每周）

```bash
# 1. 服务状态
pm2 status

# 2. 磁盘空间
df -h

# 3. 内存使用
free -h

# 4. 系统更新
sudo apt update
sudo apt upgrade -y
```

### 数据库备份（建议每天）

```bash
# MongoDB 备份
mongodump --out=/var/www/backups/$(date +%Y%m%d)

# 定时任务（crontab）
0 2 * * * mongodump --out=/var/www/backups/$(date +\%Y\%m\%d)
```

---

## 🆘 故障排查

### 后端服务无响应

```bash
pm2 restart timeless-love-backend
pm2 logs timeless-love-backend
```

### 数据库连接失败

```bash
sudo systemctl restart mongod
sudo systemctl restart redis-server
```

### Nginx 502 错误

```bash
sudo nginx -t
sudo systemctl restart nginx
pm2 status  # 检查后端是否运行
```

### SSL 证书过期

```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 📱 小程序配置

### 当前配置

```javascript
// miniprogram/utils/config.js
export const API_BASE_URL = 'https://timelesslove.top/api';
```

### 微信后台域名配置

```
request 合法域名：https://timelesslove.top
uploadFile 合法域名：https://timelesslove.top
downloadFile 合法域名：https://timelesslove.top
```

---

## 🎯 下一步开发

### 更新代码流程

```
1. 本地开发和测试
2. 提交到 Git
3. 打包并上传到服务器
4. 在服务器上构建和重启
5. 更新小程序代码
6. 提交审核或发布
```

---

## 📞 联系方式

- **服务器 IP**: 124.222.234.56
- **域名**: timelesslove.top
- **小程序**: TimelessLove

---

**最后更新**: 2026-02-02

# MongoDB 数据找不到问题排查

## 问题描述

接口 `GET /api/users/profile` 返回了用户数据：
```json
{
  "_id": "69807e8c5741ef7695f99e80",
  "openid": "oWqGE14FOJP6ZGANsbiRjSCAgrD8",
  "nickname": "户",
  "avatar": "http://119.91.32.139/uploads/6fcbbd7dd628e3a9eade49dc36e93e22.jpg",
  "gender": 0,
  "couple_id": "69807ea15741ef7695f99e8a",
  "created_at": "2026-02-02T10:38:04.692Z",
  "updated_at": "2026-02-13T08:22:19.046Z",
  "__v": 0
}
```

但通过 SSH 隧道连接 `localhost:27018`（映射到服务器 27017）的数据库中找不到这条数据。

## 可能的原因

### 1. 数据库名称不匹配 ⭐⭐⭐⭐⭐

**最可能的原因！**

Mongoose 连接字符串中的数据库名可能和你查询的不一致：

```
mongodb://localhost:27017/timeless_love  ← 你连的
mongodb://localhost:27017/timelesslove   ← 实际可能是这个
mongodb://localhost:27017/test           ← 或者其他名字
```

### 2. 集合名称转换规则

Mongoose 会自动将 Schema 名转换为复数小写：
- `User` → `users` ✅（正确）
- `Couple` → `couples` ✅

所以应该查询 `users` 集合而不是 `User`。

### 3. SSH 隧道连接的端口问题

你的隧道命令：
```bash
ssh -L 27018:localhost:27017 ubuntu@124.222.234.56 -N
```

这会将服务器的 `localhost:27017` 映射到本地 `localhost:27018`。

**注意**：如果服务器上的 MongoDB 监听的不是 `localhost:27017`，而是其他地址或端口，就会找不到数据。

### 4. 多数据库实例

服务器上可能运行了多个 MongoDB 实例：
- 一个开发用的（端口 27017）
- 一个生产用的（端口 27018 或其他）

## 诊断步骤

### 步骤 1：SSH 连接到服务器

```bash
ssh ubuntu@124.222.234.56
```

### 步骤 2：查看后端的数据库连接配置

```bash
cd ~/TimelessLove-backend
cat .env | grep MONGODB
```

你会看到类似：
```
MONGODB_URI=mongodb://localhost:27017/timeless_love
```

**记住这个数据库名！**

### 步骤 3：查看所有数据库

```bash
mongosh --eval "show dbs"
```

输出示例：
```
admin           40.00 KiB
config          60.00 KiB
local           72.00 KiB
timeless_love   5.50 MiB    ← 找到它！
```

### 步骤 4：连接正确的数据库并查询

```bash
# 使用步骤 2 中的数据库名
mongosh timeless_love
```

在 mongosh 中执行：
```javascript
// 查看所有集合
show collections

// 应该看到：
// users
// couples
// tasks
// messages
// ...

// 查询用户数据
db.users.find().pretty()

// 查询特定用户
db.users.findOne({ _id: ObjectId("69807e8c5741ef7695f99e80") })

// 统计用户数量
db.users.countDocuments()
```

### 步骤 5：修正 SSH 隧道（如果数据库名不同）

如果发现数据库在不同的端口或实例，修改隧道命令：

```bash
# 如果 MongoDB 在其他端口
ssh -L 27018:localhost:27019 ubuntu@124.222.234.56 -N

# 如果 MongoDB 在其他主机
ssh -L 27018:192.168.1.100:27017 ubuntu@124.222.234.56 -N
```

## 使用 MongoDB Compass 连接

### 方法 1：通过 SSH 隧道

1. 确保 SSH 隧道已建立：
```bash
ssh -L 27018:localhost:27017 ubuntu@124.222.234.56 -N
```

2. 在 MongoDB Compass 中连接：
```
mongodb://localhost:27018/数据库名
```

**注意**：需要指定正确的数据库名！

### 方法 2：直接 SSH 连接（推荐）

在 MongoDB Compass 中：
1. 点击 "New Connection"
2. 选择 "Advanced Connection Options"
3. 填写：
   - Connection String: `mongodb://localhost:27017/timeless_love`
   - SSH Tunnel: 启用
     - SSH Hostname: `124.222.234.56`
     - SSH Port: `22`
     - SSH Username: `ubuntu`
     - SSH Password: (输入密码)

这样可以直接通过 SSH 连接，不需要手动建立隧道。

## 快速验证脚本

在服务器上创建并运行此脚本：

```bash
nano check-db.sh
```

```bash
#!/bin/bash

echo "=== 后端配置 ==="
cat ~/TimelessLove-backend/.env | grep MONGODB

echo ""
echo "=== 所有数据库 ==="
mongosh --quiet --eval "db.adminCommand('listDatabases')" | grep -i name

echo ""
echo "=== 用户数据（前5条）==="
mongosh timeless_love --quiet --eval "db.users.find().limit(5).forEach(printjson)"

echo ""
echo "=== 集合列表 ==="
mongosh timeless_love --quiet --eval "db.getCollectionNames()"
```

运行：
```bash
chmod +x check-db.sh
./check-db.sh
```

## 最可能的解决方案

**99% 的情况下，问题是数据库名称不匹配。**

1. 在服务器上查看 `.env` 中的 `MONGODB_URI`
2. 提取数据库名（最后一个 `/` 后面的部分）
3. 在 MongoDB Compass 中连接时使用完整 URI：
   ```
   mongodb://localhost:27018/正确的数据库名
   ```

## 验证连接是否正确

在 MongoDB Compass 连接后，你应该能看到：
- 左侧显示数据库名（如 `timeless_love`）
- 展开后看到集合：`users`, `couples`, `tasks` 等
- 点击 `users` 集合，可以看到用户数据
- 能找到 `_id` 为 `69807e8c5741ef7695f99e80` 的用户

## 常见错误

❌ **错误示例 1**：连接错误的数据库
```
mongodb://localhost:27018/test  ← 错误：test 数据库
mongodb://localhost:27018/timeless_love  ← 正确
```

❌ **错误示例 2**：查询错误的集合
```javascript
db.User.find()  ← 错误：应该是 users（小写复数）
db.users.find()  ← 正确
```

❌ **错误示例 3**：ObjectId 格式错误
```javascript
db.users.findOne({ _id: "69807e8c5741ef7695f99e80" })  ← 错误：字符串
db.users.findOne({ _id: ObjectId("69807e8c5741ef7695f99e80") })  ← 正确
```

## 下一步

请执行诊断脚本或者直接在服务器上查看 `.env` 文件，告诉我：
1. `MONGODB_URI` 的完整值
2. `mongosh --eval "show dbs"` 的输出

这样我就能准确告诉你如何连接到正确的数据库了。

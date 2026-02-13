# 情侣关系接口 404 错误修复

## 问题描述

接口 `POST /api/couples/join` 返回 404 状态码，错误信息：
```json
{
  "code": 40400,
  "message": "邀请码无效",
  "data": null,
  "timestamp": 1770970965876,
  "path": "/api/couples/join"
}
```

## 问题原因

1. **错误的异常类型**: 在 `couple.service.ts` 中使用了 `NotFoundException`，导致返回 404 HTTP 状态码
2. "邀请码无效"是业务逻辑错误，应该使用 `BadRequestException` 返回 400 状态码

## 解决方案

### 1. 修改异常类型

在 `backend/src/modules/couple/couple.service.ts` 中，将 `NotFoundException` 改为 `BadRequestException`：

**修改前**:
```typescript
async joinByInviteCode(userId: string, inviteCode: string) {
  const couple = await this.coupleModel.findOne({ invite_code: inviteCode }).exec();
  
  if (!couple) {
    throw new NotFoundException('邀请码无效');  // ❌ 会返回 404
  }
  // ...
}
```

**修改后**:
```typescript
async joinByInviteCode(userId: string, inviteCode: string) {
  console.log('🔍 查找邀请码:', inviteCode);
  
  const couple = await this.coupleModel.findOne({ invite_code: inviteCode }).exec();
  
  console.log('📋 查询结果:', couple ? '找到' : '未找到');
  
  if (!couple) {
    throw new BadRequestException('邀请码无效或已过期');  // ✅ 返回 400
  }
  // ...
}
```

## 部署步骤

### 方法一：手动部署（推荐）

1. **SSH 连接到服务器**:
```bash
ssh ubuntu@124.222.234.56
```

2. **进入项目目录**:
```bash
cd ~/TimelessLove-backend
```

3. **编辑文件**:
```bash
nano src/modules/couple/couple.service.ts
```

在第 70-88 行，将 `NotFoundException` 改为 `BadRequestException`，并添加日志：

```typescript
async joinByInviteCode(userId: string, inviteCode: string) {
  console.log('🔍 查找邀请码:', inviteCode);
  
  const couple = await this.coupleModel.findOne({ invite_code: inviteCode }).exec();
  
  console.log('📋 查询结果:', couple ? '找到' : '未找到');
  
  if (!couple) {
    throw new BadRequestException('邀请码无效或已过期');
  }

  if (couple.user2_id) {
    throw new BadRequestException('该邀请码已被使用');
  }

  console.log('✅ 开始加入情侣关系:', { userId, coupleId: couple._id });

  couple.user2_id = userId as any;
  couple.status = 'active';
  couple.invite_code = undefined;

  await couple.save();
  await this.userService.updateCoupleId(userId, couple._id.toString());

  console.log('✅ 情侣关系激活成功');

  return couple;
}
```

4. **重启服务**:
```bash
pm2 restart timeless-love-backend
```

5. **查看日志**:
```bash
pm2 logs timeless-love-backend --lines 50
```

### 方法二：使用部署脚本

```bash
cd /Users/qxxxr/Documents/my/TimelessLove
chmod +x deploy-couple-fix.sh
./deploy-couple-fix.sh
```

## 验证修复

### 1. 测试邀请码功能

在小程序中：
1. 用户 A 创建情侣关系，获取邀请码（8位）
2. 用户 B 输入邀请码加入

### 2. 查看日志输出

正常情况下会看到：
```
🔍 查找邀请码: XXXXXXXX
📋 查询结果: 找到
✅ 开始加入情侣关系: { userId: '...', coupleId: '...' }
✅ 情侣关系激活成功
```

如果邀请码不存在：
```
🔍 查找邀请码: XXXXXXXX
📋 查询结果: 未找到
```
返回 400 错误，message: "邀请码无效或已过期"

## 调试数据库

如果仍然提示邀请码无效，需要检查数据库：

### 1. 通过 SSH 隧道连接 MongoDB

```bash
# 本地执行（已在终端2中运行）
ssh -L 27018:localhost:27017 ubuntu@124.222.234.56 -N
```

### 2. 使用 MongoDB Compass 或命令行查询

```javascript
// 连接: mongodb://localhost:27018/timeless_love

// 查询所有待激活的情侣关系
db.couples.find({ status: 'pending' })

// 查询特定邀请码
db.couples.find({ invite_code: 'YOUR_CODE' })

// 查看邀请码字段
db.couples.find({}, { invite_code: 1, status: 1, user1_id: 1, user2_id: 1 })
```

### 3. 如果数据库中没有邀请码

可能原因：
- 创建情侣关系时没有生成邀请码
- 邀请码字段名不匹配

检查用户的情侣关系：
```javascript
// 查询用户的情侣关系
db.couples.find({ user1_id: ObjectId('USER_ID') })
```

手动添加邀请码（临时方案）：
```javascript
db.couples.updateOne(
  { user1_id: ObjectId('USER_ID'), status: 'pending' },
  { $set: { invite_code: 'TEST1234' } }
)
```

## 预期结果

修复后：
- ✅ 邀请码无效时返回 **400** 状态码（而非 404）
- ✅ 错误信息更明确："邀请码无效或已过期"
- ✅ 添加详细日志便于调试
- ✅ HTTP 状态码符合 RESTful 规范

## 错误码说明

- **40400**: 资源不存在（404 Not Found）
- **40001**: 参数错误/业务逻辑错误（400 Bad Request） ✅ 正确

## 下一步

如果修复后还有问题，请提供：
1. pm2 日志输出
2. 数据库中 couples 集合的数据
3. 使用的具体邀请码

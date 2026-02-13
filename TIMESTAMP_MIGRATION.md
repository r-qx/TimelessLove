# 日期时间标准化改造文档

## 📋 改造内容

### 后端改造
✅ 所有日期字段改为时间戳（Number类型）
✅ 移除 Date 类型和 IsDateString 验证
✅ 统一使用 `Date.now()` 生成时间戳
✅ Schema 添加自动更新 `updated_at` 的钩子

### 前端改造
✅ 新增日期格式化工具函数 `utils/date.js`
✅ 统一格式：`yyyy-MM-dd HH:mm:ss`

### 数据库迁移
✅ 提供迁移脚本将现有 Date 数据转换为时间戳

---

## 🚀 部署步骤

### 1. 打包修改的代码

```bash
cd /Users/qxxxr/Documents/my/TimelessLove

tar -czf timestamp-migration.tar.gz \
  backend/src/modules/user/schemas/user.schema.ts \
  backend/src/modules/user/dto/create-user.dto.ts \
  backend/src/modules/user/dto/update-user.dto.ts \
  backend/src/modules/user/user.controller.ts \
  backend/src/modules/couple/schemas/couple.schema.ts \
  backend/src/modules/couple/dto/create-couple.dto.ts \
  backend/src/modules/couple/couple.service.ts \
  backend/src/modules/task/schemas/task.schema.ts \
  backend/src/modules/moment/schemas/moment.schema.ts \
  backend/src/modules/chat/schemas/message.schema.ts \
  backend/src/main.ts \
  miniprogram/utils/date.js \
  migrate-dates-to-timestamps.sh
```

### 2. 上传到服务器

```bash
scp timestamp-migration.tar.gz ubuntu@124.222.234.56:~/
scp migrate-dates-to-timestamps.sh ubuntu@124.222.234.56:~/
```

### 3. 在服务器上部署

```bash
ssh ubuntu@124.222.234.56

# 解压后端代码
cd /var/www/TimelessLove
tar -xzf ~/timestamp-migration.tar.gz
rm ~/timestamp-migration.tar.gz

# 重新编译后端
cd backend
npm run build

# 执行数据库迁移
chmod +x ~/migrate-dates-to-timestamps.sh
~/migrate-dates-to-timestamps.sh

# 重启后端服务
pm2 restart timeless-love

# 查看日志
pm2 logs timeless-love --lines 50
```

---

## 📝 前端使用示例

### 引入日期工具

```javascript
import { formatDate, formatDateTime, formatDateOnly, formatRelativeTime } from '../../utils/date';
```

### 使用示例

#### 1. 基础格式化

```javascript
// 完整日期时间: 2026-02-13 16:30:45
const fullDateTime = formatDate(timestamp);

// 日期时间（无秒）: 2026-02-13 16:30
const dateTime = formatDateTime(timestamp);

// 仅日期: 2026-02-13
const dateOnly = formatDateOnly(timestamp);
```

#### 2. 相对时间

```javascript
// 相对时间: 刚刚、3分钟前、1小时前、昨天等
const relativeTime = formatRelativeTime(timestamp);
```

#### 3. 在页面中使用

**WXML:**
```xml
<view>创建时间：{{createdTime}}</view>
<view>更新时间：{{updatedTime}}</view>
<view>相对时间：{{relativeTime}}</view>
```

**JS:**
```javascript
import { formatDateTime, formatRelativeTime } from '../../utils/date';

Page({
  data: {
    createdTime: '',
    updatedTime: '',
    relativeTime: '',
  },

  onLoad() {
    // 从 API 获取数据
    const data = {
      created_at: 1739448000000,  // 时间戳
      updated_at: 1739534400000,
    };

    this.setData({
      createdTime: formatDateTime(data.created_at),
      updatedTime: formatDateTime(data.updated_at),
      relativeTime: formatRelativeTime(data.created_at),
    });
  },
});
```

#### 4. 计算时间差

```javascript
import { getDaysBetween } from '../../utils/date';

// 计算恋爱天数
const anniversary = couple.anniversary; // 时间戳
const days = getDaysBetween(anniversary, Date.now());
console.log(`在一起 ${days} 天`);
```

---

## 🔍 后端变更说明

### Schema 变更

**修改前 (Date 类型):**
```typescript
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document {
  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}
```

**修改后 (Number 类型):**
```typescript
@Schema({ timestamps: false })
export class User extends Document {
  @Prop({ type: Number })
  birthday: number;

  @Prop({ type: Number, default: () => Date.now() })
  created_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  updated_at: number;
}

// 自动更新 updated_at
UserSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});
```

### DTO 变更

**修改前:**
```typescript
@IsDateString()
@IsOptional()
birthday?: Date;
```

**修改后:**
```typescript
@IsNumber()
@IsOptional()
birthday?: number;
```

### 业务逻辑变更

**修改前:**
```typescript
const anniversaryDate = createCoupleDto.anniversary 
  ? new Date(createCoupleDto.anniversary) 
  : new Date();
```

**修改后:**
```typescript
const anniversaryTimestamp = createCoupleDto.anniversary || Date.now();
```

---

## ✅ 验证测试

### 1. 测试后端接口

```bash
# 创建用户
curl -X POST https://timelesslove.top/api/auth/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'

# 获取用户信息（检查时间戳格式）
curl -X GET https://timelesslove.top/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# 响应示例：
{
  "code": 20000,
  "data": {
    "_id": "...",
    "nickname": "测试",
    "created_at": 1739448000000,  // ✅ 时间戳
    "updated_at": 1739534400000   // ✅ 时间戳
  }
}
```

### 2. 测试前端格式化

在小程序中：

```javascript
import { formatDateTime } from '../../utils/date';

// 测试
console.log(formatDateTime(1739448000000));
// 输出: 2026-02-13 10:00:00
```

### 3. 验证数据库迁移

```bash
ssh ubuntu@124.222.234.56

mongosh timeless_love --eval "db.users.findOne()"
# 检查 created_at 是否为 Number 类型

mongosh timeless_love --eval "db.users.countDocuments({ created_at: { \$type: 'number' } })"
# 应该返回所有用户数量
```

---

## 🎯 优势

1. **统一格式**: 后端全部使用时间戳，前端统一格式化
2. **类型安全**: Number 类型避免了 Date 序列化问题
3. **易于计算**: 时间戳便于计算时间差、排序等
4. **跨平台**: 时间戳在所有平台通用
5. **性能优化**: 避免 Date 对象的序列化/反序列化开销

---

## ⚠️ 注意事项

1. **小程序端**: 所有从 API 获取的时间字段都是时间戳，需使用 `date.js` 格式化
2. **提交数据**: 提交日期时也需传递时间戳，可用 `new Date(dateString).getTime()`
3. **数据库备份**: 迁移前建议备份数据库
4. **向后兼容**: 迁移脚本会检查 Date 类型并转换，不影响已有数据

---

## 📚 相关文件

- `miniprogram/utils/date.js` - 前端日期格式化工具
- `migrate-dates-to-timestamps.sh` - 数据库迁移脚本
- `backend/src/modules/*/schemas/*.schema.ts` - 后端 Schema 定义
- `backend/src/modules/*/dto/*.dto.ts` - 后端 DTO 定义

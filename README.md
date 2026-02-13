# TimelessLove - 永恒之爱

> 两个人的目标，用心来完成

一款专为情侣打造的任务管理微信小程序。

## 🌐 线上信息

- **小程序**：TimelessLove（已上架）
- **后端API**：<https://timelesslove.top/api>
- **服务器**：124.222.234.56（腾讯云）

## 📖 项目简介

TimelessLove 将日常心愿变成有趣的挑战，让情侣在完成任务中增进默契，积累爱心值升级关系。

### ✨ 核心特性

- 🎯 **任务系统**：个人任务、双人协作、周期任务
- ❤️ **成长系统**：30级CP等级，从"新手情侣"到"TimelessLove"
- 🏆 **等级奖励**：爱心值和爱情币
- 💬 **情侣配对**：邀请码系统，专属二人空间
- 👤 **个人中心**：资料管理、头像上传

## 🛠 技术栈

### 前端

- 微信小程序原生框架
- Vant Weapp UI组件库
- MobX 状态管理

### 后端

- NestJS 10.x
- MongoDB + Mongoose
- Redis 缓存
- JWT 认证

### 部署

- 腾讯云服务器（Ubuntu 24.04）
- Nginx 反向代理
- PM2 进程管理
- Let's Encrypt SSL证书

## 📁 项目结构

```
TimelessLove/
├── miniprogram/          # 小程序前端
│   ├── pages/           # 页面
│   ├── components/      # 组件（待开发）
│   ├── services/        # API服务层
│   └── utils/           # 工具函数
├── backend/             # 后端服务
│   └── src/
│       ├── modules/     # 业务模块
│       └── common/      # 公共模块
└── docs/                # 文档（本目录）
```

## 🚀 已上架功能（V1.0）

- ✅ 用户登录与认证
- ✅ 欢迎页和功能介绍
- ✅ 情侣配对系统
- ✅ 首页信息展示
- ✅ 完整的任务系统（创建→完成→验收→奖励）
- ✅ 个人信息管理
- ✅ 30级成长体系

## 📄 核心文档

- [产品设计文档](./PRODUCT_DESIGN.md) - 完整的产品规划
- [开发提示词](./DEVELOPMENT_PROMPT.md) - 开发速查手册
- [功能路线图](./FEATURE_ROADMAP.md) - 迭代规划和优先级
- [部署运维手册](./DEPLOYMENT_INFO.md) - 服务器管理
- [代码更新指南](./UPDATE_GUIDE.md) - 如何更新服务端
- [功能恢复备份](./REMOVED_FEATURES_BACKUP.md) - 企业主体后可恢复的功能

## 🔧 开发相关

### 本地开发

小程序使用微信开发者工具打开 `miniprogram` 目录即可。

### 服务器更新

参考 [UPDATE_GUIDE.md](./UPDATE_GUIDE.md)

### 恢复UGC功能

升级企业主体后，参考 [REMOVED_FEATURES_BACKUP.md](./REMOVED_FEATURES_BACKUP.md)

## 🎯 下一步开发

查看 [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) 了解详细规划。

推荐优先开发：

1. 任务模板系统
2. 任务提醒推送
3. 每日签到功能
4. 成就系统

## 📝 License

MIT

---

**用心开发，让爱永恒 💕**

**线上地址**：<https://timelesslove.top>
**小程序**：TimelessLove（微信搜索）

# 图片资源说明

## 📋 需要的图片

### Logo
- **文件名**: `logo.png`
- **尺寸**: 建议 512px × 512px 或更大
- **格式**: PNG（透明背景）
- **用途**: 登录页面的 App Logo
- **设计建议**: 
  - 爱心、情侣相关元素
  - 温暖的粉色调 (#FF6B9D)
  - 简洁现代

### 其他可能需要的图片
- 空状态占位图
- 默认头像
- 引导页图片
- 节日特效图片

## 🎨 获取图片资源

### 方式一：自己设计
使用 Figma、Sketch、Canva 等设计工具

### 方式二：使用 AI 生成
- Midjourney
- DALL-E
- Stable Diffusion

### 方式三：图标库
- iconfont.cn
- IconPark
- Flaticon

## 💡 当前状态

目前登录页使用 emoji 图标（💕 和 💬）作为临时占位。

功能完全正常，只是视觉上还需要美化。

## 🔧 添加真实图片后

将图片文件放到此文件夹，然后修改：
- `pages/auth/login/login.wxml` 
- 将 `<view class="logo-text">💕</view>` 改为 `<image class="logo" src="/assets/images/logo.png" mode="aspectFit" />`
- 相应调整 CSS

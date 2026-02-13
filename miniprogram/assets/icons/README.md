# TabBar 图标说明

## 📋 需要的图标

为了显示 tabBar 的图标，需要在这个文件夹中放置以下图标文件：

### 图标列表（每个需要两个状态）

1. **首页**
   - `home.png` - 未选中状态（灰色）
   - `home-active.png` - 选中状态（粉色 #FF6B9D）

2. **任务**
   - `task.png` - 未选中状态
   - `task-active.png` - 选中状态

3. **聊天**
   - `chat.png` - 未选中状态
   - `chat-active.png` - 选中状态

4. **时光**
   - `timeline.png` - 未选中状态
   - `timeline-active.png` - 选中状态

5. **我的**
   - `profile.png` - 未选中状态
   - `profile-active.png` - 选中状态

## 🎨 图标规格

- **尺寸**: 81px × 81px（推荐）
- **格式**: PNG 格式
- **背景**: 透明背景
- **颜色**:
  - 未选中: #999999（灰色）
  - 选中: #FF6B9D（粉色）

## 📦 获取图标的方式

### 方式一：使用 iconfont（推荐）

1. 访问 [iconfont.cn](https://www.iconfont.cn/)
2. 搜索对应的图标（如：home、task、chat、timeline、profile）
3. 下载 PNG 格式，尺寸 81px
4. 使用在线工具更改颜色

### 方式二：使用 IconPark

1. 访问 [IconPark](https://iconpark.oceanengine.com/)
2. 搜索并下载图标
3. 导出为 PNG

### 方式三：使用 Figma/Sketch 设计

自己设计简单的图标

## 🔧 添加图标后

1. 将图标文件放到这个文件夹
2. 打开 `app.json`
3. 在 tabBar 的每个 list 项中添加：

   ```json
   {
     "pagePath": "pages/index/index",
     "text": "首页",
     "iconPath": "assets/icons/home.png",
     "selectedIconPath": "assets/icons/home-active.png"
   }
   ```

4. 重新编译小程序

## 💡 临时方案

当前配置已经移除了图标路径，小程序会使用默认的文字 tabBar。
功能完全正常，只是没有图标而已。

等有了图标文件后，再按上面的方式添加即可。

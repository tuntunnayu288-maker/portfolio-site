# 🎨 Portfolio Website

Toilet Paper Magazine 风格的作品集网站，支持图片画廊和 3D 展示。

## 🚀 访问网站

开发服务器已启动：
- **本地访问**: http://localhost:5173/
- **网络访问**: http://192.168.255.10:5173/

## 📁 项目结构

```
portfolio-site/
├── index.html      # 主页面
├── styles.css      # 样式文件（TP 风格）
├── main.js         # 交互逻辑 + 3D 效果
├── package.json    # 项目配置
└── public/         # 放置你的图片文件
```

## 🖼️ 添加你的图片

### 方法 1：替换示例数据

编辑 `main.js` 中的 `portfolioItems` 数组：

```javascript
const portfolioItems = [
  { 
    id: 1, 
    color: 'color-1',  // color-1 到 color-5
    title: '我的作品 1', 
    type: 'photo',     // 'photo' 或 '3d'
    image: '/public/my-photo-1.jpg'  // 添加图片路径
  },
  // ...
];
```

### 方法 2：放置图片到 public 文件夹

1. 创建 `public` 文件夹
2. 放入你的图片文件（JPG/PNG）
3. 在 `main.js` 中引用

## 🎨 颜色方案

Toilet Paper Magazine 风格的大胆配色：

| 类名 | 颜色 | 效果 |
|------|------|------|
| color-1 | 红色 #ff4757 | 热情、醒目 |
| color-2 | 蓝色 #5352ed | 冷静、科技 |
| color-3 | 橙色 #ffa502 | 活力、温暖 |
| color-4 | 绿色 #2ed573 | 自然、清新 |
| color-5 | 粉色 #ff6b81 | 浪漫、柔和 |

## ✨ 功能特性

- **极简网格布局** - 响应式画廊
- **点击放大** - Lightbox 全屏查看
- **3D 展示** - 标记为 '3d' 的项目会显示 3D 几何体
- **鼠标交互** - 3D 模型跟随鼠标旋转
- **滚轮缩放** - 在 3D 视图上滚动可缩放
- **平滑动画** - 滚动触发的淡入效果
- **加载动画** - 优雅的加载界面

## 🛠️ 命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📱 响应式设计

- 桌面端：多列网格
- 平板端：自适应布局
- 移动端：单列显示

## 🎯 自定义建议

1. **修改品牌色** - 编辑 `styles.css` 中的 CSS 变量
2. **更换字体** - 修改 `--font-main`
3. **添加更多 3D 形状** - 在 `main.js` 的 `init3DViewer` 中修改几何体
4. **添加实际图片** - 替换 placeholder 图片链接

## 📄 License

MIT - 随意使用和修改

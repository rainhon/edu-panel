# 教务管理系统

基于 Vue 3 + Vite 的教务管理系统前端项目。

## 技术栈

- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **Element Plus** - UI 组件库
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Axios** - HTTP 客户端

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 环境变量

- **开发环境**: `.env.development`
  - API 地址: `http://localhost:9000/api`

- **生产环境**: `.env.production`
  - API 地址: `https://poper-ops-interview-04.herokuapp.com/api`

## 项目结构

```
src/
├── api/           # API 请求
├── assets/        # 静态资源
├── components/    # 组件
├── layouts/       # 布局
├── router/        # 路由
├── stores/        # 状态管理
├── views/         # 页面
└── main.js        # 入口
```

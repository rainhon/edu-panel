# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + Vite 的教务管理系统前端项目，支持教师和学生两种角色。系统使用 Element Plus 作为 UI 框架，Pinia 进行状态管理，Vue Router 处理路由。

## 开发命令

### 开发环境
```bash
npm run dev
```
启动开发服务器，默认运行在 `http://localhost:5173`。

开发环境下，API 请求会通过 Vite 代理转发到 `http://localhost:8000`（配置在 vite.config.js）。

### 构建生产版本
```bash
npm run build
```
构建生产版本到 `dist/` 目录。

### 预览生产构建
```bash
npm run preview
```
预览生产构建结果。

## 项目架构

### 目录结构
```
src/
├── api/           # API 请求模块
│   ├── auth.js    # 认证相关 API
│   ├── index.js   # Axios 实例配置
│   ├── student/   # 学生相关 API
│   └── teacher/   # 教师相关 API
├── assets/        # 静态资源（样式、图片等）
├── components/    # 可复用组件
├── composables/   # 组合式函数
├── layouts/       # 布局组件
│   ├── AuthLayout.vue      # 认证布局（登录页）
│   ├── TeacherLayout.vue   # 教师端布局
│   └── StudentLayout.vue   # 学生端布局
├── router/        # 路由配置
│   └── index.js   # 路由定义和守卫
├── stores/        # Pinia 状态管理
│   ├── auth.js    # 认证状态（token、登录状态）
│   └── user.js    # 用户信息状态
├── utils/         # 工具函数
├── views/         # 页面组件
│   ├── auth/      # 认证页面
│   ├── teacher/   # 教师页面
│   └── student/   # 学生页面
├── App.vue        # 根组件
└── main.js        # 应用入口
```

### 核心架构设计

#### 认证与授权流程
- 认证状态存储在 `stores/auth.js` 中，包含 token 和登录状态
- 用户信息存储在 `stores/user.js` 中
- 路由守卫（`router/index.js`）处理权限验证：
  - 检查 `requiresAuth` meta 字段确定是否需要登录
  - 检查 `role` meta 字段验证用户角色（teacher/student）
  - 自动重定向到对应的首页或登录页

#### API 请求架构
- 统一的 Axios 实例配置在 `api/index.js`
- 请求拦截器自动添加 Bearer Token
- 响应拦截器统一处理错误（401 跳转登录、403/404/422/500 显示错误消息）
- 所有 API 返回格式为 `{ success: boolean, data: any, message: string }`

#### 动态布局系统
- `App.vue` 根据路由的 `meta.layout` 字段动态选择布局组件
- 支持 AuthLayout、TeacherLayout、StudentLayout 三种布局

#### 角色路由分离
- 教师路由：`/teacher/*`，包含课程管理、账单管理
- 学生路由：`/student/*`，包含课程查看、账单支付
- 公共路由：`/login` 和 404 页面

## 环境配置

### 开发环境 (.env.development)
- API 基础地址：`http://localhost:9000/api`
- Vite 代理配置将 `/api` 转发到 `http://localhost:8000`

### 生产环境 (.env.production)
- API 基础地址：`https://poper-ops-interview-04.herokuapp.com/api`

## 部署

项目使用 Heroku 部署，配合 Nginx 提供静态文件服务。

### 部署相关文件
- `Procfile`：定义 Heroku 启动命令 `bin/start-nginx-static`
- `config/nginx.conf.erb`：Nginx 配置模板
  - 强制 HTTPS
  - 静态文件根目录：`/app/dist`
  - SPA 路由支持（try_files 配置）

## 关键依赖

- **vue** 3.5.24：前端框架
- **vue-router** 5.0.2：路由管理
- **pinia** 3.0.4：状态管理
- **element-plus** 2.13.2：UI 组件库（中文语言包）
- **axios** 1.13.4：HTTP 客户端
- **@element-plus/icons-vue** 2.3.2：Element Plus 图标
- **date-fns** 4.1.0：日期处理

## 开发注意事项

### 路由守卫逻辑
路由守卫会自动：
1. 检查 token 是否存在
2. 如果有 token 但无用户信息，自动获取用户信息
3. 验证用户角色是否匹配路由要求
4. 已登录用户访问 `/login` 会重定向到对应角色的首页

### Token 管理
- Token 存储在 localStorage 中（通过 `utils/storage.js`）
- Token 过期（401 响应）会自动清除并跳转登录页
- 请求时自动添加 `Authorization: Bearer ${token}` 头

### API 错误处理
所有 API 错误会通过 Element Plus 的 `ElMessage` 自动显示给用户，无需在组件中重复处理错误消息。

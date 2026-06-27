# 乌东文旅 · 第四组 · 行·线路订票

本项目为《人工智能工程实践》课程设计，第四组负责“行·线路订票”模块，涵盖景区门票、苗寨路线套餐、电子票等业务。

## 仓库结构

```
wudong-group4/
├── backend/              # Midway + TypeORM + MySQL 后端接口（端口 3000）
├── web/                  # React + Vite PC Web 端（端口 5173）
├── miniprogram/          # 微信小程序端
├── admin/                # React + Vite + Ant Design 后台管理端（端口 5174）
├── sql/                  # 数据库初始化脚本
├── docs/                 # 接口测试截图、设计文档
└── README.md             # 本文件
```

## 核心模块

- 景区管理（`scenic_spot`）
- 票种管理（`ticket_type`）
- 路线套餐（`route_package`）
- 路线行程（`route_itinerary`）
- 电子票（`electronic_ticket`）
- 票种日库存（`ticket_inventory`，管理后台额外功能）

## 快速启动

### 1. 数据库

```bash
# 登录 MySQL 后执行
mysql -u root -p < sql/init.sql
```

### 2. 后端

```bash
cd backend
npm install
npm run dev
```

### 3. Web 端

```bash
cd web
npm install
npm run dev
```

### 4. 管理后台

```bash
cd admin
npm install
npm run dev
```

### 5. 微信小程序

使用微信开发者工具打开 `miniprogram` 目录，勾选「不校验合法域名」。

## Docker 一键部署

```bash
docker network create wudong-net
docker-compose up -d
```

访问：http://localhost

## 小组成员与分工

| 角色 | 姓名 | 负责方向 |
|------|------|----------|
| A | （填写） | 后端接口 / 数据库设计 |
| B | （填写） | PC Web 端 |
| C | （填写） | 微信小程序端 |
| D | （填写） | 后台管理端 / Docker 部署 |

## 接口文档

本地启动后端后，基础地址：`http://localhost:3000`

主要接口：

- `GET /api/scenic-spot/list`
- `GET /api/scenic-spot/detail/:id`
- `POST /api/scenic-spot/create`
- `POST /api/scenic-spot/update/:id`
- `POST /api/scenic-spot/delete/:id`
- `GET /api/ticket-type/list?scenicSpotId=1`
- `GET /api/route-package/list`
- `GET /api/route-package/detail/:id`
- `POST /api/electronic-ticket/create`
- `POST /api/admin/login`
- ...

详见后端源码 `backend/src/controller/`。

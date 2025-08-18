# 宝宝取名网站API文档

## 1. API概述

本文档描述了宝宝取名网站的API接口，包括名字推荐、名字详情查询、用户认证等功能。所有API均采用RESTful设计风格，支持JSON格式的请求和响应。

### 1.1 基础URL

- 开发环境：`http://localhost:3000/api`
- 测试环境：`https://test-api.babyname.example.com/api`
- 生产环境：`https://api.babyname.example.com/api`

### 1.2 认证方式

除了公开接口外，其他接口需要通过以下方式进行认证：

- Bearer Token认证：在请求头中添加`Authorization: Bearer {token}`
- API密钥认证：在请求头中添加`X-API-Key: {api_key}`

### 1.3 响应格式

所有API响应均使用以下统一格式：

```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功"
}
```

错误响应：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 1.4 状态码

- 200: 请求成功
- 201: 资源创建成功
- 400: 请求参数错误
- 401: 未认证或认证失败
- 403: 权限不足
- 404: 资源不存在
- 429: 请求过于频繁
- 500: 服务器内部错误

## 2. 名字API

### 2.1 获取名字推荐

根据用户提供的条件推荐适合的名字。

**请求**

```
POST /api/names/recommend
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| familyName | string | 是 | 姓氏 |
| gender | string | 是 | 性别，可选值：male, female |
| birthdate | string | 否 | 出生日期，格式：YYYY-MM-DD |
| preferences | array | 否 | 偏好标签，如["文学", "自然"] |
| count | number | 否 | 返回名字数量，默认10，最大20 |

**请求示例**

```json
{
  "familyName": "张",
  "gender": "male",
  "birthdate": "2023-05-15",
  "preferences": ["文学", "自然"],
  "count": 10
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "names": [
      {
        "id": "123",
        "firstName": "浩",
        "secondName": "然",
        "meaning": "宽广、正大、光明磊落",
        "popularity": 65,
        "fiveElements": ["水", "火"]
      },
      {
        "id": "124",
        "firstName": "子",
        "secondName": "墨",
        "meaning": "有学识、有才华、有深度",
        "popularity": 45,
        "fiveElements": ["水", "水"]
      },
      // 更多名字...
    ]
  },
  "message": "名字推荐成功"
}
```

### 2.2 获取名字详情

根据名字ID获取详细信息。

**请求**

```
GET /api/names/:id
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | string | 是 | 名字ID |

**响应**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "familyName": "张",
    "firstName": "浩",
    "secondName": "然",
    "fullName": "张浩然",
    "meaning": "宽广、正大、光明磊落",
    "popularity": 65,
    "strokes": 20,
    "fiveElements": ["水", "火"],
    "analysis": {
      "harmony": 85,
      "uniqueness": 70,
      "fortune": 80
    },
    "relatedPersons": [
      {
        "name": "张浩然",
        "description": "当代著名作家",
        "birthYear": 1985
      }
    ],
    "references": [
      {
        "source": "诗经",
        "quote": "浩浩荡荡，归于大海"
      }
    ]
  },
  "message": "获取名字详情成功"
}
```

### 2.3 名字高级分析

对指定名字进行高级分析，包括生辰八字、音律等。

**请求**

```
POST /api/names/analyze
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| familyName | string | 是 | 姓氏 |
| firstName | string | 是 | 名字首字 |
| secondName | string | 是 | 名字次字 |
| birthdate | string | 是 | 出生日期时间，格式：YYYY-MM-DD HH:mm |
| birthplace | string | 否 | 出生地点 |
| analysisTypes | array | 否 | 分析类型，可选值：["fiveElements", "soundPattern", "strokes", "fortune"] |

**请求示例**

```json
{
  "familyName": "张",
  "firstName": "浩",
  "secondName": "然",
  "birthdate": "2023-05-15 08:30",
  "birthplace": "北京",
  "analysisTypes": ["fiveElements", "soundPattern"]
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "name": "张浩然",
    "analyses": {
      "fiveElements": {
        "familyName": "木",
        "firstName": "水",
        "secondName": "火",
        "overall": "木水火",
        "compatibility": 85,
        "recommendation": "五行搭配和谐，木生火，水生木，循环相生"
      },
      "soundPattern": {
        "tones": [1, 3, 2],
        "pattern": "平仄平",
        "harmony": 90,
        "recommendation": "音律和谐，朗朗上口"
      }
    }
  },
  "message": "名字分析成功"
}
```

## 3. 用户API

### 3.1 用户注册

创建新用户账号。

**请求**

```
POST /api/users/register
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| email | string | 是 | 电子邮箱 |
| password | string | 是 | 密码，至少8位 |
| name | string | 是 | 用户姓名 |

**请求示例**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "张三"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "张三",
    "createdAt": "2023-05-15T08:30:00Z"
  },
  "message": "注册成功"
}
```

### 3.2 用户登录

用户登录并获取认证令牌。

**请求**

```
POST /api/users/login
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| email | string | 是 | 电子邮箱 |
| password | string | 是 | 密码 |

**请求示例**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "张三"
    }
  },
  "message": "登录成功"
}
```

### 3.3 收藏名字

将名字添加到用户收藏列表。

**请求**

```
POST /api/users/favorites
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| nameId | string | 是 | 名字ID |

**请求示例**

```json
{
  "nameId": "123"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "fav123",
    "nameId": "123",
    "userId": "user123",
    "createdAt": "2023-05-15T10:30:00Z"
  },
  "message": "收藏成功"
}
```

### 3.4 获取收藏列表

获取用户收藏的名字列表。

**请求**

```
GET /api/users/favorites
```

**参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |

**响应**

```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "fav123",
        "nameId": "123",
        "name": {
          "familyName": "张",
          "firstName": "浩",
          "secondName": "然",
          "meaning": "宽广、正大、光明磊落"
        },
        "createdAt": "2023-05-15T10:30:00Z"
      },
      // 更多收藏...
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  },
  "message": "获取收藏列表成功"
}
```

## 4. 错误代码

| 错误代码 | 描述 |
|---------|------|
| INVALID_PARAMS | 请求参数无效 |
| NAME_NOT_FOUND | 名字不存在 |
| USER_EXISTS | 用户已存在 |
| INVALID_CREDENTIALS | 登录凭证无效 |
| UNAUTHORIZED | 未授权访问 |
| TOO_MANY_REQUESTS | 请求频率超限 |
| SERVER_ERROR | 服务器内部错误 |

## 5. 速率限制

为保护API服务，我们实施了以下速率限制：

- 公开API：每IP每分钟60次请求
- 认证API：每用户每分钟120次请求
- 高级分析API：每用户每小时100次请求

超过限制将返回429状态码和以下响应：

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "请求频率超限，请稍后再试"
  }
}
```

## 6. API版本控制

API版本通过URL路径指定，当前版本为v1：

```
https://api.babyname.example.com/api/v1/names/recommend
```

未来版本将通过路径中的版本号区分，如v2：

```
https://api.babyname.example.com/api/v2/names/recommend
```

我们将确保向后兼容性，并在引入重大变更前提供充分的过渡期。
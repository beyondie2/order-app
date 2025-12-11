# COZY Coffee Order API Server

커피 주문 앱의 백엔드 API 서버입니다.

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: pg (node-postgres)

## 시작하기

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 PostgreSQL 연결 정보를 입력합니다.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. 데이터베이스 초기화

PostgreSQL이 실행 중인지 확인한 후, 데이터베이스를 초기화합니다.

```bash
npm run db:init
```

### 4. 서버 실행

**개발 모드** (자동 재시작):
```bash
npm run dev
```

**프로덕션 모드**:
```bash
npm start
```

서버가 http://localhost:3000 에서 실행됩니다.

## API 엔드포인트

### 헬스 체크
- `GET /api/health` - 서버 상태 확인

### 메뉴
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회
- `PATCH /api/menus/:id/stock` - 재고 수정

### 옵션
- `GET /api/options` - 옵션 목록 조회
- `GET /api/options/:id` - 특정 옵션 조회

### 주문
- `GET /api/orders` - 주문 목록 조회 (통계 포함)
- `GET /api/orders/:id` - 주문 상세 조회
- `POST /api/orders` - 주문 생성
- `PATCH /api/orders/:id/status` - 주문 상태 변경

## 프로젝트 구조

```
server/
├── src/
│   ├── app.js              # Express 앱 설정
│   ├── db/
│   │   ├── index.js        # DB 연결 설정
│   │   ├── init.js         # DB 초기화 스크립트
│   │   └── init.sql        # 테이블 생성 SQL
│   └── routes/
│       ├── menus.js        # 메뉴 API
│       ├── options.js      # 옵션 API
│       └── orders.js       # 주문 API
├── .env                    # 환경 변수 (git 제외)
├── .gitignore
├── package.json
└── README.md
```

## 테스트

API 테스트는 Postman, Insomnia 또는 curl을 사용할 수 있습니다.

```bash
# 헬스 체크
curl http://localhost:3000/api/health

# 메뉴 목록 조회
curl http://localhost:3000/api/menus

# 주문 생성
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "options": ["샷 추가"],
        "quantity": 1,
        "unitPrice": 4500,
        "totalPrice": 4500
      }
    ],
    "totalAmount": 4500
  }'
```


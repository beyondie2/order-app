# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본 사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

---

## 4. 화면 설계

### 4.1 주문하기 화면

#### 4.1.1 화면 개요
- **화면명**: 주문하기
- **목적**: 사용자가 메뉴를 선택하고 옵션을 추가하여 장바구니에 담은 후 주문을 완료하는 화면
- **URL**: `/order` 또는 `/` (메인 페이지)

#### 4.1.2 화면 구성

##### A. 헤더 (Header)
| 구성요소 | 설명 |
|---------|------|
| 로고 | "COZY" 텍스트 로고, 왼쪽 정렬 |
| 네비게이션 | "주문하기", "관리자" 버튼, 오른쪽 정렬 |

- 현재 선택된 메뉴(주문하기)는 시각적으로 구분됨 (테두리 표시)
- 각 버튼 클릭 시 해당 화면으로 이동

##### B. 메뉴 목록 (Menu List)
| 구성요소 | 설명 |
|---------|------|
| 레이아웃 | 가로 방향 카드 형태로 나열 (반응형 그리드) |
| 메뉴 카드 | 각 메뉴 항목을 카드 형태로 표시 |

**메뉴 카드 구성:**
| 요소 | 설명 | 예시 |
|-----|------|------|
| 상품 이미지 | 메뉴 이미지 표시 영역 | 이미지 또는 플레이스홀더 |
| 상품명 | 메뉴 이름 (온도 구분 포함) | 아메리카노(ICE), 아메리카노(HOT), 카페라떼 |
| 가격 | 기본 가격 표시 | 4,000원, 5,000원 |
| 설명 | 메뉴에 대한 간단한 설명 | "간단한 설명..." |
| 옵션 | 체크박스 형태의 추가 옵션 | 샷 추가 (+500원), 시럽 추가 (+0원) |
| 담기 버튼 | 장바구니에 추가하는 버튼 | "담기" |

**옵션 상세:**
| 옵션명 | 추가 금액 | 타입 |
|-------|----------|------|
| 샷 추가 | +500원 | 체크박스 |
| 시럽 추가 | +0원 | 체크박스 |

##### C. 장바구니 (Cart)
| 구성요소 | 설명 |
|---------|------|
| 제목 | "장바구니" |
| 상품 목록 | 담긴 상품들의 리스트 |
| 총 금액 | 모든 상품 금액의 합계 |
| 주문하기 버튼 | 주문을 완료하는 버튼 |

**장바구니 상품 항목 구성:**
| 요소 | 설명 | 예시 |
|-----|------|------|
| 상품명 | 메뉴 이름 (온도 포함) | 아메리카노(ICE) |
| 선택 옵션 | 추가된 옵션 표시 | (샷 추가) |
| 수량 | 해당 상품의 수량 | X 1, X 2 |
| 금액 | 해당 상품의 총 금액 (옵션 포함) | 4,500원, 8,000원 |

**금액 계산 예시:**
- 아메리카노(ICE) 4,000원 + 샷 추가 500원 = 4,500원 × 1개 = 4,500원
- 아메리카노(HOT) 4,000원 × 2개 = 8,000원
- **총 금액: 12,500원**

#### 4.1.3 기능 요구사항

| ID | 기능 | 설명 |
|----|-----|------|
| ORD-001 | 메뉴 조회 | 화면 로드 시 모든 메뉴를 서버에서 조회하여 표시 |
| ORD-002 | 옵션 선택 | 각 메뉴별로 옵션(샷 추가, 시럽 추가)을 체크박스로 선택 가능 |
| ORD-003 | 장바구니 담기 | "담기" 버튼 클릭 시 선택한 옵션과 함께 장바구니에 추가 |
| ORD-004 | 장바구니 표시 | 담긴 상품명, 옵션, 수량, 금액을 목록으로 표시 |
| ORD-005 | 금액 계산 | 기본 가격 + 옵션 가격을 합산하여 상품별 금액 및 총 금액 계산 |
| ORD-006 | 수량 관리 | 동일 상품+옵션 조합 추가 시 수량 증가 |
| ORD-007 | 주문 완료 | "주문하기" 버튼 클릭 시 주문 정보를 서버에 전송 |

#### 4.1.4 UI/UX 요구사항

| ID | 요구사항 | 설명 |
|----|---------|------|
| UI-001 | 반응형 레이아웃 | 메뉴 카드는 화면 크기에 따라 가로 배치 조정 |
| UI-002 | 현재 메뉴 표시 | 네비게이션에서 현재 페이지(주문하기)를 시각적으로 구분 |
| UI-003 | 가격 형식 | 천 단위 콤마 표시 (예: 4,000원, 12,500원) |
| UI-004 | 장바구니 실시간 갱신 | 상품 담기 시 장바구니 영역 즉시 업데이트 |
| UI-005 | 버튼 스타일 | 담기/주문하기 버튼은 테두리 스타일로 표시 |

#### 4.1.5 데이터 구조

**메뉴 데이터:**
```json
{
  "id": 1,
  "name": "아메리카노",
  "temperature": "ICE",
  "price": 4000,
  "description": "간단한 설명...",
  "imageUrl": "/images/americano-ice.jpg"
}
```

**옵션 데이터:**
```json
{
  "id": 1,
  "name": "샷 추가",
  "price": 500
}
```

**장바구니 아이템:**
```json
{
  "menuId": 1,
  "menuName": "아메리카노(ICE)",
  "options": ["샷 추가"],
  "quantity": 1,
  "unitPrice": 4500,
  "totalPrice": 4500
}
```

**주문 요청:**
```json
{
  "items": [
    {
      "menuId": 1,
      "options": ["샷 추가"],
      "quantity": 1
    },
    {
      "menuId": 2,
      "options": [],
      "quantity": 2
    }
  ],
  "totalAmount": 12500
}
```

---

### 4.2 관리자 화면

#### 4.2.1 화면 개요
- **화면명**: 관리자
- **목적**: 관리자가 주문 현황을 확인하고, 재고를 관리하며, 주문 상태를 변경할 수 있는 화면
- **URL**: `/admin`

#### 4.2.2 화면 구성

##### A. 헤더 (Header)
| 구성요소 | 설명 |
|---------|------|
| 로고 | "COZY" 텍스트 로고, 왼쪽 정렬 |
| 네비게이션 | "주문하기", "관리자" 버튼, 오른쪽 정렬 |

- 현재 선택된 메뉴(관리자)는 시각적으로 구분됨 (테두리 표시)
- 각 버튼 클릭 시 해당 화면으로 이동

##### B. 관리자 대시보드 (Admin Dashboard)
| 구성요소 | 설명 |
|---------|------|
| 제목 | "관리자 대시보드" |
| 통계 정보 | 주문 상태별 건수를 한 줄로 표시 |

**통계 항목:**
| 항목 | 설명 | 예시 |
|-----|------|------|
| 총 주문 | 전체 주문 건수 | 총 주문 1 |
| 주문 접수 | 접수된 주문 건수 | 주문 접수 1 |
| 제조 중 | 제조 중인 주문 건수 | 제조 중 0 |
| 제조 완료 | 완료된 주문 건수 | 제조 완료 0 |

##### C. 재고 현황 (Inventory Status)
| 구성요소 | 설명 |
|---------|------|
| 제목 | "재고 현황" |
| 레이아웃 | 가로 방향 카드 형태로 나열 |
| 재고 카드 | 각 메뉴별 재고를 카드 형태로 표시 |

**재고 카드 구성:**
| 요소 | 설명 | 예시 |
|-----|------|------|
| 상품명 | 메뉴 이름 (온도 구분 포함) | 아메리카노 (ICE), 아메리카노 (HOT), 카페라떼 |
| 재고 수량 | 현재 재고 수량 표시 | 10개 |
| 수량 조절 버튼 | +/- 버튼으로 재고 수량 조절 | [+] [-] |

##### D. 주문 현황 (Order Status)
| 구성요소 | 설명 |
|---------|------|
| 제목 | "주문 현황" |
| 주문 목록 | 접수된 주문들의 리스트 |

**주문 항목 구성:**
| 요소 | 설명 | 예시 |
|-----|------|------|
| 주문 일시 | 주문이 접수된 날짜와 시간 | 7월 31일 13:00 |
| 주문 내역 | 메뉴명 × 수량 | 아메리카노(ICE) x 1 |
| 금액 | 해당 주문의 총 금액 | 4,000원 |
| 상태 버튼 | 주문 상태를 변경하는 버튼 | "주문 접수", "제조 중", "제조 완료" |

**주문 상태 흐름:**
| 현재 상태 | 버튼 텍스트 | 클릭 시 변경되는 상태 |
|----------|-----------|-------------------|
| 신규 주문 | 주문 접수 | 주문 접수 |
| 주문 접수 | 제조 시작 | 제조 중 |
| 제조 중 | 제조 완료 | 제조 완료 |

#### 4.2.3 기능 요구사항

| ID | 기능 | 설명 |
|----|-----|------|
| ADM-001 | 대시보드 조회 | 화면 로드 시 주문 상태별 통계를 조회하여 표시 |
| ADM-002 | 재고 조회 | 모든 메뉴의 현재 재고 수량을 조회하여 표시 |
| ADM-003 | 재고 증가 | + 버튼 클릭 시 해당 메뉴의 재고 수량 1 증가 |
| ADM-004 | 재고 감소 | - 버튼 클릭 시 해당 메뉴의 재고 수량 1 감소 (최소 0) |
| ADM-005 | 주문 목록 조회 | 모든 주문을 목록으로 조회하여 표시 |
| ADM-006 | 주문 상태 변경 | 상태 버튼 클릭 시 주문 상태를 다음 단계로 변경 |
| ADM-007 | 실시간 갱신 | 주문 상태 변경 시 대시보드 통계 즉시 업데이트 |

#### 4.2.4 UI/UX 요구사항

| ID | 요구사항 | 설명 |
|----|---------|------|
| UI-006 | 섹션 구분 | 대시보드, 재고 현황, 주문 현황을 테두리 박스로 구분 |
| UI-007 | 현재 메뉴 표시 | 네비게이션에서 현재 페이지(관리자)를 시각적으로 구분 |
| UI-008 | 카드 레이아웃 | 재고 카드는 가로 방향으로 나열 |
| UI-009 | 버튼 스타일 | 수량 조절 버튼(+/-)과 상태 버튼은 테두리 스타일로 표시 |
| UI-010 | 가격 형식 | 천 단위 콤마 표시 (예: 4,000원) |
| UI-011 | 날짜 형식 | "M월 D일 HH:mm" 형식으로 표시 (예: 7월 31일 13:00) |

#### 4.2.5 데이터 구조

**재고 데이터:**
```json
{
  "menuId": 1,
  "menuName": "아메리카노 (ICE)",
  "stock": 10
}
```

**주문 데이터:**
```json
{
  "id": 1,
  "orderDate": "2024-07-31T13:00:00",
  "items": [
    {
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "options": [],
      "quantity": 1,
      "unitPrice": 4000,
      "totalPrice": 4000
    }
  ],
  "totalAmount": 4000,
  "status": "pending"
}
```

**주문 상태 값:**
| 상태 코드 | 설명 | 화면 표시 |
|----------|-----|----------|
| pending | 신규 주문 (접수 대기) | 주문 접수 버튼 표시 |
| accepted | 주문 접수됨 | 제조 시작 버튼 표시 |
| preparing | 제조 중 | 제조 완료 버튼 표시 |
| completed | 제조 완료 | 완료 상태 표시 |

**대시보드 통계 데이터:**
```json
{
  "totalOrders": 1,
  "acceptedOrders": 1,
  "preparingOrders": 0,
  "completedOrders": 0
}
```

**재고 수정 요청:**
```json
{
  "menuId": 1,
  "stock": 11
}
```

**주문 상태 변경 요청:**
```json
{
  "orderId": 1,
  "status": "accepted"
}
```

---

## 5. 백엔드 설계

### 5.1 데이터 모델

#### 5.1.1 Menus (메뉴)

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| id | SERIAL | 메뉴 고유 ID | PRIMARY KEY |
| name | VARCHAR(100) | 커피 이름 | NOT NULL |
| temperature | VARCHAR(10) | 온도 (ICE/HOT) | NOT NULL |
| description | TEXT | 메뉴 설명 | |
| price | INTEGER | 가격 (원) | NOT NULL, DEFAULT 0 |
| image_url | VARCHAR(255) | 이미지 URL | |
| stock | INTEGER | 재고 수량 | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | 생성일시 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT NOW() |

**DDL:**
```sql
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    temperature VARCHAR(10) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**초기 데이터:**
```sql
INSERT INTO menus (name, temperature, description, price, stock) VALUES
('아메리카노', 'ICE', '깔끔한 에스프레소와 시원한 얼음의 조화', 4000, 10),
('아메리카노', 'HOT', '진한 에스프레소의 풍부한 향', 4000, 10),
('카페라떼', 'ICE', '부드러운 우유와 에스프레소의 만남', 5000, 10),
('카페라떼', 'HOT', '따뜻한 우유 거품 위 에스프레소', 5000, 10),
('바닐라라떼', 'ICE', '달콤한 바닐라 시럽이 들어간 라떼', 5500, 10),
('카라멜마끼아또', 'ICE', '달콤한 카라멜 드리즐이 올라간 라떼', 6000, 10);
```

#### 5.1.2 Options (옵션)

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| id | SERIAL | 옵션 고유 ID | PRIMARY KEY |
| name | VARCHAR(50) | 옵션 이름 | NOT NULL |
| price | INTEGER | 추가 가격 (원) | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | 생성일시 | DEFAULT NOW() |

**DDL:**
```sql
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**초기 데이터:**
```sql
INSERT INTO options (name, price) VALUES
('샷 추가', 500),
('시럽 추가', 0);
```

#### 5.1.3 Orders (주문)

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| id | SERIAL | 주문 고유 ID | PRIMARY KEY |
| order_date | TIMESTAMP | 주문 일시 | NOT NULL, DEFAULT NOW() |
| total_amount | INTEGER | 총 주문 금액 | NOT NULL |
| status | VARCHAR(20) | 주문 상태 | NOT NULL, DEFAULT 'pending' |
| created_at | TIMESTAMP | 생성일시 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 수정일시 | DEFAULT NOW() |

**주문 상태 값:**
- `pending`: 신규 주문 (접수 대기)
- `accepted`: 주문 접수됨
- `preparing`: 제조 중
- `completed`: 제조 완료

**DDL:**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 5.1.4 Order_Items (주문 상세)

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| id | SERIAL | 주문 상세 고유 ID | PRIMARY KEY |
| order_id | INTEGER | 주문 ID | FOREIGN KEY → orders(id) |
| menu_id | INTEGER | 메뉴 ID | FOREIGN KEY → menus(id) |
| menu_name | VARCHAR(100) | 주문 시점 메뉴명 | NOT NULL |
| quantity | INTEGER | 수량 | NOT NULL, DEFAULT 1 |
| unit_price | INTEGER | 단가 (옵션 포함) | NOT NULL |
| total_price | INTEGER | 소계 (단가 × 수량) | NOT NULL |
| options | TEXT | 선택한 옵션 (JSON) | |

**DDL:**
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER NOT NULL REFERENCES menus(id),
    menu_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    options TEXT
);
```

#### 5.1.5 ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   menus     │       │   orders    │       │   options   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ name        │       │ order_date  │       │ name        │
│ temperature │       │ total_amount│       │ price       │
│ description │       │ status      │       │ created_at  │
│ price       │       │ created_at  │       └─────────────┘
│ image_url   │       │ updated_at  │
│ stock       │       └──────┬──────┘
│ created_at  │              │
│ updated_at  │              │ 1:N
└──────┬──────┘              │
       │                     │
       │ 1:N    ┌────────────┴────────────┐
       │        │      order_items        │
       └────────┤─────────────────────────┤
                │ id (PK)                 │
                │ order_id (FK → orders)  │
                │ menu_id (FK → menus)    │
                │ menu_name               │
                │ quantity                │
                │ unit_price              │
                │ total_price             │
                │ options                 │
                └─────────────────────────┘
```

---

### 5.2 사용자 흐름 (User Flow)

#### 5.2.1 주문하기 화면 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│  1. 화면 로드                                                    │
│     └─→ GET /api/menus 호출                                     │
│         └─→ Menus 테이블에서 메뉴 목록 조회                        │
│             └─→ 메뉴 카드로 화면에 표시 (재고 0인 메뉴는 '품절' 표시)  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. 메뉴 선택                                                    │
│     └─→ 사용자가 옵션 선택 후 '담기' 클릭                          │
│         └─→ 프론트엔드 장바구니(state)에 추가                       │
│             └─→ 장바구니 UI 실시간 업데이트                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. 주문하기                                                     │
│     └─→ '주문하기' 버튼 클릭                                      │
│         └─→ POST /api/orders 호출 (주문 정보 전송)                 │
│             └─→ Orders 테이블에 주문 저장                         │
│             └─→ Order_Items 테이블에 주문 상세 저장                 │
│             └─→ Menus 테이블의 재고 차감 (stock - quantity)        │
│             └─→ 주문 완료 메시지 표시                              │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 관리자 화면 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│  1. 화면 로드                                                    │
│     └─→ GET /api/menus 호출 (재고 현황)                          │
│     └─→ GET /api/orders 호출 (주문 현황)                         │
│         └─→ 대시보드 통계, 재고 현황, 주문 목록 표시                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. 재고 관리                                                    │
│     └─→ +/- 버튼 클릭                                            │
│         └─→ PATCH /api/menus/:id/stock 호출                     │
│             └─→ Menus 테이블의 재고 수량 업데이트                   │
│             └─→ 재고 현황 UI 업데이트                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. 주문 상태 관리                                                │
│     └─→ 상태 버튼 클릭 (주문 접수 → 제조 시작 → 제조 완료)           │
│         └─→ PATCH /api/orders/:id/status 호출                   │
│             └─→ Orders 테이블의 status 업데이트                    │
│             └─→ 주문 현황 및 대시보드 통계 UI 업데이트               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.3 API 설계

#### 5.3.1 API 개요

| 기능 | Method | Endpoint | 설명 |
|------|--------|----------|------|
| 메뉴 목록 조회 | GET | /api/menus | 모든 메뉴 목록 조회 |
| 옵션 목록 조회 | GET | /api/options | 모든 옵션 목록 조회 |
| 재고 수정 | PATCH | /api/menus/:id/stock | 특정 메뉴의 재고 수량 수정 |
| 주문 생성 | POST | /api/orders | 새 주문 생성 |
| 주문 목록 조회 | GET | /api/orders | 모든 주문 목록 조회 |
| 주문 상세 조회 | GET | /api/orders/:id | 특정 주문 상세 조회 |
| 주문 상태 변경 | PATCH | /api/orders/:id/status | 특정 주문의 상태 변경 |

---

#### 5.3.2 메뉴 관련 API

##### GET /api/menus

**설명:** 모든 메뉴 목록을 조회합니다.

**Request:**
```
GET /api/menus
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노",
      "temperature": "ICE",
      "description": "깔끔한 에스프레소와 시원한 얼음의 조화",
      "price": 4000,
      "imageUrl": null,
      "stock": 10
    },
    {
      "id": 2,
      "name": "아메리카노",
      "temperature": "HOT",
      "description": "진한 에스프레소의 풍부한 향",
      "price": 4000,
      "imageUrl": null,
      "stock": 10
    }
  ]
}
```

---

##### PATCH /api/menus/:id/stock

**설명:** 특정 메뉴의 재고 수량을 수정합니다.

**Request:**
```
PATCH /api/menus/1/stock
Content-Type: application/json

{
  "stock": 15
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노",
    "temperature": "ICE",
    "stock": 15
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "메뉴를 찾을 수 없습니다."
}
```

---

#### 5.3.3 옵션 관련 API

##### GET /api/options

**설명:** 모든 옵션 목록을 조회합니다.

**Request:**
```
GET /api/options
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "샷 추가",
      "price": 500
    },
    {
      "id": 2,
      "name": "시럽 추가",
      "price": 0
    }
  ]
}
```

---

#### 5.3.4 주문 관련 API

##### POST /api/orders

**설명:** 새 주문을 생성하고, 주문한 메뉴의 재고를 차감합니다.

**Request:**
```
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "options": ["샷 추가"],
      "quantity": 2,
      "unitPrice": 4500,
      "totalPrice": 9000
    },
    {
      "menuId": 3,
      "menuName": "카페라떼(ICE)",
      "options": [],
      "quantity": 1,
      "unitPrice": 5000,
      "totalPrice": 5000
    }
  ],
  "totalAmount": 14000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderDate": "2024-12-12T14:30:00.000Z",
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "options": ["샷 추가"],
        "quantity": 2,
        "unitPrice": 4500,
        "totalPrice": 9000
      },
      {
        "menuId": 3,
        "menuName": "카페라떼(ICE)",
        "options": [],
        "quantity": 1,
        "unitPrice": 5000,
        "totalPrice": 5000
      }
    ],
    "totalAmount": 14000,
    "status": "pending"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "재고가 부족합니다.",
  "details": {
    "menuId": 1,
    "menuName": "아메리카노(ICE)",
    "requested": 5,
    "available": 3
  }
}
```

---

##### GET /api/orders

**설명:** 모든 주문 목록을 조회합니다 (최신순 정렬).

**Request:**
```
GET /api/orders
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "orderDate": "2024-12-12T15:00:00.000Z",
      "items": [
        {
          "menuId": 2,
          "menuName": "아메리카노(HOT)",
          "options": [],
          "quantity": 1,
          "unitPrice": 4000,
          "totalPrice": 4000
        }
      ],
      "totalAmount": 4000,
      "status": "preparing"
    },
    {
      "id": 1,
      "orderDate": "2024-12-12T14:30:00.000Z",
      "items": [
        {
          "menuId": 1,
          "menuName": "아메리카노(ICE)",
          "options": ["샷 추가"],
          "quantity": 2,
          "unitPrice": 4500,
          "totalPrice": 9000
        }
      ],
      "totalAmount": 9000,
      "status": "completed"
    }
  ],
  "stats": {
    "totalOrders": 2,
    "pendingOrders": 0,
    "acceptedOrders": 0,
    "preparingOrders": 1,
    "completedOrders": 1
  }
}
```

---

##### GET /api/orders/:id

**설명:** 특정 주문의 상세 정보를 조회합니다.

**Request:**
```
GET /api/orders/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderDate": "2024-12-12T14:30:00.000Z",
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "options": ["샷 추가"],
        "quantity": 2,
        "unitPrice": 4500,
        "totalPrice": 9000
      }
    ],
    "totalAmount": 9000,
    "status": "completed"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

---

##### PATCH /api/orders/:id/status

**설명:** 특정 주문의 상태를 변경합니다.

**상태 흐름:** `pending` → `accepted` → `preparing` → `completed`

**Request:**
```
PATCH /api/orders/1/status
Content-Type: application/json

{
  "status": "accepted"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "accepted",
    "updatedAt": "2024-12-12T14:35:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "유효하지 않은 상태 값입니다."
}
```

---

### 5.4 프로젝트 구조

```
order-app/
├── docs/
│   └── PRD.md
├── ui/                          # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── api/                         # 백엔드 (Node.js + Express)
    ├── src/
    │   ├── routes/
    │   │   ├── menus.js         # 메뉴 라우트
    │   │   ├── options.js       # 옵션 라우트
    │   │   └── orders.js        # 주문 라우트
    │   ├── db/
    │   │   ├── index.js         # DB 연결 설정
    │   │   └── init.sql         # 테이블 생성 및 초기 데이터
    │   └── app.js               # Express 앱 설정
    ├── .env                     # 환경 변수 (DB 연결 정보)
    └── package.json
```

---

### 5.5 환경 변수

```env
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order
DB_USER=postgres
DB_PASSWORD=your_password

PORT=3000
```
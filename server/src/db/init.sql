-- 커피 주문 앱 데이터베이스 초기화 스크립트

-- 기존 테이블 삭제 (개발용)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS menus CASCADE;

-- 메뉴 테이블 생성
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

-- 옵션 테이블 생성
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 주문 테이블 생성
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 주문 상세 테이블 생성
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

-- 인덱스 생성
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 초기 메뉴 데이터 삽입
INSERT INTO menus (name, temperature, description, price, stock) VALUES
('아메리카노', 'ICE', '깔끔한 에스프레소와 시원한 얼음의 조화', 4000, 10),
('아메리카노', 'HOT', '진한 에스프레소의 풍부한 향', 4000, 10),
('카페라떼', 'ICE', '부드러운 우유와 에스프레소의 만남', 5000, 10),
('카페라떼', 'HOT', '따뜻한 우유 거품 위 에스프레소', 5000, 10),
('바닐라라떼', 'ICE', '달콤한 바닐라 시럽이 들어간 라떼', 5500, 10),
('카라멜마끼아또', 'ICE', '달콤한 카라멜 드리즐이 올라간 라떼', 6000, 10);

-- 초기 옵션 데이터 삽입
INSERT INTO options (name, price) VALUES
('샷 추가', 500),
('시럽 추가', 0);

-- 확인 쿼리
SELECT '=== 메뉴 목록 ===' as info;
SELECT id, name, temperature, price, stock FROM menus;

SELECT '=== 옵션 목록 ===' as info;
SELECT id, name, price FROM options;


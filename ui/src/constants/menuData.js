// 커피 메뉴 데이터
export const menuData = [
  {
    id: 1,
    name: '아메리카노',
    temperature: 'ICE',
    price: 4000,
    description: '깔끔한 에스프레소와 시원한 얼음의 조화',
    icon: '☕'
  },
  {
    id: 2,
    name: '아메리카노',
    temperature: 'HOT',
    price: 4000,
    description: '진한 에스프레소의 풍부한 향',
    icon: '☕'
  },
  {
    id: 3,
    name: '카페라떼',
    temperature: 'ICE',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 만남',
    icon: '🥛'
  },
  {
    id: 4,
    name: '카페라떼',
    temperature: 'HOT',
    price: 5000,
    description: '따뜻한 우유 거품 위 에스프레소',
    icon: '🥛'
  },
  {
    id: 5,
    name: '바닐라라떼',
    temperature: 'ICE',
    price: 5500,
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    icon: '🍦'
  },
  {
    id: 6,
    name: '카라멜마끼아또',
    temperature: 'ICE',
    price: 6000,
    description: '달콤한 카라멜 드리즐이 올라간 라떼',
    icon: '🍯'
  }
]

// 옵션 데이터
export const optionsData = [
  { id: 1, name: '샷 추가', price: 500 },
  { id: 2, name: '시럽 추가', price: 0 }
]

// 초기 재고 데이터
export const initialInventory = [
  { menuId: 1, menuName: '아메리카노 (ICE)', stock: 10 },
  { menuId: 2, menuName: '아메리카노 (HOT)', stock: 10 },
  { menuId: 3, menuName: '카페라떼 (ICE)', stock: 10 },
  { menuId: 4, menuName: '카페라떼 (HOT)', stock: 10 },
  { menuId: 5, menuName: '바닐라라떼 (ICE)', stock: 10 },
  { menuId: 6, menuName: '카라멜마끼아또 (ICE)', stock: 10 }
]

// 주문 상태 정보
export const orderStatusInfo = {
  pending: { text: '주문 접수', nextStatus: 'accepted', buttonText: '주문 접수' },
  accepted: { text: '주문 접수됨', nextStatus: 'preparing', buttonText: '제조 시작' },
  preparing: { text: '제조 중', nextStatus: 'completed', buttonText: '제조 완료' },
  completed: { text: '제조 완료', nextStatus: null, buttonText: '완료' }
}


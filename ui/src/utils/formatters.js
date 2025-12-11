// 가격 포맷 함수
export const formatPrice = (price) => {
  return price.toLocaleString('ko-KR') + '원'
}

// 날짜 포맷 함수
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

// 장바구니 아이템 키 생성
export const getCartItemKey = (menuId, options) => {
  return `${menuId}-${[...options].sort().join(',')}`
}

// 재고 상태 확인 함수
export const getStockStatus = (stock) => {
  if (stock === 0) return { text: '품절', className: 'stock-danger' }
  if (stock < 5) return { text: '주의', className: 'stock-warning' }
  return { text: '정상', className: 'stock-normal' }
}


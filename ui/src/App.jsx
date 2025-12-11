import { useState } from 'react'
import './App.css'

// 커피 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노',
    temperature: 'ICE',
    price: 4000,
    description: '간단한 설명...'
  },
  {
    id: 2,
    name: '아메리카노',
    temperature: 'HOT',
    price: 4000,
    description: '간단한 설명...'
  },
  {
    id: 3,
    name: '카페라떼',
    temperature: 'ICE',
    price: 5000,
    description: '간단한 설명...'
  },
  {
    id: 4,
    name: '카페라떼',
    temperature: 'HOT',
    price: 5000,
    description: '간단한 설명...'
  },
  {
    id: 5,
    name: '바닐라라떼',
    temperature: 'ICE',
    price: 5500,
    description: '간단한 설명...'
  },
  {
    id: 6,
    name: '카라멜마끼아또',
    temperature: 'ICE',
    price: 6000,
    description: '간단한 설명...'
  }
]

// 옵션 데이터
const optionsData = [
  { id: 1, name: '샷 추가', price: 500 },
  { id: 2, name: '시럽 추가', price: 0 }
]

// 초기 재고 데이터
const initialInventory = [
  { menuId: 1, menuName: '아메리카노 (ICE)', stock: 10 },
  { menuId: 2, menuName: '아메리카노 (HOT)', stock: 10 },
  { menuId: 3, menuName: '카페라떼', stock: 10 }
]

// 가격 포맷 함수
const formatPrice = (price) => {
  return price.toLocaleString('ko-KR') + '원'
}

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

// 장바구니 아이템 키 생성
const getCartItemKey = (menuId, options) => {
  return `${menuId}-${options.sort().join(',')}`
}

// 재고 상태 확인 함수
const getStockStatus = (stock) => {
  if (stock === 0) return { text: '품절', className: 'stock-danger' }
  if (stock < 5) return { text: '주의', className: 'stock-warning' }
  return { text: '정상', className: 'stock-normal' }
}

// 주문 상태 정보
const orderStatusInfo = {
  pending: { text: '주문 접수', nextStatus: 'accepted', buttonText: '주문 접수' },
  accepted: { text: '주문 접수됨', nextStatus: 'preparing', buttonText: '제조 시작' },
  preparing: { text: '제조 중', nextStatus: 'completed', buttonText: '제조 완료' },
  completed: { text: '제조 완료', nextStatus: null, buttonText: '완료' }
}

function App() {
  const [currentPage, setCurrentPage] = useState('order') // 'order' or 'admin'
  const [cart, setCart] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [toast, setToast] = useState(null)
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(initialInventory)

  // 옵션 선택 핸들러
  const handleOptionChange = (menuId, optionName, checked) => {
    setSelectedOptions(prev => {
      const menuOptions = prev[menuId] || []
      if (checked) {
        return { ...prev, [menuId]: [...menuOptions, optionName] }
      } else {
        return { ...prev, [menuId]: menuOptions.filter(o => o !== optionName) }
      }
    })
  }

  // 장바구니에 담기
  const addToCart = (menu) => {
    const options = selectedOptions[menu.id] || []
    const optionPrice = options.reduce((sum, optName) => {
      const opt = optionsData.find(o => o.name === optName)
      return sum + (opt ? opt.price : 0)
    }, 0)
    
    const unitPrice = menu.price + optionPrice
    const itemKey = getCartItemKey(menu.id, options)
    const menuName = `${menu.name}(${menu.temperature})`

    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        getCartItemKey(item.menuId, item.options) === itemKey
      )

      if (existingIndex >= 0) {
        const newCart = [...prev]
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
          totalPrice: (newCart[existingIndex].quantity + 1) * unitPrice
        }
        return newCart
      } else {
        return [...prev, {
          menuId: menu.id,
          menuName,
          options: [...options],
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice
        }]
      }
    })

    setSelectedOptions(prev => ({ ...prev, [menu.id]: [] }))
    showToast(`${menuName} 담기 완료!`)
  }

  // 토스트 메시지 표시
  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)

  // 주문하기
  const handleOrder = () => {
    if (cart.length === 0) return
    
    const newOrder = {
      id: Date.now(),
      orderDate: new Date().toISOString(),
      items: cart.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        options: item.options,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      totalAmount,
      status: 'pending'
    }
    
    setOrders(prev => [newOrder, ...prev])
    showToast('주문이 완료되었습니다!')
    setCart([])
  }

  // 주문 상태 변경
  const handleStatusChange = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const currentStatus = order.status
        const nextStatus = orderStatusInfo[currentStatus].nextStatus
        if (nextStatus) {
          return { ...order, status: nextStatus }
        }
      }
      return order
    }))
  }

  // 재고 증가
  const increaseStock = (menuId) => {
    setInventory(prev => prev.map(item => 
      item.menuId === menuId ? { ...item, stock: item.stock + 1 } : item
    ))
  }

  // 재고 감소
  const decreaseStock = (menuId) => {
    setInventory(prev => prev.map(item => 
      item.menuId === menuId ? { ...item, stock: Math.max(0, item.stock - 1) } : item
    ))
  }

  // 대시보드 통계
  const dashboardStats = {
    totalOrders: orders.length,
    acceptedOrders: orders.filter(o => o.status === 'accepted').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    completedOrders: orders.filter(o => o.status === 'completed').length
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">COZY</div>
        <nav className="nav">
          <button 
            className={`nav-btn ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => setCurrentPage('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentPage('admin')}
          >
            관리자
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {currentPage === 'order' ? (
          <>
            {/* Order Page - Menu Section */}
            <section className="menu-section">
              <h2 className="section-title">메뉴</h2>
              <div className="menu-grid">
                {menuData.map(menu => (
                  <div key={menu.id} className="menu-card">
                    <div className="menu-image"></div>
                    <div className="menu-content">
                      <h3 className="menu-name">{menu.name}({menu.temperature})</h3>
                      <p className="menu-price">{formatPrice(menu.price)}</p>
                      <p className="menu-description">{menu.description}</p>
                      
                      <div className="options-container">
                        {optionsData.map(option => (
                          <div key={option.id} className="option-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={(selectedOptions[menu.id] || []).includes(option.name)}
                                onChange={(e) => handleOptionChange(menu.id, option.name, e.target.checked)}
                              />
                              {option.name} ({option.price > 0 ? `+${formatPrice(option.price)}` : '+0원'})
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className="add-btn"
                        onClick={() => addToCart(menu)}
                      >
                        담기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Page - Cart Section */}
            <section className="cart-section">
              <div className="cart-container">
                <div className="cart-left">
                  <h2 className="cart-title">장바구니</h2>
                  
                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      장바구니가 비어있습니다
                    </div>
                  ) : (
                    <div className="cart-items">
                      {cart.map((item, index) => (
                        <div key={index} className="cart-item">
                          <div className="cart-item-info">
                            <span className="cart-item-name">{item.menuName}</span>
                            {item.options.length > 0 && (
                              <span className="cart-item-options">
                                ({item.options.join(', ')})
                              </span>
                            )}
                            <span className="cart-item-quantity">X {item.quantity}</span>
                          </div>
                          <div className="cart-item-price">{formatPrice(item.totalPrice)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="cart-right">
                  <div className="cart-total">
                    <span className="total-label">총 금액</span>
                    <span className="total-amount">{formatPrice(totalAmount)}</span>
                  </div>
                  
                  <button 
                    className="order-btn"
                    onClick={handleOrder}
                    disabled={cart.length === 0}
                  >
                    주문하기
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Admin Page - Dashboard */}
            <section className="admin-section">
              <div className="admin-box">
                <h2 className="admin-title">관리자 대시보드</h2>
                <div className="dashboard-stats">
                  <span>총 주문 {dashboardStats.totalOrders}</span>
                  <span className="stats-divider">/</span>
                  <span>주문 접수 {dashboardStats.acceptedOrders}</span>
                  <span className="stats-divider">/</span>
                  <span>제조 중 {dashboardStats.preparingOrders}</span>
                  <span className="stats-divider">/</span>
                  <span>제조 완료 {dashboardStats.completedOrders}</span>
                </div>
              </div>
            </section>

            {/* Admin Page - Inventory */}
            <section className="admin-section">
              <div className="admin-box">
                <h2 className="admin-title">재고 현황</h2>
                <div className="inventory-grid">
                  {inventory.map(item => {
                    const stockStatus = getStockStatus(item.stock)
                    return (
                      <div key={item.menuId} className="inventory-card">
                        <div className="inventory-name">{item.menuName}</div>
                        <div className="inventory-stock-row">
                          <span className="inventory-stock">{item.stock}개</span>
                          <span className={`inventory-status ${stockStatus.className}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        <div className="inventory-buttons">
                          <button 
                            className="inventory-btn"
                            onClick={() => increaseStock(item.menuId)}
                          >
                            +
                          </button>
                          <button 
                            className="inventory-btn"
                            onClick={() => decreaseStock(item.menuId)}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Admin Page - Orders */}
            <section className="admin-section">
              <div className="admin-box">
                <h2 className="admin-title">주문 현황</h2>
                {orders.length === 0 ? (
                  <div className="orders-empty">접수된 주문이 없습니다</div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-item">
                        <div className="order-date">{formatDate(order.orderDate)}</div>
                        <div className="order-details">
                          {order.items.map((item, idx) => (
                            <span key={idx}>
                              {item.menuName} x {item.quantity}
                              {idx < order.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                        <div className="order-amount">{formatPrice(order.totalAmount)}</div>
                        <button 
                          className={`order-status-btn ${order.status === 'completed' ? 'completed' : ''}`}
                          onClick={() => handleStatusChange(order.id)}
                          disabled={order.status === 'completed'}
                        >
                          {orderStatusInfo[order.status].buttonText}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App

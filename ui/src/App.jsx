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

// 가격 포맷 함수
const formatPrice = (price) => {
  return price.toLocaleString('ko-KR') + '원'
}

// 장바구니 아이템 키 생성
const getCartItemKey = (menuId, options) => {
  return `${menuId}-${options.sort().join(',')}`
}

function App() {
  const [cart, setCart] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [toast, setToast] = useState(null)

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
        // 이미 있는 상품이면 수량 증가
        const newCart = [...prev]
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
          totalPrice: (newCart[existingIndex].quantity + 1) * unitPrice
        }
        return newCart
      } else {
        // 새로운 상품 추가
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

    // 옵션 초기화
    setSelectedOptions(prev => ({ ...prev, [menu.id]: [] }))
    
    // 토스트 메시지
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
    
    const orderData = {
      items: cart.map(item => ({
        menuId: item.menuId,
        options: item.options,
        quantity: item.quantity
      })),
      totalAmount
    }
    
    console.log('주문 데이터:', orderData)
    showToast('주문이 완료되었습니다!')
    setCart([])
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">COZY</div>
        <nav className="nav">
          <button className="nav-btn active">주문하기</button>
          <button className="nav-btn">관리자</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {/* Menu Section */}
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

        {/* Cart Section */}
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
      </main>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App

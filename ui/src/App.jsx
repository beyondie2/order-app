import { useState, useCallback, useMemo } from 'react'
import './App.css'

// Components
import Header from './components/Header'
import MenuCard from './components/MenuCard'
import Cart from './components/Cart'
import Toast from './components/Toast'
import ConfirmModal from './components/ConfirmModal'
import AdminDashboard from './components/AdminDashboard'
import InventorySection from './components/InventorySection'
import OrdersSection from './components/OrdersSection'

// Data & Utils
import { menuData, optionsData, initialInventory } from './constants/menuData'
import { getCartItemKey } from './utils/formatters'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cart, setCart] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [toast, setToast] = useState({ message: null, isVisible: false })
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(initialInventory)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // 옵션 선택 핸들러
  const handleOptionChange = useCallback((menuId, optionName, checked) => {
    setSelectedOptions(prev => {
      const menuOptions = prev[menuId] || []
      if (checked) {
        return { ...prev, [menuId]: [...menuOptions, optionName] }
      } else {
        return { ...prev, [menuId]: menuOptions.filter(o => o !== optionName) }
      }
    })
  }, [])

  // 토스트 메시지 표시
  const showToast = useCallback((message) => {
    setToast({ message, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 1800)
    setTimeout(() => {
      setToast({ message: null, isVisible: false })
    }, 2200)
  }, [])

  // 장바구니에 담기
  const addToCart = useCallback((menu) => {
    const menuStock = inventory.find(item => item.menuId === menu.id)
    if (menuStock && menuStock.stock === 0) {
      showToast('품절된 상품입니다')
      return
    }

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
  }, [selectedOptions, inventory, showToast])

  // 장바구니 아이템 삭제
  const removeFromCart = useCallback((index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }, [])

  // 장바구니 수량 업데이트
  const updateQuantity = useCallback((index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index)
      return
    }
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice
        }
      }
      return item
    }))
  }, [removeFromCart])

  // 총 금액 계산
  const totalAmount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.totalPrice, 0)
  , [cart])

  // 주문 확인 모달 열기
  const handleOrderClick = useCallback(() => {
    if (cart.length === 0) return
    setShowConfirmModal(true)
  }, [cart.length])

  // 주문하기
  const handleOrder = useCallback(() => {
    if (cart.length === 0) return
    
    const orderId = crypto.randomUUID()
    const orderDate = new Date().toISOString()
    
    const newOrder = {
      id: orderId,
      orderDate,
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
    
    // 재고 차감
    setInventory(prev => {
      const newInventory = [...prev]
      cart.forEach(cartItem => {
        const inventoryIndex = newInventory.findIndex(inv => inv.menuId === cartItem.menuId)
        if (inventoryIndex >= 0) {
          newInventory[inventoryIndex] = {
            ...newInventory[inventoryIndex],
            stock: Math.max(0, newInventory[inventoryIndex].stock - cartItem.quantity)
          }
        }
      })
      return newInventory
    })
    
    setOrders(prev => [newOrder, ...prev])
    showToast('주문이 완료되었습니다!')
    setCart([])
    setShowConfirmModal(false)
  }, [cart, totalAmount, showToast])

  // 주문 상태 변경
  const handleStatusChange = useCallback((orderId) => {
    const statusFlow = {
      pending: 'accepted',
      accepted: 'preparing',
      preparing: 'completed'
    }
    
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && statusFlow[order.status]) {
        return { ...order, status: statusFlow[order.status] }
      }
      return order
    }))
  }, [])

  // 재고 증가
  const increaseStock = useCallback((menuId) => {
    setInventory(prev => prev.map(item => 
      item.menuId === menuId ? { ...item, stock: item.stock + 1 } : item
    ))
  }, [])

  // 재고 감소
  const decreaseStock = useCallback((menuId) => {
    setInventory(prev => prev.map(item => 
      item.menuId === menuId ? { ...item, stock: Math.max(0, item.stock - 1) } : item
    ))
  }, [])

  // 재고 조회 함수
  const getStock = useCallback((menuId) => {
    const item = inventory.find(inv => inv.menuId === menuId)
    return item ? item.stock : 0
  }, [inventory])

  // 대시보드 통계
  const dashboardStats = useMemo(() => ({
    totalOrders: orders.length,
    acceptedOrders: orders.filter(o => o.status === 'accepted').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    completedOrders: orders.filter(o => o.status === 'completed').length
  }), [orders])

  return (
    <div className="app">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="main-container">
        {currentPage === 'order' ? (
          <>
            {/* Order Page - Menu Section */}
            <section className="menu-section">
              <h2 className="section-title">메뉴</h2>
              <div className="menu-grid">
                {menuData.map(menu => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                    onAddToCart={addToCart}
                    stock={getStock(menu.id)}
                  />
                ))}
              </div>
            </section>

            {/* Order Page - Cart Section */}
            <Cart
              cart={cart}
              totalAmount={totalAmount}
              onOrder={handleOrderClick}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          </>
        ) : (
          <>
            <AdminDashboard stats={dashboardStats} />
            <InventorySection 
              inventory={inventory} 
              onIncrease={increaseStock} 
              onDecrease={decreaseStock} 
            />
            <OrdersSection 
              orders={orders} 
              onStatusChange={handleStatusChange} 
            />
          </>
        )}
      </main>

      {/* Toast */}
      <Toast message={toast.message} isVisible={toast.isVisible} />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        cart={cart}
        totalAmount={totalAmount}
        onConfirm={handleOrder}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}

export default App

import { useState, useCallback, useMemo, useEffect } from 'react'
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

// API Services
import * as api from './services/api'

// Utils
import { getCartItemKey } from './utils/formatters'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cart, setCart] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [toast, setToast] = useState({ message: null, isVisible: false })
  
  // API에서 가져오는 데이터
  const [menus, setMenus] = useState([])
  const [options, setOptions] = useState([])
  const [orders, setOrders] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    preparingOrders: 0,
    completedOrders: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

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

  // 초기 데이터 로드
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 데이터 로드 시작...')
      console.log('🔗 API URL:', api.getApiUrl())
      
      const [menusData, optionsData] = await Promise.all([
        api.getMenus(),
        api.getOptions()
      ])
      
      console.log('✅ 메뉴 데이터:', menusData)
      console.log('✅ 옵션 데이터:', optionsData)
      
      setMenus(menusData)
      setOptions(optionsData)
    } catch (err) {
      console.error('❌ 데이터 로드 실패:', err)
      setError(err.message || '데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 주문 목록 로드
  const loadOrders = useCallback(async () => {
    try {
      const { orders: ordersData, stats } = await api.getOrders()
      setOrders(ordersData)
      setDashboardStats(stats)
    } catch (err) {
      console.error('주문 목록 로드 실패:', err)
    }
  }, [])

  // 초기 로드
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // 관리자 페이지 진입 시 주문 목록 로드
  useEffect(() => {
    if (currentPage === 'admin') {
      loadOrders()
    }
  }, [currentPage, loadOrders])

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

  // 장바구니에 담기
  const addToCart = useCallback((menu) => {
    if (menu.stock === 0) {
      showToast('품절된 상품입니다')
      return
    }

    const menuOptions = selectedOptions[menu.id] || []
    const optionPrice = menuOptions.reduce((sum, optName) => {
      const opt = options.find(o => o.name === optName)
      return sum + (opt ? opt.price : 0)
    }, 0)
    
    const unitPrice = menu.price + optionPrice
    const itemKey = getCartItemKey(menu.id, menuOptions)
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
          options: [...menuOptions],
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice
        }]
      }
    })

    setSelectedOptions(prev => ({ ...prev, [menu.id]: [] }))
    showToast(`${menuName} 담기 완료!`)
  }, [selectedOptions, options, showToast])

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

  // 주문하기 (API 호출)
  const handleOrder = useCallback(async () => {
    if (cart.length === 0) return
    
    try {
      const orderData = {
        items: cart.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          options: item.options,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        totalAmount
      }

      await api.createOrder(orderData)
      
      // 메뉴 목록 새로고침 (재고 반영)
      const updatedMenus = await api.getMenus()
      setMenus(updatedMenus)
      
      showToast('주문이 완료되었습니다!')
      setCart([])
      setShowConfirmModal(false)
    } catch (err) {
      console.error('주문 실패:', err)
      showToast(err.message || '주문 처리 중 오류가 발생했습니다.')
    }
  }, [cart, totalAmount, showToast])

  // 주문 상태 변경 (API 호출)
  const handleStatusChange = useCallback(async (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    const statusFlow = {
      pending: 'accepted',
      accepted: 'preparing',
      preparing: 'completed'
    }
    
    const nextStatus = statusFlow[order.status]
    if (!nextStatus) return

    try {
      await api.updateOrderStatus(orderId, nextStatus)
      
      // 주문 목록 새로고침
      await loadOrders()
    } catch (err) {
      console.error('상태 변경 실패:', err)
      showToast('상태 변경 중 오류가 발생했습니다.')
    }
  }, [orders, loadOrders, showToast])

  // 재고 증가 (API 호출)
  const increaseStock = useCallback(async (menuId) => {
    const menu = menus.find(m => m.id === menuId)
    if (!menu) return

    try {
      await api.updateMenuStock(menuId, menu.stock + 1)
      
      // 메뉴 목록 새로고침
      const updatedMenus = await api.getMenus()
      setMenus(updatedMenus)
    } catch (err) {
      console.error('재고 증가 실패:', err)
      showToast('재고 수정 중 오류가 발생했습니다.')
    }
  }, [menus, showToast])

  // 재고 감소 (API 호출)
  const decreaseStock = useCallback(async (menuId) => {
    const menu = menus.find(m => m.id === menuId)
    if (!menu || menu.stock <= 0) return

    try {
      await api.updateMenuStock(menuId, menu.stock - 1)
      
      // 메뉴 목록 새로고침
      const updatedMenus = await api.getMenus()
      setMenus(updatedMenus)
    } catch (err) {
      console.error('재고 감소 실패:', err)
      showToast('재고 수정 중 오류가 발생했습니다.')
    }
  }, [menus, showToast])

  // 재고 조회 함수
  const getStock = useCallback((menuId) => {
    const menu = menus.find(m => m.id === menuId)
    return menu ? menu.stock : 0
  }, [menus])

  // 재고 현황 데이터 생성
  const inventory = useMemo(() => 
    menus.map(menu => ({
      menuId: menu.id,
      menuName: `${menu.name} (${menu.temperature})`,
      stock: menu.stock
    }))
  , [menus])

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="app">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>데이터를 불러오는 중...</p>
            <p className="loading-hint">서버가 깨어나는 중일 수 있습니다. 잠시만 기다려주세요.</p>
          </div>
        </main>
      </div>
    )
  }

  // 오류 발생 시 표시
  if (error) {
    return (
      <div className="app">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>데이터를 불러올 수 없습니다</h2>
            <p className="error-message">{error}</p>
            <p className="error-hint">
              서버가 슬립 모드에서 깨어나는 중일 수 있습니다.<br />
              잠시 후 다시 시도해주세요.
            </p>
            <button className="retry-btn" onClick={loadInitialData}>
              다시 시도
            </button>
            <p className="error-api-url">API: {api.getApiUrl()}</p>
          </div>
        </main>
      </div>
    )
  }

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
                {menus.map(menu => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    options={options}
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

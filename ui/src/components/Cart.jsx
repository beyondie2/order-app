import { formatPrice } from '../utils/formatters'

export default function Cart({ 
  cart, 
  totalAmount, 
  onOrder, 
  onRemoveItem,
  onUpdateQuantity 
}) {
  return (
    <section className="cart-section">
      <div className="cart-container">
        <div className="cart-left">
          <h2 className="cart-title">장바구니</h2>
          
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>장바구니가 비어있습니다</p>
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
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        aria-label="수량 감소"
                      >
                        −
                      </button>
                      <span className="cart-item-quantity">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        aria-label="수량 증가"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">{formatPrice(item.totalPrice)}</div>
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveItem(index)}
                      aria-label={`${item.menuName} 삭제`}
                    >
                      ✕
                    </button>
                  </div>
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
            onClick={onOrder}
            disabled={cart.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  )
}


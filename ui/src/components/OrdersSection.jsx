import { formatPrice, formatDate } from '../utils/formatters'
import { orderStatusInfo } from '../constants/menuData'

export default function OrdersSection({ orders, onStatusChange }) {
  return (
    <section className="admin-section">
      <div className="admin-box">
        <h2 className="admin-title">주문 현황</h2>
        {orders.length === 0 ? (
          <div className="orders-empty">
            <span className="orders-empty-icon">📋</span>
            <p>접수된 주문이 없습니다</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className={`order-item status-${order.status}`}>
                <div className="order-date">{formatDate(order.orderDate)}</div>
                <div className="order-details">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.menuName}
                      {item.options.length > 0 && ` (${item.options.join(', ')})`}
                      {' x '}{item.quantity}
                      {idx < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <div className="order-amount">{formatPrice(order.totalAmount)}</div>
                <button 
                  className={`order-status-btn ${order.status}`}
                  onClick={() => onStatusChange(order.id)}
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
  )
}


import { formatPrice } from '../utils/formatters'

export default function ConfirmModal({ isOpen, cart, totalAmount, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">주문 확인</h2>
        
        <div className="modal-body">
          <div className="modal-items">
            {cart.map((item, index) => (
              <div key={index} className="modal-item">
                <span className="modal-item-name">
                  {item.menuName}
                  {item.options.length > 0 && ` (${item.options.join(', ')})`}
                </span>
                <span className="modal-item-qty">x {item.quantity}</span>
                <span className="modal-item-price">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          
          <div className="modal-total">
            <span>총 결제 금액</span>
            <span className="modal-total-price">{formatPrice(totalAmount)}</span>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>
            취소
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}


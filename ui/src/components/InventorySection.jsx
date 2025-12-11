import { getStockStatus } from '../utils/formatters'

export default function InventorySection({ inventory, onIncrease, onDecrease }) {
  return (
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
                    onClick={() => onIncrease(item.menuId)}
                    aria-label={`${item.menuName} 재고 증가`}
                  >
                    +
                  </button>
                  <button 
                    className="inventory-btn"
                    onClick={() => onDecrease(item.menuId)}
                    aria-label={`${item.menuName} 재고 감소`}
                  >
                    −
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


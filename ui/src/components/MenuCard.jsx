import { formatPrice } from '../utils/formatters'
import { optionsData } from '../constants/menuData'

export default function MenuCard({ 
  menu, 
  selectedOptions, 
  onOptionChange, 
  onAddToCart,
  stock 
}) {
  const isOutOfStock = stock === 0
  const menuOptions = selectedOptions[menu.id] || []

  return (
    <div className={`menu-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="menu-image">
        <span className="menu-icon">{menu.icon}</span>
        {isOutOfStock && <div className="sold-out-badge">품절</div>}
      </div>
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
                  checked={menuOptions.includes(option.name)}
                  onChange={(e) => onOptionChange(menu.id, option.name, e.target.checked)}
                  disabled={isOutOfStock}
                />
                {option.name} ({option.price > 0 ? `+${formatPrice(option.price)}` : '+0원'})
              </label>
            </div>
          ))}
        </div>
        
        <button 
          className="add-btn"
          onClick={() => onAddToCart(menu)}
          disabled={isOutOfStock}
          aria-label={`${menu.name} ${menu.temperature} 장바구니에 담기`}
        >
          {isOutOfStock ? '품절' : '담기'}
        </button>
      </div>
    </div>
  )
}


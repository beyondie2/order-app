import { formatPrice } from '../utils/formatters'

// 메뉴 이름에 따른 아이콘 매핑 (이미지가 없을 때 사용)
const menuIcons = {
  '아메리카노': '☕',
  '카페라떼': '🥛',
  '바닐라라떼': '🍦',
  '카라멜마끼아또': '🍯'
}

export default function MenuCard({ 
  menu, 
  options = [],
  selectedOptions, 
  onOptionChange, 
  onAddToCart,
  stock 
}) {
  const isOutOfStock = stock === 0
  const menuOptions = selectedOptions[menu.id] || []
  const icon = menuIcons[menu.name] || '☕'
  const hasImage = menu.imageUrl && menu.imageUrl !== null

  return (
    <div className={`menu-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="menu-image">
        {hasImage ? (
          <img 
            src={menu.imageUrl} 
            alt={`${menu.name} ${menu.temperature}`}
            className="menu-img"
          />
        ) : (
          <span className="menu-icon">{icon}</span>
        )}
        {isOutOfStock && <div className="sold-out-badge">품절</div>}
      </div>
      <div className="menu-content">
        <h3 className="menu-name">{menu.name}({menu.temperature})</h3>
        <p className="menu-price">{formatPrice(menu.price)}</p>
        <p className="menu-description">{menu.description}</p>
        
        <div className="options-container">
          {options.map(option => (
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

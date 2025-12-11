export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header">
      <div className="logo">COZY</div>
      <nav className="nav" role="navigation" aria-label="메인 네비게이션">
        <button 
          className={`nav-btn ${currentPage === 'order' ? 'active' : ''}`}
          onClick={() => setCurrentPage('order')}
          aria-current={currentPage === 'order' ? 'page' : undefined}
        >
          주문하기
        </button>
        <button 
          className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={() => setCurrentPage('admin')}
          aria-current={currentPage === 'admin' ? 'page' : undefined}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}


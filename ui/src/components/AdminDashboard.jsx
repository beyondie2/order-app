export default function AdminDashboard({ stats }) {
  return (
    <section className="admin-section">
      <div className="admin-box">
        <h2 className="admin-title">관리자 대시보드</h2>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-label">총 주문</span>
            <span className="stat-value">{stats.totalOrders}</span>
          </div>
          <span className="stats-divider">|</span>
          <div className="stat-item">
            <span className="stat-label">주문 접수</span>
            <span className="stat-value">{stats.acceptedOrders}</span>
          </div>
          <span className="stats-divider">|</span>
          <div className="stat-item">
            <span className="stat-label">제조 중</span>
            <span className="stat-value preparing">{stats.preparingOrders}</span>
          </div>
          <span className="stats-divider">|</span>
          <div className="stat-item">
            <span className="stat-label">제조 완료</span>
            <span className="stat-value completed">{stats.completedOrders}</span>
          </div>
        </div>
      </div>
    </section>
  )
}


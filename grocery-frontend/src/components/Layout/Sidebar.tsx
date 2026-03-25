export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🛒</div>
        <span className="sidebar-logo-text">Grocery</span>
      </div>

      <span className="sidebar-section-label">Menu</span>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div className="nav-item active">
          <span className="nav-icon">⊞</span>
          Dashboard
        </div>
        <div className="nav-item">
          <span className="nav-icon">☰</span>
          Lists
        </div>
      </nav>
    </div>
  );
}

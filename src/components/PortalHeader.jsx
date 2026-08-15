/**
 * PortalHeader Component
 *
 * Clean, modern, production-grade navigation header inspired by Linear & Vercel.
 * Features crisp segmented controls, refined metrics, and SVG icons (no emojis).
 */
export default function PortalHeader({
  activeTab,
  setActiveTab,
  people,
  historyCount,
  onOpenNfcModal,
  onResetData,
}) {
  const totalCount = people.length;
  const checkedInCount = people.filter((p) => p.user).length;
  const activeLeadsCount = people.filter((p) => p.user && p.role === 'Lead').length;

  return (
    <header className="portal-header">
      {/* Top Bar: Brand, Status, Actions */}
      <div className="header-top-bar">
        <div className="header-brand-group">
          <div className="brand-symbol">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </div>
          <div className="brand-titles">
            <div className="brand-title-row">
              <span className="brand-title">IEDC Portal</span>
              <span className="environment-badge">Live System</span>
            </div>
            <span className="brand-desc">NFC Attendance & Lab Management</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenNfcModal}
            id="open-nfc-simulator-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>NFC Scanner Simulator</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={onResetData}
            title="Reset data to initial state"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="metrics-strip">
        <div className="metric-pill">
          <span className="metric-label">Total Roster</span>
          <span className="metric-val">{totalCount}</span>
        </div>
        <div className="metric-divider" />
        <div className="metric-pill">
          <span className="metric-label">Active in Lab</span>
          <span className="metric-val text-emerald">
            <span className="status-dot dot-active" />
            {checkedInCount}
          </span>
        </div>
        <div className="metric-divider" />
        <div className="metric-pill">
          <span className="metric-label">Leads Present</span>
          <span className="metric-val">{activeLeadsCount}</span>
        </div>
        <div className="metric-divider" />
        <div className="metric-pill">
          <span className="metric-label">Total Logged Records</span>
          <span className="metric-val">{historyCount}</span>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="tab-segmented-control" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dashboard'}
          className={`segment-btn ${activeTab === 'dashboard' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          id="tab-btn-dashboard"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Live Members</span>
          <span className="count-badge">{checkedInCount}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'history'}
          className={`segment-btn ${activeTab === 'history' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('history')}
          id="tab-btn-history"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span>Attendance History</span>
          <span className="count-badge">{historyCount}</span>
        </button>
      </div>
    </header>
  );
}

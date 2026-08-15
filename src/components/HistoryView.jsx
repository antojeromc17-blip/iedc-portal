import { useState, useMemo } from 'react';
import { formatTimer, formatFriendlyDuration, formatTime, formatDate } from '../utils/formatters';

/**
 * HistoryView Component
 *
 * Professional data table displaying past attendance sessions
 * sorted most recent first, with filters, search, and CSV export.
 */
export default function HistoryView({ history, onClearHistory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'LEAD' | 'MEMBER'

  // Filter & sort most recent first
  const filteredHistory = useMemo(() => {
    return [...history]
      .sort((a, b) => (b.checkOutTime || b.checkInTime || 0) - (a.checkOutTime || a.checkInTime || 0))
      .filter((record) => {
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          !query ||
          record.name.toLowerCase().includes(query) ||
          (record.leadPosition && record.leadPosition.toLowerCase().includes(query)) ||
          record.role.toLowerCase().includes(query) ||
          (record.checkInDate && record.checkInDate.includes(query));

        let matchRole = true;
        if (roleFilter === 'LEAD') matchRole = record.role === 'Lead';
        if (roleFilter === 'MEMBER') matchRole = record.role === 'Member';

        return matchSearch && matchRole;
      });
  }, [history, searchQuery, roleFilter]);

  // Summary metrics
  const totalLoggedSeconds = useMemo(() => {
    return history.reduce((acc, r) => acc + (r.duration || 0), 0);
  }, [history]);

  const averageSessionSeconds = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.round(totalLoggedSeconds / history.length);
  }, [history, totalLoggedSeconds]);

  // CSV Export utility
  const handleExportCSV = () => {
    if (filteredHistory.length === 0) return;
    const headers = ['Name', 'Role', 'Position', 'Date', 'Check-In Time', 'Check-Out Time', 'Duration (HH:MM:SS)', 'Duration (Seconds)'];
    const rows = filteredHistory.map((r) => [
      `"${r.name}"`,
      `"${r.role}"`,
      `"${r.leadPosition || 'Member'}"`,
      `"${r.checkInDate || formatDate(r.checkInTime)}"`,
      `"${formatTime(r.checkInTime)}"`,
      `"${formatTime(r.checkOutTime)}"`,
      `"${formatTimer(r.duration)}"`,
      r.duration,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `iedc_attendance_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="history-section" aria-label="Attendance History Logs">
      {/* Top Metric Summary Cards */}
      <div className="history-summary-grid">
        <div className="summary-card">
          <span className="summary-label">Total Sessions Logged</span>
          <span className="summary-num">{history.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Lab Hours</span>
          <span className="summary-num">{formatFriendlyDuration(totalLoggedSeconds)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Average Session Length</span>
          <span className="summary-num">{formatFriendlyDuration(averageSessionSeconds)}</span>
        </div>
      </div>

      {/* Toolbar: Search, Role Filter, Export & Clear */}
      <div className="history-toolbar">
        <div className="search-field">
          <svg className="search-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search records by name, role, date…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-text-input"
            id="history-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSearchQuery('')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="history-actions-group">
          <div className="chip-group">
            <button
              type="button"
              className={`chip-btn ${roleFilter === 'ALL' ? 'is-selected' : ''}`}
              onClick={() => setRoleFilter('ALL')}
            >
              All Records
            </button>
            <button
              type="button"
              className={`chip-btn ${roleFilter === 'LEAD' ? 'is-selected' : ''}`}
              onClick={() => setRoleFilter('LEAD')}
            >
              Leads
            </button>
            <button
              type="button"
              className={`chip-btn ${roleFilter === 'MEMBER' ? 'is-selected' : ''}`}
              onClick={() => setRoleFilter('MEMBER')}
            >
              Members
            </button>
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportCSV}
              disabled={filteredHistory.length === 0}
              title="Download records as CSV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>

            {history.length > 0 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onClearHistory}
                title="Clear all session history records"
              >
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredHistory.length > 0 ? (
        <div className="table-wrapper">
          <table className="data-table" id="attendance-history-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role / Position</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th className="text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record, index) => {
                const isLead = record.role === 'Lead';
                return (
                  <tr key={record.id || `hist-${index}`}>
                    <td>
                      <div className="cell-member">
                        {record.image && (
                          <img
                            src={record.image}
                            alt={record.name}
                            className="cell-avatar"
                          />
                        )}
                        <span className="cell-name">{record.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-tag ${isLead ? 'tag-lead' : 'tag-member'}`}>
                        {isLead ? (record.leadPosition || 'Team Lead') : 'Lab Member'}
                      </span>
                    </td>
                    <td>
                      <span className="cell-date">
                        {record.checkInDate || formatDate(record.checkInTime)}
                      </span>
                    </td>
                    <td>
                      <span className="mono-time time-in">
                        {formatTime(record.checkInTime)}
                      </span>
                    </td>
                    <td>
                      <span className="mono-time time-out">
                        {formatTime(record.checkOutTime)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="duration-tag">
                        {formatTimer(record.duration)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-panel">
          <div className="empty-symbol">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h4 className="empty-heading">No attendance records found</h4>
          <p className="empty-subtext">
            {searchQuery || roleFilter !== 'ALL'
              ? 'No records match your active search filters.'
              : 'Records will populate automatically as members complete their check-out sessions.'}
          </p>
        </div>
      )}
    </section>
  );
}

import { useState, useMemo } from 'react';
import PersonCard from './PersonCard';

/**
 * Dashboard Component
 *
 * Clean member grid with search, role filters, and status toggles.
 */
export default function Dashboard({ people, onToggleCheckIn }) {
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'CHECKED_IN' | 'CHECKED_OUT'
  const [filterRole, setFilterRole] = useState('ALL'); // 'ALL' | 'LEAD' | 'MEMBER'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        person.name.toLowerCase().includes(query) ||
        (person.leadPosition && person.leadPosition.toLowerCase().includes(query)) ||
        person.role.toLowerCase().includes(query);

      let matchStatus = true;
      if (filterStatus === 'CHECKED_IN') matchStatus = Boolean(person.user);
      if (filterStatus === 'CHECKED_OUT') matchStatus = !person.user;

      let matchRole = true;
      if (filterRole === 'LEAD') matchRole = person.role === 'Lead';
      if (filterRole === 'MEMBER') matchRole = person.role === 'Member';

      return matchSearch && matchStatus && matchRole;
    });
  }, [people, searchQuery, filterStatus, filterRole]);

  const checkedInCount = people.filter((p) => p.user).length;
  const checkedOutCount = people.length - checkedInCount;

  return (
    <section className="dashboard-section" aria-label="Member Attendance Dashboard">
      {/* Search & Filter Toolbar */}
      <div className="toolbar-row">
        <div className="search-field">
          <svg className="search-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, role, or position…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-text-input"
            id="person-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="filter-toolbar">
          <div className="chip-group" role="group" aria-label="Filter by Status">
            <button
              type="button"
              className={`chip-btn ${filterStatus === 'ALL' ? 'is-selected' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All ({people.length})
            </button>
            <button
              type="button"
              className={`chip-btn ${filterStatus === 'CHECKED_IN' ? 'is-selected is-emerald' : ''}`}
              onClick={() => setFilterStatus('CHECKED_IN')}
            >
              In Lab ({checkedInCount})
            </button>
            <button
              type="button"
              className={`chip-btn ${filterStatus === 'CHECKED_OUT' ? 'is-selected' : ''}`}
              onClick={() => setFilterStatus('CHECKED_OUT')}
            >
              Out ({checkedOutCount})
            </button>
          </div>

          <div className="chip-divider" />

          <div className="chip-group" role="group" aria-label="Filter by Role">
            <button
              type="button"
              className={`chip-btn ${filterRole === 'ALL' ? 'is-selected' : ''}`}
              onClick={() => setFilterRole('ALL')}
            >
              All Roles
            </button>
            <button
              type="button"
              className={`chip-btn ${filterRole === 'LEAD' ? 'is-selected' : ''}`}
              onClick={() => setFilterRole('LEAD')}
            >
              Leads
            </button>
            <button
              type="button"
              className={`chip-btn ${filterRole === 'MEMBER' ? 'is-selected' : ''}`}
              onClick={() => setFilterRole('MEMBER')}
            >
              Members
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Person Cards */}
      {filteredPeople.length > 0 ? (
        <div className="cards-grid">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onToggleCheckIn={onToggleCheckIn}
            />
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <div className="empty-symbol">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h4 className="empty-heading">No matching members found</h4>
          <p className="empty-subtext">Try changing your search keywords or clear current filters.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('ALL');
              setFilterRole('ALL');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}

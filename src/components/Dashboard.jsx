import { useState, useMemo } from 'react';
import PersonCard from './PersonCard';

export default function Dashboard({ people, onToggleCheckIn }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
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

  return (
    <div className="flex-grow w-full">
      {/* Header & Metrics */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 hidden">
        {/* We moved the title part to App.jsx for layout simplicity, but keeping metrics here */}
      </header>

      <div className="flex gap-8 items-end mb-12">
        <div className="glass-container rounded-2xl p-6 min-w-[200px]">
          <p className="font-label-mono text-label-mono text-secondary-fixed mb-2 uppercase tracking-widest">Active Members</p>
          <div className="font-display-lg text-display-lg text-white flex items-baseline gap-2">
            {checkedInCount}
            {checkedInCount > 0 && (
              <span className="pulse-indicator w-3 h-3 bg-secondary-fixed rounded-full inline-block ml-2 shadow-[0_0_10px_#63f7ff]"></span>
            )}
          </div>
        </div>
        <div className="glass-container rounded-2xl p-6 min-w-[200px] hidden md:block">
          <p className="font-label-mono text-label-mono text-primary-fixed-dim mb-2 uppercase tracking-widest">Total Members</p>
          <div className="font-display-lg text-display-lg text-white">
            {people.length}
          </div>
        </div>
      </div>

      {/* Search & Filter Glass Bar */}
      <div className="glass-container rounded-2xl p-4 mb-12 flex flex-col md:flex-row gap-4 items-center caustic-bg">
        <div className="relative w-full md:flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full bg-surface-dim/50 border-b border-white/20 focus:border-secondary-fixed text-white font-body-lg px-12 py-4 rounded-xl outline-none transition-all focus:bg-surface-dim/80" 
            placeholder="Search members by name, role, or NFC ID..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            className={`px-6 py-3 rounded-full font-label-mono text-label-mono whitespace-nowrap transition-colors ${filterRole === 'ALL' ? 'border border-secondary-fixed bg-secondary-fixed/10 text-secondary-fixed' : 'border border-white/20 hover:border-white/40 text-on-surface-variant'}`}
            onClick={() => setFilterRole('ALL')}
          >
            All Roles
          </button>
          <button 
            className={`px-6 py-3 rounded-full font-label-mono text-label-mono whitespace-nowrap transition-colors ${filterRole === 'MEMBER' ? 'border border-secondary-fixed bg-secondary-fixed/10 text-secondary-fixed' : 'border border-white/20 hover:border-white/40 text-on-surface-variant'}`}
            onClick={() => setFilterRole('MEMBER')}
          >
            Makers
          </button>
          <button 
            className={`px-6 py-3 rounded-full font-label-mono text-label-mono whitespace-nowrap transition-colors ${filterRole === 'LEAD' ? 'border border-secondary-fixed bg-secondary-fixed/10 text-secondary-fixed' : 'border border-white/20 hover:border-white/40 text-on-surface-variant'}`}
            onClick={() => setFilterRole('LEAD')}
          >
            Leads
          </button>
        </div>
      </div>

      {/* Live Presence Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h3 className="font-headline-xl text-[28px] text-on-surface font-bold">Live Presence</h3>
          <div className="flex items-center gap-2 text-secondary-fixed font-label-mono text-label-mono bg-secondary-fixed/10 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-sm">sync</span> Syncing...
          </div>
        </div>

        {filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPeople.map((person, i) => (
              <PersonCard
                key={person.id}
                person={person}
                onToggleCheckIn={onToggleCheckIn}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-container rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search_off</span>
            <h4 className="font-headline-xl text-[24px] text-on-surface mb-2">No matching members found</h4>
            <p className="font-body-md text-on-surface-variant max-w-sm mb-6">
              Try changing your search keywords or clear current filters.
            </p>
            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-white/20 text-on-surface font-label-mono hover:bg-white/5 transition-colors"
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
    </div>
  );
}

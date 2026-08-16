import { useState, useMemo } from 'react';

export default function MemberDirectory({ people, onOpenAddMember }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        person.name.toLowerCase().includes(query) ||
        (person.leadPosition && person.leadPosition.toLowerCase().includes(query)) ||
        person.role.toLowerCase().includes(query);

      let matchRole = true;
      if (filterRole === 'LEAD') matchRole = person.role === 'Lead';
      if (filterRole === 'MEMBER') matchRole = person.role === 'Member';
      if (filterRole === 'FACULTY') matchRole = person.role === 'Faculty';

      return matchSearch && matchRole;
    });
  }, [people, searchQuery, filterRole]);

  return (
    <div className="flex-grow w-full">
      {/* Search Bar / Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full bg-surface-dim/50 border border-white/10 focus:border-secondary-fixed text-white font-body-lg px-12 py-3 rounded-xl outline-none transition-all focus:bg-surface-dim/80" 
            placeholder="Search directory..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
          <button 
            className={`px-6 py-3 rounded-xl font-label-mono text-label-mono whitespace-nowrap transition-colors ${filterRole === 'ALL' ? 'border border-secondary-fixed bg-secondary-fixed/10 text-secondary-fixed' : 'border border-white/20 hover:border-white/40 text-on-surface-variant'}`}
            onClick={() => setFilterRole('ALL')}
          >
            All Members
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-label-mono text-label-mono whitespace-nowrap transition-colors ${filterRole === 'MEMBER' ? 'border border-secondary-fixed bg-secondary-fixed/10 text-secondary-fixed' : 'border border-white/20 hover:border-white/40 text-on-surface-variant'}`}
            onClick={() => setFilterRole('MEMBER')}
          >
            Makers
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-label-mono text-label-mono whitespace-nowrap transition-colors ${filterRole === 'LEAD' ? 'border border-secondary-fixed bg-secondary-fixed/10 text-secondary-fixed' : 'border border-white/20 hover:border-white/40 text-on-surface-variant'}`}
            onClick={() => setFilterRole('LEAD')}
          >
            Leads
          </button>
        </div>
        <div className="flex justify-end lg:hidden">
            {/* Show Add button on mobile here since sidebar button is hidden */}
            <button 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary-fixed to-[#0066ff] text-white font-label-mono text-label-mono tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.2)]"
              onClick={onOpenAddMember}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              NEW ENTRY
            </button>
        </div>
      </div>

      {/* Directory Table Section */}
      <section className="glass-panel rounded-xl overflow-hidden border border-white/5">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <h3 className="font-headline-xl text-[24px] text-on-surface font-bold">Registered Members</h3>
          <span className="font-label-mono text-label-mono text-on-surface-variant bg-surface-variant/30 px-3 py-1 rounded-full">
            {filteredPeople.length} FOUND
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-label-mono text-label-mono text-on-surface-variant">
                <th className="py-4 px-6 font-medium tracking-wider">MEMBER</th>
                <th className="py-4 px-6 font-medium tracking-wider">ID</th>
                <th className="py-4 px-6 font-medium tracking-wider">ROLE</th>
                <th className="py-4 px-6 font-medium tracking-wider">STATUS</th>
                <th className="py-4 px-6 font-medium tracking-wider text-right">TOTAL HOURS</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-white divide-y divide-white/5">
              {filteredPeople.length > 0 ? (
                filteredPeople.map((record, idx) => {
                  const isLead = record.role === 'Lead';
                  const totalHrs = record.totalDuration ? (record.totalDuration / 3600).toFixed(1) + 'h' : '0.0h';
                  
                  return (
                    <tr key={record.id} className="hover:bg-white/5 transition-all duration-200 cursor-default">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-white/10 flex items-center justify-center font-bold text-on-surface-variant">
                            {record.image ? (
                              <img className="w-full h-full object-cover" alt={record.name} src={record.image} />
                            ) : (
                              record.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white">{record.name}</p>
                            {isLead && <p className="text-xs text-primary-fixed-dim font-label-mono mt-1">{record.leadPosition}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant font-label-mono">
                        IEDC-{record.id.substring(0,4)}
                      </td>
                      <td className="py-4 px-6">
                        {isLead ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-label-mono bg-error/10 text-error border border-error/20">Lead Admin</span>
                        ) : record.role === 'Faculty' ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-label-mono bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/20">Faculty</span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-label-mono bg-white/5 text-white border border-white/10">Maker</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {record.user ? (
                            <>
                              <span className="pulse-indicator w-2 h-2 bg-secondary-fixed rounded-full inline-block"></span>
                              <span className="font-label-mono text-label-mono text-secondary-fixed">Live</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 bg-outline rounded-full inline-block"></span>
                              <span className="font-label-mono text-label-mono text-outline">Away</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-label-mono text-right text-on-surface-variant">
                        {totalHrs}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 px-6 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">person_off</span>
                    <p>No members found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

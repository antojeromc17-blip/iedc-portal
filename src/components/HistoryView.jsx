import { useState, useMemo } from 'react';
import { formatTimer, formatFriendlyDuration, formatTime, formatDate } from '../utils/formatters';

export default function HistoryView({ history, onClearHistory }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    return [...history]
      .sort((a, b) => (b.checkOutTime || b.checkInTime || 0) - (a.checkOutTime || a.checkInTime || 0))
      .filter((record) => {
        const query = searchQuery.trim().toLowerCase();
        return (
          !query ||
          record.name.toLowerCase().includes(query) ||
          (record.leadPosition && record.leadPosition.toLowerCase().includes(query)) ||
          record.role.toLowerCase().includes(query) ||
          (record.checkInDate && record.checkInDate.includes(query))
        );
      });
  }, [history, searchQuery]);

  const totalLoggedSeconds = useMemo(() => {
    return history.reduce((acc, r) => acc + (r.duration || 0), 0);
  }, [history]);

  const averageSessionSeconds = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.round(totalLoggedSeconds / history.length);
  }, [history, totalLoggedSeconds]);

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
    <div className="flex-grow w-full">
      {/* Search Bar / Header Actions */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hidden">
        {/* We can place actions in the app header or right here */}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full bg-surface-dim/50 border border-white/10 focus:border-secondary-fixed text-white font-body-lg px-12 py-3 rounded-xl outline-none transition-all focus:bg-surface-dim/80" 
            placeholder="Search records..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary-fixed/20 to-primary-fixed/20 border border-secondary-fixed/30 text-secondary-fixed font-label-mono text-label-mono flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,245,255,0.2)] transition-all"
            onClick={handleExportCSV}
            disabled={filteredHistory.length === 0}
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            EXPORT CSV
          </button>
          {history.length > 0 && (
            <button 
              className="px-6 py-3 rounded-xl glass-panel text-white font-label-mono text-label-mono flex items-center gap-2 hover:bg-error/20 hover:text-error hover:border-error/50 transition-all"
              onClick={onClearHistory}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              CLEAR LOGS
            </button>
          )}
        </div>
      </div>

      {/* Insights Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
        {/* Insight Card 1 */}
        <div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <p className="font-label-mono text-label-mono text-on-surface-variant mb-2">TOTAL ENTRIES</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display-lg text-[56px] text-white leading-none glow-text">{history.length}</span>
            </div>
            <div className="mt-6 h-2 w-full bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-secondary-fixed w-[100%] rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Insight Card 2 */}
        <div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <p className="font-label-mono text-label-mono text-on-surface-variant mb-2">TOTAL HOURS</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display-lg text-[40px] text-white leading-tight">{formatFriendlyDuration(totalLoggedSeconds)}</span>
            </div>
            <div className="mt-6 flex gap-1 h-8 items-end">
              <div className="w-1/7 bg-surface-variant rounded-t hover:bg-secondary-fixed/50 transition-colors h-[40%] w-full"></div>
              <div className="w-1/7 bg-surface-variant rounded-t hover:bg-secondary-fixed/50 transition-colors h-[60%] w-full"></div>
              <div className="w-1/7 bg-secondary-fixed rounded-t shadow-[0_0_10px_rgba(0,245,255,0.3)] h-[85%] w-full"></div>
              <div className="w-1/7 bg-surface-variant rounded-t hover:bg-secondary-fixed/50 transition-colors h-[50%] w-full"></div>
              <div className="w-1/7 bg-surface-variant rounded-t hover:bg-secondary-fixed/50 transition-colors h-[70%] w-full"></div>
            </div>
          </div>
        </div>

        {/* Insight Card 3 */}
        <div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-6 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <p className="font-label-mono text-label-mono text-on-surface-variant mb-2">AVG SESSION</p>
            <p className="font-headline-xl text-[40px] text-white leading-tight">{formatFriendlyDuration(averageSessionSeconds)}</p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
            <span className="text-on-surface-variant font-label-mono text-sm">Lab Engagement</span>
            <span className="font-label-mono text-secondary-fixed bg-secondary-fixed/10 px-2 py-1 rounded text-sm">OPTIMAL</span>
          </div>
        </div>
      </section>

      {/* Data Table Section */}
      <section className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-label-mono text-label-mono text-on-surface-variant">
                <th className="py-4 px-6 font-medium tracking-wider">MEMBER</th>
                <th className="py-4 px-6 font-medium tracking-wider">DATE</th>
                <th className="py-4 px-6 font-medium tracking-wider">CHECK IN/OUT</th>
                <th className="py-4 px-6 font-medium tracking-wider">DURATION</th>
                <th className="py-4 px-6 font-medium tracking-wider">ROLE</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-white divide-y divide-white/5">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record, idx) => {
                  const isLead = record.role === 'Lead';
                  
                  return (
                    <tr key={record.id || `hist-${idx}`} className="hover:bg-white/5 transition-all duration-200 cursor-default">
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
                            <p className="text-sm text-on-surface-variant font-label-mono">
                              ID: {record.personId ? `IEDC-${record.personId.substring(0,4)}` : `MEM-${idx}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant font-label-mono">
                        {record.checkInDate || formatDate(record.checkInTime)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-secondary-fixed font-label-mono">{formatTime(record.checkInTime)}</span>
                          <span className="text-on-surface-variant opacity-50 block w-4 h-[1px] bg-white/20"></span>
                          <span className="text-on-surface-variant font-label-mono">{formatTime(record.checkOutTime)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-label-mono">{formatTimer(record.duration)}</td>
                      <td className="py-4 px-6">
                        {isLead ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-label-mono bg-error/10 text-error border border-error/20">Lead Admin</span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-label-mono bg-white/5 text-white border border-white/10">Maker</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 px-6 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">description</span>
                    <p>No access logs found.</p>
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

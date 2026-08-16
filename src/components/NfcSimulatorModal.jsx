import { useState, useEffect } from 'react';

export default function NfcSimulatorModal({ isOpen, onClose, people, onToggleCheckIn }) {
  const [selectedPersonId, setSelectedPersonId] = useState(people[0]?.id || '');
  const [scanState, setScanState] = useState('WAITING'); // 'WAITING', 'SCANNING', 'SUCCESS'
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setScanState('WAITING');
      setScanResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPerson = people.find((p) => p.id === selectedPersonId) || people[0];

  const handleSimulateScan = () => {
    if (!currentPerson || scanState !== 'WAITING') return;
    setScanState('SCANNING');
    setScanResult(null);

    // Audio effect
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.16);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch { /* ignore */ }

    setTimeout(() => {
      const wasCheckedIn = currentPerson.user;
      onToggleCheckIn(currentPerson.id);
      
      setScanResult({
        action: wasCheckedIn ? 'CHECK_OUT' : 'CHECK_IN',
        name: currentPerson.name,
        role: currentPerson.role === 'Lead' ? 'LEAD RESEARCHER' : 'MAKER',
        id: `IEDC-${currentPerson.id.substring(0, 4).toUpperCase()}`,
        image: currentPerson.image
      });
      setScanState('SUCCESS');
    }, 500);
  };

  const handleReset = () => {
    setScanState('WAITING');
    setScanResult(null);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col font-body-md text-body-md overflow-x-hidden bg-surface/90 backdrop-blur-3xl"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* TopNavBar Modal Specific */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile h-24 border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-display-lg text-[24px] bg-gradient-to-r from-secondary-fixed to-primary-fixed bg-clip-text text-transparent font-bold">NFC TERMINAL</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPersonId}
            onChange={(e) => {
              setSelectedPersonId(e.target.value);
              handleReset();
            }}
            className="bg-surface-container border border-white/10 rounded-lg px-4 py-2 font-label-mono text-label-mono text-on-surface focus:border-secondary-fixed outline-none"
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.user ? 'IN' : 'OUT'})
              </option>
            ))}
          </select>
          <button 
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:text-secondary-fixed transition-all"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 flex items-center justify-center relative z-10 w-full h-full">
        {/* Terminal Container */}
        <div 
          className="relative w-[500px] h-[600px] rounded-3xl bg-surface-container-lowest/50 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl overflow-hidden transition-all duration-500 flex flex-col"
          style={{
            boxShadow: scanState === 'SCANNING' ? '0 0 60px rgba(0,244,254,0.2), inset 0 0 40px rgba(0,244,254,0.1)' : undefined,
            borderColor: scanState === 'SCANNING' ? 'rgba(0,244,254,0.3)' : undefined
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-secondary-fixed shadow-[0_0_10px_rgba(0,245,255,0.8)] animate-pulse"></span>
              <span className="font-label-mono text-label-mono text-on-surface-variant tracking-widest">SCANNER ACTIVE</span>
            </div>
            <span className="font-label-mono text-label-mono text-on-surface-variant opacity-50">NODE 01</span>
          </div>

          {/* Content Area - Waiting State */}
          <div 
            className={`flex-1 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${scanState === 'WAITING' || scanState === 'SCANNING' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
          >
            <div 
              className="relative w-64 h-64 flex items-center justify-center cursor-pointer group"
              onClick={handleSimulateScan}
            >
              <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite] group-hover:border-secondary-fixed/50 transition-colors"></div>
              <div className="absolute inset-4 border border-white/10 rounded-full"></div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-surface-variant to-surface shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant group-hover:text-secondary-fixed transition-colors">contactless</span>
              </div>
              <div className="absolute inset-0 bg-secondary-fixed/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {scanState === 'SCANNING' && (
                 <div className="pulse-indicator w-full h-full absolute top-0 left-0"></div>
              )}
            </div>
            <h2 className="font-display-lg text-[32px] text-white mt-12 text-center tracking-tight">Tap ID Card</h2>
            <p className="font-label-mono text-label-mono text-on-surface-variant mt-4 text-center max-w-[250px]">
              {scanState === 'SCANNING' ? 'READING...' : 'Place your NFC-enabled ID card near the scanner.'}
            </p>
          </div>

          {/* Content Area - Success State */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 z-20 transition-opacity duration-500 bg-surface/40 backdrop-blur-xl ${scanState === 'SUCCESS' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background Caustic Glow */}
            <div className="absolute inset-0 caustic-bg pointer-events-none opacity-50"></div>
            
            {/* Profile Card */}
            <div className={`w-full max-w-sm bg-surface-container-highest/40 backdrop-blur-3xl rounded-2xl border border-secondary-fixed/30 shadow-[0_20px_60px_rgba(0,244,254,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] p-8 flex flex-col items-center transition-all duration-700 ease-out delay-100 ${scanState === 'SUCCESS' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="w-24 h-24 rounded-full border-2 border-secondary-fixed p-1 mb-6 shadow-[0_0_20px_rgba(0,244,254,0.3)] bg-surface-variant flex items-center justify-center overflow-hidden">
                {scanResult?.image ? (
                  <img className="w-full h-full rounded-full object-cover" alt={scanResult?.name} src={scanResult?.image} />
                ) : (
                  <span className="font-headline-xl text-[32px] font-bold text-white">{scanResult?.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-headline-xl-mobile text-headline-xl-mobile text-on-background mb-1 text-center">{scanResult?.name}</h3>
              <p className="font-label-mono text-label-mono text-secondary-fixed tracking-widest mb-8">{scanResult?.role}</p>
              
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="font-body-md text-body-md text-on-surface-variant">Clearance Level</span>
                  <span className="font-label-mono text-label-mono text-on-background px-3 py-1 bg-surface-variant/50 rounded-full">{scanResult?.id}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="font-body-md text-body-md text-on-surface-variant">Action</span>
                  <span className={`font-label-mono text-label-mono text-on-background px-3 py-1 rounded-full ${scanResult?.action === 'CHECK_IN' ? 'bg-secondary-fixed/20 text-secondary-fixed border border-secondary-fixed/30' : 'bg-surface-variant/50'}`}>
                    {scanResult?.action === 'CHECK_IN' ? 'LOGGED IN' : 'LOGGED OUT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Granted Status */}
            <div className={`mt-12 text-center transition-all duration-700 ease-out delay-300 ${scanState === 'SUCCESS' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <span className="material-symbols-outlined text-[48px] text-secondary-fixed mb-4 drop-shadow-[0_0_15px_rgba(0,244,254,0.6)]">check_circle</span>
              <h2 className="font-display-lg text-[40px] text-secondary-fixed drop-shadow-[0_0_10px_rgba(0,244,254,0.3)] tracking-tight">ACCESS GRANTED</h2>
            </div>

            <button 
              className={`absolute bottom-12 px-8 py-4 rounded-full bg-surface-variant/20 border border-white/10 backdrop-blur-md font-label-mono text-label-mono text-on-surface-variant hover:bg-white/10 hover:text-white transition-all duration-300 delay-500 ${scanState === 'SUCCESS' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              onClick={handleReset}
            >
              RESET TERMINAL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

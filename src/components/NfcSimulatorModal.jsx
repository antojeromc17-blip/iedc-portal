import { useState } from 'react';

/**
 * NfcSimulatorModal Component
 *
 * Clean, tactile hardware NFC RFID reader simulator.
 */
export default function NfcSimulatorModal({ isOpen, onClose, people, onToggleCheckIn }) {
  const [selectedPersonId, setSelectedPersonId] = useState(people[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  if (!isOpen) return null;

  const currentPerson = people.find((p) => p.id === selectedPersonId) || people[0];

  const handleSimulateScan = () => {
    if (!currentPerson || isScanning) return;

    setIsScanning(true);
    setScanResult(null);

    // Subtle beep sound feedback via Web Audio API
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
    } catch {
      // ignore
    }

    setTimeout(() => {
      onToggleCheckIn(currentPerson.id);
      setIsScanning(false);
      setScanResult({
        action: currentPerson.user ? 'CHECK_OUT' : 'CHECK_IN',
        name: currentPerson.name,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nfc-modal-title"
      >
        {/* Modal Header */}
        <div className="modal-top">
          <div className="modal-heading-group">
            <h2 id="nfc-modal-title" className="modal-title">NFC Tag Hardware Scanner</h2>
            <p className="modal-desc">Simulate physical RFID card tap interactions</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close dialog">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {/* Member Selector */}
          <div className="input-group">
            <label htmlFor="nfc-person-select" className="input-label">
              Select NFC Card / Member
            </label>
            <select
              id="nfc-person-select"
              value={selectedPersonId}
              onChange={(e) => {
                setSelectedPersonId(e.target.value);
                setScanResult(null);
              }}
              className="select-field"
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role === 'Lead' ? p.leadPosition : 'Member'}) — {p.user ? 'Currently IN' : 'Checked OUT'}
                </option>
              ))}
            </select>
          </div>

          {/* Virtual Card Graphic */}
          <div className="virtual-card">
            <div className="virtual-card-top">
              <span className="chip-badge" />
              <span className="card-tag-id">NFC • 13.56MHz</span>
            </div>
            <div className="virtual-card-identity">
              <img src={currentPerson?.image} alt="" className="virtual-avatar" />
              <div>
                <h4 className="virtual-name">{currentPerson?.name}</h4>
                <span className="virtual-role">
                  {currentPerson?.role === 'Lead' ? currentPerson.leadPosition : 'Lab Member'}
                </span>
              </div>
            </div>
            <div className="virtual-status-row">
              <span className={`status-tag ${currentPerson?.user ? 'is-in' : 'is-out'}`}>
                {currentPerson?.user ? '🟢 Currently Checked In' : '⚪ Checked Out'}
              </span>
            </div>
          </div>

          {/* Touch Reader Pad */}
          <div
            className={`reader-pad ${isScanning ? 'is-scanning' : ''}`}
            onClick={handleSimulateScan}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan()}
          >
            <div className="reader-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
            </div>
            <span className="pad-instruction">
              {isScanning ? 'Reading RFID Card…' : 'TAP HERE TO SCAN CARD'}
            </span>
          </div>

          {/* Scan result alert */}
          {scanResult && (
            <div className={`scan-feedback ${scanResult.action === 'CHECK_IN' ? 'feedback-in' : 'feedback-out'}`}>
              <div className="feedback-badge">
                {scanResult.action === 'CHECK_IN' ? 'Check-in Recorded' : 'Check-out Recorded'}
              </div>
              <p className="feedback-text">
                <strong>{scanResult.name}</strong> was successfully {scanResult.action === 'CHECK_IN' ? 'checked into' : 'checked out of'} the lab at {scanResult.timestamp}.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-bottom">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

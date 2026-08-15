import { useState, useEffect } from 'react';
import { formatTimer, formatFriendlyDuration, formatTime, formatDate } from '../utils/formatters';

/**
 * PersonCard Component
 *
 * Clean, modern, high-contrast member card.
 * Shows photo, name, specific role badge, check-in status,
 * live timer (HH:MM:SS), timestamp details, and NFC toggle action.
 */
export default function PersonCard({ person, onToggleCheckIn }) {
  const isCheckedIn = Boolean(person.user);
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    if (isCheckedIn && person.checkInTime) {
      return Math.max(0, Math.floor((Date.now() - person.checkInTime) / 1000));
    }
    return 0;
  });

  // Live timer interval: updates every second when checked in
  useEffect(() => {
    if (!isCheckedIn || !person.checkInTime) {
      setElapsedSeconds(0);
      return;
    }

    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - person.checkInTime) / 1000)));

    const intervalId = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - person.checkInTime) / 1000));
      setElapsedSeconds(diff);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isCheckedIn, person.checkInTime]);

  const isLead = person.role === 'Lead';
  const roleTitle = isLead ? (person.leadPosition || 'Team Lead') : 'Lab Member';

  return (
    <div
      className={`member-card ${isCheckedIn ? 'status-active' : 'status-idle'} ${isLead ? 'is-lead' : 'is-member'}`}
      id={`person-card-${person.id}`}
    >
      {/* Top Header: Identity & Badges */}
      <div className="card-top">
        <div className="avatar-frame">
          <img
            src={person.image}
            alt={person.name}
            className="avatar-img"
            loading="lazy"
          />
          <span
            className={`beacon-dot ${isCheckedIn ? 'beacon-online' : 'beacon-offline'}`}
            title={isCheckedIn ? 'Present in lab' : 'Checked out'}
          />
        </div>

        <div className="identity-block">
          <div className="name-row">
            <h3 className="name-text">{person.name}</h3>
          </div>

          <div className="tags-row">
            <span className={`role-tag ${isLead ? 'tag-lead' : 'tag-member'}`}>
              {isLead && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
              {roleTitle}
            </span>

            <span className={`state-badge ${isCheckedIn ? 'state-in' : 'state-out'}`}>
              <span className="state-dot" />
              {isCheckedIn ? 'Checked In' : 'Checked Out'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Body: Timer / Status Section */}
      <div className="card-body">
        {isCheckedIn ? (
          <div className="session-panel session-live">
            <div className="session-panel-header">
              <span className="session-tag">Active Session</span>
              <span className="session-start">Since {formatTime(person.checkInTime)}</span>
            </div>
            <div className="timer-value" aria-label="Session Timer">
              {formatTimer(elapsedSeconds)}
            </div>
            <div className="session-date-row">
              <span>Date: {person.checkInDate || formatDate(person.checkInTime)}</span>
            </div>
          </div>
        ) : (
          <div className="session-panel session-idle">
            <div className="idle-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>Ready for NFC Scan</span>
            </div>
            <div className="last-seen-text">
              {person.checkOutTime ? (
                <span>Last out: {formatDate(person.checkOutTime)} at {formatTime(person.checkOutTime)}</span>
              ) : (
                <span>No prior session today</span>
              )}
            </div>
          </div>
        )}

        {/* All-time duration metric */}
        <div className="accumulated-time-row">
          <span className="acc-label">All-Time Total</span>
          <span className="acc-value">
            {formatFriendlyDuration(person.totalDuration + (isCheckedIn ? elapsedSeconds : 0))}
          </span>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="card-action">
        <button
          type="button"
          className={`nfc-btn ${isCheckedIn ? 'nfc-btn-checkout' : 'nfc-btn-checkin'}`}
          onClick={() => onToggleCheckIn(person.id)}
          aria-label={isCheckedIn ? `Check out ${person.name}` : `Check in ${person.name}`}
          id={`toggle-btn-${person.id}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          <span>{isCheckedIn ? 'Tap NFC / Check Out' : 'Tap NFC / Check In'}</span>
        </button>
      </div>
    </div>
  );
}

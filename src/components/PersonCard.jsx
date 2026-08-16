import { useState, useEffect } from 'react';
import { formatTimer, formatFriendlyDuration, formatTime } from '../utils/formatters';

export default function PersonCard({ person, onToggleCheckIn }) {
  const isCheckedIn = Boolean(person.user);
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    if (isCheckedIn && person.checkInTime) {
      return Math.max(0, Math.floor((Date.now() - person.checkInTime) / 1000));
    }
    return 0;
  });

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
  const roleTitle = isLead ? (person.leadPosition || 'Lead Engineer') : 'Maker';

  return (
    <div
      className={`glass-container rounded-2xl p-6 flex flex-col gap-4 group transition-all duration-300 relative overflow-hidden ${
        isCheckedIn ? 'hover:-translate-y-2' : 'opacity-60 hover:opacity-100'
      }`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-fixed to-primary-container transition-opacity ${
        isCheckedIn ? 'opacity-50 group-hover:opacity-100' : 'opacity-0'
      }`}></div>
      
      <div className="flex justify-between items-start">
        {person.image ? (
          <img 
            className={`w-16 h-16 rounded-full object-cover border-2 border-surface ${!isCheckedIn && 'grayscale'}`} 
            alt={person.name} 
            src={person.image}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center font-headline-xl text-[20px] text-on-surface border-2 border-surface">
            {person.name.charAt(0)}
          </div>
        )}
        
        <div className="bg-surface-dim/80 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
          {isCheckedIn ? (
            <span className="pulse-indicator w-2 h-2 bg-secondary-fixed rounded-full inline-block"></span>
          ) : (
            <span className="w-2 h-2 bg-outline rounded-full inline-block"></span>
          )}
          <span className={`font-label-mono text-label-mono ${isCheckedIn ? 'text-secondary-fixed' : 'text-outline'}`}>
            {isCheckedIn ? 'Live' : 'Away'}
          </span>
        </div>
      </div>
      
      <div>
        <h4 className="font-headline-xl text-xl text-on-surface mb-1 truncate">{person.name}</h4>
        <p className={`font-label-mono text-label-mono uppercase tracking-wider ${isCheckedIn ? (isLead ? 'text-primary-fixed-dim' : 'text-on-surface-variant') : 'text-outline'}`}>
          {roleTitle}
        </p>
      </div>
      
      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center text-on-surface-variant h-[40px]">
        {isCheckedIn ? (
          <>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="font-label-mono text-label-mono">{formatTimer(elapsedSeconds)}</span>
            </div>
            <span 
              className="material-symbols-outlined text-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => onToggleCheckIn(person.id)}
            >
              logout
            </span>
          </>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="font-label-mono text-label-mono">
                {person.checkOutTime ? `Last seen ${formatTime(person.checkOutTime)}` : 'No sessions'}
              </span>
            </div>
            <span 
              className="material-symbols-outlined text-outline hover:text-secondary-fixed transition-colors cursor-pointer"
              onClick={() => onToggleCheckIn(person.id)}
            >
              login
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

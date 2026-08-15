/**
 * Utility functions for formatting time, dates, and durations.
 */

/**
 * Formats a duration in seconds into HH:MM:SS
 * @param {number} totalSeconds
 * @returns {string} e.g. "01:23:45"
 */
export function formatTimer(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats a duration in seconds into a friendly badge text (e.g. "1h 45m" or "45s")
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatFriendlyDuration(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '0s';
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);

  return parts.join(' ') || `${s}s`;
}

/**
 * Formats a timestamp into a readable Date string
 * @param {number|string|null} timestamp
 * @returns {string} e.g. "Aug 16, 2026"
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a timestamp into a 12-hour Time string with seconds
 * @param {number|string|null} timestamp
 * @returns {string} e.g. "03:15:22 PM"
 */
export function formatTime(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Formats a timestamp into combined date and time
 * @param {number|string|null} timestamp
 * @returns {string} e.g. "Aug 16, 2026, 03:15 PM"
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return `${formatDate(date)}, ${date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}`;
}

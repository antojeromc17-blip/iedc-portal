import { useState, useEffect, useCallback } from 'react';
import IntroSection from './components/IntroSection';
import PortalHeader from './components/PortalHeader';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import NfcSimulatorModal from './components/NfcSimulatorModal';
import { INITIAL_PEOPLE, INITIAL_HISTORY } from './data/people';
import './index.css';

const STORAGE_KEY_PEOPLE = 'iedc_nfc_people_v4';
const STORAGE_KEY_HISTORY = 'iedc_nfc_history_v4';

export default function App() {
  // Page Routing State: 'intro' (100vh canvas, no scrollbar) vs 'portal' (dedicated full app page)
  const [currentPage, setCurrentPage] = useState('intro');

  // People State with LocalStorage persistence
  const [people, setPeople] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PEOPLE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved people data:', e);
    }
    return INITIAL_PEOPLE;
  });

  // Attendance History State with LocalStorage persistence
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved history data:', e);
    }
    return INITIAL_HISTORY;
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'history'
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PEOPLE, JSON.stringify(people));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [history]);

  // Navigate to Portal (after intro completes or on skip)
  const handleGoToPortal = useCallback(() => {
    setCurrentPage('portal');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Navigate back to Intro when user scrolls up past top of portal
  const handleBackToIntro = useCallback(() => {
    setCurrentPage('intro');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Listen for scroll-up at top of portal page to return to intro
  useEffect(() => {
    if (currentPage !== 'portal') return;

    let touchStartY = 0;

    const handleWheel = (e) => {
      // If user is at top of portal page and scrolls UP with wheel
      if (window.scrollY <= 2 && e.deltaY < -25) {
        handleBackToIntro();
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      // If at top of portal and swiped down (meaning scrolling up)
      if (window.scrollY <= 2 && touchEndY - touchStartY > 60) {
        handleBackToIntro();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage, handleBackToIntro]);

  /**
   * Check-in / Check-out Toggle Logic
   *
   * On check-in (false -> true):
   *   - Set checkInDate to current date string (YYYY-MM-DD)
   *   - Set checkInTime to Date.now() timestamp
   *   - Set user to true
   *
   * On check-out (true -> false):
   *   - Set checkOutTime to Date.now()
   *   - Calculate session duration = (checkOutTime - checkInTime) in seconds
   *   - Add session duration to totalDuration
   *   - Set user to false
   *   - Push full record into attendance history array (most recent first)
   */
  const handleToggleCheckIn = (personId) => {
    const now = Date.now();
    const todayStr = new Date(now).toISOString().split('T')[0];

    setPeople((prevPeople) => {
      return prevPeople.map((person) => {
        if (person.id !== personId) return person;

        const isCurrentlyCheckedIn = Boolean(person.user);

        if (!isCurrentlyCheckedIn) {
          // --- CHECK IN ---
          return {
            ...person,
            user: true,
            checkInDate: todayStr,
            checkInTime: now,
            checkOutTime: null,
          };
        } else {
          // --- CHECK OUT ---
          const inTime = person.checkInTime || now;
          const sessionSeconds = Math.max(0, Math.floor((now - inTime) / 1000));
          const newTotal = (person.totalDuration || 0) + sessionSeconds;

          // Create history log entry
          const historyEntry = {
            id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            personId: person.id,
            name: person.name,
            role: person.role,
            leadPosition: person.leadPosition,
            image: person.image,
            checkInDate: person.checkInDate || todayStr,
            checkInTime: inTime,
            checkOutTime: now,
            duration: sessionSeconds,
          };

          // Append to history state
          setHistory((prevHist) => [historyEntry, ...prevHist]);

          return {
            ...person,
            user: false,
            checkOutTime: now,
            totalDuration: newTotal,
          };
        }
      });
    });
  };

  // Reset to initial mock dataset
  const handleResetData = () => {
    if (window.confirm('Reset all members and attendance logs to demo state?')) {
      setPeople(INITIAL_PEOPLE);
      setHistory(INITIAL_HISTORY);
      localStorage.removeItem(STORAGE_KEY_PEOPLE);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  };

  // Clear session history
  const handleClearHistory = () => {
    if (window.confirm('Clear all attendance history logs?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  };

  return (
    <div className="iedc-app-root">
      {currentPage === 'intro' ? (
        /* PAGE 1: 100vh Cinematic Canvas Intro (NO SCROLLBAR, scrubs on scroll, changes page when done) */
        <IntroSection
          framePath="/frames/"
          frameCount={180}
          onComplete={handleGoToPortal}
        />
      ) : (
        /* PAGE 2: Dedicated Inside Attendance Portal (scroll up at top returns to intro) */
        <div className="portal-page-wrapper">
          <main id="portal-main-section" className="portal-main-container">
            <div className="portal-content-wrapper">
              <PortalHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                people={people}
                historyCount={history.length}
                onOpenNfcModal={() => setIsNfcModalOpen(true)}
                onResetData={handleResetData}
              />

              {/* Active View Switcher */}
              {activeTab === 'dashboard' ? (
                <Dashboard
                  people={people}
                  onToggleCheckIn={handleToggleCheckIn}
                />
              ) : (
                <HistoryView
                  history={history}
                  onClearHistory={handleClearHistory}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* NFC Hardware Simulator Modal */}
      <NfcSimulatorModal
        isOpen={isNfcModalOpen}
        onClose={() => setIsNfcModalOpen(false)}
        people={people}
        onToggleCheckIn={handleToggleCheckIn}
      />
    </div>
  );
}

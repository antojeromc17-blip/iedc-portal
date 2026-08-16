import { useState, useEffect, useCallback } from 'react';
import IntroSection from './components/IntroSection';
import SideNav from './components/SideNav';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import MemberDirectory from './components/MemberDirectory';
import NfcSimulatorModal from './components/NfcSimulatorModal';
import AddMemberModal from './components/AddMemberModal';
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

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'history' | 'directory'
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

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

  const handleAddMember = (newMemberData) => {
    const newId = Date.now().toString(); // simple unique ID
    const newMember = {
      id: newId,
      name: newMemberData.name,
      role: newMemberData.role,
      leadPosition: newMemberData.leadPosition,
      image: newMemberData.image,
      user: false,
      totalDuration: 0,
      checkInTime: null,
      checkOutTime: null,
      checkInDate: null
    };

    setPeople((prev) => [...prev, newMember]);
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
        /* PAGE 1: 100vh Cinematic Canvas Intro */
        <IntroSection
          framePath="/frames/"
          frameCount={180}
          onComplete={handleGoToPortal}
        />
      ) : (
        /* PAGE 2: Dedicated Inside Attendance Portal */
        <div className="portal-page-wrapper">
          {/* Ambient Light Orbs for depth */}
          <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/10 blur-[120px] pointer-events-none z-0"></div>
          <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/5 blur-[150px] pointer-events-none z-0"></div>
          
          <SideNav 
            onLogoClick={() => window.scrollTo(0, 0)} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenNfcModal={() => setIsNfcModalOpen(true)}
            onOpenAddMember={() => setIsAddMemberModalOpen(true)}
          />

          {/* We use relative positioning for main content and account for the sidebar on large screens */}
          <main className="relative z-10 pt-28 lg:pt-12 lg:ml-72 px-margin-mobile lg:px-margin-desktop pb-section-gap max-w-container-max mx-auto">
            {/* Header / Nav Tabs inside Dashboard for this specific design? Actually, let's keep tabs here for simplicity of state switching */}
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="font-display-2xl text-display-2xl text-on-surface mb-2 tracking-tighter">
                  {activeTab === 'dashboard' && 'Overview'}
                  {activeTab === 'history' && 'Access Logs'}
                  {activeTab === 'directory' && 'Member Directory'}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  {activeTab === 'dashboard' && 'Real-time attendance and resource tracking for the Advanced Research & Entrepreneurship Cell.'}
                  {activeTab === 'history' && 'A complete historical ledger of member presence.'}
                  {activeTab === 'directory' && 'Manage all registered members and faculty in the ecosystem.'}
                </p>
              </div>
            </header>

            {/* Active View Switcher */}
            {activeTab === 'dashboard' && (
              <Dashboard
                people={people}
                onToggleCheckIn={handleToggleCheckIn}
              />
            )}
            
            {activeTab === 'history' && (
              <HistoryView
                history={history}
                onClearHistory={handleClearHistory}
              />
            )}

            {activeTab === 'directory' && (
              <MemberDirectory
                people={people}
                onOpenAddMember={() => setIsAddMemberModalOpen(true)}
              />
            )}
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

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
}

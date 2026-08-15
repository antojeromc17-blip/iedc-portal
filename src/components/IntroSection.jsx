import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollFrameAnimation from './ScrollFrameAnimation';
import ScrollText from './ScrollText';

/**
 * IntroSection
 *
 * Immersive 100vh full-screen cinematic intro experience (NO SCROLLBAR).
 * Captures user wheel, trackpad, touch swipe, or arrow keys to scrub
 * through the 180 frames.
 *
 * ONLY AFTER the 180 frames complete does the page change to the Attendance Portal!
 */

function padNumber(n, digits = 3) {
  return String(n).padStart(digits, '0');
}

export default function IntroSection({
  framePath = '/frames/',
  frameCount = 180,
  textBlocks,
  onComplete,
}) {
  const [frames, setFrames] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const touchStartY = useRef(0);
  const isTransitioningRef = useRef(false);

  // ---------- Preload all 180 frames ----------
  useEffect(() => {
    let cancelled = false;
    const images = [];
    let count = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${framePath}ezgif-frame-${padNumber(i)}.png`;

      img.onload = () => {
        if (cancelled) return;
        count++;
        setLoadProgress(count / frameCount);
        if (count === frameCount) {
          setFrames(images);
          setLoaded(true);
        }
      };

      img.onerror = () => {
        if (cancelled) return;
        count++;
        console.warn(`Failed to load frame ${i}`);
        setLoadProgress(count / frameCount);
        if (count === frameCount) {
          setFrames(images);
          setLoaded(true);
        }
      };

      images.push(img);
    }

    return () => { cancelled = true; };
  }, [framePath, frameCount]);

  // ---------- Trigger Page Change to Portal ----------
  const triggerTransition = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // ---------- Smooth 60fps Lerp Animation Loop ----------
  useEffect(() => {
    if (!loaded) return;

    const renderLoop = () => {
      // Smooth lerp progress for silky frame transitions
      const current = progressRef.current;
      const target = targetProgressRef.current;
      const next = current + (target - current) * 0.14;
      progressRef.current = next;

      if (canvasRef.current) canvasRef.current.draw(next);
      if (textRef.current) textRef.current.update(next);

      // ONLY after all 180 frames finish (progress >= 0.97) -> change page!
      if (next >= 0.97 && !isTransitioningRef.current) {
        triggerTransition();
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [loaded, triggerTransition]);

  // ---------- Wheel & Touch Event Handlers (No Side Scrollbar) ----------
  useEffect(() => {
    if (!loaded) return;

    const handleWheel = (e) => {
      e.preventDefault();
      // Smooth delta calculation
      const delta = (e.deltaY || e.detail || 0) * 0.00065;
      const nextTarget = Math.max(0, Math.min(1.0, targetProgressRef.current + delta));
      targetProgressRef.current = nextTarget;
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      touchStartY.current = currentY;
      const delta = deltaY * 0.002;
      const nextTarget = Math.max(0, Math.min(1.0, targetProgressRef.current + delta));
      targetProgressRef.current = nextTarget;
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        targetProgressRef.current = Math.min(1.0, targetProgressRef.current + 0.12);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.12);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loaded]);

  // ---------- Preload loading indicator ----------
  if (!loaded) {
    return (
      <div className="intro-loader">
        <div className="intro-loader-content">
          <div className="loader-ring">
            <svg viewBox="0 0 100 100">
              <circle className="loader-track" cx="50" cy="50" r="42" />
              <circle
                className="loader-fill"
                cx="50"
                cy="50"
                r="42"
                style={{ strokeDashoffset: 264 - 264 * loadProgress }}
              />
            </svg>
            <span className="loader-pct">
              {Math.round(loadProgress * 100)}%
            </span>
          </div>
          <p className="loader-label">Initializing IEDC Experience…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="intro-fullscreen-view" id="intro-fullscreen-container">
      {/* Top minimal brand + skip pill */}
      <div className="intro-floating-bar">
        <div className="intro-brand-pill">
          <span className="brand-dot-pulse" />
          <span className="brand-title">IEDC PORTAL</span>
        </div>
        <button
          type="button"
          className="intro-skip-pill"
          onClick={triggerTransition}
          title="Skip intro and change to portal page"
        >
          <span>Skip to Portal</span>
          <span className="skip-arrow">→</span>
        </button>
      </div>

      {/* Pristine 180-frame canvas & text overlay */}
      <div className="intro-canvas-frame">
        <ScrollFrameAnimation ref={canvasRef} frames={frames} />
        <ScrollText ref={textRef} blocks={textBlocks} />
      </div>
    </div>
  );
}

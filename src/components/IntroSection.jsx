import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollFrameAnimation from './ScrollFrameAnimation';
import ScrollText from './ScrollText';

/**
 * IntroSection
 *
 * Orchestrates preloading, scroll tracking, and child updates.
 * The hot scroll → draw path uses refs only — no setState, no re-renders.
 *
 * Props:
 *   framePath  – Base path to the frame folder (default: '/frames/')
 *   frameCount – Total number of frames (default: 30)
 *   height     – CSS height of the scroll container (default: '300vh')
 *   textBlocks – Optional array of { text, start, end } overrides for ScrollText
 */

function padNumber(n, digits = 3) {
  return String(n).padStart(digits, '0');
}

export default function IntroSection({
  framePath = '/frames/',
  frameCount = 30,
  height = '300vh',
  textBlocks,
}) {
  const [frames, setFrames] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);   // imperative handle to ScrollFrameAnimation
  const textRef = useRef(null);     // imperative handle to ScrollText
  const tickingRef = useRef(false);

  // ---------- preload all frames ----------
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

  // ---------- scroll tracking — direct imperative updates ----------
  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;

    requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) {
        tickingRef.current = false;
        return;
      }

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportH = window.innerHeight;

      const scrolled = -rect.top;
      const total = containerHeight - viewportH;
      const p = Math.max(0, Math.min(1, scrolled / total));

      // Directly call imperative methods — NO setState, NO re-render
      if (canvasRef.current) canvasRef.current.draw(p);
      if (textRef.current) textRef.current.update(p);

      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ---------- loading screen ----------
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
          <p className="loader-label">Loading experience…</p>
        </div>
      </div>
    );
  }

  // ---------- main render (rendered once, never re-renders during scroll) ----------
  return (
    <section ref={containerRef} className="intro-section" style={{ height }}>
      <div className="intro-sticky-wrapper">
        <ScrollFrameAnimation ref={canvasRef} frames={frames} />
        <ScrollText ref={textRef} blocks={textBlocks} />
      </div>
    </section>
  );
}

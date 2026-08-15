import IntroSection from './components/IntroSection';
import './index.css';

export default function App() {
  return (
    <>
      {/* Black‑hole scroll animation intro */}
      <IntroSection
        framePath="/frames/"
        frameCount={180}
        height="300vh"
      />

      {/* Next section scrolls into view naturally after frame 30 (full black) */}
      <section className="next-section">
        <h2>IEDC Portal</h2>
        <p>
          Explore equipment, track maintenance history, and access
          real-time diagnostics — all from a single scan.
        </p>
      </section>
    </>
  );
}

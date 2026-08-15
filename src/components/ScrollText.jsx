import { useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * ScrollText
 *
 * Renders 4 text overlay blocks. Exposes an imperative `update(progress)`
 * method that directly mutates DOM styles — zero React re-renders during scroll.
 */

const DEFAULT_BLOCKS = [
  { text: 'Every machine has a story.', start: 0.0, end: 0.2 },
  { text: 'Tap. Scan. Discover.', start: 0.2, end: 0.45 },
  { text: 'One tag. Instant information.', start: 0.45, end: 0.75 },
  { text: 'Welcome to IEDC Portal.', start: 0.75, end: 1.0 },
];

function computeOpacity(progress, start, end) {
  const range = end - start;
  if (range <= 0) return 0;

  const fadeZone = range * 0.3;
  const local = progress - start;

  if (local < 0 || local > range) return 0;
  if (local < fadeZone) return local / fadeZone;
  if (local > range - fadeZone) return (range - local) / fadeZone;
  return 1;
}

const ScrollText = forwardRef(function ScrollText({ blocks }, ref) {
  const items = blocks || DEFAULT_BLOCKS;
  const elRefs = useRef([]);

  useImperativeHandle(ref, () => ({
    update(progress) {
      for (let i = 0; i < items.length; i++) {
        const el = elRefs.current[i];
        if (!el) continue;

        const opacity = computeOpacity(progress, items[i].start, items[i].end);
        el.style.opacity = opacity;
        el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
        el.style.transform = `translateY(${(1 - opacity) * 24}px)`;
      }
    },
  }), [items]);

  return (
    <div className="scroll-text-overlay">
      {items.map((block, i) => (
        <div
          key={i}
          ref={(el) => (elRefs.current[i] = el)}
          className="scroll-text-block"
          style={{
            opacity: 0,
            visibility: 'hidden',
            transform: 'translateY(24px)',
            willChange: 'opacity, transform',
          }}
        >
          {block.text}
        </div>
      ))}
    </div>
  );
});

export default ScrollText;

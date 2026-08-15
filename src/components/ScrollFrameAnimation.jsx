import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

/**
 * ScrollFrameAnimation
 *
 * Renders a <canvas> pinned to the viewport via position:sticky.
 * Exposes an imperative `draw(progress)` method so the parent can
 * drive updates directly from a rAF callback — no React re-renders.
 *
 * Smoothness technique: instead of snapping to the nearest integer frame,
 * we blend two consecutive frames using globalAlpha, so motion feels
 * fluid even at low scroll speeds.
 */
const ScrollFrameAnimation = forwardRef(function ScrollFrameAnimation({ frames }, ref) {
  const canvasRef = useRef(null);
  const lastProgress = useRef(-1);

  // ---------- responsive sizing ----------
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;

    // setTransform resets + applies in one call — prevents scale accumulation on resize
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // force redraw after resize
    lastProgress.current = -1;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ---------- shared cover-fill helper ----------
  function getCoverRect(img, canvasW, canvasH) {
    const imgRatio    = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasW / canvasH;
    let drawW, drawH, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawH   = canvasH;
      drawW   = canvasH * imgRatio;
      offsetX = (canvasW - drawW) / 2;
      offsetY = 0;
    } else {
      drawW   = canvasW;
      drawH   = canvasW / imgRatio;
      offsetX = 0;
      offsetY = (canvasH - drawH) / 2;
    }
    return { drawW, drawH, offsetX, offsetY };
  }

  // ---------- imperative draw with frame blending ----------
  useImperativeHandle(ref, () => ({
    draw(progress) {
      if (!frames || frames.length === 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Skip if progress hasn't changed meaningfully
      if (Math.abs(progress - lastProgress.current) < 0.0001) return;
      lastProgress.current = progress;

      const frameCount = frames.length;
      const clamped    = Math.max(0, Math.min(1, progress));

      // Floating-point frame index — e.g. 12.7 means 70% between frame 12 and 13
      const floatIdx = clamped * (frameCount - 1);
      const lowerIdx = Math.floor(floatIdx);
      const upperIdx = Math.min(lowerIdx + 1, frameCount - 1);
      const blend    = floatIdx - lowerIdx; // 0..1 alpha for the upper frame

      const lowerImg = frames[lowerIdx];
      const upperImg = frames[upperIdx];

      if (!lowerImg?.complete) return;

      const ctx     = canvas.getContext('2d');
      const canvasW = window.innerWidth;
      const canvasH = window.innerHeight;

      ctx.clearRect(0, 0, canvasW, canvasH);

      // Draw the base (lower) frame at full opacity
      const r1 = getCoverRect(lowerImg, canvasW, canvasH);
      ctx.globalAlpha = 1;
      ctx.drawImage(lowerImg, r1.offsetX, r1.offsetY, r1.drawW, r1.drawH);

      // Blend the next (upper) frame on top — this is what makes it silky smooth
      if (blend > 0.001 && lowerIdx !== upperIdx && upperImg?.complete) {
        const r2 = getCoverRect(upperImg, canvasW, canvasH);
        ctx.globalAlpha = blend;
        ctx.drawImage(upperImg, r2.offsetX, r2.offsetY, r2.drawW, r2.drawH);
        ctx.globalAlpha = 1;
      }
    },
  }), [frames]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
      }}
    />
  );
});

export default ScrollFrameAnimation;

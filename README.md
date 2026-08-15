<div align="center">

# 🌀 IEDC Portal

### *Tap. Scan. Discover.*

A cinematic scroll-driven web experience for the **Innovation and Entrepreneurship Development Centre** — featuring a 180-frame canvas animation, real-time frame blending, and a zero-rerender architecture.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

- **180-Frame Scroll Animation** — A full black-hole animation sequence driven by scroll position, split across two 90-frame segments
- **Frame Blending** — Consecutive frames are alpha-blended in real time, producing perfectly smooth motion between any two frames
- **Zero Re-render Architecture** — All scroll updates go through imperative `ref` handles (`canvasRef.draw()`, `textRef.update()`), bypassing React's render cycle entirely for 60fps performance
- **DPR-Aware Canvas** — Renders at native device pixel ratio for crisp visuals on HiDPI/Retina screens
- **Scroll Text Overlay** — Four sequenced text blocks fade in/out with smooth translateY transitions at defined scroll progress milestones
- **Animated Loading Screen** — SVG ring progress indicator while all 180 frames preload in the background

---

## 🗂️ Project Structure

```
IEDC PORTAL/
│
├── index.html                      ← App entry point + meta tags
├── vite.config.js                  ← Vite configuration
├── package.json
│
├── public/
│   ├── frames/                     ← 180 PNG frames (ezgif-frame-001 → 180)
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── main.jsx                    ← React root mount
    ├── App.jsx                     ← Top-level layout
    ├── index.css                   ← Design tokens + global styles
    │
    └── components/
        ├── IntroSection.jsx        ← Orchestrator: preloading + scroll tracking
        ├── ScrollFrameAnimation.jsx← Canvas renderer with frame blending
        └── ScrollText.jsx          ← Imperative text overlay
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/iedc-portal.git
cd iedc-portal

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧠 How It Works

### Scroll → Frame Pipeline

```
window scroll event
      │
      ▼
 requestAnimationFrame (throttled via tickingRef)
      │
      ▼
 Compute scroll progress p ∈ [0, 1]
      │
      ├──▶ canvasRef.draw(p)   → renders blended frame to <canvas>
      └──▶ textRef.update(p)   → mutates DOM opacity/transform directly
```

### Frame Blending

Instead of snapping to the nearest integer frame, `ScrollFrameAnimation` computes a **floating-point index**:

```
floatIdx = progress × (frameCount - 1)   // e.g. 12.73
lowerIdx = floor(floatIdx)               // 12
upperIdx = lowerIdx + 1                  // 13
blend    = floatIdx - lowerIdx           // 0.73

ctx.globalAlpha = 1;     drawImage(frames[12], ...)
ctx.globalAlpha = 0.73;  drawImage(frames[13], ...)  ← layered on top
```

This produces sub-frame precision and eliminates all visible frame-jump artifacts.

---

## ⚙️ Configuration

All animation parameters are controlled from [`App.jsx`](src/App.jsx):

| Prop | Default | Description |
|---|---|---|
| `framePath` | `"/frames/"` | Path to the frames folder in `public/` |
| `frameCount` | `180` | Total number of frames to load |
| `height` | `"300vh"` | Scroll container height (more = slower animation) |
| `textBlocks` | *(see ScrollText)* | Custom `{ text, start, end }` overlay blocks |

**To change scroll speed:** increase `height` in `App.jsx` (e.g. `"500vh"` for a slower, more cinematic feel).

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI framework |
| [Vite](https://vitejs.dev) | 8 | Dev server & bundler |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter) | 1.75 | Fast JS linter |
| Vanilla CSS | — | Styling (no framework) |
| Canvas 2D API | — | Frame rendering |

---

## 📜 License

MIT — feel free to use, modify, and build on this.

---

<div align="center">
  <sub>Built with ❤️ for the IEDC community</sub>
</div>


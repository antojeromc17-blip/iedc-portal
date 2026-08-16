<div align="center">

# 📡 IEDC Portal: NFC Attendance Tracking System

### *Tap. Scan. Track.*

A smart, real-time lab attendance and session tracking platform designed for the IEDC Innovation & Makerspace Lab. Features a 180-frame canvas scroll intro, real-time presence indicators, live session timers, comprehensive attendance history logs, and a built-in interactive NFC hardware scanner simulator.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

- **Cinematic Canvas Intro Experience**: High-performance 180-frame scroll animation with imperative rAF frame blending and smooth typography overlays.
- **Dedicated Page Navigation**: Distinct separation between the cinematic landing experience and the full-featured attendance tracking portal via a responsive Sidebar (`SideNav`).
- **Member Directory & Registration**:
  - Comprehensive ledger of all active members, leads, and faculty.
  - Interactive "New Entry" modal for instantaneous, on-the-fly registration.
- **Live Attendance Dashboard**:
  - Grid of team members and leads with avatars and presence beacons.
  - **Distinct Role Badging**: Gold/purple gradient badges for Leads (with specific titles like *President*, *Tech Lead*, *Design Lead*, *Vice President*) and teal badges for Members.
  - **Live Running Timers**: Dynamic `HH:MM:SS` timer updating every second for active lab sessions.
  - **Quick NFC Toggle**: One-tap simulation of RFID/NFC card scans for instant check-in and check-out.
  - **All-Time Logged Time**: Real-time accumulation of lab hours per member.
- **Attendance History Logs**:
  - Detailed session records sorted by most recent first.
  - Summary metrics: total sessions logged, total lab time, and average session duration.
  - Search by name, role, or date.
  - **CSV Export**: One-click export of attendance logs.
- **Interactive NFC Scanner Simulator**:
  - Modal with animated RFID scanner pad, virtual card chip graphics, and synthesized audio confirmation beeps via Web Audio API.
- **Persistent State**: Automatic local storage synchronization to retain active sessions and logs across refreshes.

---

## 🏗️ Architecture & Project Structure

```
iedc-portal/
├── public/
│   ├── favicon.svg
│   └── frames/                 # 180 high-res intro animation frames
├── src/
│   ├── components/
│   │   ├── IntroSection.jsx           # Canvas scroll orchestrator & landing view
│   │   ├── ScrollFrameAnimation.jsx   # Imperative 2D canvas frame blender
│   │   ├── ScrollText.jsx             # Text overlay transitions
│   │   ├── SideNav.jsx                # Sidebar navigation & state switcher
│   │   ├── Dashboard.jsx              # Member grid with filters & search
│   │   ├── MemberDirectory.jsx        # Complete personnel list view
│   │   ├── PersonCard.jsx             # Individual card with live timer & NFC button
│   │   ├── HistoryView.jsx            # Session history table & CSV export
│   │   ├── AddMemberModal.jsx         # Registration form for new members
│   │   └── NfcSimulatorModal.jsx      # Interactive RFID hardware simulator
│   ├── data/
│   │   └── people.js                  # Initial mock dataset & history schema
│   ├── utils/
│   │   └── formatters.js              # Time, date, and duration formatting utilities
│   ├── App.jsx                        # Page routing & global state management
│   ├── index.css                      # Tailwind v4 configuration & base styles
│   └── main.jsx                       # React root mounting
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ How the NFC Attendance Logic Works

1. **Check-In (`false` → `true`)**:
   - Updates `user` status to `true` (Checked In).
   - Records `checkInDate` and `checkInTime` (millisecond timestamp).
   - Starts the live `setInterval` timer on the person's card displaying `HH:MM:SS`.

2. **Check-Out (`true` → `false`)**:
   - Records `checkOutTime`.
   - Computes elapsed session duration (`checkOutTime - checkInTime`).
   - Accumulates session time into `totalDuration`.
   - Prepends a complete session record into the `history` log array.
   - Updates local storage persistence.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9+

### Installation

```bash
# Clone repository
git clone https://github.com/antojeromc17-blip/iedc-portal.git
cd iedc-portal

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | Modern component architecture & hooks |
| [Vite 8](https://vitejs.dev) | Next-generation frontend tooling |
| [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Smooth 60fps frame-blended scroll animation |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Synthesized audio feedback for NFC scans |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling framework powering the Obsidian Kinetic UI |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter) | Fast static code analysis |

---

## 📜 License

MIT License — feel free to use, modify, and build on this project.

<div align="center">
  <sub>Built with ❤️ for the IEDC Community</sub>
</div>

# Evolution of the Internet — An Interactive Storytelling Experience

An immersive, scroll-driven web experience that takes users on a cinematic journey through the history of the internet — from the first 4-node ARPANET connection in 1969 to the decentralized, AI-powered future of Web3.

## 🎯 Concept

Instead of a traditional static website, this project is built as an **interactive narrative**. Users explore five distinct eras of internet history through scroll-linked animations, interactive elements, and era-specific visual design. Each section transforms the entire page — colors, typography, backgrounds, and interactions morph to match the aesthetic of that time period, creating a cohesive feeling of traveling through technological history.

## 🎨 Design Approach

Each era has its own visual identity:
- **ARPANET (1969)** — Terminal green-on-black with draggable SVG network nodes and animated data packets
- **Dot-Com Boom (1990s)** — Windows 95 chrome with retro browser windows, marquee banners, and visitor counters
- **Social & Mobile (2000s)** — Clean iOS-inspired app grid with an interactive phone mockup, expandable posts, and reply system
- **Web3 & AI (2020s+)** — Glassmorphism, neon particle fields, orbital rings, and a 3D CSS cube with mouse-tracked parallax
- **Epilogue** — A calm, particle-dissolve ending that reinforces narrative closure

Transitions between eras use a single master GSAP timeline pinned to scroll progress, ensuring smooth, cinematic pacing with no jumps or inconsistencies.

## 🛠️ Tech Stack

- **React 19** (Vite) — Component architecture
- **GSAP** (ScrollTrigger + ScrollToPlugin) — Master scroll timeline engine
- **Framer Motion** — Physics-based micro-interactions (hover, tap, modals)
- **Lucide React** — Consistent iconography
- **Vanilla CSS** — Zero frameworks, full control over era-specific theming

## ✨ Key Features

- **Cinematic Scroll Timeline** — Single master GSAP timeline controlling all 6 sections with smooth scrub
- **Interactive Progress Bar** — Clickable era markers with completion shimmer effect
- **Draggable ARPANET Nodes** — SVG topology with pointer-capture drag confined to invisible boundaries
- **Expandable Post Overlays** — Stateful reply system with algorithmically-generated user avatars
- **3D CSS Cube** — Click-to-rotate with ±80° mouse-tracked parallax (no Three.js)
- **ARPANET Boot Loader** — Canvas-drawn node network that lights up progressively
- **Responsive Design** — Optimized breakpoints for desktop, tablet, and mobile
- **Accessibility** — `prefers-reduced-motion` support, semantic HTML, proper heading hierarchy

## 🚀 Setup

```bash
npm install
npm run dev
```

## 🌐 Live Demo

[🌐 Live Demo — frontend-odessey.vercel.app](https://frontend-odessey.vercel.app)

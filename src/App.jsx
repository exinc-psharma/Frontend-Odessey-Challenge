import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Loader from './components/Loader';
import Timeline from './components/Timeline';

import Hero from './components/Sections/Hero';
import Arpanet from './components/Sections/Arpanet';
import DotCom from './components/Sections/DotCom';
import Social from './components/Sections/Social';
import Future from './components/Sections/Future';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── Normalize scroll removed - caused aggressive jumping loops ── */

/* ── Era definitions for progress bar ── */
const ERAS = [
  { id: 'hero', label: 'Inception', color: '#00ff41', pos: 0 },
  { id: 'arpanet', label: 'ARPANET', color: '#00ff41', pos: 25 },
  { id: 'dotcom', label: 'Dot-Com', color: '#00aaff', pos: 50 },
  { id: 'social', label: 'Social', color: '#3b82f6', pos: 75 },
  { id: 'future', label: 'Future', color: '#ff00c1', pos: 100 },
];

/* ── Interactive Scroll Progress Bar ── */
const ScrollProgressBar = ({ activeSection, onNavigate }) => {
  const fillRef = useRef(null);
  const [hoveredEra, setHoveredEra] = useState(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    // This is a passive read-only trigger — no conflict
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        fill.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div ref={fillRef} className="progress-bar-fill" />
      </div>
      <div className="progress-markers">
        {ERAS.map((era) => (
          <div
            key={era.id}
            className={`progress-marker ${activeSection === era.id ? 'active' : ''}`}
            style={{ left: `${era.pos}%`, '--mc': era.color }}
            onClick={() => onNavigate(era.id)}
            onMouseEnter={() => setHoveredEra(era.id)}
            onMouseLeave={() => setHoveredEra(null)}
          >
            <div className="marker-dot" />
            {hoveredEra === era.id && (
              <div className="marker-tooltip">{era.label}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Transition Overlay ── */
const TransitionOverlay = ({ visible }) => (
  <div className={`transition-overlay ${visible ? 'active' : ''}`} />
);

/* ── App ── */
const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef(null);
  const prevSection = useRef('hero');

  const sections = useMemo(() => [
    { id: 'hero', component: Hero, color: '#0a0a0a', text: '#ffffff', accent: '#00ff41' },
    { id: 'arpanet', component: Arpanet, color: '#050505', text: '#00ff41', accent: '#00ff41' },
    { id: 'dotcom', component: DotCom, color: '#e0e0e0', text: '#333333', accent: '#0066cc' },
    { id: 'social', component: Social, color: '#f5f5f7', text: '#1a1a1a', accent: '#3b82f6' },
    { id: 'future', component: Future, color: '#0f0524', text: '#ffffff', accent: '#ff00c1' },
  ], []);

  const updateTheme = useCallback((id, color, text, accent) => {
    if (prevSection.current !== id) {
      setTransitioning(true);
      setTimeout(() => setTransitioning(false), 500);
      prevSection.current = id;
    }
    setActiveSection(id);

    gsap.to('body', {
      backgroundColor: color,
      color: text,
      duration: 0.8,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
    document.documentElement.style.setProperty('--accent-primary', accent);
    document.documentElement.style.setProperty('--bg-primary', color);
    document.documentElement.style.setProperty('--text-primary', text);
  }, []);

  useEffect(() => {
    if (loading) return;

    const sectionEls = gsap.utils.toArray('.section-wrapper');
    const numSections = sectionEls.length;

    /*
     * SINGLE ScrollTrigger — controls everything:
     *  - Theme switching based on scroll progress
     *  - Global snap (evenly spaced)
     *  - Consistent scroll distance per section
     *
     * The container is pinned for the entire scroll distance.
     * Each section gets exactly 1/(n-1) of the total progress.
     */
    const mainST = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',

      // Smooth controlled scrub (1s lag)
      scrub: 1,

      // Custom 1/3 structure snap: magnetic at edges, raw in the middle
      snap: {
        snapTo: (progress) => {
          const interval = 1 / (numSections - 1);
          const raw = progress / interval;
          const base = Math.floor(raw);
          const fraction = raw - base;

          // If they scroll < 40%, drag them back to where they started
          if (fraction <= 0.40) return base * interval;
          // If they scroll > 60%, pull them securely to the next page
          if (fraction >= 0.60) return (base + 1) * interval;
          // In the dead zone (40% - 60%), snap firmly to whichever page is closest (prevent mid-transition floating)
          return Math.round(raw) * interval;
        },
        duration: { min: 0.2, max: 0.6 },
        delay: 0.15,
        ease: 'power1.inOut',
      },

      onUpdate: (self) => {
        // Determine which section is active based on progress
        const rawIndex = self.progress * (numSections - 1);
        const activeIndex = Math.round(rawIndex);
        const clamped = Math.min(activeIndex, numSections - 1);
        const { id, color, text, accent } = sections[clamped];
        if (prevSection.current !== id) {
          updateTheme(id, color, text, accent);
        }
      },
    });

    return () => {
      mainST.kill();
    };
  }, [loading, sections, updateTheme]);

  const navigateToSection = useCallback((id) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0) return;

    // Scroll to the matching section element directly
    gsap.to(window, {
      scrollTo: { y: `#section-${id}`, autoKill: true },
      duration: 1.2,
      ease: 'power3.inOut',
    });
  }, [sections]);

  return (
    <>
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <ScrollProgressBar
            activeSection={activeSection}
            onNavigate={navigateToSection}
          />
          <TransitionOverlay visible={transitioning} />
        </>
      )}

      <div ref={containerRef} className="app-container">
        {!loading && (
          <Timeline activeSection={activeSection} onNavigate={navigateToSection} />
        )}

        {sections.map(({ id, component: SectionComponent }) => (
          <div key={id} id={`section-${id}`} className="section-wrapper">
            <SectionComponent active={activeSection === id} />
          </div>
        ))}
      </div>

      <style jsx="true">{`
        .app-container {
          position: relative;
          width: 100%;
        }

        /* Fixed, consistent section heights */
        .section-wrapper {
          width: 100%;
          height: 100vh;
          min-height: 100vh;
          max-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          will-change: transform;
        }

        /* ── Interactive Progress Bar ── */
        .progress-bar-container {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 28px;
          z-index: 9999;
          display: flex;
          align-items: flex-start;
        }
        .progress-bar-track {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(255,255,255,0.08);
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff41, #00aaff, #3b82f6, #ff00c1);
          transform-origin: left center;
          transform: scaleX(0);
          will-change: transform;
        }
        .progress-markers {
          position: relative;
          width: 100%;
          height: 28px;
        }
        .progress-marker {
          position: absolute;
          top: -3px;
          transform: translateX(-50%);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
          padding: 0 8px;
        }
        .marker-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.6);
          transition: all 0.3s ease;
        }
        .progress-marker:hover .marker-dot,
        .progress-marker.active .marker-dot {
          border-color: var(--mc);
          background: var(--mc);
          box-shadow: 0 0 12px var(--mc);
          transform: scale(1.3);
        }
        .marker-tooltip {
          margin-top: 4px;
          background: rgba(0,0,0,0.85);
          color: white;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
          pointer-events: none;
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* ── Transition Overlay ── */
        .transition-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%);
          pointer-events: none;
          z-index: 999;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .transition-overlay.active {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .progress-bar-container { height: 22px; }
          .marker-dot { width: 8px; height: 8px; }
          .marker-tooltip { font-size: 0.5rem; padding: 2px 6px; }
        }
      `}</style>
    </>
  );
};

export default App;

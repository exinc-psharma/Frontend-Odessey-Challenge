import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const eras = [
  { id: 'hero', label: 'Inception', color: '#00ff41' },
  { id: 'arpanet', label: 'ARPANET', color: '#00ff41' },
  { id: 'dotcom', label: 'Dot-Com', color: '#00aaff' },
  { id: 'social', label: 'Social', color: '#3b82f6' },
  { id: 'future', label: 'Future', color: '#ff00c1' },
  { id: 'epilogue', label: 'End', color: '#c084fc' }
];

const Timeline = ({ activeSection, onNavigate }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <nav className="timeline-container">
      <div className="timeline-line" />
      <div className="timeline-markers">
        {eras.map((era, index) => {
          const isActive = activeSection === era.id;
          const isPast = eras.findIndex(e => e.id === activeSection) > index;
          
          return (
            <div
              key={era.id}
              className={`timeline-marker-wrapper ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHovered(era.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNavigate(era.id)}
            >
              <AnimatePresence>
                {hovered === era.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: -10 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="timeline-label"
                  >
                    {era.label}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div 
                className={`timeline-dot ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isActive && era.id === 'epilogue' ? 'completed-pulse' : ''}`}
                style={{ '--era-color': era.color }}
              />
            </div>
          );
        })}
      </div>

      <style jsx="true">{`
        .timeline-container {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-line {
          position: absolute;
          width: 2px;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .timeline-markers {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .timeline-marker-wrapper {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          transition: all 0.3s ease;
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
        }

        .timeline-dot.active {
          width: 20px;
          height: 20px;
          border-color: var(--era-color);
          background: var(--era-color);
          box-shadow: 0 0 20px var(--era-color);
        }

        .timeline-dot.past {
          background: var(--era-color);
          border-color: var(--era-color);
          opacity: 0.5;
        }

        .timeline-dot.completed-pulse {
          animation: completePulse 1.5s ease-in-out 3;
        }
        @keyframes completePulse {
          0%, 100% { box-shadow: 0 0 20px var(--era-color); }
          50% { box-shadow: 0 0 35px var(--era-color), 0 0 50px var(--era-color); transform: scale(1.2); }
        }

        .timeline-label {
          position: absolute;
          right: 100%;
          white-space: nowrap;
          background: rgba(0, 0, 0, 0.8);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .timeline-container { right: 1rem; height: 240px; }
          .timeline-dot { width: 10px; height: 10px; }
          .timeline-dot.active { width: 16px; height: 16px; }
        }

        @media (max-width: 768px) {
          .timeline-container {
            right: auto;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            transform: none;
            flex-direction: row;
          }
          .timeline-line {
            width: 100%;
            height: 2px;
          }
          .timeline-markers {
            flex-direction: row;
            width: 100%;
          }
           .timeline-label {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Timeline;

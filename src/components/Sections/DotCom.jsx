import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import gsap from 'gsap';

const SITES = [
  { id: 1, name: 'Netscape', year: '1994', color: '#004a99', tagline: 'Navigator — Your window to the Web', visitors: '10,248,301', url: 'http://home.netscape.com', content: 'Welcome to Netscape Navigator! Browse the World Wide Web, read Usenet newsgroups, and send electronic mail. Download plugins to enhance your browsing experience.' },
  { id: 2, name: 'Amazon', year: '1995', color: '#ff9900', tagline: "Earth's biggest bookstore", visitors: '3,412,089', url: 'http://www.amazon.com', content: 'Welcome! Search over 1 million titles. Free shipping on orders over $25. One-Click ordering now available for registered users.' },
  { id: 3, name: 'Yahoo!', year: '1994', color: '#7b0099', tagline: 'The guide to the World Wide Web', visitors: '8,921,445', url: 'http://www.yahoo.com', content: 'Yahoo! — The ultimate web directory. Search Arts, Business, Computers, Education, Entertainment, News, Recreation, and Science.' },
  { id: 4, name: 'Google', year: '1998', color: '#4285f4', tagline: "I'm Feeling Lucky", visitors: '15,003,221', url: 'http://www.google.com', content: 'Google Search: I\'m Feeling Lucky — Search the web using our proprietary PageRank algorithm. Feeling lucky? We\'ll take you straight to the first result.' },
  { id: 5, name: 'eBay', year: '1995', color: '#e53238', tagline: 'Buy it. Sell it. Love it.', visitors: '5,671,234', url: 'http://www.ebay.com', content: 'Person-to-person online auction. Buy and sell electronics, cars, clothes, collectibles, and more. Register free and start bidding today!' },
  { id: 6, name: 'GeoCities', year: '1994', color: '#008800', tagline: 'Build your own homepage!', visitors: '7,102,556', url: 'http://www.geocities.com', content: 'Welcome to GeoCities! Build FREE homepages! Choose a neighborhood: Hollywood, Tokyo, SiliconValley, or Area51. Add guestbooks, counters, and animated GIFs!' },
];

/* ── Retro Browser Window (WOW: full expanded browser view) ── */
const RetroBrowser = ({ site, onClose }) => (
  <motion.div
    className="retro-browser-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="retro-browser"
      initial={{ scale: 0.7, y: 40 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.7, y: 40 }}
      transition={{ type: 'spring', damping: 20 }}
      onClick={(e) => e.stopPropagation()}
      style={{ '--win-color': site.color }}
    >
      {/* Title bar */}
      <div className="browser-title-bar">
        <span>{site.name} - Internet Explorer</span>
        <div className="browser-controls">
          <div className="bctrl">_</div>
          <div className="bctrl">□</div>
          <div className="bctrl close" onClick={onClose}>X</div>
        </div>
      </div>
      {/* Menu bar */}
      <div className="browser-menu">
        <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span>
      </div>
      {/* Address bar */}
      <div className="browser-address">
        <span className="address-label">Address</span>
        <div className="address-input">{site.url}</div>
        <div className="go-btn" onClick={() => window.open(site.url, '_blank')}>Go</div>
      </div>
      {/* Content */}
      <div className="browser-content">
        <h2 style={{ color: site.color, marginBottom: '0.5rem', fontSize: '1.3rem' }}>
          Welcome to {site.name}!
        </h2>
        <hr style={{ border: '1px solid #ccc', margin: '0.5rem 0' }} />
        <p style={{ fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{site.content}</p>
        <div className="visitor-counter-lg">
          <span>👁 You are visitor #</span>
          <span className="counter-num-lg">{site.visitors}</span>
        </div>
        <p style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.5rem' }}>
          EST {site.year} · Best viewed in 800×600 · Netscape Navigator 4.0+
        </p>
      </div>
    </motion.div>
  </motion.div>
);

const DotCom = ({ active }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [browserId, setBrowserId] = useState(null);
  const expandedSite = SITES.find(s => s.id === browserId);

  useEffect(() => {
    if (!active) return;
    gsap.fromTo('.retro-window',
      { scale: 0, opacity: 0, rotateY: -20 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' }
    );
  }, [active]);

  return (
    <section className="section dot-com">
      <div className="retro-grid" />

      <div className="marquee-bar">
        <div className="marquee-content">
          ★ Welcome to the World Wide Web! ★ You are visitor #4,291,003 ★ Best viewed in 800x600 ★ Netscape Navigator recommended ★ Under Construction ★ Sign our Guestbook!  ★ 
          ★ Welcome to the World Wide Web! ★ You are visitor #4,291,003 ★ Best viewed in 800x600 ★ Netscape Navigator recommended ★ Under Construction ★ Sign our Guestbook!  ★
        </div>
      </div>

      <h2 className="dotcom-title">
        The World Wide Web <span className="blink">[1990s]</span>
      </h2>

      <div className="windows-container">
        {SITES.map((site) => (
          <motion.div
            key={site.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={active ? { scale: 1, opacity: 1 } : {}}
            whileHover={{ y: -8, boxShadow: '8px 8px 20px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className={`retro-window ${expandedId === site.id ? 'expanded' : ''}`}
            style={{ '--win-color': site.color }}
            onClick={() => setExpandedId(expandedId === site.id ? null : site.id)}
          >
            <div className="window-header">
              <span className="window-title">{site.name}.exe</span>
              <div className="window-controls">
                <div className="win-btn">_</div>
                <div className="win-btn">□</div>
                <div className="win-btn close">X</div>
              </div>
            </div>
            <div className="window-body">
              <div className="window-content">
                <h3>{site.name}</h3>
                <p className="win-tagline">{site.tagline}</p>
                <p className="win-year">EST {site.year}</p>

                {expandedId === site.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="win-expanded"
                  >
                    <div className="visitor-counter">
                      <span>👁 Visitors: </span>
                      <span className="counter-num">{site.visitors}</span>
                    </div>
                    <div
                      className="browse-btn"
                      onClick={(e) => { e.stopPropagation(); setBrowserId(site.id); }}
                    >
                      🌐 OPEN IN BROWSER
                    </div>
                  </motion.div>
                )}

                <div className="win-button">
                  {expandedId === site.id ? 'CLOSE' : 'OPEN'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="construction-banner">
        🚧 Page Under Construction 🚧
      </div>

      {/* WOW: Retro Browser Window Overlay */}
      <AnimatePresence>
        {expandedSite && (
          <RetroBrowser site={expandedSite} onClose={() => setBrowserId(null)} />
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .dot-com {
          background: linear-gradient(135deg, #e8e8e8, #d0d0d0);
          color: #333;
          overflow: hidden;
        }
        .retro-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }
        .marquee-bar {
          position: absolute; top: 0; left: 0; right: 0;
          background: #000080; color: #ffff00;
          font-family: 'Comic Sans MS', 'Courier New', monospace;
          font-size: 0.75rem; font-weight: bold;
          overflow: hidden; white-space: nowrap;
          z-index: 3; padding: 4px 0;
        }
        .marquee-content { display: inline-block; animation: marquee 25s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dotcom-title {
          position: absolute; top: 2.5rem; left: 2rem;
          font-size: 1.5rem; font-weight: 900; z-index: 2;
        }
        .blink { animation: blink-anim 1s step-end infinite; }
        @keyframes blink-anim { 50% { opacity: 0; } }
        .windows-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem; max-width: 900px; width: 100%;
          padding: 4rem 2rem; z-index: 2;
          align-items: flex-start;
        }
        .retro-window {
          background: #c0c0c0;
          border: 2px solid #fff;
          border-right-color: #808080; border-bottom-color: #808080;
          box-shadow: 3px 3px 10px rgba(0,0,0,0.15);
          cursor: pointer; transition: all 0.3s ease;
        }
        .window-header {
          background: var(--win-color); color: white;
          padding: 4px 8px; display: flex;
          justify-content: space-between; align-items: center;
          font-size: 0.65rem; font-family: 'Segoe UI', Tahoma, sans-serif;
          font-weight: bold;
        }
        .window-controls { display: flex; gap: 2px; }
        .win-btn {
          width: 14px; height: 14px; background: #c0c0c0;
          border: 1px solid #fff; border-right-color: #808080; border-bottom-color: #808080;
          color: black; display: flex; align-items: center; justify-content: center; font-size: 8px;
        }
        .window-body {
          padding: 0.8rem; border: 1px solid #808080;
          border-right-color: #fff; border-bottom-color: #fff;
          margin: 2px; background: #fff;
        }
        .window-content h3 { font-size: 1.1rem; margin-bottom: 0.25rem; color: var(--win-color); }
        .win-tagline { font-size: 0.7rem; font-style: italic; color: #666; margin-bottom: 0.3rem; }
        .win-year { font-size: 0.7rem; margin-bottom: 0.8rem; font-weight: bold; }
        .win-expanded { overflow: hidden; margin-bottom: 0.5rem; }
        .visitor-counter {
          font-family: 'Courier New', monospace; font-size: 0.7rem;
          background: #000; color: #0f0; padding: 4px 8px; border-radius: 2px; margin-bottom: 0.5rem;
        }
        .counter-num { font-weight: bold; }
        .browse-btn {
          display: inline-block; padding: 4px 10px;
          background: #000080; color: white; font-size: 0.65rem;
          font-weight: bold; cursor: pointer; border: 1px outset #aaa;
          margin-top: 0.3rem;
        }
        .browse-btn:active { border-style: inset; }
        .win-button {
          display: inline-block; padding: 3px 12px; background: #c0c0c0;
          border: 1px solid #fff; border-right-color: #808080; border-bottom-color: #808080;
          font-size: 0.65rem; font-weight: bold;
        }
        .construction-banner {
          position: absolute; bottom: 1.5rem; font-size: 0.8rem;
          font-family: 'Comic Sans MS', 'Courier New', monospace;
          color: #ff0000; letter-spacing: 2px;
          animation: blink-anim 1.5s step-end infinite; z-index: 2;
        }

        /* Retro Browser Overlay */
        .retro-browser-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
        }
        .retro-browser {
          width: 100%; max-width: 560px;
          background: #c0c0c0;
          border: 2px solid #fff; border-right-color: #808080; border-bottom-color: #808080;
          box-shadow: 8px 8px 25px rgba(0,0,0,0.4);
        }
        .browser-title-bar {
          background: var(--win-color); color: white;
          padding: 3px 6px; display: flex; justify-content: space-between; align-items: center;
          font-size: 0.7rem; font-weight: bold; font-family: 'Segoe UI', sans-serif;
        }
        .browser-controls { display: flex; gap: 2px; }
        .bctrl {
          width: 16px; height: 16px; background: #c0c0c0;
          border: 1px outset #ddd; display: flex; align-items: center; justify-content: center;
          font-size: 9px; cursor: pointer; color: #333;
        }
        .bctrl.close:hover { background: #e44; color: white; }
        .browser-menu {
          display: flex; gap: 12px; padding: 2px 8px;
          font-size: 0.65rem; border-bottom: 1px solid #999;
          background: #d4d0c8;
        }
        .browser-address {
          display: flex; align-items: center; gap: 4px;
          padding: 3px 6px; background: #d4d0c8;
          border-bottom: 1px solid #999;
        }
        .address-label { font-size: 0.6rem; font-weight: bold; }
        .address-input {
          flex: 1; background: white; border: 1px inset #999;
          padding: 2px 6px; font-size: 0.65rem;
          font-family: 'Courier New', monospace; color: #0000ff;
        }
        .go-btn {
          padding: 2px 8px; background: #c0c0c0;
          border: 1px outset #ddd; font-size: 0.6rem; font-weight: bold; cursor: pointer;
        }
        .browser-content {
          padding: 1.2rem; background: #fff; min-height: 200px;
          border: 1px inset #999; margin: 2px;
        }
        .visitor-counter-lg {
          font-family: 'Courier New', monospace; font-size: 0.8rem;
          background: #000; color: #0f0; padding: 6px 12px;
          display: inline-block; border-radius: 2px;
        }
        .counter-num-lg { font-weight: bold; font-size: 1rem; }

        @media (max-width: 1024px) and (min-width: 769px) {
          .windows-container { grid-template-columns: repeat(3, 1fr); gap: 1.2rem; padding: 3.5rem 1.5rem; }
          .retro-browser { max-width: 90%; }
        }

        @media (max-width: 768px) {
          .windows-container { grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 3rem 1rem; }
          .retro-browser { max-width: 95%; }
        }
      `}</style>
    </section>
  );
};

export default DotCom;

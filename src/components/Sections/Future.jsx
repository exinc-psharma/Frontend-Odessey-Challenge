import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Cpu, Globe, Zap, Shield, Hexagon, Sparkles } from 'lucide-react';

/* ── Dense Neon Particle Field (distinct from Hero's sparse stars) ── */
const NeonField = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const isMobile = W < 768;
    const count = isMobile ? 35 : 80; // Dense on desktop

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      hue: [280, 300, 320, 180, 200][Math.floor(Math.random() * 5)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;

        // Glow effect
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 70%, 0.6)`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, 0.7)`;
        ctx.fill();
      });

      // Dense connection web
      const connectDist = isMobile ? 80 : 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = 0.15 * (1 - dist / connectDist);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${particles[i].hue}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return () => cleanup?.();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100%', height: '100%' }}
    />
  );
};

/* ── Animated Orbital Rings ── */
const OrbitalRings = () => (
  <div className="orbital-rings">
    <div className="orbit orbit-1"><div className="orbit-dot" /></div>
    <div className="orbit orbit-2"><div className="orbit-dot" /></div>
    <div className="orbit orbit-3"><div className="orbit-dot" /></div>
  </div>
);

/* ── Future Section ── */
const Future = ({ active }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [baseRot, setBaseRot] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  // WOW: Stronger mouse tilt on the cube
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 80;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -80;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleCubeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    if (Math.abs(dx) > Math.abs(dy)) {
      setBaseRot((prev) => ({ ...prev, y: prev.y + (dx > 0 ? 90 : -90) }));
    } else {
      setBaseRot((prev) => ({ ...prev, x: prev.x + (dy > 0 ? -90 : 90) }));
    }
  };

  useEffect(() => {
    if (!active) return;
    gsap.fromTo('.future-content > *',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className="section future"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <NeonField />
      <div className="neon-blobs" />
      <div className="grid-floor" />

      <div className="future-content">
        <div className="era-badge">
          <Sparkles size={14} />
          <span>The Next Chapter</span>
        </div>

        <h2 className="neon-title">Web3 & AI</h2>
        <p className="glass-subtext">Decentralized. Intelligent. Immersive.</p>

        <div className="cube-scene" onClick={handleCubeClick} style={{ cursor: 'pointer' }}>
          <OrbitalRings />
          <motion.div
            className="cube"
            animate={{
              rotateX: baseRot.x + tilt.y * 0.5,
              rotateY: baseRot.y + tilt.x * 0.8,
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`cube-face face-${i}`}>
                <div className="cube-inner">
                  {i === 0 && <Cpu size={36} />}
                  {i === 1 && <Globe size={36} />}
                  {i === 2 && <Zap size={36} />}
                  {i === 3 && <Shield size={36} />}
                  {i === 4 && <Hexagon size={36} />}
                  {i === 5 && <Sparkles size={36} />}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="tech-pills">
          {['Blockchain', 'Generative AI', 'Metaverse', 'Zero-Knowledge', 'Edge AI'].map((t) => (
            <motion.div
              key={t}
              whileHover={{ scale: 1.1, borderColor: 'rgba(255,0,193,0.6)', background: 'rgba(255,0,193,0.08)' }}
              whileTap={{ scale: 0.95 }}
              className="pill"
            >
              {t}
            </motion.div>
          ))}
        </div>

        <p className="closing-text">
          The story continues. You are part of it.
        </p>
      </div>

      <style jsx="true">{`
        .future {
          background: #080318;
          color: white;
          perspective: 1200px;
          overflow: hidden;
        }
        .neon-blobs {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 20% 30%, rgba(255,0,193,0.18) 0%, transparent 40%),
            radial-gradient(circle at 80% 60%, rgba(0,255,255,0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 85%, rgba(88,80,236,0.12) 0%, transparent 35%),
            radial-gradient(circle at 65% 15%, rgba(255,0,100,0.08) 0%, transparent 30%);
          filter: blur(50px);
          pointer-events: none;
        }
        .grid-floor {
          position: absolute;
          bottom: 0; left: -50%; right: -50%;
          height: 40%;
          background:
            linear-gradient(rgba(255,0,193,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(500px) rotateX(60deg);
          pointer-events: none;
          mask-image: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
        }
        .future-content {
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
        .era-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px;
          padding: 6px 16px;
          border: 1px solid rgba(255,0,193,0.3);
          border-radius: 99px;
          color: rgba(255,255,255,0.7);
          background: rgba(255,0,193,0.05);
        }
        .neon-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          font-family: var(--font-future);
          color: white;
          text-shadow:
            0 0 10px rgba(255,0,193,0.5),
            0 0 40px rgba(255,0,193,0.3),
            0 0 80px rgba(0,255,255,0.2);
          letter-spacing: 0.05em;
        }
        .glass-subtext {
          font-size: 1rem; letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-future);
        }

        .cube-scene {
          position: relative;
          width: 200px; height: 200px;
          margin: 2rem 0;
          perspective: 1000px;
        }
        .orbital-rings { position: absolute; inset: -40px; pointer-events: none; }
        .orbit {
          position: absolute; inset: 0;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 50%;
          animation: orbit-spin 12s linear infinite;
        }
        .orbit-dot {
          position: absolute; top: 0; left: 50%;
          width: 4px; height: 4px; border-radius: 50%;
          background: #ff00c1;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #ff00c1;
        }
        .orbit-1 { inset: 0; animation-duration: 10s; }
        .orbit-2 { inset: 15px; animation-duration: 16s; animation-direction: reverse; border-color: rgba(255,0,193,0.12); }
        .orbit-2 .orbit-dot { background: #00ffff; box-shadow: 0 0 8px #00ffff; }
        .orbit-3 { inset: 30px; animation-duration: 22s; border-color: rgba(0,255,255,0.1); }
        .orbit-3 .orbit-dot { background: #7b2ffc; box-shadow: 0 0 8px #7b2ffc; }
        @keyframes orbit-spin {
          from { transform: rotateX(60deg) rotateZ(0deg); }
          to { transform: rotateX(60deg) rotateZ(360deg); }
        }

        .cube {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        .cube-face {
          position: absolute;
          width: 200px; height: 200px;
          background: rgba(255,0,193,0.03);
          border: 1px solid rgba(255,0,193,0.15);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
        }
        .face-0 { transform: translateZ(100px); }
        .face-1 { transform: rotateY(90deg) translateZ(100px); }
        .face-2 { transform: rotateY(180deg) translateZ(100px); }
        .face-3 { transform: rotateY(-90deg) translateZ(100px); }
        .face-4 { transform: rotateX(90deg) translateZ(100px); }
        .face-5 { transform: rotateX(-90deg) translateZ(100px); }
        .cube-inner {
          color: rgba(255,255,255,0.5);
          filter: drop-shadow(0 0 12px rgba(255,0,193,0.4));
        }

        .tech-pills { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; }
        .pill {
          padding: 0.4rem 1.2rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 99px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-future);
        }
        .closing-text {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.35);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .cube-scene { width: 140px; height: 140px; }
          .cube-face { width: 140px; height: 140px; }
          .face-0 { transform: translateZ(70px); }
          .face-1 { transform: rotateY(90deg) translateZ(70px); }
          .face-2 { transform: rotateY(180deg) translateZ(70px); }
          .face-3 { transform: rotateY(-90deg) translateZ(70px); }
          .face-4 { transform: rotateX(90deg) translateZ(70px); }
          .face-5 { transform: rotateX(-90deg) translateZ(70px); }
          .tech-pills { gap: 0.4rem; }
          .grid-floor { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Future;

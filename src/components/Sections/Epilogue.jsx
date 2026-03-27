import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ── Fading Particle Field (wind-down effect) ── */
const FadingParticles = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    });
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

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
    const count = isMobile ? 12 : 20;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      hue: [280, 300, 200, 180][Math.floor(Math.random() * 4)],
      alpha: 0.6,
    }));

    const animate = () => {
      if (!isVisible.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        // Gradually decelerate — calming wind-down
        p.dx *= 0.998;
        p.dy *= 0.998;
        p.alpha = Math.max(0.15, p.alpha - 0.0001);

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha * 0.8})`;
        ctx.fill();
      });

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

/* ── Epilogue Section ── */
const Epilogue = ({ active }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    // Delayed staggered text reveal — feels like a deliberate pause
    const tl = gsap.timeline({ delay: 1.2 });
    tl.fromTo('.epilogue-line-1',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo('.epilogue-line-2',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.epilogue-line-3',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 0.5, duration: 1.2, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo('.epilogue-divider',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
      '-=0.8'
    );

    return () => tl.kill();
  }, [active]);

  return (
    <section ref={sectionRef} className="section epilogue">
      <FadingParticles active={active} />

      <div className="epilogue-bg-glow" />

      <div className="epilogue-content">
        <div className="epilogue-divider" />
        <h2 className="epilogue-line-1">
          The Internet is still evolving…
        </h2>
        <p className="epilogue-line-2">
          and you are part of it.
        </p>
        <p className="epilogue-line-3">
          From a 4-node experiment to a civilization of billions — the story never ends.
        </p>
      </div>

      <style jsx="true">{`
        .epilogue {
          background: #050510;
          color: white;
          overflow: hidden;
          position: relative;
        }

        .epilogue-bg-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 50%, rgba(255,0,193,0.06) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(0,255,255,0.04) 0%, transparent 40%);
          pointer-events: none;
        }

        .epilogue-content {
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          max-width: 700px;
          padding: 0 2rem;
        }

        .epilogue-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,0,193,0.6), transparent);
          margin-bottom: 1rem;
          transform-origin: center;
        }

        .epilogue-line-1 {
          font-family: var(--font-future);
          font-size: clamp(1.8rem, 5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-shadow: 0 0 20px rgba(255,0,193,0.25);
          animation: epilogue-glow-pulse 3s ease-in-out 3s infinite;
        }

        .epilogue-line-2 {
          font-family: var(--font-future);
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          font-weight: 300;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.05em;
        }

        .epilogue-line-3 {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.35);
          font-style: italic;
          max-width: 480px;
          line-height: 1.6;
        }

        @keyframes epilogue-glow-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .epilogue-content { max-width: 560px; }
        }

        @media (max-width: 768px) {
          .epilogue-content { gap: 1rem; }
          .epilogue-line-3 { font-size: 0.75rem; }
        }
      `}</style>
    </section>
  );
};

export default Epilogue;

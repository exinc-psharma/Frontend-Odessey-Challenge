import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

/* ── Sparse Star-Field Canvas (organic, not networked) ── */
/* ── Futuristic Glitch Canvas ── */
const GlitchBackground = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const scrollVelocity = useRef(0);
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
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Track global scroll velocity for glitch intensity
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // scale scroll speed
        const speed = Math.abs(self.getVelocity() / 150);
        scrollVelocity.current = Math.min(speed, 6); // cap max glitch intensity
      }
    });

    const colors = ['#00ffff', '#ff003c', '#00ff41', '#ffffff', '#111111'];

    const animate = () => {
      if (!isVisible.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      // Natural decay of velocity back to rest state (constant slight glitch)
      scrollVelocity.current += (0 - scrollVelocity.current) * 0.1;
      const intensity = 0.6 + scrollVelocity.current; // min intensity + scroll boost

      // Trail/Fade dark background
      ctx.fillStyle = `rgba(10, 10, 10, 0.25)`;
      ctx.fillRect(0, 0, W, H);

      // Draw random glitch horizontal blocks
      const numLines = Math.floor(Math.random() * 4 * intensity);
      for (let i = 0; i < numLines; i++) {
        const y = Math.random() * H;
        const h = Math.random() * 3 * intensity + 1;
        const w = (Math.random() * W * 0.6 + 20) * intensity;
        const x = Math.random() * W;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        
        // RGB Color Splits (Cyan/Red shift)
        if (Math.random() > 0.5) {
          ctx.fillStyle = 'rgba(255, 0, 60, 0.7)'; // Red layer
          ctx.fillRect(x - (12 * intensity), y, w, h);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.7)'; // Cyan layer
          ctx.fillRect(x + (16 * intensity), y, w, h);
        }
      }

      // Random full screen static flashes
      if (Math.random() < 0.015 * intensity) {
         ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.08})`;
         ctx.fillRect(0,0,W,H);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      st.kill();
    };
  }, []);

  useEffect(() => {
    const cleanup = draw();
    const onResize = () => { cancelAnimationFrame(animRef.current); draw(); };
    window.addEventListener('resize', onResize);
    return () => { cleanup?.(); window.removeEventListener('resize', onResize); };
  }, [draw]);

  return <canvas ref={canvasRef} className="glitch-bg" style={{position:'absolute', inset:0, zIndex:0}}/>;
};

/* ── Hero Section ── */
const Hero = ({ active }) => {
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const yearRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);

  // Typing animation
  useEffect(() => {
    if (!active) return;
    const tl = gsap.timeline();
    tl.to(textRef.current, {
      duration: 2.5,
      text: 'Before Google. Before the Web. There was a dream.',
      ease: 'none',
    })
    .fromTo(yearRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 0.12, scale: 1, duration: 1.5, ease: 'power2.out' },
      '-=1.5'
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      '+=0.3'
    )
    .fromTo(scrollRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '+=0.2'
    )
    .to(scrollRef.current, {
      y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut',
    });
  }, [active]);



  return (
    <section ref={sectionRef} className="section hero">
      <GlitchBackground />
      <div className="scanlines" />
      <div className="vignette" />

      <div className="hero-content">
        <div ref={yearRef} className="year-watermark">1969</div>
        <h1 ref={textRef} className="hero-title">{/* typed */}</h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Scroll to travel through time.
        </p>
        <div ref={scrollRef} className="scroll-indicator">
          <ChevronDown size={28} />
        </div>
      </div>

      <style jsx="true">{`
        .hero {
          background: #0a0a0a;
          color: #fff;
          text-align: center;
          overflow: hidden;
        }
        .star-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.08) 3px,
            rgba(0,0,0,0.08) 6px
          );
          pointer-events: none;
          z-index: 1;
        }
        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .year-watermark {
          position: absolute;
          font-size: clamp(8rem, 25vw, 20rem);
          font-weight: 900;
          color: rgba(0,255,65,0.06);
          letter-spacing: -0.05em;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity;
        }
        .hero-title {
          font-size: clamp(1.8rem, 6vw, 4rem);
          font-weight: 800;
          text-shadow: 0 0 30px rgba(0,255,65,0.12);
          max-width: 800px;
          line-height: 1.2;
          font-family: var(--font-mono);
        }
        .hero-subtitle {
          font-size: 0.9rem;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 300;
        }
        .scroll-indicator {
          margin-top: 2rem;
          color: var(--accent-primary);
          opacity: 0;
        }
        @media (max-width: 768px) {
          .year-watermark { font-size: 6rem; }
        }
      `}</style>
    </section>
  );
};

export default Hero;

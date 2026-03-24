import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network } from 'lucide-react';

/* ── Connected Nodes Canvas ── */
const NodeCanvas = ({ progress }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = (canvas.width = 300);
    const H = (canvas.height = 300);
    const cx = W / 2;
    const cy = H / 2;
    const nodeCount = 8;
    const radius = 100;

    ctx.clearRect(0, 0, W, H);

    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
    });

    // Draw connections (lit up based on progress)
    const totalEdges = nodeCount;
    const litEdges = Math.floor((progress / 100) * totalEdges);

    for (let i = 0; i < nodeCount; i++) {
      const j = (i + 1) % nodeCount;
      const isLit = i < litEdges;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.strokeStyle = isLit ? '#00ff41' : 'rgba(0,255,65,0.1)';
      ctx.lineWidth = isLit ? 2 : 1;
      ctx.stroke();

      if (isLit) {
        // Glow
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Cross connections
    for (let i = 0; i < nodeCount; i++) {
      const j = (i + 3) % nodeCount;
      const isLit = i < litEdges - 1;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.strokeStyle = isLit ? 'rgba(0,255,65,0.3)' : 'rgba(0,255,65,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw nodes
    nodes.forEach((n, i) => {
      const isLit = i <= litEdges;
      ctx.beginPath();
      ctx.arc(n.x, n.y, isLit ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isLit ? '#00ff41' : 'rgba(0,255,65,0.2)';
      ctx.fill();
      if (isLit) {
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = progress > 10 ? '#00ff41' : 'rgba(0,255,65,0.2)';
    ctx.fill();
    if (progress > 10) {
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [progress]);

  return <canvas ref={canvasRef} width={300} height={300} style={{ width: '200px', height: '200px' }} />;
};

/* ── Loader Component ── */
const Loader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing ARPANET protocols...');
  const intervalRef = useRef(null);

  const statuses = [
    'Handshaking with IMP node 1...',
    'Establishing TCP/IP layer...',
    'Pinging CERN (Tim Berners-Lee)...',
    'Negotiating 56k dial-up handshake...',
    'Loading World Wide Web...',
    'Buffering the Social Graph...',
    'Compiling Web3 contracts...',
    'System Ready. Launching timeline.'
  ];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setTimeout(onFinish, 800);
          return 100;
        }
        const next = prev + Math.random() * 6 + 1;
        const clamped = Math.min(next, 100);
        setStatus(statuses[Math.floor((clamped / 100) * (statuses.length - 1))]);
        return clamped;
      });
    }, 120);
    return () => clearInterval(intervalRef.current);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#050505',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          color: '#00ff41',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Scanlines overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
        }} />

        {/* Node network animation */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'relative' }}
        >
          <NodeCanvas progress={progress} />
        </motion.div>

        <div style={{ width: '280px', textAlign: 'center', zIndex: 2 }}>
          <p style={{
            fontSize: '0.65rem', marginBottom: '0.8rem',
            textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.9,
            minHeight: '1.5em'
          }}>
            {status}
          </p>

          {/* Progress bar */}
          <div style={{
            width: '100%', height: '3px',
            background: 'rgba(0, 255, 65, 0.08)',
            borderRadius: '2px', overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00ff41, #00cc33)',
                boxShadow: '0 0 15px #00ff41, 0 0 5px #00ff41'
              }}
            />
          </div>

          <p style={{ marginTop: '0.6rem', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '2px' }}>
            {Math.round(progress)}%
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;

import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';

const ARPANET_NODES = 12;

const NODE_LABELS = [
  'UCLA', 'SRI', 'UCSB', 'Utah', 'MIT', 'RAND',
  'BBN', 'Harvard', 'Lincoln', 'Stanford', 'CMU', 'Case'
];

const generateNodes = () =>
  Array.from({ length: ARPANET_NODES }, (_, i) => ({
    id: i,
    x: Math.random() * 70 + 15,
    y: Math.random() * 70 + 15,
    label: NODE_LABELS[i],
    connections: [(i + 1) % ARPANET_NODES, (i + 3) % ARPANET_NODES],
  }));

/* Helper: find shortest path between two nodes (BFS) */
const findPath = (nodes, startId, endId) => {
  const visited = new Set();
  const queue = [[startId]];
  visited.add(startId);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (current === endId) return path;
    const node = nodes.find(n => n.id === current);
    if (!node) continue;
    for (const connId of node.connections) {
      if (!visited.has(connId)) {
        visited.add(connId);
        queue.push([...path, connId]);
      }
    }
    // Also check reverse connections
    for (const n of nodes) {
      if (n.connections.includes(current) && !visited.has(n.id)) {
        visited.add(n.id);
        queue.push([...path, n.id]);
      }
    }
  }
  return [];
};

/* ── Data Packet ── */
const DataPacket = ({ x1, y1, x2, y2, delay }) => (
  <g>
    <circle r="1.5" fill="rgba(0,255,65,0.3)">
      <animateMotion dur="3s" repeatCount="indefinite" begin={`${delay}s`} path={`M ${x1} ${y1} L ${x2} ${y2}`} />
    </circle>
    <circle r="0.5" fill="#00ff41">
      <animateMotion dur="3s" repeatCount="indefinite" begin={`${delay}s`} path={`M ${x1} ${y1} L ${x2} ${y2}`} />
    </circle>
  </g>
);

/* ── Terminal Log ── */
const TerminalLog = ({ active }) => {
  const logRef = useRef(null);
  useEffect(() => {
    if (!active || !logRef.current) return;
    const lines = [
      '> LOGIN: UCLA-HOST',
      '> CONNECT 4800',
      '> Attempting IMP handshake...',
      '> LINK ESTABLISHED',
      '> Sending packet: "LO"',
      '> SRI confirms receipt',
      '> First message transmitted ✓',
      '> Network status: OPERATIONAL',
    ];
    const el = logRef.current;
    el.innerHTML = '';
    lines.forEach((line, i) => {
      setTimeout(() => {
        const span = document.createElement('div');
        span.textContent = line;
        span.style.opacity = '0';
        el.appendChild(span);
        gsap.to(span, { opacity: 1, duration: 0.3 });
        el.scrollTop = el.scrollHeight;
      }, i * 600);
    });
  }, [active]);
  return <div ref={logRef} className="terminal-log" />;
};

/* ── Arpanet Section ── */
const Arpanet = ({ active }) => {
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodes, setNodes] = useState(() => generateNodes());
  const [draggingNode, setDraggingNode] = useState(null);
  const svgRef = useRef(null);

  const handlePointerDown = (e, nodeId) => {
    e.target.setPointerCapture(e.pointerId);
    setDraggingNode(nodeId);
  };

  const handlePointerMove = (e) => {
    if (draggingNode === null || !svgRef.current) return;
    const svg = svgRef.current;
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    // Confine to internal invisible bounds (5% to 95%) 
    const newX = Math.max(5, Math.min(95, cursorPt.x));
    const newY = Math.max(5, Math.min(95, cursorPt.y));
    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x: newX, y: newY } : n));
  };

  const handlePointerUp = (e) => {
    if (draggingNode !== null) {
      if (e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }
      setDraggingNode(null);
    }
  };

  // WOW: Highlighted connection path from hovered node to a remote node
  const highlightedPath = useMemo(() => {
    if (hoveredNode === null) return new Set();
    // Find path from hovered node to a "distant" node (opposite side of ring)
    const targetId = (hoveredNode + Math.floor(ARPANET_NODES / 2)) % ARPANET_NODES;
    const path = findPath(nodes, hoveredNode, targetId);
    const edgeSet = new Set();
    for (let i = 0; i < path.length - 1; i++) {
      edgeSet.add(`${path[i]}-${path[i + 1]}`);
      edgeSet.add(`${path[i + 1]}-${path[i]}`);
    }
    return edgeSet;
  }, [hoveredNode, nodes]);

  const pathNodeIds = useMemo(() => {
    if (hoveredNode === null) return new Set();
    const targetId = (hoveredNode + Math.floor(ARPANET_NODES / 2)) % ARPANET_NODES;
    return new Set(findPath(nodes, hoveredNode, targetId));
  }, [hoveredNode, nodes]);

  useEffect(() => {
    if (!active) return;
    gsap.fromTo('.arpanet-node',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'back.out(2)' }
    );
    gsap.fromTo('.arpanet-line',
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 2.5, stagger: 0.04, ease: 'power2.out' }
    );
  }, [active]);

  const getEdgeStyle = (nodeId, connId) => {
    const edgeKey = `${nodeId}-${connId}`;
    const isPath = highlightedPath.has(edgeKey);
    const isDirectHover = hoveredNode === nodeId || hoveredNode === connId;

    if (isPath) return { stroke: '#00ff41', strokeWidth: 0.5, opacity: 1 };
    if (isDirectHover) return { stroke: '#00ff41', strokeWidth: 0.3, opacity: 0.8 };
    if (hoveredNode !== null) return { stroke: 'rgba(0,255,65,0.06)', strokeWidth: 0.06, opacity: 0.5 };
    return { stroke: 'rgba(0,255,65,0.15)', strokeWidth: 0.08, opacity: 1 };
  };

  return (
    <section ref={containerRef} className="section arpanet">
      <div className="terminal-panel">
        <div className="terminal-chrome">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">arpanet.sys</span>
        </div>
        <div className="terminal-content">
          <div className="terminal-header">ARPANET v1.0 — [1969]</div>
          <TerminalLog active={active} />
        </div>
      </div>

      <svg 
        ref={svgRef} 
        className="network-svg" 
        viewBox="0 0 100 100"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >


        {/* Lines */}
        {nodes.map((node) =>
          node.connections.map((connId) => {
            const target = nodes.find((n) => n.id === connId);
            if (!target) return null;
            const style = getEdgeStyle(node.id, connId);
            return (
              <line
                key={`${node.id}-${connId}`}
                x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                className="arpanet-line"
                style={{ ...style, transition: 'stroke 0.4s ease, stroke-width 0.4s ease, opacity 0.4s ease' }}
              />
            );
          })
        )}

        {/* Data packets */}
        {active && nodes.map((node) =>
          node.connections.map((connId) => {
            const target = nodes.find((n) => n.id === connId);
            if (!target) return null;
            return (
              <DataPacket
                key={`pkt-${node.id}-${connId}`}
                x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                delay={Math.random() * 4}
              />
            );
          })
        )}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isOnPath = pathNodeIds.has(node.id);
          const isDimmed = hoveredNode !== null && !isHovered && !isOnPath;
          return (
            <g
              key={node.id}
              className="arpanet-node"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onPointerDown={(e) => handlePointerDown(e, node.id)}
              style={{ cursor: draggingNode === node.id ? 'grabbing' : 'grab' }}
            >
              {isHovered && (
                <circle cx={node.x} cy={node.y} r="3" fill="none" stroke="#00ff41" strokeWidth="0.1" opacity="0.5">
                  <animate attributeName="r" from="1.5" to="4" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={node.x} cy={node.y}
                r={isHovered ? 4 : isOnPath ? 3 : 2}
                fill={isHovered ? 'rgba(0,255,65,0.2)' : isOnPath ? 'rgba(0,255,65,0.15)' : 'rgba(0,255,65,0.08)'}
                style={{ transition: 'all 0.3s ease', opacity: isDimmed ? 0.3 : 1 }}
              />
              <circle
                cx={node.x} cy={node.y}
                r={isHovered ? 1.8 : isOnPath ? 1.4 : 1}
                fill={isHovered ? '#00ff41' : isOnPath ? 'rgba(0,255,65,0.8)' : 'rgba(0,255,65,0.6)'}
                stroke="#00ff41" strokeWidth="0.15"
                style={{ transition: 'all 0.3s ease', opacity: isDimmed ? 0.3 : 1 }}
              />
              {(isHovered || isOnPath) && (
                <text
                  x={node.x + 2.5} y={node.y + 0.5}
                  fill="#00ff41" fontSize="1.4"
                  fontFamily="var(--font-mono)"
                  style={{ opacity: isHovered ? 1 : 0.7 }}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <style jsx="true">{`
        .arpanet {
          background: #050505;
          color: #00ff41;
          font-family: var(--font-mono);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          padding: 2rem 4rem;
        }
        .terminal-panel {
          width: 380px; min-width: 320px;
          background: #0c0c0c;
          border: 1px solid rgba(0,255,65,0.15);
          border-radius: 8px;
          overflow: hidden; z-index: 2; flex-shrink: 0;
        }
        .terminal-chrome {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px;
          background: rgba(0,255,65,0.05);
          border-bottom: 1px solid rgba(0,255,65,0.1);
        }
        .terminal-dot { width: 8px; height: 8px; border-radius: 50%; }
        .terminal-dot.red { background: #ff5f56; }
        .terminal-dot.yellow { background: #ffbd2e; }
        .terminal-dot.green { background: #27c93f; }
        .terminal-title {
          margin-left: auto; font-size: 0.6rem; opacity: 0.5;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .terminal-content { padding: 1rem; }
        .terminal-header { font-weight: bold; letter-spacing: 2px; margin-bottom: 1rem; font-size: 0.8rem; }
        .terminal-log {
          font-size: 0.65rem; line-height: 1.8; max-height: 300px;
          overflow-y: auto; color: rgba(0,255,65,0.8);
        }
        .terminal-log div { border-left: 1px solid rgba(0,255,65,0.15); padding-left: 8px; margin-bottom: 2px; }
        .network-svg { flex: 1; max-width: 700px; height: 80vh; touch-action: none; }

        @media (max-width: 1024px) and (min-width: 769px) {
          .arpanet { gap: 2rem; padding: 2rem 2rem; }
          .terminal-panel { width: 300px; min-width: 260px; }
          .network-svg { height: 60vh; }
        }

        @media (max-width: 768px) {
          .arpanet { flex-direction: column; align-items: center; padding: 1.5rem 1rem; gap: 1.5rem; }
          .terminal-panel { width: 100%; min-width: auto; max-width: 340px; }
          .terminal-log { max-height: 120px; } /* Prevent terminal from consuming all space */
          .network-svg { width: 100%; height: 45vh; touch-action: pan-y; margin-bottom: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default Arpanet;

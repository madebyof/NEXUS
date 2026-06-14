import { useState, useEffect } from "react";

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: Array<{
    target: NeuralNode;
    strength: number;
  }>;
}

export default function VisualizationArea() {
  const [neuralPatterns, setNeuralPatterns] = useState<NeuralNode[]>([]);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Initialize neural patterns
  useEffect(() => {
    const patterns: NeuralNode[] = [];
    for (let i = 0; i < 50; i++) {
      patterns.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
      });
    }
    setNeuralPatterns(patterns);
  }, []);

  // Update neural patterns and pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));

      setNeuralPatterns((prevPatterns) => {
        const newPatterns = prevPatterns.map((node) => ({
          ...node,
          x: node.x + node.vx,
          y: node.y + node.vy,
          vx: node.x < 0 || node.x > 100 ? node.vx * -1 : node.vx,
          vy: node.y < 0 || node.y > 100 ? node.vy * -1 : node.vy,
          connections: [],
        }));

        // Calculate connections
        newPatterns.forEach((node, i) => {
          newPatterns.forEach((other, j) => {
            if (i !== j) {
              const dist = Math.sqrt(
                Math.pow(node.x - other.x, 2) +
                  Math.pow(node.y - other.y, 2)
              );
              if (dist < 15) {
                node.connections.push({
                  target: other,
                  strength: 1 - dist / 15,
                });
              }
            }
          });
        });

        return newPatterns;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        height: "calc(100vh - 300px)",
        minHeight: "500px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF11] to-[#FF00FF11] backdrop-blur-xl" />
      <div className="absolute inset-0 border border-[#00FFFF33] rounded-3xl" />

      <div className="absolute inset-[1px] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="radarGrid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="#00FFFF" opacity="0.3" />
                <path
                  d="M 0 20 L 40 20 M 20 0 L 20 40"
                  stroke="#00FFFF"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              </pattern>
              <radialGradient id="radarGlow">
                <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#radarGrid)" />
            <circle cx="50%" cy="50%" r="30%" fill="url(#radarGlow)" />
          </svg>
        </div>
      </div>

      <div className="relative h-full flex flex-col">
        {/* Visualization Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#00FFFF22] backdrop-blur-sm bg-[#00000044]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full bg-[#00FFFF]"
                style={{
                  boxShadow: "0 0 10px #00FFFF",
                }}
              />
              <span className="text-[12px] font-semibold text-[#00FFFF] tracking-[0.1em]">
                REAL-TIME DATA STREAM
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#00FFFF88]">
            {neuralPatterns.length} NODES ACTIVE
          </span>
        </div>

        {/* Neural Network Visualization */}
        <div className="relative flex-1 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            {/* Neural connections */}
            {neuralPatterns.map((node, i) =>
              node.connections.map((conn, j) => (
                <line
                  key={`line-${i}-${j}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${conn.target.x}%`}
                  y2={`${conn.target.y}%`}
                  stroke={`rgba(0, 255, 255, ${conn.strength * 0.3})`}
                  strokeWidth="1"
                />
              ))
            )}

            {/* Neural nodes */}
            {neuralPatterns.map((node, i) => (
              <g key={`node-${i}`}>
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="2"
                  fill="#00FFFF"
                  opacity={0.6 + Math.sin(pulsePhase + i) * 0.4}
                />
              </g>
            ))}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div
                className="text-[48px] font-bold text-[#00FFFF] text-transparent bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text mb-4"
                style={{
                  opacity: 0.5 + Math.sin(pulsePhase) * 0.3,
                }}
              >
                NEURAL SYNC
              </div>
              <p className="text-[12px] text-[#00FFFF88] tracking-[0.2em]">
                QUANTUM NETWORK ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

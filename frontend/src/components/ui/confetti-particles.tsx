"use client";

import React, { useEffect, useRef } from "react";

/**
 * Confetti Particles — Lightweight CSS-based background sparkles.
 *
 * Creates a floating particle effect using absolutely positioned elements.
 * No external library needed — pure CSS animations for performance.
 */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  type: "circle" | "star" | "dot";
}

const PARTICLE_COLORS = [
  "rgba(236, 72, 153, 0.6)", // pink
  "rgba(168, 85, 247, 0.5)", // purple
  "rgba(6, 182, 212, 0.4)",  // cyan
  "rgba(251, 191, 36, 0.4)", // amber
  "rgba(244, 114, 182, 0.3)", // light pink
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 4,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    type: (["circle", "star", "dot"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function ConfettiParticles({ count = 30 }: { count?: number }) {
  const particlesRef = useRef<Particle[]>(generateParticles(count));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particlesRef.current.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: `blur(${p.size > 4 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";

/**
 * Hero Section — Animated welcome section with the friend's name.
 *
 * Features:
 * - Large gradient text for the friend's name
 * - Animated entrance with staggered elements
 * - Floating emoji decorations
 * - Neon glow accents
 */

interface HeroSectionProps {
  friendsName: string;
  mainHeading: string;
}

export function HeroSection({ friendsName, mainHeading }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animations after mount
    const section = sectionRef.current;
    if (section) {
      section.classList.add("animate-fade-in-up");
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial gradient glow behind text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
          }}
        />

        {/* Floating emojis */}
        <span
          className="absolute text-4xl animate-float"
          style={{ top: "15%", left: "10%", animationDelay: "0s" }}
        >
          🎈
        </span>
        <span
          className="absolute text-3xl animate-float"
          style={{ top: "25%", right: "15%", animationDelay: "1s" }}
        >
          🎉
        </span>
        <span
          className="absolute text-4xl animate-float"
          style={{ top: "60%", left: "8%", animationDelay: "2s" }}
        >
          🎂
        </span>
        <span
          className="absolute text-3xl animate-float"
          style={{ top: "70%", right: "12%", animationDelay: "1.5s" }}
        >
          🎁
        </span>
        <span
          className="absolute text-2xl animate-float"
          style={{ top: "40%", left: "20%", animationDelay: "0.5s" }}
        >
          ⭐
        </span>
        <span
          className="absolute text-2xl animate-float"
          style={{ top: "50%", right: "20%", animationDelay: "2.5s" }}
        >
          💖
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-8 max-w-3xl">
        {/* Small label */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-sm font-medium opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <span className="animate-pulse">🎂</span>
          <span>Bugün çok özel bir gün!</span>
        </div>

        {/* Main heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <span
            className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient"
            style={{ backgroundSize: "200% 200%" }}
          >
            {mainHeading}
          </span>
        </h1>

        {/* Friend's name — large and glowing */}
        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        >
          <p className="text-zinc-400 text-lg mb-3">Bu site sana özel hazırlandı</p>
          <h2
            className="text-6xl sm:text-7xl md:text-8xl font-black text-glow"
            style={{ color: "#ec4899" }}
          >
            {friendsName}
          </h2>
        </div>

        {/* Scroll indicator */}
        <div
          className="pt-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <span className="text-sm">Aşağı kaydır</span>
            <div className="w-6 h-10 rounded-full border-2 border-zinc-600 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-3 bg-pink-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

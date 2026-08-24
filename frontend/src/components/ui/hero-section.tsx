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
      className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden py-12"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial gradient glow behind text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
          }}
        />

        {/* Floating emojis - positioned within safe bounds */}
        <span
          className="absolute text-2xl sm:text-4xl animate-float"
          style={{ top: "12%", left: "6%", animationDelay: "0s" }}
        >
          🎈
        </span>
        <span
          className="absolute text-2xl sm:text-3xl animate-float"
          style={{ top: "18%", right: "8%", animationDelay: "1s" }}
        >
          🎉
        </span>
        <span
          className="absolute text-2xl sm:text-4xl animate-float"
          style={{ top: "68%", left: "6%", animationDelay: "2s" }}
        >
          🎂
        </span>
        <span
          className="absolute text-2xl sm:text-3xl animate-float"
          style={{ top: "75%", right: "8%", animationDelay: "1.5s" }}
        >
          🎁
        </span>
        <span
          className="absolute text-xl sm:text-2xl animate-float opacity-70"
          style={{ top: "35%", left: "12%", animationDelay: "0.5s" }}
        >
          ⭐
        </span>
        <span
          className="absolute text-xl sm:text-2xl animate-float opacity-70"
          style={{ top: "45%", right: "12%", animationDelay: "2.5s" }}
        >
          💖
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-6 sm:space-y-8 max-w-3xl w-full mx-auto">
        {/* Small label */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs sm:text-sm font-medium opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <span className="animate-pulse">🎂</span>
          <span>Bugün çok özel bir gün!</span>
        </div>

        {/* Main heading */}
        <h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight opacity-0 animate-fade-in-up px-2"
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
          className="opacity-0 animate-fade-in-up px-2"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        >
          <p className="text-zinc-400 text-sm sm:text-lg mb-2 sm:mb-3">Bu site sana özel hazırlandı</p>
          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-glow break-words tracking-tight"
            style={{ color: "#ec4899" }}
          >
            {friendsName}
          </h2>
        </div>

        {/* Scroll indicator */}
        <div
          className="pt-6 sm:pt-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col items-center gap-1.5 text-zinc-500">
            <span className="text-xs sm:text-sm">Aşağı kaydır</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-zinc-600 flex items-start justify-center p-1">
              <div className="w-1.5 h-2.5 sm:h-3 bg-pink-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

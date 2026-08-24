"use client";

import React, { useRef, useState, useEffect } from "react";

/**
 * Music Player — Floating toggle button for background music.
 *
 * Shows a pulsing music icon that the user can click to play/pause.
 * Positioned fixed in the bottom-right corner for easy access.
 */

interface MusicPlayerProps {
  src: string | null;
}

export function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setIsLoaded(true));
    audio.addEventListener("error", () => setIsLoaded(false));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn("Audio playback failed:", err);
    }
  };

  // Don't render if no music source provided
  if (!src) return null;

  return (
    <button
      onClick={togglePlay}
      disabled={!isLoaded}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        border-2 transition-all duration-300
        ${
          isPlaying
            ? "border-pink-500 bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-pulse-glow"
            : "border-zinc-600 bg-zinc-800/80 hover:border-pink-500/50 hover:bg-zinc-700/80"
        }
        ${!isLoaded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        backdrop-blur-sm
      `}
      title={isPlaying ? "Müziği Durdur" : "Müzik Çal"}
      aria-label={isPlaying ? "Müziği Durdur" : "Müzik Çal"}
    >
      <span className="text-2xl">
        {isPlaying ? "🎵" : "🔇"}
      </span>
    </button>
  );
}

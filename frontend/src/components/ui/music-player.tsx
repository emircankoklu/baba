"use client";

import React, { useRef, useState, useEffect } from "react";

/**
 * Music Player — Floating toggle button for background music.
 *
 * Fully compatible with iOS Safari & Android Chrome:
 * - Uses native HTML5 <audio> tag with playsInline.
 * - Never blocks the button with canplaythrough (which iOS Safari intentionally skips until tapped).
 * - Shows clear play/pause and pulsing invite badge.
 */

interface MusicPlayerProps {
  src: string | null;
}

export function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset playing state if audio source changes
    setIsPlaying(false);
    setIsLoading(false);
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio playback failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!src) return null;

  return (
    <>
      {/* Native HTML5 Audio with iOS Safari compliance */}
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.warn("Audio error:", e);
          setIsLoading(false);
        }}
      />

      <button
        onClick={togglePlay}
        className={`
          fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50
          w-13 h-13 sm:w-14 sm:h-14 rounded-full
          flex items-center justify-center
          border-2 transition-all duration-300
          ${
            isPlaying
              ? "border-pink-500 bg-pink-500/25 shadow-[0_0_25px_rgba(236,72,153,0.45)] animate-pulse-glow"
              : "border-zinc-600/80 bg-zinc-900/90 hover:border-pink-400 hover:bg-zinc-800 active:scale-95 shadow-xl"
          }
          backdrop-blur-md cursor-pointer touch-manipulation
        `}
        title={isPlaying ? "Müziği Durdur" : "Müzik Çal"}
        aria-label={isPlaying ? "Müziği Durdur" : "Müzik Çal"}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-xl sm:text-2xl select-none">
            {isPlaying ? "🎵" : "🔇"}
          </span>
        )}

        {/* Pulsing indicator when music is ready to be played */}
        {!isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
          </span>
        )}
      </button>
    </>
  );
}


"use client";

import React, { useEffect, useState, useRef } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { LiveCounter } from "@/components/ui/live-counter";
import { Balloons, BalloonsHandle } from "@/components/ui/balloons";
import { CardFanCarousel, CardItem } from "@/components/ui/card-fan-carousel";
import { ConfettiParticles } from "@/components/ui/confetti-particles";
import { MusicPlayer } from "@/components/ui/music-player";
import { GiftShelf } from "@/components/ui/gift-shelf";
import {
  fetchConfig,
  fetchMemories,
  getMediaUrl,
  BirthdayConfig,
  MemoryPhoto,
} from "@/lib/api";

/**
 * Main Birthday Page
 *
 * Fetches data from the Django API and renders:
 * 1. Hero section with the friend's name and heading
 * 2. Real-time Live Age & Life Counter (from birth date set in admin)
 * 3. Celebration button that launches balloons
 * 4. Birthday message section
 * 5. Memory photos card fan carousel
 * 6. Interactive Gift Shelf (Guestbook & Postcard note leaving with fireworks)
 * 7. Background music player (if configured)
 */

export default function BirthdayPage() {
  const [config, setConfig] = useState<BirthdayConfig | null>(null);
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balloonsTriggered, setBalloonsTriggered] = useState(false);
  const [celebrationStarted, setCelebrationStarted] = useState(false);
  const balloonsRef = useRef<BalloonsHandle>(null);

  // Fetch data from Django API
  useEffect(() => {
    async function loadData() {
      try {
        const [configData, memoriesData] = await Promise.all([
          fetchConfig(),
          fetchMemories(),
        ]);
        setConfig(configData);
        setMemories(memoriesData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(
          "Veriler yüklenirken bir hata oluştu. Django sunucusunun çalıştığından emin olun."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle celebration button click
  const startCelebration = () => {
    setBalloonsTriggered(true);
    setCelebrationStarted(true);

    // Reset balloon trigger after a delay to allow re-triggering
    setTimeout(() => setBalloonsTriggered(false), 3000);
  };

  // Transform memory photos for the carousel
  const carouselItems: CardItem[] = memories.map((m) => ({
    id: m.id,
    image: getMediaUrl(m.image) || m.image,
    alt_text: m.alt_text,
    description: m.description,
  }));

  // ─── Loading State ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-zinc-700 border-t-pink-500 rounded-full animate-spin" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            🎂
          </span>
        </div>
        <p className="mt-6 text-zinc-400 animate-pulse">
          Sürpriz hazırlanıyor...
        </p>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] px-6">
        <div className="glass-card p-8 max-w-md text-center space-y-4">
          <span className="text-5xl">😢</span>
          <h2 className="text-xl font-bold text-zinc-200">Bağlantı Hatası</h2>
          <p className="text-zinc-400 text-sm">{error}</p>
          <div className="pt-2 space-y-2 text-left text-xs text-zinc-500">
            <p>Kontrol edin:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Django sunucusu:{" "}
                <code className="text-pink-400">python manage.py runserver</code>
              </li>
              <li>
                CORS ayarları:{" "}
                <code className="text-pink-400">localhost:3000</code> izinli mi?
              </li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 hover:bg-pink-500/30 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Content ────────────────────────────────────────────
  return (
    <main className="relative min-h-screen bg-[#0a0a0f]">
      {/* Background particles */}
      <ConfettiParticles count={35} />

      {/* Balloons animation (renders its own overlay) */}
      <Balloons ref={balloonsRef} trigger={balloonsTriggered} />

      {/* Music player (if music is configured) */}
      {config?.background_music && (
        <MusicPlayer src={getMediaUrl(config.background_music)} />
      )}

      {/* ─── Section 1: Hero ─────────────────────────────────── */}
      <HeroSection
        friendsName={config?.friends_name || "Arkadaşım"}
        mainHeading={config?.main_heading || "İyi ki Doğdun! 🎉"}
      />

      {/* ─── Section 2: Live Age / Life Counter (if configured) ─ */}
      {config?.birth_date && (
        <LiveCounter
          birthDate={config.birth_date}
          friendsName={config.friends_name}
        />
      )}

      {/* ─── Section 3: Celebration Button ────────────────────── */}
      <section className="relative py-20 flex flex-col items-center justify-center">
        <div className="text-center space-y-8">
          {!celebrationStarted ? (
            <>
              <p className="text-zinc-400 text-lg animate-pulse">
                Kutlamaya hazır mısın? 🎊
              </p>
              <button
                id="celebration-button"
                onClick={startCelebration}
                className="
                  relative group
                  px-12 py-5 rounded-full
                  bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600
                  text-white text-xl font-bold
                  shadow-[0_0_40px_rgba(236,72,153,0.4)]
                  hover:shadow-[0_0_60px_rgba(236,72,153,0.6)]
                  hover:scale-105
                  active:scale-95
                  transition-all duration-300
                  animate-pulse-glow
                  bg-[length:200%_100%]
                  hover:bg-right
                  cursor-pointer
                "
              >
                <span className="relative z-10">Kutlamayı Başlat! 🎈</span>

                {/* Animated border ring */}
                <span className="absolute inset-0 rounded-full border-2 border-pink-400/30 animate-ping" />
              </button>
            </>
          ) : (
            <div className="animate-fade-in-up space-y-4">
              <span className="text-6xl block">🎉</span>
              <p className="text-2xl font-bold text-pink-400 text-glow-sm">
                Kutlama başladı!
              </p>
              <button
                onClick={startCelebration}
                className="
                  mt-4 px-8 py-3 rounded-full
                  bg-pink-500/20 border border-pink-500/40
                  text-pink-400 font-medium
                  hover:bg-pink-500/30
                  transition-all duration-300
                  cursor-pointer
                "
              >
                Tekrar Balonlar! 🎈
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 4: Celebration Message ───────────────────── */}
      {config?.celebration_message && (
        <section className="relative py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500/50" />
              <span className="text-2xl">💌</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-500/50" />
            </div>

            <div className="glass-card p-8 sm:p-12">
              <h3 className="text-2xl font-bold text-zinc-200 mb-6">
                Sana Özel Mesajımız
              </h3>
              <div className="space-y-4">
                {config.celebration_message.split("\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-zinc-300 text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Section 5: Memory Gallery (Card Fan Carousel) ──── */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
              <span className="text-2xl">📸</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Anılarımız
              </span>
            </h3>
            <p className="text-zinc-500 mt-3">
              Birlikte yaşadığımız güzel anlar ✨
            </p>
          </div>

          {/* Card Fan Carousel */}
          <CardFanCarousel items={carouselItems} />
        </div>
      </section>

      {/* ─── Section 6: Interactive Gift Shelf (Leave a Note) ─── */}
      <GiftShelf friendsName={config?.friends_name || "Arkadaşım"} />

      {/* Floating Admin Button */}
      <a
        href="/admin/"
        target="_blank"
        rel="noopener noreferrer"
        title="Yönetim Paneli"
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-zinc-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-zinc-800 transition-all duration-200 backdrop-blur-md shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </a>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="relative py-12 text-center border-t border-zinc-800 space-y-3">
        <p className="text-zinc-600 text-sm">
          ❤️ Sevgiyle hazırlandı — {new Date().getFullYear()}
        </p>
        <div>
          <a
            href="/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-pink-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>İçerikleri Düzenle (Admin Paneli)</span>
          </a>
        </div>
      </footer>
    </main>
  );
}

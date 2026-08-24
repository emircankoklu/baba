"use client";

import React, { useEffect, useState } from "react";

interface LiveCounterProps {
  birthDate?: string | null;
  friendsName?: string;
}

interface TimeDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export function LiveCounter({ birthDate, friendsName = "Arkadaşım" }: LiveCounterProps) {
  const [diff, setDiff] = useState<TimeDifference | null>(null);

  useEffect(() => {
    if (!birthDate) return;

    function calculateTime() {
      const birth = new Date(birthDate!);
      const now = new Date();

      if (isNaN(birth.getTime())) {
        return;
      }

      let diffMs = now.getTime() - birth.getTime();
      if (diffMs < 0) {
        // In case a future date is set (countdown mode)
        diffMs = Math.abs(diffMs);
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalDays = Math.floor(totalSeconds / 86400);

      // Detailed year/month/day breakdown
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        // Days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours() - birth.getHours();
      const minutes = now.getMinutes() - birth.getMinutes();
      const seconds = now.getSeconds() - birth.getSeconds();

      const normalizedSeconds = (seconds + 60) % 60;
      const normalizedMinutes = (minutes + (seconds < 0 ? -1 : 0) + 60) % 60;
      const normalizedHours =
        (hours + (minutes < 0 || (minutes === 0 && seconds < 0) ? -1 : 0) + 24) % 24;

      setDiff({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: normalizedHours,
        minutes: normalizedMinutes,
        seconds: normalizedSeconds,
        totalDays,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  if (!birthDate || !diff) {
    return null;
  }

  const statBoxes = [
    { label: "Yıl", value: diff.years, icon: "🎂", gradient: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/30" },
    { label: "Ay", value: diff.months, icon: "🌙", gradient: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/30" },
    { label: "Gün", value: diff.days, icon: "☀️", gradient: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30" },
    { label: "Saat", value: diff.hours, icon: "⏱️", gradient: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/30" },
    { label: "Dakika", value: diff.minutes, icon: "✨", gradient: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
    { label: "Saniye", value: diff.seconds, icon: "⚡", isLive: true, gradient: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/40" },
  ];

  return (
    <section className="relative py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Header decoration */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium animate-pulse">
          <span>⏳</span>
          <span>Hayatımıza Kattığın Güzellik</span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            İyi ki Doğdun,{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {friendsName}
            </span>
            !
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Bu dünyayı güzelleştirdiğin, varlığınla neşe kattığın her an için:
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {statBoxes.map((item, idx) => (
            <div
              key={idx}
              className={`
                relative overflow-hidden p-4 sm:p-5 rounded-2xl
                bg-gradient-to-b ${item.gradient}
                border ${item.border}
                backdrop-blur-md
                flex flex-col items-center justify-center
                shadow-lg hover:scale-105 transition-all duration-300
              `}
            >
              {item.isLive && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}

              <span className="text-lg sm:text-xl mb-1">{item.icon}</span>

              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {String(item.value).padStart(2, "0")}
              </span>

              <span className="text-xs uppercase tracking-wider text-zinc-400 mt-1 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Total days milestone badge */}
        <div className="pt-2">
          <p className="inline-block text-xs sm:text-sm text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-full px-5 py-2">
            🌟 Toplam{" "}
            <span className="text-pink-400 font-bold font-mono">
              {diff.totalDays.toLocaleString("tr-TR")}
            </span>{" "}
            gündür hayatımızdasın ve her günümüz seninle daha anlamlı!
          </p>
        </div>
      </div>
    </section>
  );
}

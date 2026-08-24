"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

/**
 * Card Fan Carousel — GSAP-powered fanned card display with mobile touch & swipe support.
 *
 * Cards are spread in an adaptive fan/arc formation.
 * On mobile, supports touch gestures (swiping left/right), tap to focus,
 * and thumb-friendly prev/next controls.
 */

export interface CardItem {
  id: number;
  image: string;
  alt_text: string;
  description: string;
}

interface CardFanCarouselProps {
  items: CardItem[];
}

export function CardFanCarousel({ items }: CardFanCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate fan positions adaptively
  const getFanTransform = useCallback((index: number, total: number, mobile: boolean) => {
    const mid = (total - 1) / 2;
    const offset = index - mid;

    if (mobile) {
      // Mobile: compact fan that stays within 360-400px phone screens
      const maxRotation = total > 5 ? 3.5 : 5;
      const maxTranslateY = total > 5 ? 5 : 8;
      const spreadX = total > 6 ? 28 : (total > 4 ? 36 : 46);
      return {
        rotation: offset * maxRotation,
        y: Math.abs(offset) * maxTranslateY,
        x: offset * spreadX,
      };
    }

    // Desktop
    const maxRotation = total > 6 ? 4 : 6;
    const maxTranslateY = total > 6 ? 8 : 15;
    const spreadX = total > 6 ? 85 : 110;

    return {
      rotation: offset * maxRotation,
      y: Math.abs(offset) * maxTranslateY,
      x: offset * spreadX,
    };
  }, []);

  // Initialize the fan layout
  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const total = cards.length;

    // Set initial positions (hidden)
    gsap.set(cards, {
      opacity: 0,
      scale: 0.6,
      y: 80,
    });

    // Animate into fan formation
    cards.forEach((card, i) => {
      const { rotation, y, x } = getFanTransform(i, total, isMobile);

      gsap.to(card, {
        opacity: 1,
        scale: 1,
        rotation,
        y,
        x,
        duration: 0.7,
        delay: i * 0.08,
        ease: "back.out(1.2)",
        onComplete: () => {
          if (i === total - 1) setIsInitialized(true);
        },
      });
    });

    return () => {
      gsap.killTweensOf(cards);
    };
  }, [items, isMobile, getFanTransform]);

  // Handle card activation (click/hover)
  const activateCard = (index: number) => {
    if (!isInitialized) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const total = cards.length;

    // Optional haptic feedback on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }

    if (activeIndex === index) {
      // Deactivate — return to fan position
      setActiveIndex(null);
      cards.forEach((card, i) => {
        const { rotation, y, x } = getFanTransform(i, total, isMobile);
        gsap.to(card, {
          rotation,
          y,
          x,
          scale: 1,
          zIndex: i,
          duration: 0.4,
          ease: "power2.out",
        });
      });
      return;
    }

    setActiveIndex(index);

    cards.forEach((card, i) => {
      if (i === index) {
        // Bring active card to front
        gsap.to(card, {
          rotation: 0,
          y: isMobile ? -18 : -30,
          x: 0,
          scale: isMobile ? 1.08 : 1.15,
          zIndex: 50,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        // Push other cards aside
        const { rotation, y, x } = getFanTransform(i, total, isMobile);
        const pushDirection = i < index ? -1 : 1;
        const pushDistance = isMobile ? 18 : 30;
        gsap.to(card, {
          rotation: rotation + pushDirection * 2.5,
          y: y + (isMobile ? 6 : 10),
          x: x + pushDirection * pushDistance,
          scale: isMobile ? 0.92 : 0.9,
          zIndex: i,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  };

  // Navigate to prev / next card
  const navigateCard = (direction: "prev" | "next") => {
    const total = items.length;
    if (total === 0) return;

    let nextIdx = 0;
    if (activeIndex === null) {
      nextIdx = direction === "next" ? 0 : total - 1;
    } else {
      nextIdx =
        direction === "next"
          ? (activeIndex + 1) % total
          : (activeIndex - 1 + total) % total;
    }
    activateCard(nextIdx);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Only trigger if horizontal swipe is significant and dominant over vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        navigateCard("next");
      } else {
        navigateCard("prev");
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <p className="text-base sm:text-lg">Henüz anı fotoğrafı eklenmemiş.</p>
        <p className="text-xs sm:text-sm mt-1.5">Django Admin panelinden fotoğraf ekleyin.</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full py-6 sm:py-12 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Card container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center mx-auto"
        style={{ minHeight: isMobile ? "360px" : "420px" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onClick={() => activateCard(index)}
            className="absolute cursor-pointer select-none touch-manipulation"
            style={{
              zIndex: activeIndex === index ? 50 : index,
              transformOrigin: "center bottom",
            }}
          >
            <div
              className={`
                relative w-48 h-68 sm:w-64 sm:h-80 rounded-2xl overflow-hidden
                border-2 transition-colors duration-300 shadow-xl
                ${
                  activeIndex === index
                    ? "border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.35)]"
                    : "border-zinc-700/60 hover:border-zinc-500"
                }
              `}
            >
              {/* Photo */}
              <img
                src={item.image}
                alt={item.alt_text || "Anı fotoğrafı"}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
                loading="lazy"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Description overlay */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 transition-all duration-300
                  ${activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                `}
              >
                {item.alt_text && (
                  <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-1">
                    {item.alt_text}
                  </h4>
                )}
                {item.description && (
                  <p className="text-zinc-300 text-[11px] sm:text-xs line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Shine effect on hover */}
              <div
                className="
                  absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent
                  opacity-0 hover:opacity-100 transition-opacity duration-500
                "
              />
            </div>
          </div>
        ))}
      </div>

      {/* Thumb-friendly mobile controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => navigateCard("prev")}
          className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-300 hover:text-white hover:border-pink-500/50 active:scale-95 transition-all text-sm"
          title="Önceki Fotoğraf"
          aria-label="Önceki Fotoğraf"
        >
          ‹
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => activateCard(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  activeIndex === i
                    ? "w-6 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                    : "w-2 bg-zinc-700 hover:bg-zinc-500"
                }
              `}
              title={`Fotoğraf ${i + 1}`}
              aria-label={`Fotoğraf ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => navigateCard("next")}
          className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-300 hover:text-white hover:border-pink-500/50 active:scale-95 transition-all text-sm"
          title="Sonraki Fotoğraf"
          aria-label="Sonraki Fotoğraf"
        >
          ›
        </button>
      </div>

      {/* Mobile-friendly Instruction text */}
      <p className="text-center text-zinc-500 text-xs sm:text-sm mt-3 animate-pulse">
        {isMobile ? "👈 Sağa-sola kaydırarak veya dokunarak anıları keşfet ✨" : "Kartlara tıklayarak anıları keşfedin ✨"}
      </p>
    </div>
  );
}


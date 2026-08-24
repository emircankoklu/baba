"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

/**
 * Card Fan Carousel — GSAP-powered fanned card display.
 *
 * Cards are spread in a fan/arc formation. Hovering/clicking a card
 * brings it to the front with a smooth animation. Perfect for
 * showcasing memory photos in an interactive way.
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

  // Calculate fan positions
  const getFanTransform = (index: number, total: number) => {
    const mid = (total - 1) / 2;
    const offset = index - mid;
    const maxRotation = total > 6 ? 4 : 6;
    const maxTranslateY = total > 6 ? 8 : 15;
    const spreadX = total > 6 ? 90 : 120;

    return {
      rotation: offset * maxRotation,
      y: Math.abs(offset) * maxTranslateY,
      x: offset * spreadX,
    };
  };

  // Initialize the fan layout
  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const total = cards.length;

    // Set initial positions (hidden)
    gsap.set(cards, {
      opacity: 0,
      scale: 0.6,
      y: 100,
    });

    // Animate into fan formation
    cards.forEach((card, i) => {
      const { rotation, y, x } = getFanTransform(i, total);

      gsap.to(card, {
        opacity: 1,
        scale: 1,
        rotation,
        y,
        x,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1.2)",
        onComplete: () => {
          if (i === total - 1) setIsInitialized(true);
        },
      });
    });

    return () => {
      gsap.killTweensOf(cards);
    };
  }, [items]);

  // Handle card activation (click/hover)
  const activateCard = (index: number) => {
    if (!isInitialized) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const total = cards.length;

    if (activeIndex === index) {
      // Deactivate — return to fan position
      setActiveIndex(null);
      cards.forEach((card, i) => {
        const { rotation, y, x } = getFanTransform(i, total);
        gsap.to(card, {
          rotation,
          y,
          x,
          scale: 1,
          zIndex: i,
          duration: 0.5,
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
          y: -30,
          x: 0,
          scale: 1.15,
          zIndex: 50,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        // Push other cards aside
        const { rotation, y, x } = getFanTransform(i, total);
        const pushDirection = i < index ? -1 : 1;
        gsap.to(card, {
          rotation: rotation + pushDirection * 3,
          y: y + 10,
          x: x + pushDirection * 30,
          scale: 0.9,
          zIndex: i,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <p className="text-lg">Henüz anı fotoğrafı eklenmemiş.</p>
        <p className="text-sm mt-2">Django Admin panelinden fotoğraf ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full py-12">
      {/* Card container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center mx-auto"
        style={{ minHeight: "420px" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onClick={() => activateCard(index)}
            className="absolute cursor-pointer select-none"
            style={{
              zIndex: activeIndex === index ? 50 : index,
              transformOrigin: "center bottom",
            }}
          >
            <div
              className={`
                relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden
                border-2 transition-colors duration-300
                ${
                  activeIndex === index
                    ? "border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                    : "border-zinc-700/60 hover:border-zinc-500"
                }
              `}
            >
              {/* Photo */}
              <img
                src={item.image}
                alt={item.alt_text || "Anı fotoğrafı"}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Description overlay */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 p-4 transition-all duration-300
                  ${activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                `}
              >
                {item.alt_text && (
                  <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                    {item.alt_text}
                  </h4>
                )}
                {item.description && (
                  <p className="text-zinc-300 text-xs line-clamp-3">
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

      {/* Instruction text */}
      <p className="text-center text-zinc-500 text-sm mt-6 animate-pulse">
        Kartlara tıklayarak anıları keşfedin ✨
      </p>
    </div>
  );
}

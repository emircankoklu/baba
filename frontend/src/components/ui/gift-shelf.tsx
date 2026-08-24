"use client";

import React, { useState } from "react";
import { launchFireworks } from "./fireworks";
import { sendGiftNote } from "@/lib/api";

interface GiftShelfProps {
  friendsName?: string;
}

interface GiftBoxItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  border: string;
  glow: string;
  description: string;
}

const GIFTS: GiftBoxItem[] = [
  {
    id: "gold",
    name: "Altın Sürpriz Kutu",
    emoji: "🎁",
    color: "from-amber-500/20 via-yellow-500/10 to-amber-500/5",
    border: "border-amber-400/40 hover:border-amber-400",
    glow: "hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]",
    description: "Parlak altın kurdeleli hediye kutusu",
  },
  {
    id: "pink",
    name: "Pembe Sevgi Kutusu",
    emoji: "💖",
    color: "from-pink-500/20 via-rose-500/10 to-pink-500/5",
    border: "border-pink-400/40 hover:border-pink-400",
    glow: "hover:shadow-[0_0_30px_rgba(244,114,182,0.35)]",
    description: "Kalpli ve sevgi dolu pembe hediye paketi",
  },
  {
    id: "purple",
    name: "Sihirli Yıldız Kutusu",
    emoji: "✨",
    color: "from-purple-500/20 via-fuchsia-500/10 to-purple-500/5",
    border: "border-purple-400/40 hover:border-purple-400",
    glow: "hover:shadow-[0_0_30px_rgba(192,132,252,0.35)]",
    description: "Yıldız tozuyla süslenmiş mor kutu",
  },
  {
    id: "emerald",
    name: "Zümrüt Mutluluk Kutusu",
    emoji: "🌿",
    color: "from-emerald-500/20 via-teal-500/10 to-emerald-500/5",
    border: "border-emerald-400/40 hover:border-emerald-400",
    glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.35)]",
    description: "Huzur ve neşe getiren zümrüt yeşili kutu",
  },
];

export function GiftShelf({ friendsName = "Arkadaşım" }: GiftShelfProps) {
  const [selectedGift, setSelectedGift] = useState<GiftBoxItem | null>(null);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When a user clicks on a gift box
  const handleGiftClick = (gift: GiftBoxItem, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Launch celebratory fireworks burst!
    launchFireworks(x, y, 70);

    setSelectedGift(gift);
    setIsSuccess(false);
    setErrorMsg(null);
  };

  // Submit note to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) {
      setErrorMsg("Lütfen adınızı ve mesajınızı yazın.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await sendGiftNote({
        sender_name: senderName.trim(),
        message: message.trim(),
        gift_type: selectedGift?.id || "gold",
      });

      // Extra burst on successful delivery!
      launchFireworks(window.innerWidth / 2, window.innerHeight / 2, 90);
      setIsSuccess(true);
      setSenderName("");
      setMessage("");
    } catch (err: any) {
      console.error("Failed to send note:", err);
      setErrorMsg(err.message || "Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedGift(null);
    setIsSuccess(false);
    setErrorMsg(null);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-[#08080c] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            <span>🎁</span>
            <span>Özel Dilek & Sürpriz Rafı</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-zinc-100">
            <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {friendsName}&apos;e Hediye Bırak
            </span>
          </h3>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Aşağıdaki raftan dilediğin hediyeye tıkla, havai fişekleri patlat ve
            içine {friendsName}&apos;e özel gizli bir kutlama notu iliştir! ✨
          </p>
        </div>

        {/* ─── The 3D Glowing Shelf ─────────────────────────────── */}
        <div className="relative pt-6 pb-2">
          {/* Gifts on shelf */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10 px-4">
            {GIFTS.map((gift) => (
              <button
                key={gift.id}
                onClick={(e) => handleGiftClick(gift, e)}
                className={`
                  group relative flex flex-col items-center justify-end
                  p-6 sm:p-7 rounded-2xl
                  bg-gradient-to-b ${gift.color}
                  border ${gift.border}
                  ${gift.glow}
                  backdrop-blur-md cursor-pointer
                  transition-all duration-300 transform
                  hover:-translate-y-3 active:scale-95
                `}
                title={`${gift.name} - Tıkla ve not bırak`}
              >
                {/* Floating particle sparkle badge */}
                <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-300 font-medium tracking-wide">
                  Tıkla & Aç
                </span>

                {/* Animated Gift Emoji */}
                <div className="relative my-2 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                  <span className="text-5xl sm:text-6xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
                    {gift.emoji}
                  </span>
                </div>

                <p className="text-sm font-semibold text-zinc-200 mt-2 group-hover:text-white transition-colors text-center">
                  {gift.name}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5 text-center line-clamp-1">
                  {gift.description}
                </p>
              </button>
            ))}
          </div>

          {/* Wooden / Glass Illuminated Shelf Base */}
          <div className="relative mt-2 mx-auto">
            {/* Shelf top surface */}
            <div className="h-4 sm:h-5 rounded-md bg-gradient-to-r from-amber-800/80 via-amber-700/90 to-amber-800/80 border-t border-amber-500/60 shadow-[0_4px_20px_rgba(217,119,6,0.3)]" />
            {/* Shelf front edge */}
            <div className="h-3 rounded-b-md bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-900/80" />
            {/* Shelf bottom shadow/glow */}
            <div className="h-4 bg-gradient-to-b from-amber-500/10 to-transparent blur-md" />
          </div>
        </div>
      </div>

      {/* ─── Postcard / Notepad Modal ─────────────────────────── */}
      {selectedGift && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in-up"
          onClick={closeModal}
        >
          <div
            className="
              relative w-full max-w-lg overflow-hidden rounded-2xl
              bg-[#121218] border border-amber-500/30
              shadow-[0_0_50px_rgba(217,119,6,0.25)]
              text-zinc-100 p-6 sm:p-8
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              ✕
            </button>

            {!isSuccess ? (
              <>
                {/* Postcard Header */}
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                    {selectedGift.emoji}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                      {selectedGift.name} İçinden Çıkan Kartpostal
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      {friendsName}&apos;e Not Bırak 💌
                    </h4>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {/* Sender Name */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Adın / Kimsin? <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Örn: Can Dostun Ali, Kardeşin..."
                      maxLength={100}
                      className="
                        w-full px-4 py-2.5 rounded-xl
                        bg-zinc-900/90 border border-zinc-700/80
                        text-white placeholder-zinc-500 text-sm
                        focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400
                        transition-all
                      "
                      required
                    />
                  </div>

                  {/* Message (Postcard / Notepad lined look) */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Kutlama Notun / Mesajın{" "}
                      <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Buraya doğum günü sahibine özel sevgi dolu bir mesaj yaz..."
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-zinc-900/90 border border-zinc-700/80
                        text-white placeholder-zinc-500 text-sm leading-relaxed
                        focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400
                        transition-all resize-none
                      "
                      required
                    />
                  </div>

                  {/* Confidentiality Guarantee Note */}
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs">
                    <span className="text-base flex-shrink-0">🔒</span>
                    <p className="font-medium">
                      <strong>Not!</strong> Bu notu yalnızca{" "}
                      <span className="text-pink-400 underline font-bold">
                        &quot;{friendsName}&quot;
                      </span>{" "}
                      okuyabilir.
                    </p>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      w-full py-3.5 px-6 rounded-xl
                      bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600
                      hover:from-amber-400 hover:via-pink-400 hover:to-purple-500
                      text-white font-bold text-sm
                      shadow-[0_0_25px_rgba(244,114,182,0.3)]
                      hover:shadow-[0_0_35px_rgba(244,114,182,0.5)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300 cursor-pointer
                      flex items-center justify-center gap-2
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Hediyen İletiliyor...</span>
                      </>
                    ) : (
                      <>
                        <span>Hediyeni ve Notunu Bırak!</span>
                        <span>🎁</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-6 space-y-4 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-3xl flex items-center justify-center mx-auto animate-bounce">
                  ✨
                </div>
                <h4 className="text-2xl font-bold text-white">
                  Harika! Hediyen Bırakıldı! 🎉
                </h4>
                <p className="text-zinc-300 text-sm max-w-sm mx-auto leading-relaxed">
                  Özel kutlama notun hediye kutusuna özenle yerleştirildi.{" "}
                  <strong className="text-pink-400">{friendsName}</strong>{" "}
                  yönetim panelini açtığında bu tatlı sürprizini okuyacak!
                </p>
                <div className="pt-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
                  >
                    Kapat & Sayfaya Dön
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

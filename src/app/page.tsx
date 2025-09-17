"use client";

import { useEffect, useState } from "react";
import { Music, Edit3, FileMusic, Image as ImageIcon } from "lucide-react";

// Extend the Window interface to include Telegram
export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number | string;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            [key: string]: unknown;
          };
          query_id?: string;
          auth_date?: string;
          hash?: string;
          [key: string]: unknown;
        };
        initData?: string;
        expand?: () => void;
        close?: () => void;
        ready?: () => void;
        sendData?: (data: string) => void;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }
}


export default function Home() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Telegram foydalanuvchi ID olish
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setTelegramId(String(window.Telegram.WebApp.initDataUnsafe.user.id));
    } else {
      console.warn("Telegram WebApp maʼlumotlari topilmadi!");
    }
  }, []);

  const handleSubmit = async () => {
    if (!audio) return alert("Avval MP3 fayl yuklang!");
    if (!telegramId) return alert("Telegram ID olinmadi!");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("audio", audio);
    if (cover) formData.append("cover", cover);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("telegram_id", telegramId);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik!");

      alert("Audio tayyor! Bot orqali yuborildi ✅");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Music className="w-7 h-7 text-green-400" />
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-green-400">MP3 Editor</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Audio fayllaringizni professional tarzda tahrirlang
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-black/50 p-5 rounded-2xl border border-green-400/30 backdrop-blur-lg shadow-xl">
        <div className="space-y-5">
          {/* Audio Upload */}
          <div>
            <label className="flex items-center text-sm text-green-400 mb-2">
              <FileMusic className="w-4 h-4 mr-2" />
              MP3 fayl yuklash
            </label>
            <input
              type="file"
              accept="audio/*,.mp3"
              onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-100 border border-green-400/30 rounded-lg p-2 bg-black/60 file:mr-2 file:py-1 file:px-3 file:bg-green-400 file:text-black file:rounded-md cursor-pointer"
            />
            {audio && <p className="text-xs text-green-400 mt-1">✓ {audio.name}</p>}
          </div>

          {/* Cover Upload */}
          <div>
            <label className="flex items-center text-sm text-green-400 mb-2">
              <ImageIcon className="w-4 h-4 mr-2" />
              Muqova rasmi (ixtiyoriy)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-100 border border-green-400/30 rounded-lg p-2 bg-black/60 file:mr-2 file:py-1 file:px-3 file:bg-green-400 file:text-black file:rounded-md cursor-pointer"
            />
            {cover && <p className="text-xs text-green-400 mt-1">✓ {cover.name}</p>}
          </div>

          {/* Title & Artist */}
          <div>
            <label className="block text-sm text-green-400 mb-1">Qo&apos;shiq nomi</label>
            <input
              type="text"
              placeholder="Yangi nom (Title)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg bg-black/60 text-gray-100 border border-green-400/30 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-green-400 mb-1">Ijrochi</label>
            <input
              type="text"
              placeholder="Artist nomi"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full p-2 rounded-lg bg-black/60 text-gray-100 border border-green-400/30 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!audio || isLoading}
            className="w-full bg-green-400 text-black font-semibold py-2 rounded-lg shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Ishlanmoqda...
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                Tahrirlash
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} MP3 Editor
      </footer>
    </div>
  );
}

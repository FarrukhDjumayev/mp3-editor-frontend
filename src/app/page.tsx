"use client";

import { useState, useEffect } from "react";
import Form from "@/components/Form";

export default function Home() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [telegramId, setTelegramId] = useState<string | null>(null);

  // Telegram WebApp foydalanuvchi ID olish
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
      if (userId) {
        setTelegramId(String(userId));
        console.log("Telegram ID:", userId);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!audio) {
      alert("Iltimos, musiqa faylini yuklang!");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("audio", audio);
      if (cover) formData.append("cover", cover);
      formData.append("title", title);
      formData.append("artist", artist);

      if (telegramId) formData.append("telegram_id", telegramId);

      const res = await fetch("https://mp3-editor-backend.onrender.com/api/edit", {
        method: "POST",
        body: formData,
      });

      if (telegramId) {
        // Telegram Mini App uchun
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");
        setSuccess(data.message);
      } else {
        // Oddiy sayt foydalanuvchisi uchun faylni yuklash
        if (!res.ok) throw new Error(await res.text() || "Xatolik yuz berdi");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "edited"}.mp3`;
        a.click();

        setSuccess("Audio tayyor va yuklab olindi!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Xatolik: " + err.message);
      } else {
        alert("Xatolik yuz berdi");
      }
    }     finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <Form
        audio={audio}
        setAudio={setAudio}
        cover={cover}
        setCover={setCover}
        title={title}
        setTitle={setTitle}
        artist={artist}
        setArtist={setArtist}
        loading={loading}
        success={success}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

// Telegram tiplarini qo'shish
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: string | number;
            [key: string]: unknown; // qo‘shimcha fieldlar uchun
          };
        };
      };
    };
  }
}

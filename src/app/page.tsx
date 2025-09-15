"use client";

import { useState } from "react";
import { Music, Upload, Edit3, Download, FileMusic, Image } from "lucide-react";

export default function Home() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!audio) return alert("Avval MP3 yuklang!");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("audio", audio);
    if (cover) formData.append("cover", cover);
    formData.append("title", title);
    formData.append("artist", artist);

    try {
      const res = await fetch(
        "https://mp3-editor-backend.onrender.com/api/edit",
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Xatolik!");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Universal fayl yuklash (Telegram Web App, brauzerlar, IE/Edge)
      const nav = window.navigator as Navigator & {
        msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
      };

      if (navigator.userAgent.includes("Telegram")) {
        // Telegram mini app: yangi tab ochiladi
        window.open(url, "_blank");
      } else if (nav.msSaveOrOpenBlob) {
        // IE / Edge
        nav.msSaveOrOpenBlob(blob, "edited.mp3");
      } else {
        // Boshqa brauzerlar
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited.mp3";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-green-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl mb-4 shadow-[0_0_15px_rgba(34,197,94,0.8)]">
            <Music className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-400 drop-shadow-lg">
            MP3 Editor
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-md mx-auto mt-2">
            Audio fayllaringizni professional darajada tahrirlang
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <div className="bg-black/40 backdrop-blur-lg border border-green-400/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_25px_rgba(34,197,94,0.4)]">
            <div className="space-y-6">

              {/* Audio Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-green-400 mb-2">
                  <FileMusic className="w-4 h-4 mr-2" />
                  MP3 fayl yuklash
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => setAudio(e.target.files?.[0] || null)}
                    className="w-full p-3 sm:p-4 bg-black/60 border border-green-400/30 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-green-400 file:text-black file:rounded-lg hover:file:bg-green-300 cursor-pointer"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400/60" />
                </div>
                {audio && (
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    ✓ {audio.name}
                  </p>
                )}
              </div>

              {/* Cover Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-green-400 mb-2">
                  <Image className="w-4 h-4 mr-2" />
                  Muqova rasmi (ixtiyoriy)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCover(e.target.files?.[0] || null)}
                    className="w-full p-3 sm:p-4 bg-black/60 border border-green-400/30 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-green-400 file:text-black file:rounded-lg hover:file:bg-green-300 cursor-pointer"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400/60" />
                </div>
                {cover && (
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    ✓ {cover.name}
                  </p>
                )}
              </div>

              {/* Title & Artist */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400">Qo'shiq nomi</label>
                <input
                  type="text"
                  placeholder="Yangi nom (Title)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-black/60 border border-green-400/30 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400">Ijrochi</label>
                <input
                  type="text"
                  placeholder="Artist nomi"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-black/60 border border-green-400/30 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!audio || isLoading}
                className="w-full bg-green-400 text-black font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.8)] hover:shadow-[0_0_20px_rgba(34,197,94,1)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Ishlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-5 h-5" />
                    <span>Tahrirlash</span>
                    <Download className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-black/50 rounded-xl border border-green-400/20">
                <p className="text-xs text-gray-400 text-center">
                  💡 Faqat MP3 formatdagi audio fayllar qo'llab-quvvatlanadi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Professional audio editing tool</p>
        </div>
      </main>
    </div>
  );
}

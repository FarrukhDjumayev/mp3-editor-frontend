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
      const res = await fetch("https://mp3-editor-backend-production.up.railway.app/api/edit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Xatolik!");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.mp3";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-xl">
            <Music className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
            MP3 Editor
          </h1>
          <p className="text-purple-200 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
            Audio fayllaringizni professional darajada tahrirlang
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="space-y-6">

              {/* Audio File Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-white mb-2">
                  <FileMusic className="w-4 h-4 mr-2" />
                  MP3 fayl yuklash
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => setAudio(e.target.files?.[0] || null)}
                    className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white file:rounded-lg hover:file:bg-purple-600 cursor-pointer"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                </div>
                {audio && (
                  <p className="text-xs text-green-300 flex items-center">
                    ✓ {audio.name}
                  </p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-white mb-2">
                  <Image className="w-4 h-4 mr-2" />
                  Muqova rasmi (ixtiyoriy)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCover(e.target.files?.[0] || null)}
                    className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white file:rounded-lg hover:file:bg-purple-600 cursor-pointer"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                </div>
                {cover && (
                  <p className="text-xs text-green-300 flex items-center">
                    ✓ {cover.name}
                  </p>
                )}
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Qo'shiq nomi
                </label>
                <input
                  type="text"
                  placeholder="Yangi nom (Title)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Artist Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Ijrochi
                </label>
                <input
                  type="text"
                  placeholder="Artist nomi"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!audio || isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/70 text-center">
                💡 Faqat MP3 formatdagi audio fayllar qo'llab-quvvatlanadi
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Professional audio editing tool
          </p>
        </div>
      </main>
    </div>
  );
}
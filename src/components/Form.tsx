"use client";

import React from "react";

interface FormProps {
  audio: File | null;
  setAudio: React.Dispatch<React.SetStateAction<File | null>>;
  cover: File | null;
  setCover: React.Dispatch<React.SetStateAction<File | null>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  artist: string;
  setArtist: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  success: string;
  onSubmit: () => void;
}

export default function Form({
  // audio,
  setAudio,
  // cover,
  setCover,
  title,
  setTitle,
  artist,
  setArtist,
  loading,
  success,
  onSubmit,
}: FormProps) {
  return (
    <div className="max-w-md w-full bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-green-400 mb-6">
        🎵 MP3 Metadata Editor
      </h1>

      <div className="space-y-4">
        {/* Audio Fayl */}
        <div>
          <label className="block mb-1 text-gray-300">Audio fayl</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            className="w-full bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Cover Rasm */}
        <div>
          <label className="block mb-1 text-gray-300">Cover rasm</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
            className="w-full bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 text-gray-300">Musiqa nomi (Title)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Musiqa nomini kiriting"
            className="w-full bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block mb-1 text-gray-300">Artist nomi</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist nomini kiriting"
            className="w-full bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-2 mt-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Yuklanmoqda..." : "O'zgartirish"}
        </button>

        {/* Success Message */}
        {success && (
          <p className="text-green-400 text-center mt-3 font-medium">
            {success}
          </p>
        )}
      </div>
    </div>
  );
}

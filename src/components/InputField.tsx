"use client";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function InputField({ label, value, onChange }: Props) {
  return (
    <div className="w-full">
      <label className="block text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
      />
    </div>
  );
}

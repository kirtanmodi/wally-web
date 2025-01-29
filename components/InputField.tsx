import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
  min?: number;
  max?: number;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "number", placeholder, suffix, min, max }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {suffix && <span className="text-gray-500">({suffix})</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

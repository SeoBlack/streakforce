import React from "react";

export default function CustomSelect({ options, value, handleSelect, title }) {
  return (
    <div>
      <h3 className="text-lg font-semibold ml-4 mb-3">{title}</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`py-4 px-4 rounded-xl text-center font-medium transition-all ${
                value === option.value
                  ? "bg-red-400 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="text-xl font-bold">{option.icon}</div>
              <div className="text-sm">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

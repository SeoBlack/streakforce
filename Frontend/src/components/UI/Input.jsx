import React from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  className,
  withIcon,
}) {
  const styles = `w-full ${
    withIcon ? "pl-14" : "pl-4"
  } py-5 bg-gray-300 border-0 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all ${className}`;
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={styles}
    />
  );
}

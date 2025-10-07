import React from "react";

const Input = React.forwardRef(function Input(
  { value, onChange, placeholder, className, withIcon, type = "text", ...rest },
  ref
) {
  const styles = `w-full ${
    withIcon ? "pl-14" : "pl-4"
  } py-5 bg-gray-300 border-0 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all ${className}`;
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={styles}
      ref={ref}
      {...rest}
    />
  );
});

export default Input;

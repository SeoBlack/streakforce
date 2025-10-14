import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const Button = ({
  children,
  to,
  onClick,
  type = "button",
  className,
  disabled,
}) => {
  let baseClasses =
    "w-full h-full font-semibold py-4 rounded-2xl text-base sm:text-xl transition-colors duration-200 shadow-lg transform active:scale-95 flex items-center justify-center";

  if (disabled) {
    baseClasses += " opacity-50 cursor-not-allowed";
  }
  if (to) {
    return (
      <Link to={to} className={clsx(baseClasses, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(baseClasses, className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

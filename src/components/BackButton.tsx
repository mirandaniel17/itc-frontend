import React, { ButtonHTMLAttributes } from "react";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  className = "",
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
        disabled ? "opacity-25" : ""
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BackButton;

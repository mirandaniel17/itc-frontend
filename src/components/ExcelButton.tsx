import React, { ButtonHTMLAttributes } from "react";

interface ExcelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}

const ExcelButton: React.FC<ExcelButtonProps> = ({
  className = "",
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`text-white text-md bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 ${
        disabled ? "opacity-25" : ""
      } ${className}`}
      disabled={disabled}
    >
      <span className="mdi mdi-file-excel me-2 text-md"></span>
      {children}
    </button>
  );
};

export default ExcelButton;

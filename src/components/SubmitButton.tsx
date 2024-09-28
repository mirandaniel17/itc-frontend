import React, { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  className = "",
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center rounded-md border border-transparent bg-sky-800 px-4 py-2 text-xs font-semibold uppercase tracking-tight text-white transition duration-150 ease-in-out hover:bg-sky-700 focus:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:bg-gray-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 ${
        disabled ? "opacity-25" : ""
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SubmitButton;

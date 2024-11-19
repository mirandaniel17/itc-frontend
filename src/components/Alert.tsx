import React from "react";

interface AlertProps {
  message: string;
  color?: string;
}

const Alert: React.FC<AlertProps> = ({ message, color = "blue" }) => {
  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 mb-4 border-t-4 rounded-lg bg-${color}-50 text-${color}-800 border-${color}-300 dark:bg-gray-800 dark:text-${color}-400 dark:border-${color}-800`}
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-4 h-4 me-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
};

export default Alert;

import React from "react";

interface AlertProps {
  message: string;
  color?: "red" | "blue" | "green" | "yellow";
  icon?: React.ReactNode;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, color = "blue" }) => {
  const colors = {
    red: "text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800",
    blue: "text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800",
    green:
      "text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800",
    yellow:
      "text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800 dark:border-yellow-800",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 mb-4 border-t-4 ${colors[color]} rounded-lg`}
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-4 h-4 me-4"
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

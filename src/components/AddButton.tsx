import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const AddButton: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center text-xs px-5 py-2.5 mb-4 font-medium text-white rounded-lg bg-gradient-to-br from-green-400 to-blue-600 hover:from-green-400 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 ${className}`}
    >
      <span className="mdi mdi-plus me-2"></span>
      {label}
    </button>
  );
};

export default AddButton;

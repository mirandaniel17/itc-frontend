import React from "react";

interface AlertProps {
  message: string;
  color?: string;
  icon?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ message, color = "blue", icon }) => {
  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-${color}-500 text-white text-sm font-bold px-4 py-3`}
      role="alert"
    >
      {icon && <div className="mr-2">{icon}</div>}
      <p>{message}</p>
    </div>
  );
};

export default Alert;

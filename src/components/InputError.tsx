import React from "react";

interface InputErrorProps {
  message?: string;
  className?: string;
}

const InputError: React.FC<InputErrorProps> = ({
  message,
  className = "",
  ...props
}) => {
  return message ? (
    <p
      {...props}
      className={`text-md font-thin tracking-tight mt-2 text-red-600 dark:text-red-400 ${className}`}
    >
      <span className="mdi mdi-alert-circle-outline me-2"></span>
      {message}
    </p>
  ) : null;
};

export default InputError;

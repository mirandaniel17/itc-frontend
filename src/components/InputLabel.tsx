import React, { LabelHTMLAttributes } from "react";

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({
  value,
  className = "",
  children,
  ...props
}) => {
  return (
    <label
      {...props}
      className={`block text-sm tracking-tighter mb-2 font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {value ? value : children}
    </label>
  );
};

export default InputLabel;

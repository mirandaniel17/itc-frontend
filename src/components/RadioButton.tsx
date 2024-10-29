import React from "react";

interface RadioButtonProps {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  value,
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center mb-2">
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;

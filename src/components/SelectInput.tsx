import { SelectHTMLAttributes, forwardRef, useRef } from "react";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className = "", children, ...props }, ref) => {
    const input = ref ? ref : useRef<HTMLSelectElement>(null);

    return (
      <select
        {...props}
        className={`border-gray-300 text-xs tracking-tighter dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-sky-500 dark:focus:border-sky-600 focus:ring-sky-500 dark:focus:ring-sky-600 rounded-sm shadow-sm ${className}`}
        ref={input}
      >
        {children}
      </select>
    );
  }
);

export default SelectInput;

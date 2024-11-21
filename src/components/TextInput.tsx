import {
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isFocused?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = "text", className = "", isFocused = false, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

    useEffect(() => {
      if (isFocused) {
        localRef.current?.focus();
      }
    }, [isFocused]);

    return (
      <input
        {...props}
        type={type}
        className={`rounded-sm text-sm tracking-normal border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-sky-600 dark:focus:ring-sky-600 ${className}`}
        ref={localRef}
      />
    );
  }
);

export default TextInput;

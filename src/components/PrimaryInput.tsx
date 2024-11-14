interface InputProps {
  label: string;
  type: string;
  value?: string;
  readOnly?: boolean;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PrimaryInput = ({
  label,
  type,
  value,
  readOnly = false,
  placeholder,
  onChange,
}: InputProps) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500 my-4"
        required
      />
    </div>
  );
};

export default PrimaryInput;

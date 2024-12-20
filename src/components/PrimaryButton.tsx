interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const PrimaryButton = ({ text, type = "button", onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full text-white bg-sky-500 hover:bg-sky-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold tracking-wider rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-4 transition transform hover:-translate-y-2"
    >
      {text}
    </button>
  );
};

export default PrimaryButton;

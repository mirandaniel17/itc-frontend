import { Dispatch, SetStateAction } from "react";

interface DropdownLinkProps {
  label: string;
  icon: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

const DropdownLink: React.FC<DropdownLinkProps> = ({
  label,
  icon,
  isOpen,
  setIsOpen,
  children,
}) => {
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <button
        onClick={toggleDropdown}
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-sky-900 hover:text-white dark:text-white dark:hover:bg-gray-700"
        aria-controls="dropdown-content"
        aria-expanded={isOpen}
      >
        <i className={`mdi ${icon}`}></i>
        <span className="flex-1 ms-3 text-left text-xs">{label}</span>
        <span
          className={`mdi ${isOpen ? "mdi-chevron-up" : "mdi-chevron-down"}`}
        ></span>
      </button>
      {isOpen && <ul className="py-2 space-y-2">{children}</ul>}
    </li>
  );
};

export default DropdownLink;

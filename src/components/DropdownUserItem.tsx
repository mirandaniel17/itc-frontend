import React from "react";
import { Link } from "react-router-dom";

interface DropdownUserItemProps {
  label: string;
  to: string;
  onClick?: () => void;
}

const DropdownUserItem: React.FC<DropdownUserItemProps> = ({
  label,
  to,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
    >
      {label}
    </Link>
  );
};

export default DropdownUserItem;

import React from "react";

interface UserMenuButtonProps {
  onClick: () => void;
}

const UserMenuButton: React.FC<UserMenuButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="flex text-sm bg-sky-900 md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 border border-gray-300 dark:border-gray-600 p-2 text-white rounded-lg"
      onClick={onClick}
    >
      <span className="mdi mdi-chevron-down mr-1"></span>
      <span className="sr-only">Open user menu</span>
      <span className="text-sm">Usuario</span>
    </button>
  );
};

export default UserMenuButton;

import React from "react";

interface UserMenuButtonProps {
  onClick: () => void;
}

const UserMenuButton: React.FC<UserMenuButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="flex text-sm text-black uppercase tracking-wider mx-10"
      onClick={onClick}
    >
      <span className="mdi mdi-chevron-down mr-1"></span>
      <span className="sr-only">Open user menu</span>
      <span className="text-sm">Usuario</span>
    </button>
  );
};

export default UserMenuButton;

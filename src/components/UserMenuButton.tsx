import React from "react";

interface UserMenuButtonProps {
  onClick: () => void;
  userName: string | React.ReactNode;
}

const UserMenuButton: React.FC<UserMenuButtonProps> = ({
  onClick,
  userName,
}) => {
  return (
    <button type="button" className="flex text-md text-black" onClick={onClick}>
      <span className="mdi mdi-chevron-down mr-1"></span>
      <span className="sr-only">Open user menu</span>
      <span className="text-md tracking-tight">{userName}</span>{" "}
    </button>
  );
};

export default UserMenuButton;

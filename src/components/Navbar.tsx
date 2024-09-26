import React, { useState } from "react";
import UserMenuButton from "./UserMenuButton";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="z-20 bg-white dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white"></span>
        </div>
        <div className="flex items-center md:order-2 relative">
          <UserMenuButton onClick={handleToggle} />
          <UserDropdown isOpen={isDropdownOpen} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

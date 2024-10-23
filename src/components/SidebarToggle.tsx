import React from "react";
import { useLocation } from "react-router-dom";

interface SidebarToggleProps {
  ariaControls: string;
  onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({
  ariaControls,
  onToggle,
}) => {
  const location = useLocation();
  const isHome = location.pathname === "/home";

  return (
    <div className="flex items-center sm:hidden h-24 justify-between ms-5">
      <button
        data-drawer-target={ariaControls}
        data-drawer-toggle={ariaControls}
        aria-controls={ariaControls}
        onClick={onToggle}
        type="button"
        className={`inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400 ${
          isHome
            ? "bg-white text-gray-400"
            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        }`}
      >
        <span className="sr-only">Open sidebar</span>
        <span className="mdi mdi-chevron-right-circle-outline text-4xl"></span>
      </button>
    </div>
  );
};

export default SidebarToggle;

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
    <button
      data-drawer-target={ariaControls}
      data-drawer-toggle={ariaControls}
      aria-controls={ariaControls}
      onClick={onToggle}
      type="button"
      className={`inline-flex items-center p-2 mt-2 ms-3 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 ${
        isHome
          ? "bg-sky-900 text-white"
          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
      }`}
    >
      <span className="sr-only">Open sidebar</span>
      <span className="mdi mdi-chevron-right-circle-outline text-4xl"></span>
    </button>
  );
};

export default SidebarToggle;

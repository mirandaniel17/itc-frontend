import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import DropdownLink from "./DropdownLink";
import SidebarToggle from "./SidebarToggle";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const isDropdownRoute =
      location.pathname === "/users/roles" || location.pathname === "/users";
    setIsDropdownOpen(isDropdownRoute);
  }, [location.pathname]);

  return (
    <div>
      <SidebarToggle
        ariaControls="sidebar-multi-level-sidebar"
        onToggle={handleToggle}
      />
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 border-r border-gray-200 shadow-lg`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
          <button
            onClick={handleToggle}
            className="sm:hidden p-2 text-gray-500 hover:text-white hover:bg-sky-900 rounded-lg mb-2"
          >
            <span className="mdi mdi-close"></span>
          </button>
          <ul className="space-y-2 font-medium">
            <Link to="/" className="flex items-center ps-2.5 mb-5">
              <img src="/itc_logo.png" className="h-6 me-3 sm:h-7" alt="Logo" />
              <span className="self-center tracking-tighter font-light whitespace-nowrap dark:text-white">
                Instituto Técnico Columbia
              </span>
            </Link>
            <hr />
            <SidebarLink to="/home" icon="mdi-apps" label="Inicio" />
            <SidebarLink
              to="/students"
              icon="mdi-account-school"
              label="Estudiantes"
            />
            <DropdownLink
              label="Gestión de Usuarios"
              icon="mdi-security"
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
            >
              <SidebarLink
                to="/users"
                icon="mdi-account-multiple-outline"
                label="Usuarios"
                onClick={() => setIsDropdownOpen(true)}
              />
            </DropdownLink>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

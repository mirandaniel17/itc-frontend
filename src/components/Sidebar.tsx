import React, { useState } from "react";
import SidebarLink from "./SidebarLink";
{
  /*import DropdownLink from "./DropdownLink";*/
}
import SidebarToggle from "./SidebarToggle";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

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
            <a href="#" className="flex items-center ps-2.5 mb-5">
              <img src="/itc_logo.png" className="h-6 me-3 sm:h-7" alt="Logo" />
              <span className="self-center tracking-tighter font-light whitespace-nowrap dark:text-white">
                Instituto Técnico Columbia
              </span>
            </a>
            <hr />
            <SidebarLink to="/home" icon="mdi-apps" label="Inicio" />
            {/*
            <DropdownLink label="Gestión de Usuarios" icon="mdi-security">
              <SidebarLink
                to="/users/list"
                icon="mdi-account-switch"
                label="Roles"
              />
              <SidebarLink
                to="/users/list"
                icon="mdi-account-multiple-outline"
                label="Usuarios"
              />
            </DropdownLink>
            */}
            <SidebarLink
              to="/students"
              icon="mdi-account-school"
              label="Estudiantes"
            />
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

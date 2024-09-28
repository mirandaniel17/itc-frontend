import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import UserMenuButton from "./UserMenuButton";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userName, setUserName] = useState("Daniel Miranda");
  const location = useLocation();
  const breadcrumbMap: { [key: string]: string } = {
    "/": "Inicio",
    "/dashboard": "Dashboard",
    "/students": "Estudiantes",
    "/students/create": "Crear Estudiante",
    "/students/edit": "Editar Estudiante",
  };

  const generateBreadcrumb = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    let breadcrumb = pathnames
      .map((part, index) => {
        const route = `/${pathnames.slice(0, index + 1).join("/")}`;
        if (breadcrumbMap[route]) {
          return breadcrumbMap[route];
        }
        return null;
      })
      .filter(Boolean);
    breadcrumb = breadcrumb.filter(
      (item, index, self) => item !== self[index - 1]
    );

    return breadcrumb.join(" / ") || breadcrumbMap["/"];
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className=" bg-white dark:bg-gray-800 mb-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center"></div>
            <div className="hidden sm:ml-10 sm:flex p-5">
              <span className="text-gray-900 dark:text-gray-300 tracking-medium text-sm font-extralight">
                {generateBreadcrumb()}
              </span>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative ml-3">
              <UserMenuButton onClick={handleToggleDropdown} />
              <UserDropdown
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                setName={setUserName}
              />
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={handleToggleNav}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={!isNavOpen ? "inline-flex" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={isNavOpen ? "inline-flex" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={(isNavOpen ? "block" : "hidden") + " sm:hidden"}>
        <div className="space-y-1 pb-3 pt-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "block px-4 py-2 text-base font-medium text-gray-900 dark:text-gray-300"
                : "block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400"
            }
          >
            Dashboard
          </NavLink>
        </div>

        <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
          <div className="px-4">
            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
              {userName}
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              name@columbia.com
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <NavLink
              to="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400"
            >
              Perfil
            </NavLink>
            <button
              onClick={() => {}}
              className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 dark:text-gray-400"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

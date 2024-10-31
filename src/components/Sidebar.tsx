import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import DropdownLink from "./DropdownLink";
import SidebarToggle from "./SidebarToggle";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
      setIsLoading(false);
    } else {
      setPermissions([]);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isCoursesDropdownRoute =
      location.pathname === "/courses" || location.pathname === "/modalities";
    setIsCoursesDropdownOpen(isCoursesDropdownRoute);

    const isUsersDropdownRoute =
      location.pathname === "/users" || location.pathname === "/users/roles";
    setIsUsersDropdownOpen(isUsersDropdownRoute);
  }, [location.pathname]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
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
        } sm:translate-x-0 border-r border-gray-100 shadow-xl`}
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
              <img src="/itc_logo.png" className="h-6 sm:h-8 me-1" alt="Logo" />
              <span className="self-center font-light dark:text-white">
                Instituto Técnico Columbia
              </span>
            </Link>
            <hr />
            <SidebarLink to="/home" icon="mdi-apps" label="Inicio" />

            {isLoading ? (
              <Skeleton count={6} height={40} />
            ) : (
              <>
                {hasPermission("Consultar Estudiantes") && (
                  <SidebarLink
                    to="/students"
                    icon="mdi-account-school"
                    label="Estudiantes"
                  />
                )}
                {hasPermission("Gestión de Cursos") && (
                  <SidebarLink
                    to="/teachers"
                    icon="mdi-human-male-board"
                    label="Docentes"
                  />
                )}

                {hasPermission("Gestión de Cursos") && (
                  <DropdownLink
                    label="Gestión de Cursos"
                    icon="mdi mdi-cast-education"
                    isOpen={isCoursesDropdownOpen}
                    setIsOpen={setIsCoursesDropdownOpen}
                  >
                    <SidebarLink
                    to="/modalities"
                    icon="mdi mdi-human-capacity-decrease"
                    label="Modalidades"
                    className="ms-0"
                  />
                  <SidebarLink
                    to="/courses"
                    icon="mdi-google-classroom"
                    label="Cursos"
                    className="ms-0"
                  />

                  </DropdownLink>
                )}

                {hasPermission("Gestión de Usuarios") && (
                  <DropdownLink
                    label="Gestión de Usuarios"
                    icon="mdi-security"
                    isOpen={isUsersDropdownOpen}
                    setIsOpen={setIsUsersDropdownOpen}
                  >
                    <SidebarLink
                      to="/users"
                      icon="mdi-account-multiple-outline"
                      label="Usuarios"
                    />
                  </DropdownLink>
                )}

                {hasPermission("Ver Horarios") && (
                  <SidebarLink
                    to="/shifts"
                    icon="mdi-calendar-arrow-right"
                    label="Turnos"
                    className="ms-0"
                  />
                )}

                {hasPermission("Ver Horarios") && (
                  <SidebarLink
                    to="/discounts"
                    icon="mdi-brightness-percent"
                    label="Descuentos"
                  />
                )}

                {hasPermission("Ver Horarios") && (
                  <SidebarLink
                    to="/schedules/set-schedule"
                    icon="mdi mdi-calendar-clock"
                    label="Horarios"
                  />
                )}

                {hasPermission("Inscripciones") && (
                  <SidebarLink
                    to="/enrollments"
                    icon="mdi-basket-fill"
                    label="Inscripciones"
                  />
                )}
              </>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

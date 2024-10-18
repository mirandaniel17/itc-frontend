import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import UserMenuButton from "./UserMenuButton";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userName, setUserName] = useState("Cargando...");
  const [userEmail, setUserEmail] = useState("Cargando...");
  const [notifications, setNotifications] = useState(3);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        setUserName(data.user.name);
        setUserEmail(data.user.email);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      setUserName("");
      setUserEmail("");
      navigate("/login");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const breadcrumbMap: { [key: string]: string } = {
    "/": "Inicio",
    "/profile": "Perfil",
    "/students": "Estudiantes",
    "/students/create": "Registrar Estudiante",
    "/students/edit": "Actualizar Estudiante",
    "/students/profile": "Perfil del Estudiante",
    "/users": "Usuarios",
    "/users/permissions": "Permisos",
    "/teachers": "Docentes",
    "/teachers/create": "Registrar Docente",
    "/teachers/edit": "Actualizar Docente",
    "/modalities": "Modalidades",
    "/modalities/create": "Registrar Modalidad",
    "/modalities/edit": "Actualizar Modalidad",
    "/courses": "Cursos",
    "/courses/create": "Registrar Curso",
    "/courses/edit": "Actualizar Curso",
  };

  const generateBreadcrumb = () => {
    const location = useLocation();
    const { userId } = useParams<{ userId: string }>();
    const pathnames = location.pathname.split("/").filter((x) => x);
    let breadcrumb = pathnames.map((part, index) => {
      const route = `/${pathnames.slice(0, index + 1).join("/")}`;

      if (route === `/users/${userId}/permissions`) {
        return "Permisos";
      }

      if (route === `/users/${userId}`) {
        return "Detalles del Usuario";
      }

      if (breadcrumbMap[route]) {
        return breadcrumbMap[route];
      }

      if (route === `/users/${userId}/roles`) {
        return "Roles";
      }

      return null;
    });

    breadcrumb = breadcrumb.filter(Boolean);
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
              <span className="text-gray-900 dark:text-gray-300 tracking-medium text-sm">
                {generateBreadcrumb()}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <div className="relative">
              <span className="mdi mdi-bell-outline text-2xl text-gray-500 cursor-pointer"></span>
              {notifications > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-600 text-white text-xs leading-tight text-center">
                  {notifications}
                </span>
              )}
            </div>

            <div
              onClick={toggleFullScreen}
              className="hidden sm:block cursor-pointer"
            >
              <span className="mdi mdi-fullscreen text-2xl text-gray-500"></span>
            </div>

            <div className="relative ml-3">
              <UserMenuButton
                onClick={handleToggleDropdown}
                userName={userName}
              />
              <UserDropdown
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                setName={setUserName}
              />
            </div>
          </div>

          <div className="flex items-center sm:hidden">
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
          <div className="flex items-center px-4">
            <span className="mdi mdi-bell-outline text-xl text-gray-500 mr-2"></span>
            <span className="text-sm font-medium text-gray-500">
              Notificaciones: {notifications}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
          <div className="px-4">
            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
              {userName}
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {userEmail}
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
              onClick={logout}
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

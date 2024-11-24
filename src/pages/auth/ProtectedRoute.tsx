import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredPermission?: string | string[];
}

const ProtectedRoute = ({
  children,
  requiredPermission,
}: ProtectedRouteProps) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/user`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const storedPermissions = localStorage.getItem("permissions");
          setIsAuthenticated(true);

          if (requiredPermission && storedPermissions) {
            const permissions = JSON.parse(storedPermissions);

            if (Array.isArray(requiredPermission)) {
              setHasPermission(
                requiredPermission.some((perm) => permissions.includes(perm))
              );
            } else {
              setHasPermission(permissions.includes(requiredPermission));
            }
          } else if (requiredPermission) {
            setHasPermission(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [requiredPermission]);

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (
    isAuthenticated === null ||
    (requiredPermission && hasPermission === null)
  ) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div
          aria-label="Cargando..."
          role="status"
          className="flex items-center space-x-2"
        >
          <svg
            className="h-20 w-20 animate-spin stroke-sky-900"
            viewBox="0 0 256 256"
          >
            <line
              x1="128"
              y1="32"
              x2="128"
              y2="64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="195.9"
              y1="60.1"
              x2="173.3"
              y2="82.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="224"
              y1="128"
              x2="192"
              y2="128"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="195.9"
              y1="195.9"
              x2="173.3"
              y2="173.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="128"
              y1="224"
              x2="128"
              y2="192"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="60.1"
              y1="195.9"
              x2="82.7"
              y2="173.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="32"
              y1="128"
              x2="64"
              y2="128"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="60.1"
              y1="60.1"
              x2="82.7"
              y2="82.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
          </svg>
          <span className="text-5xl font-medium text-sky-900 tracking-tighter ms-2">
            Cargando
          </span>
        </div>
      </section>
    );
  }

  if (requiredPermission && !hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;

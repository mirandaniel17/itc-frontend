import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownItem from "./DropdownUserItem";
import { Link } from "react-router-dom";

interface UserDropdownProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setName: (name: string) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  setIsOpen,
  setName,
}) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUser();
  }, []);

  if (!isOpen || !user) return null;

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      setName("");
      navigate("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-full right-0 mt-2">
      <div className="px-4 py-3">
        <span className="block text-sm text-gray-900 dark:text-white">
          {user.name}
        </span>
        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
          {user.email}
        </span>
      </div>
      <ul className="py-2">
        <li>
          <DropdownItem label="Perfil" to="/profile" />
        </li>
        <li>
          <Link
            to="/login"
            onClick={logout}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Salir
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;

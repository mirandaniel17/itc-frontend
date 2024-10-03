import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>({
    name: "Cargando...",
    email: "Cargando...",
    created_at: new Date(),
    roles: [],
    permissions: [],
  });

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado.");
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white m-4">
          <h1 className="text-xl font-semibold">Detalles del Usuario</h1>
          <div className="mt-4">
            <p>
              <strong>Nombre:</strong> {user.name}
            </p>
          </div>
          <div className="mt-4">
            <p>
              <strong>Correo Electrónico:</strong> {user.email}
            </p>
          </div>
          <div className="mt-4">
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <h2 className="text-lg font-semibold mt-4">Rol</h2>
          {user.roles.length > 0 ? (
            <ul>
              {user.roles.map((role: any) => (
                <li key={role.id}>{role.name}</li>
              ))}
            </ul>
          ) : (
            <p>No hay roles asignados.</p>
          )}
          <h2 className="text-lg font-semibold mt-4">Permisos</h2>
          {user.permissions.length > 0 ? (
            <ul>
              {user.permissions.map((permission: any) => (
                <li key={permission.id}>{permission.name}</li>
              ))}
            </ul>
          ) : (
            <p>No hay permisos asignados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

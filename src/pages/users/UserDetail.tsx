import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { User } from "../../types/user";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";

const UserDetail = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado.");
        return;
      }
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user details:", error);
      setLoading(false);
    }
  };

  const goBackToUsers = () => {
    navigate("/users");
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h1 className="text-2xl font-bold text-gray-800 my-4">
            Detalles del Usuario
          </h1>

          <div className="mt-4">
            <p>
              <strong>Nombre:</strong>{" "}
              {loading ? <Skeleton width={150} /> : user?.name}
            </p>
          </div>

          <div className="mt-4">
            <p>
              <strong>Correo Electrónico:</strong>{" "}
              {loading ? <Skeleton width={200} /> : user?.email}
            </p>
          </div>

          <div className="mt-4">
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {loading ? (
                <Skeleton width={100} />
              ) : (
                new Date(user?.created_at || "").toLocaleDateString()
              )}
            </p>
          </div>

          <h2 className="text-lg font-semibold mt-4">Rol</h2>
          {loading ? (
            <Skeleton count={1} width={200} />
          ) : user && user.roles && user.roles.length > 0 ? (
            <ul>
              {user.roles.map((role) => (
                <li key={role.id}>{role.name}</li>
              ))}
            </ul>
          ) : (
            <p>No hay roles asignados.</p>
          )}

          <h2 className="text-lg font-semibold mt-4">Permisos</h2>
          {loading ? (
            <Skeleton count={2} width={250} />
          ) : user && user.permissions && user.permissions.length > 0 ? (
            <ul>
              {user.permissions.map((permission) => (
                <li key={permission.id}>{permission.name}</li>
              ))}
            </ul>
          ) : (
            <p>No hay permisos asignados.</p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <BackButton onClick={goBackToUsers}>Volver</BackButton>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default UserDetail;

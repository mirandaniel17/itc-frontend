import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";
import SelectInput from "../../components/SelectInput";

const Roles = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("Cargando...");
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchUserRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${userId}/role`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP! status: ${response.status}`);
      }
      const data = await response.json();
      const role = data.role ? data.role : "Sin rol";
      setUserRole(role);
      setSelectedRole(role);

      const rolesResponse = await fetch("http://127.0.0.1:8000/api/roles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!rolesResponse.ok) {
        throw new Error(`Error HTTP! status: ${rolesResponse.status}`);
      }

      const rolesData = await rolesResponse.json();
      setAllRoles(rolesData.roles);
    } catch (error) {
      console.error("Error fetching roles or user role:", error);
    }
  };

  const saveRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${userId}/role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: selectedRole === "Sin rol" ? null : selectedRole,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP! status: ${response.status}`);
      }

      await response.json();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const goBackToUsers = () => {
    navigate("/users");
  };

  useEffect(() => {
    fetchUserRoles();
  }, [userId]);

  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="p-6 border-2 border-gray-200 rounded-lg bg-white text-black m-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Roles</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-md font-semibold text-gray-700 mb-4">
              Rol Actual: {userRole}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Cambiar Rol:
              </label>
              <SelectInput
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-5"
              >
                <option value="Sin rol">Sin rol</option>
                {allRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={saveRole}
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Guardar Cambios
              </button>
              <button
                onClick={goBackToUsers}
                className="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Volver
              </button>
            </div>

            {showAlert && (
              <Alert message="Rol actualizado con éxito." color="green" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;

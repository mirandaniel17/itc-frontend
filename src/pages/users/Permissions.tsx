import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importar useNavigate
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";

const Permissions = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate(); // Hook para navegar
  const [user, setUser] = useState<any>({
    name: "Cargando...",
    permissions: [],
  });
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/permissions`,
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
      setUser(data.user);
      setAllPermissions(data.all_permissions);
      setAssignedPermissions(data.assigned_permissions);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  };

  const savePermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/permissions/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            permissions: assignedPermissions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP! status: ${response.status}`);
      }

      await response.json();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error saving permissions:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setAssignedPermissions([]);
    } else {
      setAssignedPermissions([...allPermissions]);
    }
    setSelectAll(!selectAll);
  };

  const handlePermissionChange = (permission: string) => {
    if (assignedPermissions.includes(permission)) {
      setAssignedPermissions(
        assignedPermissions.filter((p) => p !== permission)
      );
    } else {
      setAssignedPermissions([...assignedPermissions, permission]);
    }
  };

  const goBackToUsers = () => {
    navigate("/users"); // Navegar a la lista de usuarios
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    setSelectAll(
      assignedPermissions.length === allPermissions.length &&
        allPermissions.length > 0
    );
  }, [assignedPermissions, allPermissions]);

  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="p-6 border-2 border-gray-200 rounded-lg bg-white text-black m-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Permisos de {user.name}
            </h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Seleccionar Permisos
            </h2>

            <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
              <li className="w-full border-b border-gray-200 rounded-t-lg">
                <div className="flex items-center ps-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="select-all"
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >
                    Todos
                  </label>
                </div>
              </li>

              {allPermissions.map((permission) => (
                <li
                  key={permission}
                  className="w-full border-b border-gray-200 rounded-t-lg"
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={permission}
                      type="checkbox"
                      checked={assignedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={permission}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {permission}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={savePermissions}
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
            <Alert message="Permisos guardados con éxito." color="green" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Permissions;

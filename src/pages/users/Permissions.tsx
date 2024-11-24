import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import SelectInput from "../../components/SelectInput";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";

const RolesPermissions = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("Cargando...");
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("Sin rol");
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const roleResponse = await fetch(`${API_URL}/user/${userId}/role`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const roleData = await roleResponse.json();
      setUserRole(roleData.role || "Sin rol");
      setSelectedRole(roleData.role || "Sin rol");

      const permissionsResponse = await fetch(
        `${API_URL}/users/${userId}/permissions`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const permissionsData = await permissionsResponse.json();
      setAllPermissions(permissionsData.all_permissions);
      setAssignedPermissions(permissionsData.assigned_permissions);

      const rolesResponse = await fetch(`${API_URL}/roles`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const rolesData = await rolesResponse.json();
      setAllRoles(rolesData.roles);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    setSelectedRole(newRole);

    if (newRole === "Sin rol") {
      setAssignedPermissions([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const rolePermissionsResponse = await fetch(
        `${API_URL}/roles/${newRole}/permissions`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const rolePermissions = await rolePermissionsResponse.json();
      setAssignedPermissions(rolePermissions.permissions);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    }
  };

  const handlePermissionChange = (permission: string) => {
    setAssignedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setAssignedPermissions([]);
    } else {
      setAssignedPermissions([...allPermissions]);
    }
    setSelectAll(!selectAll);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/user/${userId}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: selectedRole === "Sin rol" ? null : selectedRole,
        }),
      });

      await fetch(`${API_URL}/users/${userId}/permissions/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissions: assignedPermissions }),
      });

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const goBackToUsers = () => {
    navigate("/users");
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
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          {loading ? <Skeleton width={150} /> : `Usuario: ${userRole}`}
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Rol</label>
          {loading ? (
            <Skeleton width={300} height={40} />
          ) : (
            <SelectInput
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="Sin rol">Sin rol</option>
              {allRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </SelectInput>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2">Permisos</h2>
        {loading ? (
          <Skeleton count={6} height={30} />
        ) : (
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
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={saveChanges}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Guardar Cambios
          </button>
          <button
            onClick={goBackToUsers}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver
          </button>
        </div>

        {showAlert && (
          <Alert message="Cambios guardados con éxito." color="green" />
        )}
      </div>
    </Layout>
  );
};

export default RolesPermissions;

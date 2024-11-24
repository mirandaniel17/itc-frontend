import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "../../types/user";
import Table from "../../components/Table";
import TableHead from "../../components/TableHead";
import TableBody from "../../components/TableBody";
import TableRow from "../../components/TableRow";
import TableCell from "../../components/TableCell";
import TableActionButtons from "../../components/TableActionButtons";
import Pagination from "../../components/Pagination";
import ConfirmationModal from "../../components/ConfirmationModal";
import Alert from "../../components/Alert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { debounce } from "lodash";
import Layout from "../../components/Layout";

const Users = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = async (page: number, query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/users?per_page=10&page=${page}&query=${query}`,
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
      setUsers(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching users:", error);
      setLoading(false);
    }
  };

  const debouncedFetchUsers = debounce((query: string, page: number) => {
    fetchUsers(page, query);
  }, 500);

  useEffect(() => {
    if (location.state?.message) {
      showAlertWithMessage(
        location.state.message,
        location.state.color || "blue"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage]);

  const handleDeleteConfirm = async () => {
    if (userToDelete !== null) {
      try {
        const response = await fetch(`${API_URL}/users/${userToDelete}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
        setIsConfirmationModalOpen(false);
        setUserToDelete(null);
        fetchUsers(currentPage, searchQuery);
        showAlertWithMessage("Usuario eliminado con éxito", "red");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false);
    setUserToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchUsers(query, 1);
  };

  const showAlertWithMessage = (message: string, color: string) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleViewDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  const handleViewRolesPermissions = (userId: number) => {
    navigate(`/users/${userId}/roles-permissions`);
  };

  return (
    <div>
      <Layout>
        {showAlert && <Alert message={alertMessage} color={alertColor} />}
        <div className="flex justify-between items-center mb-4">
          <form className="max-w-lg">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="mdi mdi-magnify"></span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full px-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                placeholder="Buscar"
              />
            </div>
          </form>
        </div>
        <Table>
          <TableHead
            headers={[
              "Nombre",
              "Correo Electrónico",
              "Rol",
              "Fecha de Creación",
              "Acciones",
            ]}
          />
          <TableBody>
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={200} height={20} />
                    </TableCell>
                  </TableRow>
                ))
              : users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roles[0]?.name || "Sin rol"}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableActionButtons
                      actions={[
                        {
                          label: "Ver",
                          onClick: () => handleViewDetails(user.id),
                          className:
                            "text-white text-xs bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                        },
                        {
                          label: "Roles y Permisos",
                          onClick: () => handleViewRolesPermissions(user.id),
                          className:
                            "text-white text-xs bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                        },
                      ]}
                    />
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Layout>

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar a este usuario?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Users;

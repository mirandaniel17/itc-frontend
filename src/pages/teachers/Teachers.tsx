import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../components/Table";
import TableHead from "../../components/TableHead";
import TableBody from "../../components/TableBody";
import TableRow from "../../components/TableRow";
import TableCell from "../../components/TableCell";
import TableActionButtons from "../../components/TableActionButtons";
import Pagination from "../../components/Pagination";
import AddButton from "../../components/AddButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import Alert from "../../components/Alert";
import { Teacher } from "../../types/teacher";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTeachers = async (page: number, query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/teachers?per_page=10&page=${page}&query=${query}`,
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
      setTeachers(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching teachers:", error);
      setLoading(false);
    }
  };

  const debouncedFetchTeachers = debounce((query: string, page: number) => {
    fetchTeachers(page, query);
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
    fetchTeachers(currentPage, searchQuery);
  }, [currentPage]);

  const handleEdit = (teacher: Teacher) => {
    navigate(`/teachers/edit/${teacher.id}`);
    showAlertWithMessage("Docente actualizado con éxito", "green");
  };

  const handleDeleteClick = (id: number) => {
    setTeacherToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (teacherToDelete !== null) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/teachers/${teacherToDelete}`,
          {
            method: "DELETE",
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

        setIsConfirmationModalOpen(false);
        setTeacherToDelete(null);
        fetchTeachers(currentPage, searchQuery);
        showAlertWithMessage("Docente eliminado con éxito", "red");
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false);
    setTeacherToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNew = () => {
    navigate("/teachers/create");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchTeachers(query, 1);
  };

  const showAlertWithMessage = (message: string, color: string) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <div>
      <Layout>
        {showAlert && <Alert message={alertMessage} color={alertColor} />}
        <div className="flex justify-between items-center mb-4">
          <form>
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <span className="mdi mdi-magnify"></span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                placeholder="Buscar"
              />
            </div>
          </form>
          <AddButton label="Nuevo" onClick={handleNew} />
        </div>
        <Table>
          <TableHead
            headers={[
              "Apellido",
              "Nombre",
              "Especialidad",
              "Teléfono",
              "Acciones",
            ]}
          />
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={150} height={20} />
                  </TableCell>
                </TableRow>
              ))
            ) : teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    {teacher.last_name} {teacher.second_last_name}
                  </TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.specialty}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableActionButtons
                    actions={[
                      {
                        label: "Editar",
                        onClick: () => handleEdit(teacher),
                        className:
                          "text-white text-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                      },
                      {
                        label: "Eliminar",
                        onClick: () => handleDeleteClick(teacher.id),
                        className:
                          "text-white text-xs bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                      },
                    ]}
                  />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No se encontraron docentes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {loading ? (
          <Skeleton width={300} height={30} />
        ) : (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Layout>

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar a este docente?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Teachers;

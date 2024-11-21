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
import { Student } from "../../types/student";
import { formatDate } from "../../utils/dateUtils";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchStudents = async (page: number, query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/students?per_page=10&page=${page}&query=${query}`,
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
      setStudents(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching students:", error);
      setLoading(false);
    }
  };

  const debouncedFetchStudents = debounce((query: string, page: number) => {
    fetchStudents(page, query);
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
    fetchStudents(currentPage, searchQuery);
  }, [currentPage]);

  const handleEdit = (student: Student) => {
    navigate(`/students/edit/${student.id}`);
    showAlertWithMessage("Estudiante actualizado con éxito", "green");
  };

  const handleProfile = (student: Student) => {
    navigate(`/students/profile/${student.id}`);
  };

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (studentToDelete !== null) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/students/${studentToDelete}`,
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
        await response.json();
        setIsConfirmationModalOpen(false);
        setStudentToDelete(null);
        fetchStudents(currentPage, searchQuery);
        showAlertWithMessage("Estudiante eliminado con éxito", "red");
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false);
    setStudentToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNew = () => {
    navigate("/students/create");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchStudents(query, 1);
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <span className="mdi mdi-magnify"></span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block max-w-2xl p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
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
              "Fecha de Nacimiento",
              "Carnet de Identidad",
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
                    <Skeleton width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={150} height={20} />
                  </TableCell>
                </TableRow>
              ))
            ) : students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.last_name} {student.second_last_name}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{formatDate(student.dateofbirth)}</TableCell>
                  <TableCell>{student.ci}</TableCell>
                  <TableActionButtons
                    actions={[
                      {
                        label: "Ver Perfil",
                        onClick: () => handleProfile(student),
                        className:
                          "text-white text-xs bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                      },
                      {
                        label: "Editar",
                        onClick: () => handleEdit(student),
                        className:
                          "text-white text-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                      },
                      {
                        label: "Eliminar",
                        onClick: () => handleDeleteClick(student.id),
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
                  No se encontraron estudiantes.
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
        message="¿Estás seguro de que quieres eliminar a este estudiante?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Students;

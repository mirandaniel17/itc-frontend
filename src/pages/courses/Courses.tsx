import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
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
import { Course } from "../../types/course";
import { debounce } from "lodash";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCourses = async (page: number, query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses?per_page=10&page=${page}&query=${query}`,
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
      setCourses(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  };

  const debouncedFetchCourses = debounce((query: string, page: number) => {
    fetchCourses(page, query);
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
    fetchCourses(currentPage, searchQuery);
  }, [currentPage]);

  const handleEdit = (course: Course) => {
    navigate(`/courses/edit/${course.id}`);
    showAlertWithMessage("Curso actualizado con éxito", "green");
  };

  const handleDeleteClick = (id: number) => {
    setCourseToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (courseToDelete !== null) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/courses/${courseToDelete}`,
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
        setCourseToDelete(null);
        fetchCourses(currentPage, searchQuery);
        showAlertWithMessage("Curso eliminado con éxito", "red");
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false);
    setCourseToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNew = () => {
    navigate("/courses/create");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchCourses(query, 1);
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
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white m-4">
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
                  placeholder="Texto a buscar"
                />
              </div>
            </form>
            <AddButton label="Nuevo" onClick={handleNew} />
          </div>
          <Table>
            <TableHead
              headers={[
                "Nombre",
                "Modalidad",
                "Docente",
                "Fecha de Inicio",
                "Fecha de Finalización",
                "Acciones",
              ]}
            />
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="pl-3 font-semibold text-xs">
                      {course.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="pl-3 font-semibold text-xs">
                      {course.modality ? course.modality.name : "Sin modalidad"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="pl-3 font-semibold text-xs">
                      {course.teacher
                        ? `${course.teacher.last_name || ""} ${
                            course.teacher.second_last_name || ""
                          } ${course.teacher.name}`
                        : "Sin docente"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="pl-3 font-semibold text-xs">
                      {course.start_date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="pl-3 font-semibold text-xs">
                      {course.end_date}
                    </div>
                  </TableCell>
                  <TableActionButtons
                    actions={[
                      {
                        label: "Editar",
                        onClick: () => handleEdit(course),
                        className:
                          "text-white text-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                      },
                      {
                        label: "Eliminar",
                        onClick: () => handleDeleteClick(course.id),
                        className:
                          "text-white text-xs bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
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
        </div>
      </div>

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar este curso?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Courses;

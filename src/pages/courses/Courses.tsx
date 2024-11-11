import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../components/Table";
import TableHead from "../../components/TableHead";
import TableBody from "../../components/TableBody";
import TableRow from "../../components/TableRow";
import TableCell from "../../components/TableCell";
import AddButton from "../../components/AddButton";
import TableActionButtons from "../../components/TableActionButtons";
import ConfirmationModal from "../../components/ConfirmationModal";
import Alert from "../../components/Alert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";
import { Course } from "../../types/course";
import { debounce } from "lodash";

const Courses: React.FC = () => {
  const [groupedCourses, setGroupedCourses] = useState<
    Record<string, Course[]>
  >({});
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    debouncedFetchCourses(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (location.state?.message) {
      showAlertWithMessage(
        location.state.message,
        location.state.color || "blue"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchCourses = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching courses");

      const data = await response.json();
      groupCoursesByName(data.data);
    } catch {
      setGroupedCourses({});
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCourses = debounce((query: string) => {
    fetchCourses(query);
  }, 500);

  const groupCoursesByName = (courses: Course[]) => {
    const grouped = courses.reduce((acc: Record<string, Course[]>, course) => {
      if (!acc[course.name]) {
        acc[course.name] = [];
      }
      acc[course.name].push(course);
      return acc;
    }, {});
    setGroupedCourses(grouped);
  };

  const toggleExpand = (courseName: string) => {
    setExpandedCourse(expandedCourse === courseName ? null : courseName);
  };

  const handleNew = () => {
    navigate("/courses/create");
  };

  const handleEdit = (course: Course) => {
    navigate(`/courses/edit/${course.id}`);
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
          }
        );
        if (!response.ok) throw new Error("Error deleting course");

        setIsConfirmationModalOpen(false);
        setCourseToDelete(null);
        debouncedFetchCourses(searchQuery);
        showAlertWithMessage("Curso eliminado con éxito", "red");
      } catch {
        showAlertWithMessage("Error al eliminar el curso", "red");
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false);
    setCourseToDelete(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
              className="block max-w-2xl p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Buscar"
            />
          </div>
        </form>
        <AddButton label="Nuevo" onClick={handleNew} />
      </div>

      <Table>
        <TableHead headers={["Curso", "Modalidad", "Acción"]} />
        <TableBody>
          {loading
            ? [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={200} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                </TableRow>
              ))
            : Object.keys(groupedCourses).map((courseName) => (
                <React.Fragment key={courseName}>
                  <TableRow>
                    <TableCell>{courseName}</TableCell>
                    <TableCell>
                      {groupedCourses[courseName][0]?.modality?.name ||
                        "Sin modalidad"}
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-500 underline"
                        onClick={() => toggleExpand(courseName)}
                      >
                        {expandedCourse === courseName
                          ? "Ocultar Detalles"
                          : "Ver Detalles"}
                      </button>
                    </TableCell>
                  </TableRow>
                  {expandedCourse === courseName &&
                    groupedCourses[courseName].map((course, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={2} className="pl-8">
                          Paralelo: {course.parallel}, Docente:{" "}
                          {course.teacher
                            ? `${course.teacher.last_name} ${course.teacher.second_last_name} ${course.teacher.name}`
                            : "Sin docente"}
                          , Inicio: {course.start_date}, Fin: {course.end_date}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar este curso?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};

export default Courses;

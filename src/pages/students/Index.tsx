import { useState, useEffect } from "react";
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
import Modal from "../../components/Modal";
import StudentForm from "../../components/StudentForm";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Student } from "../../types/student";
import { formatDate } from "../../utils/dateUtils";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const fetchStudents = async (page: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students?per_page=10&page=${page}`,
        {
          method: "GET",
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
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (studentToDelete !== null) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/students/${studentToDelete}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Student deleted successfully:", data);
        setIsConfirmationModalOpen(false);
        setStudentToDelete(null);
        fetchStudents(currentPage);
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
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleStudentSubmit = async (formData: any) => {
    try {
      const method = selectedStudent ? "PUT" : "POST";
      const url = selectedStudent
        ? `http://127.0.0.1:8000/api/students/${selectedStudent.id}`
        : "http://127.0.0.1:8000/api/students";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Student saved successfully:", data);
      setIsModalOpen(false);
      fetchStudents(currentPage);
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <Navbar />
      <div className="p-2 sm:ml-64">
        <div className="flex justify-end">
          <AddButton label="Nuevo" onClick={handleNew} />
        </div>
        <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white">
          <Table>
            <TableHead
              headers={[
                "Apellido",
                "Nombre",
                "Fecha de Nacimiento",
                "Acciones",
              ]}
            />
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="ps-3">
                      <div className="font-semibold text-xs">
                        {student.last_name} {student.second_last_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="ps-3">
                      <div className="font-semibold text-xs">
                        {student.first_name} {student.second_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(student.dateofbirth)}</TableCell>
                  <TableActionButtons
                    onEdit={() => handleEdit(student)}
                    onDelete={() => handleDeleteClick(student.id)}
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
      <Modal
        title={
          selectedStudent
            ? "EDITAR ESTUDIANTE"
            : "FORMULARIO DE REGISTRO DE ESTUDIANTE"
        }
        isVisible={isModalOpen}
        onClose={handleModalClose}
      >
        <StudentForm
          onSubmit={handleStudentSubmit}
          initialData={selectedStudent}
        />
      </Modal>

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar a este estudiante?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Index;

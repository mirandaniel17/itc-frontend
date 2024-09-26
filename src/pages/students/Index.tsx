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

interface Student {
  id: number;
  last_name: string;
  second_last_name: string;
  first_name: string;
  second_name: string;
  dateofbirth: string;
  placeofbirth: string;
  phone: string;
  gender: string;
  status: boolean;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEdit = (id: number) => {
    alert(`Edit clicked for student with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`Delete clicked for student with id: ${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getUTCFullYear();
    return `${day} de ${month} de ${year}`;
  };

  const handleNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStudentSubmit = async (formData: any) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Student registered successfully:", data);
      setIsModalOpen(false);
      fetchStudents(currentPage);
    } catch (error) {
      console.error("Error registering student:", error);
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
                    onEdit={() => handleEdit(student.id)}
                    onDelete={() => handleDelete(student.id)}
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
        title="FORMULARIO DE REGISTRO DE ESTUDIANTE"
        isVisible={isModalOpen}
        onClose={handleModalClose}
      >
        <StudentForm onSubmit={handleStudentSubmit} />
      </Modal>
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Alert from "../../components/Alert";
import SubmitButton from "../../components/SubmitButton";
import SelectInput from "../../components/SelectInput";
import { Course } from "../../types/course";
import { Student } from "../../types/student";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
registerLocale("es", es);

const Attendances = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<{ [key: number]: string }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    color: string;
  } | null>(null);
  const [courseStartDate, setCourseStartDate] = useState<Date | undefined>(
    undefined
  );
  const [courseEndDate, setCourseEndDate] = useState<Date | undefined>(
    undefined
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/api/courses-attendance",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los cursos.");
      }

      const data: Course[] = await response.json();
      setCourses(data);
    } catch (error) {
      setAlertMessage({ message: "Error al cargar los cursos.", color: "red" });
    }
  };

  const fetchStudents = async (courseId: number, date: Date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/students?date=${
          date.toISOString().split("T")[0]
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los estudiantes.");
      }

      const data = await response.json();
      setStudents(data.students || []);
      setAttendances(data.attendances || {});
    } catch (error) {
      setAlertMessage({
        message: "Error al cargar los estudiantes.",
        color: "red",
      });
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = Number(e.target.value);
    const selected = courses.find((course) => course.id === courseId);

    if (selected) {
      setSelectedCourse(courseId);
      setCourseStartDate(
        selected.start_date ? new Date(selected.start_date) : undefined
      );
      setCourseEndDate(
        selected.end_date
          ? new Date(
              new Date(selected.end_date).setDate(
                new Date(selected.end_date).getDate() + 1
              )
            )
          : undefined
      );

      if (selectedDate) fetchStudents(courseId, selectedDate);
    } else {
      setSelectedCourse(null);
      setCourseStartDate(undefined);
      setCourseEndDate(undefined);
      setStudents([]);
    }
  };

  const handleAttendanceChange = (
    studentId: number,
    status: "PRESENTE" | "AUSENTE" | "LICENCIA"
  ) => {
    setAttendances((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      if (!selectedCourse || !selectedDate) {
        throw new Error("Debes seleccionar un curso y una fecha.");
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: selectedCourse,
          date: selectedDate.toISOString().split("T")[0],
          attendances: Object.entries(attendances).map(
            ([studentId, status]) => ({
              student_id: Number(studentId),
              status,
            })
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la asistencia.");
      }

      setAlertMessage({
        message: "Asistencia guardada con éxito.",
        color: "green",
      });
    } catch (error) {
      setAlertMessage({
        message: "Error al guardar la asistencia.",
        color: "red",
      });
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <h1 className="text-2xl font-bold mb-4">Registro de Asistencias</h1>
        {alertMessage && (
          <Alert message={alertMessage.message} color={alertMessage.color} />
        )}

        <h2 className="text-xl font-bold mb-4">Selecciona un curso</h2>
        <div className="mb-6">
          <SelectInput
            value={selectedCourse || ""}
            onChange={handleCourseChange}
            className="w-full p-3 border rounded"
          >
            <option value="">Selecciona un curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} - Paralelo {course.parallel}
              </option>
            ))}
          </SelectInput>
        </div>

        {selectedCourse && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Tomar asistencia</h2>
            <label className="block mb-4">
              Fecha de Asistencia:
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                locale="es"
                className="ml-2 border p-2 focus:border-sky-500 focus:ring-sky-500 text-center"
                dateFormat="dd/MM/yyyy"
                maxDate={courseEndDate}
                minDate={courseStartDate}
              />
            </label>

            <ul className="border rounded">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="flex justify-between p-3 border-b"
                >
                  <span>{`${student.name} ${student.last_name}`}</span>
                  <div className="flex space-x-8">
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="PRESENTE"
                        checked={attendances[student.id] === "PRESENTE"}
                        onChange={() =>
                          handleAttendanceChange(student.id, "PRESENTE")
                        }
                        className="me-2"
                      />{" "}
                      Presente
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="AUSENTE"
                        checked={attendances[student.id] === "AUSENTE"}
                        onChange={() =>
                          handleAttendanceChange(student.id, "AUSENTE")
                        }
                        className="me-2"
                      />{" "}
                      Ausente
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="LICENCIA"
                        checked={attendances[student.id] === "LICENCIA"}
                        onChange={() =>
                          handleAttendanceChange(student.id, "LICENCIA")
                        }
                        className="me-2"
                      />{" "}
                      Licencia
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <SubmitButton className="mt-4" onClick={handleSaveAttendance}>
              Guardar
            </SubmitButton>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendances;

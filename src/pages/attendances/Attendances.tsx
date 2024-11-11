import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Student } from "../../types/student";
import { Course } from "../../types/course";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import Alert from "../../components/Alert";
import SelectInput from "../../components/SelectInput";
import SubmitButton from "../../components/SubmitButton";
registerLocale("es", es);

const Attendances = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<{ [key: number]: string }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    color: string;
  } | null>(null);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setErrorMessage(null);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/api/courses-attendance",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener los cursos");
      }
      const data: Course[] = await response.json();
      setCourses(data);
    } catch (error) {
      setErrorMessage(
        "Error al cargar los cursos. Por favor, intenta nuevamente."
      );
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchStudents = async (courseId: number, date: Date) => {
    try {
      setLoadingStudents(true);
      setErrorMessage(null);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/students?date=${
          date.toISOString().split("T")[0]
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener los estudiantes");
      }

      const data = await response.json();
      if (!data || !data.students || !Array.isArray(data.students)) {
        throw new Error(
          "Formato de respuesta no válido al obtener los estudiantes"
        );
      }

      if (data.students.length === 0) {
        setErrorMessage(
          "No se encontraron estudiantes inscritos en este curso."
        );
      } else {
        setErrorMessage(null);
      }

      setStudents(data.students);
      setAttendances(data.attendances || {});
    } catch (error) {
      setErrorMessage(
        "Error al cargar los estudiantes. Por favor, intenta nuevamente."
      );
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
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
      if (selectedCourse === null) {
        throw new Error("No hay un curso seleccionado");
      }
      if (!selectedDate) {
        throw new Error("No hay una fecha seleccionada");
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/attendance-dates/${selectedCourse}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudieron verificar las fechas de asistencia");
      }

      const existingDates = await response.json();
      const selectedDateString = selectedDate.toISOString().split("T")[0];

      if (
        existingDates.some(
          (d: { date: string }) => d.date === selectedDateString
        )
      ) {
        setAlertMessage({
          message:
            "Ya existe un registro de asistencia para esta fecha. Se actualizará la asistencia existente.",
          color: "blue",
        });
      }

      const saveResponse = await fetch("http://127.0.0.1:8000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: selectedCourse,
          date: selectedDateString,
          attendances: Object.entries(attendances).map(
            ([student_id, status]) => ({
              student_id: Number(student_id),
              status,
            })
          ),
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("No se pudo guardar la asistencia");
      }

      setAlertMessage({
        message: "Asistencia guardada/actualizada con éxito",
        color: "green",
      });

      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving attendance:", error);
      setAlertMessage({
        message:
          "Error al guardar/actualizar la asistencia. Por favor, intenta nuevamente.",
        color: "red",
      });

      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      fetchStudents(selectedCourse, selectedDate);
    }
  }, [selectedCourse, selectedDate]);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Módulo de Asistencia</h1>

        {alertMessage && (
          <Alert message={alertMessage.message} color={alertMessage.color} />
        )}

        <h2 className="text-xl font-bold mb-4">Selecciona un curso</h2>
        {loadingCourses ? (
          <p>Cargando cursos...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div>
            <SelectInput
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              className="w-full p-2 mb-4"
            >
              <option value="" disabled>
                Selecciona un curso
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} Paralelo: {course.parallel} (Profesor:{" "}
                  {course.teacher?.last_name} {course.teacher?.second_last_name}{" "}
                  {course.teacher?.name || "N/A"})
                </option>
              ))}
            </SelectInput>
          </div>
        )}

        {selectedCourse && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Tomar asistencia</h2>
            <label className="block mb-2">
              Fecha de Asistencia:
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  if (date) setSelectedDate(date);
                }}
                locale="es"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                className="ml-2 border p-1"
              />
            </label>
            {loadingStudents ? (
              <p>Cargando estudiantes...</p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="flex flex-col items-start w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                {students.map((student, i) => (
                  <li key={student.id} className="w-full border-b p-3">
                    <div className="flex items-center">
                      <span className="mr-4">
                        {i + 1}. {student.name} {student.last_name}
                      </span>
                      <div className="flex space-x-4 ml-auto">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="PRESENTE"
                            checked={attendances[student.id] === "PRESENTE"}
                            onChange={() =>
                              handleAttendanceChange(student.id, "PRESENTE")
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2">Presente</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="AUSENTE"
                            checked={attendances[student.id] === "AUSENTE"}
                            onChange={() =>
                              handleAttendanceChange(student.id, "AUSENTE")
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2">Ausente</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="LICENCIA"
                            checked={attendances[student.id] === "LICENCIA"}
                            onChange={() =>
                              handleAttendanceChange(student.id, "LICENCIA")
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2">Licencia</span>
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <SubmitButton
              type="submit"
              onClick={handleSaveAttendance}
              className="mt-4"
            >
              Guardar
            </SubmitButton>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendances;

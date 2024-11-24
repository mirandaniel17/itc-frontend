import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import SelectInput from "../../components/SelectInput";
import SubmitButton from "../../components/SubmitButton";
import Alert from "../../components/Alert";
import { Course } from "../../types/course";
import { Task } from "../../types/task";
import { Student } from "../../types/student";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { formatDate } from "../../utils/dateUtils";

const Tasks = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<{
    [key: number]: { grade: number; delivered: boolean };
  }>({});
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    color: string;
  } | null>(null);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tasks/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCourses(data);
  };

  const fetchTasks = async (courseId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tasks/course/${courseId}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(data);
    setSelectedTask(null);
    setStudents([]);
  };

  const fetchStudentsWithGrades = async (taskId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tasks/${taskId}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setStudents(data.students);
    setGrades(data.grades);
  };

  const handleCreateTask = async () => {
    if (!selectedCourse || !taskTitle) {
      setAlertMessage({
        message: "El curso y el título de la actividad son obligatorios",
        color: "red",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/tasks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: taskTitle,
        description: taskDescription,
        due_date: dueDate ? dueDate.toISOString().split("T")[0] : null,
        course_id: selectedCourse,
      }),
    });

    if (response.ok) {
      setAlertMessage({
        message: "Actividad creada con éxito",
        color: "green",
      });
      setTaskTitle("");
      setTaskDescription("");
      setDueDate(null);
      setShowTaskForm(false);
      fetchTasks(selectedCourse);
    } else {
      setAlertMessage({ message: "Error al crear la actividad", color: "red" });
    }
  };

  const handleSaveGrades = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/tasks/${selectedTask}/grades/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grades: Object.entries(grades).map(([student_id, gradeData]) => ({
            student_id,
            ...gradeData,
          })),
        }),
      }
    );

    if (response.ok) {
      setAlertMessage({ message: "Notas guardadas con éxito", color: "green" });
    } else {
      setAlertMessage({ message: "Error al guardar notas", color: "red" });
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Registro de Actividades y Notas
        </h1>
        {alertMessage && (
          <Alert message={alertMessage.message} color={alertMessage.color} />
        )}
        <h2 className="text-xl font-bold mb-4">Selecciona un curso</h2>
        <div className="mb-6">
          <SelectInput
            value={selectedCourse || ""}
            onChange={(e) => {
              const courseId = Number(e.target.value);
              setSelectedCourse(courseId);
              fetchTasks(courseId);
            }}
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
          <div>
            {tasks.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Actividades Asignadas
                </h2>
                <ul className="mb-6 space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="p-3 border rounded shadow-sm hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          <strong>{task.title}</strong> - Fecha de entrega:{" "}
                          {formatDate(task.due_date || "No especificada")}
                        </span>
                        <button
                          onClick={() => {
                            if (selectedTask === task.id) {
                              setSelectedTask(null);
                              setStudents([]);
                            } else {
                              setSelectedTask(task.id);
                              fetchStudentsWithGrades(task.id);
                            }
                          }}
                          className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                          {selectedTask === task.id
                            ? "Ocultar Notas"
                            : "Ver Notas"}
                        </button>
                      </div>

                      <div
                        className="mt-3 p-3 bg-white border rounded"
                        dangerouslySetInnerHTML={{
                          __html: task.description || "",
                        }}
                      ></div>

                      {selectedTask === task.id && (
                        <div className="mt-3 p-3 bg-gray-50 border rounded">
                          {students.length > 0 ? (
                            <>
                              <h3 className="text-lg font-bold">
                                Estudiantes:
                              </h3>
                              <ul className="space-y-2 mt-2">
                                {students.map((student) => (
                                  <li
                                    key={student.id}
                                    className="flex justify-between items-center p-2 border rounded bg-white"
                                  >
                                    <span>
                                      {student.name} {student.last_name}{" "}
                                      {student.second_last_name}
                                    </span>
                                    <input
                                      type="number"
                                      value={grades[student.id]?.grade || ""}
                                      onChange={(e) => {
                                        const grade = Number(e.target.value);
                                        setGrades((prev) => ({
                                          ...prev,
                                          [student.id]: {
                                            ...prev[student.id],
                                            grade,
                                          },
                                        }));
                                      }}
                                      placeholder="Nota"
                                      className="border p-2 rounded w-20 text-center"
                                    />
                                    <label className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={
                                          grades[student.id]?.delivered || false
                                        }
                                        onChange={(e) => {
                                          const delivered = e.target.checked;
                                          setGrades((prev) => ({
                                            ...prev,
                                            [student.id]: {
                                              ...prev[student.id],
                                              delivered,
                                            },
                                          }));
                                        }}
                                      />
                                      <span>Entregado</span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                              <SubmitButton
                                onClick={handleSaveGrades}
                                className="mt-4"
                              >
                                Guardar
                              </SubmitButton>
                            </>
                          ) : (
                            <p>
                              No hay estudiantes asignados a esta actividad.
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <SubmitButton onClick={() => setShowTaskForm(true)}>
                  Nueva Actividad
                </SubmitButton>
              </>
            ) : (
              <div className="mb-6">
                <p className="text-gray-700 my-6">
                  No hay actividades asignadas para este curso.
                </p>
                <SubmitButton onClick={() => setShowTaskForm(true)}>
                  Nueva Actividad
                </SubmitButton>
              </div>
            )}
          </div>
        )}

        {showTaskForm && (
          <div className="mt-6 p-5 border rounded bg-gray-50 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              Registrar Nueva Actividad
            </h2>
            <h2 className="text-md mb-2">Título de la Actividad</h2>
            <input
              type="text"
              placeholder="Título de la Actividad"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full border p-3 mb-4 rounded"
            />
            <h2 className="text-md mb-2">Descripción de la Actividad</h2>
            <div className="w-full border p-3 rounded bg-white">
              <CKEditor
                editor={ClassicEditor}
                data={taskDescription}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setTaskDescription(data);
                }}
                config={{
                  toolbar: [
                    "bold",
                    "italic",
                    "underline",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "link",
                    "undo",
                    "redo",
                    "heading",
                    "fontColor",
                    "fontSize",
                    "alignment",
                  ],
                }}
              />
            </div>
            <label className="block mt-4 mb-4">
              Fecha de entrega:
              <input
                type="date"
                value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setDueDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="ml-2 border p-2 rounded w-full"
              />
            </label>
            <SubmitButton onClick={handleCreateTask}>
              Registrar Actividad
            </SubmitButton>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;

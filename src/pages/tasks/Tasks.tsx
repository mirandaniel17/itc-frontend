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

const Tasks = () => {
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
    const response = await fetch("http://127.0.0.1:8000/api/tasks/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCourses(data);
  };

  const fetchTasks = async (courseId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://127.0.0.1:8000/api/tasks/course/${courseId}/list`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setTasks(data);
    setSelectedTask(null);
    setStudents([]);
  };

  const fetchStudentsWithGrades = async (taskId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://127.0.0.1:8000/api/tasks/${taskId}/students`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setStudents(data.students);
    setGrades(data.grades);
  };

  const handleCreateTask = async () => {
    if (!selectedCourse || !taskTitle) {
      setAlertMessage({
        message: "El curso y el título de la tarea son obligatorios",
        color: "red",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/api/tasks/create", {
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
      setAlertMessage({ message: "Tarea creada con éxito", color: "green" });
      setTaskTitle("");
      setTaskDescription("");
      setDueDate(null);
      setShowTaskForm(false);
      fetchTasks(selectedCourse);
    } else {
      setAlertMessage({ message: "Error al crear la tarea", color: "red" });
    }
  };

  const handleSaveGrades = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://127.0.0.1:8000/api/tasks/${selectedTask}/grades/save`,
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
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-">
        <h1 className="text-2xl font-bold mb-4">Registro de Tareas</h1>
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
                  Tareas Asignadas
                </h2>
                <ul className="mb-6 space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex justify-between items-center p-3 border rounded shadow-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedTask(task.id);
                        fetchStudentsWithGrades(task.id);
                      }}
                    >
                      <span>
                        <strong>{task.title}</strong> - Fecha de entrega:{" "}
                        {task.due_date || "No especificada"}
                      </span>
                    </li>
                  ))}
                </ul>
                <SubmitButton onClick={() => setShowTaskForm(true)}>
                  Nueva Tarea
                </SubmitButton>
              </>
            ) : (
              <div className="mb-6">
                <p className="text-gray-700">
                  No hay tareas asignadas para este curso.
                </p>
                <SubmitButton onClick={() => setShowTaskForm(true)}>
                  Nueva Tarea
                </SubmitButton>
              </div>
            )}
          </div>
        )}

        {showTaskForm && (
          <div className="mt-6 p-5 border rounded bg-gray-50 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>
            <input
              type="text"
              placeholder="Título de la tarea"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full border p-3 mb-4 rounded"
            />
            <h2 className="text-xl mb-2">Descripción de la Tarea</h2>
            <div className="w-full border p-3 rounded bg-white">
              <CKEditor
                editor={ClassicEditor}
                data={taskDescription}
                onChange={(event, editor) => {
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
            <SubmitButton onClick={handleCreateTask}>Crear Tarea</SubmitButton>
          </div>
        )}

        {selectedTask && students.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Asignar notas</h2>

            <div className="bg-gray-200 p-3 rounded-t flex justify-between font-bold">
              <span className="w-1/2">Estudiante</span>
              <span className="w-1/4 text-center">Nota</span>
              <span className="w-1/4 text-center">Entregado</span>
            </div>

            <ul className="space-y-3">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="flex justify-between items-center p-3 border rounded shadow-sm bg-gray-50"
                >
                  <span className="w-1/2">
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
                        [student.id]: { ...prev[student.id], grade },
                      }));
                    }}
                    placeholder="Nota"
                    className="border p-2 rounded w-1/4 text-center"
                  />
                  <label className="w-1/4 flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={grades[student.id]?.delivered || false}
                      onChange={(e) => {
                        const delivered = e.target.checked;
                        setGrades((prev) => ({
                          ...prev,
                          [student.id]: { ...prev[student.id], delivered },
                        }));
                      }}
                    />
                  </label>
                </li>
              ))}
            </ul>
            <SubmitButton onClick={handleSaveGrades} className="mt-4">
              Guardar Notas
            </SubmitButton>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;

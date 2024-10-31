import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Alert from "../components/Alert";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type Schedule = {
  day: string;
  startTime: Date | null;
  endTime: Date | null;
  room: string;
};

const SetSchedule: React.FC = () => {
  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>(
    daysOfWeek.map((day) => ({
      day,
      startTime: null,
      endTime: null,
      room: "",
    }))
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("green");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/courses?per_page=1000",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setCourses(
          data.data.map((course: any) => ({ id: course.id, name: course.name }))
        );
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await response.json();
        setRooms(data.map((room: any) => ({ id: room.id, name: room.name })));
      } catch (error) {
        console.error("Error al cargar las aulas:", error);
      }
    };

    fetchCourses();
    fetchRooms();
  }, []);

  const handleScheduleChange = (
    index: number,
    field: keyof Schedule,
    value: any
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formattedSchedules = schedules.map((schedule) => ({
        day: schedule.day,
        start_time: schedule.startTime
          ? dayjs(schedule.startTime).format("HH:mm")
          : null,
        end_time: schedule.endTime
          ? dayjs(schedule.endTime).format("HH:mm")
          : null,
        room: schedule.room,
      }));

      const response = await fetch("http://127.0.0.1:8000/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          course_id: courseId,
          teacher_id: teacherId,
          schedules: formattedSchedules,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar el horario");

      setAlertMessage("Horario guardado correctamente");
      setAlertColor("green");

      setTimeout(() => {
        navigate("/calendar");
      }, 1000);
    } catch (error) {
      setAlertMessage("Error al guardar el horario");
      setAlertColor("red");
    } finally {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <Layout>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Configurar Horario de Clases
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curso
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-2">Día</th>
                <th className="px-4 py-2">Hora de Inicio</th>
                <th className="px-4 py-2">Hora de Fin</th>
                <th className="px-4 py-2">Número de Aula</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr
                  key={schedule.day}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {schedule.day}
                  </td>
                  <td className="px-4 py-2">
                    <DatePicker
                      selected={schedule.startTime}
                      onChange={(date) =>
                        handleScheduleChange(index, "startTime", date)
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Hora de Inicio"
                      dateFormat="h:mm aa"
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <DatePicker
                      selected={schedule.endTime}
                      onChange={(date) =>
                        handleScheduleChange(index, "endTime", date)
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Hora de Fin"
                      dateFormat="h:mm aa"
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={schedule.room}
                      onChange={(e) =>
                        handleScheduleChange(index, "room", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded-lg w-full"
                      placeholder="Ej. 101"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="submit"
            className="mt-6 w-full text-white bg-gradient-to-r from-sky-400 to-sky-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Guardar Horario
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SetSchedule;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Alert from "../../components/Alert";
import SelectInput from "../../components/SelectInput";

type Schedule = {
  day: string;
  shiftId: string;
};

const SetSchedule: React.FC = () => {
  const [courseId, setCourseId] = useState("");
  const [shiftOptions, setShiftOptions] = useState<
    { id: string; name: string; start_time: string; end_time: string }[]
  >([]);
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { day: "LUNES", shiftId: "" },
    { day: "MARTES", shiftId: "" },
    { day: "MIERCOLES", shiftId: "" },
    { day: "JUEVES", shiftId: "" },
    { day: "VIERNES", shiftId: "" },
    { day: "SABADO", shiftId: "" },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("green");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
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
      setClassOptions(
        data.data.map((course: any) => ({ id: course.id, name: course.name }))
      );
    };

    const fetchShifts = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/api/shifts?per_page=1000",
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
      setShiftOptions(
        data.data.map((shift: any) => ({
          id: shift.id,
          name: shift.name,
          start_time: shift.start_time,
          end_time: shift.end_time,
        }))
      );
    };

    fetchClasses();
    fetchShifts();
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
    if (!courseId) {
      setAlertMessage("Debe seleccionar un curso.");
      setAlertColor("red");
      setShowAlert(true);
      return;
    }

    const emptyShift = schedules.some((schedule) => !schedule.shiftId);
    if (emptyShift) {
      setAlertMessage("Debe seleccionar un turno para cada día.");
      setAlertColor("red");
      setShowAlert(true);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          course_id: courseId,
          schedules: schedules.map((schedule) => ({
            day: schedule.day,
            shift_id: schedule.shiftId,
          })),
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
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
          CONFIGURAR HORARIO DE CLASES
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curso
              </label>
              <SelectInput
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Selecciona un curso</option>
                {classOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-2">Día</th>
                <th className="px-4 py-2">Turno</th>
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
                    <SelectInput
                      value={schedule.shiftId}
                      onChange={(e) =>
                        handleScheduleChange(index, "shiftId", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    >
                      <option value="">Selecciona un turno</option>
                      {shiftOptions.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.name} ({shift.start_time} - {shift.end_time})
                        </option>
                      ))}
                    </SelectInput>
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

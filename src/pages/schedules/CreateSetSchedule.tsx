import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Alert from "../../components/Alert";
import SelectInput from "../../components/SelectInput";
import SubmitButton from "../../components/SubmitButton";

type Schedule = {
  day: string;
  shiftId: string;
};

const CreateSetSchedule: React.FC = () => {
  const [courseId, setCourseId] = useState("");
  const [shiftOptions, setShiftOptions] = useState<
    { id: string; name: string; start_time: string; end_time: string }[]
  >([]);
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string; parallel: string }[]
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
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const fetchClasses = async () => {
        const response = await fetch(
          "http://127.0.0.1:8000/api/courses?per_page=1000",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setClassOptions(
          data.data.map((course: any) => ({
            id: course.id,
            name: course.name,
            parallel: course.parallel,
          }))
        );
      };

      const fetchShifts = async () => {
        const response = await fetch(
          "http://127.0.0.1:8000/api/shifts?per_page=1000",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
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

      await Promise.all([fetchClasses(), fetchShifts()]);
    };

    fetchData();
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
      showAlertWithMessage("Debe seleccionar un curso.", "red");
      return;
    }

    if (schedules.some((schedule) => !schedule.shiftId)) {
      showAlertWithMessage("Debe seleccionar un turno para cada día.", "red");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: courseId,
          schedules: schedules.map((schedule) => ({
            day: schedule.day,
            shift_id: schedule.shiftId,
          })),
        }),
      });

      if (!response.ok) throw new Error("Error al guardar el horario");

      showAlertWithMessage("Horario guardado correctamente", "green");
      setTimeout(() => {
        navigate("/schedules");
      }, 1000);
    } catch {
      showAlertWithMessage("Error al guardar el horario", "red");
    }
  };

  const showAlertWithMessage = (message: string, color: string) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Layout>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center uppercase">
          Crear Nuevo Horario
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Curso</label>
            <SelectInput
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full"
            >
              <option value="">Selecciona un curso</option>
              {classOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.parallel}
                </option>
              ))}
            </SelectInput>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Día</th>
                <th>Turno</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.day}>
                  <td>{schedule.day}</td>
                  <td>
                    <SelectInput
                      value={schedule.shiftId}
                      onChange={(e) =>
                        handleScheduleChange(index, "shiftId", e.target.value)
                      }
                      className="w-full"
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
          <SubmitButton type="submit" className="mt-5">
            Guardar Horario
          </SubmitButton>
        </form>
      </div>
    </Layout>
  );
};

export default CreateSetSchedule;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Alert from "../../components/Alert";
import BackButton from "../../components/BackButton";
import SubmitButton from "../../components/SubmitButton";
import Select from "react-select";
import { Course } from "../../types/course";
import { Shift } from "../../types/shift";

type Schedule = {
  day: string;
  shiftId: string;
};

const CreateSetSchedule: React.FC = () => {
  const [courseId, setCourseId] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [shiftOptions, setShiftOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
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

      const fetchAllClasses = async () => {
        let allClasses: Course[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await fetch(
            `http://127.0.0.1:8000/api/courses?page=${currentPage}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          allClasses = [...allClasses, ...data.data];
          totalPages = data.last_page;
          currentPage++;
        }

        setClassOptions(
          allClasses.map((course) => ({
            value: course.id.toString(),
            label: `${course.name} - ${course.parallel}`,
          }))
        );
      };

      const fetchAllShifts = async () => {
        let allShifts: Shift[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await fetch(
            `http://127.0.0.1:8000/api/shifts?page=${currentPage}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          allShifts = [...allShifts, ...data.data];
          totalPages = data.last_page;
          currentPage++;
        }

        setShiftOptions(
          allShifts.map((shift) => ({
            value: shift.id.toString(),
            label: `${shift.name} (${shift.start_time} - ${shift.end_time})`,
          }))
        );
      };

      await Promise.all([fetchAllClasses(), fetchAllShifts()]);
    };

    fetchData();
  }, []);

  const handleScheduleChange = (
    index: number,
    field: keyof Schedule,
    value: string
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };
  const goBackToRooms = () => {
    navigate("/schedules");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
      showAlertWithMessage("Debe seleccionar un curso.", "red");
      return;
    }

    const assignedSchedules = schedules.filter((schedule) => schedule.shiftId);
    const weekdaysAssigned = assignedSchedules.filter((schedule) =>
      ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"].includes(
        schedule.day
      )
    ).length;
    const saturdayAssigned = assignedSchedules.some(
      (schedule) => schedule.day === "SABADO"
    );

    // Permitir si solo hay asignaciones para sábado o si hay al menos 3 días en la semana
    if (weekdaysAssigned < 3 && !saturdayAssigned) {
      showAlertWithMessage(
        "Debe asignar turnos a al menos 3 días de lunes a viernes o al menos 1 turno para el sábado.",
        "red"
      );
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
          course_id: courseId.value,
          schedules: assignedSchedules.map((schedule) => ({
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
          Registrar Nuevo Horario
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Curso</label>
            <Select
              value={courseId}
              onChange={(selected) => setCourseId(selected as any)}
              options={classOptions}
              placeholder="Selecciona un curso"
              isSearchable
            />
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
                    <Select
                      value={shiftOptions.find(
                        (option) => option.value === schedule.shiftId
                      )}
                      onChange={(selected) =>
                        handleScheduleChange(
                          index,
                          "shiftId",
                          selected?.value || ""
                        )
                      }
                      options={shiftOptions}
                      placeholder="Selecciona un turno"
                      isSearchable
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <BackButton onClick={goBackToRooms}>Volver</BackButton>
          <SubmitButton type="submit" className="mt-5">
            Guardar
          </SubmitButton>
        </form>
      </div>
    </Layout>
  );
};

export default CreateSetSchedule;

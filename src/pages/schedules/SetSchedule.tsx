import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableHead from "../../components/TableHead";
import TableBody from "../../components/TableBody";
import TableRow from "../../components/TableRow";
import TableCell from "../../components/TableCell";
import AddButton from "../../components/AddButton";
import SelectInput from "../../components/SelectInput";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Alert from "../../components/Alert";
import ConfirmationModal from "../../components/ConfirmationModal";

type Schedule = {
  id: number;
  course_name: string;
  parallel: string;
  shift_name: string;
  day: string;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
};

const SetSchedule: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [availableParallels, setAvailableParallels] = useState<
    Record<string, string[]>
  >({});
  const [selectedParallels, setSelectedParallels] = useState<
    Record<string, string>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("green");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/schedules`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al cargar los horarios");

        const data = await response.json();
        setSchedules(data.schedules);

        const parallelsByCourse = data.schedules.reduce(
          (acc: any, schedule: Schedule) => {
            const key = schedule.course_name;
            if (!acc[key]) {
              acc[key] = new Set();
            }
            acc[key].add(schedule.parallel);
            return acc;
          },
          {}
        );

        const parallelOptions = Object.keys(parallelsByCourse).reduce(
          (acc, course) => {
            acc[course] = Array.from(parallelsByCourse[course]);
            return acc;
          },
          {} as Record<string, string[]>
        );

        setAvailableParallels(parallelOptions);
      } catch (error) {
        setAlertMessage("Error al cargar los horarios");
        setAlertColor("red");
        setShowAlert(true);
      } finally {
        setLoading(false);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };

    fetchSchedules();
  }, []);

  const handleNewSchedule = () => {
    navigate("/schedules/create");
  };

  const confirmDeleteSchedule = async () => {
    if (scheduleToDelete === null) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/schedules/${scheduleToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el horario");

      setSchedules((prev) =>
        prev.filter((schedule) => schedule.id !== scheduleToDelete)
      );
      setAlertMessage("Horario eliminado correctamente");
      setAlertColor("green");
    } catch {
      setAlertMessage("Error al eliminar el horario");
      setAlertColor("red");
    } finally {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setIsModalVisible(false);
      setScheduleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setScheduleToDelete(null);
  };

  const toggleExpand = (courseKey: string) => {
    setExpandedCourse(expandedCourse === courseKey ? null : courseKey);
  };

  const handleParallelChange = (courseName: string, newParallel: string) => {
    setSelectedParallels((prev) => ({ ...prev, [courseName]: newParallel }));
  };

  return (
    <Layout>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Horarios de Clases</h2>
        <AddButton label="Nuevo" onClick={handleNewSchedule} />
      </div>

      <Table>
        <TableHead headers={["Curso", "Paralelo", "Acción"]} />
        <TableBody>
          {loading
            ? [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} height={20} />
                  </TableCell>
                </TableRow>
              ))
            : Object.keys(availableParallels).map((courseKey, index) => {
                const parallels = availableParallels[courseKey] || [];

                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{courseKey}</TableCell>
                      <TableCell>
                        <SelectInput
                          value={selectedParallels[courseKey] || parallels[0]}
                          onChange={(e) =>
                            handleParallelChange(courseKey, e.target.value)
                          }
                        >
                          {parallels.map((parallel, idx) => (
                            <option key={idx} value={parallel}>
                              Paralelo {parallel}
                            </option>
                          ))}
                        </SelectInput>
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-blue-500 underline mr-2"
                          onClick={() => toggleExpand(courseKey)}
                        >
                          {expandedCourse === courseKey
                            ? "Ocultar Detalles"
                            : "Ver Detalles"}
                        </button>
                      </TableCell>
                    </TableRow>
                    {expandedCourse === courseKey && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Table>
                            <TableHead
                              headers={[
                                "Día",
                                "Turno",
                                "Fecha inicio/fin",
                                "Hora inicio/fin",
                                "Acción",
                              ]}
                            />
                            <TableBody>
                              {schedules
                                .filter(
                                  (schedule) =>
                                    schedule.course_name === courseKey &&
                                    schedule.parallel ===
                                      (selectedParallels[courseKey] ||
                                        parallels[0])
                                )
                                .map((schedule, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{schedule.day}</TableCell>
                                    <TableCell>{schedule.shift_name}</TableCell>
                                    <TableCell>
                                      {schedule.start_date} -{" "}
                                      {schedule.end_date}
                                    </TableCell>
                                    <TableCell>
                                      {schedule.start_time} -{" "}
                                      {schedule.end_time}
                                    </TableCell>
                                    <TableCell>
                                      <button
                                        className="text-red-500 underline"
                                        onClick={() => {
                                          setScheduleToDelete(schedule.id);
                                          setIsModalVisible(true);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
        </TableBody>
      </Table>

      <ConfirmationModal
        isVisible={isModalVisible}
        message="¿Estás seguro de eliminar este horario?"
        onConfirm={confirmDeleteSchedule}
        onCancel={cancelDelete}
      />
    </Layout>
  );
};

export default SetSchedule;

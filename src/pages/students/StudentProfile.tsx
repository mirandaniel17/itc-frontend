import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Badge from "../../components/Badge";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { formatDate } from "../../utils/dateUtils";

interface AcademicHistory {
  course: string;
  start_date: string;
  end_date: string;
  schedules: { day: string; start_time: string; end_time: string }[];
  grades: { task: string; grade: number }[];
  attendance: { PRESENTE: number; AUSENTE: number; LICENCIA: number };
  payments: number;
}

const StudentProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any | null>(null);
  const [academicHistory, setAcademicHistory] = useState<AcademicHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/students/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        setStudent(await response.json());
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    const fetchAcademicHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `${API_URL}/students/${id}/academic-history`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error(`Error ${response.status}`);
        setAcademicHistory(await response.json());
      } catch (error) {
        console.error("Error fetching academic history:", error);
      }
    };

    if (id) {
      setLoading(true);
      Promise.all([fetchStudent(), fetchAcademicHistory()]).then(() =>
        setLoading(false)
      );
    }
  }, [id]);

  const goBackToStudents = () => {
    navigate("/students");
  };

  const imageUrl = student?.image
    ? `${STORAGE_URL}/${student.image}`
    : "/public/avatar.png";

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-background rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Perfil del Estudiante</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Nombre</p>
                <p className="font-medium">
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `${student?.name} ${student?.last_name} ${student?.second_last_name}`
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Lugar de Nacimiento</p>
                <p className="font-medium">
                  {loading ? <Skeleton /> : student?.placeofbirth}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {loading ? (
                    <Skeleton />
                  ) : (
                    new Date(student?.dateofbirth || "").toLocaleDateString()
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Género</p>
                <p className="font-medium">
                  {loading ? <Skeleton /> : student?.gender}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                {loading ? (
                  <Skeleton width={80} height={30} />
                ) : (
                  <Badge variant={student?.status ? "success" : "danger"}>
                    {student?.status ? "Activo" : "Inactivo"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {loading ? (
              <Skeleton circle={true} height={192} width={192} />
            ) : (
              <img
                src={imageUrl!}
                className="w-48 h-48 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Historial Académico</h2>
          {loading ? (
            <Skeleton count={3} />
          ) : academicHistory.length > 0 ? (
            academicHistory.map((record, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded bg-gray-50 shadow"
              >
                <h3 className="text-xl font-bold mb-5">
                  Curso: {record.course}
                </h3>
                <p className="text-lg">
                  <strong className="mr-4">Fecha de inicio:</strong>
                  {record.start_date
                    ? formatDate(record.start_date)
                    : "Sin fecha"}
                </p>
                <p className="text-lg">
                  <strong className="mr-4">Fecha final:</strong>
                  {record.end_date ? formatDate(record.end_date) : "Sin fecha"}
                </p>
                <div className="mt-4">
                  <h4 className="text-xl font-bold">Horario:</h4>
                  <ul className="text-lg">
                    {(record.schedules || []).map((schedule, idx) => (
                      <li key={idx}>
                        {schedule.day}:{" "}
                        {schedule.start_time && schedule.end_time
                          ? `${schedule.start_time} - ${schedule.end_time}`
                          : "Sin horario asignado"}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="text-xl font-bold">Notas:</h4>
                  <ul className="text-lg">
                    {(record.grades || []).map((grade, idx) => (
                      <li key={idx}>
                        {grade.task}: {grade.grade}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="text-xl font-bold">Asistencias:</h4>
                  <p className="text-lg">
                    Presente: {record.attendance?.PRESENTE || 0}
                  </p>
                  <p className="text-lg">
                    Ausente: {record.attendance?.AUSENTE || 0}
                  </p>
                  <p className="text-lg">
                    Licencia: {record.attendance?.LICENCIA || 0}
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="text-xl font-bold">Pagos Totales:</h4>
                  <p className="text-lg">{record.payments || 0} Bs.</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay historial académico disponible.</p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <BackButton onClick={goBackToStudents}>Volver</BackButton>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;

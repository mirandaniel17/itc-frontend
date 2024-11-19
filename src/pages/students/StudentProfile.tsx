import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Badge from "../../components/Badge";
import { Student } from "../../types/student";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/students/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setStudent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const goBackToStudents = () => {
    navigate("/students");
  };

  const imageUrl = student
    ? `http://localhost:8000/storage/${student.image}`
    : null;

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Perfil del Estudiante</h2>
              </div>
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
                  <p className="text-muted-foreground">
                    Carnet de Identidad (C.I.)
                  </p>
                  <p className="font-medium">
                    {loading ? <Skeleton /> : student?.ci}
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
                  <p className="text-muted-foreground">Lugar de Nacimiento</p>
                  <p className="font-medium">
                    {loading ? <Skeleton /> : student?.placeofbirth}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Número de Celular</p>
                  <p className="font-medium">
                    {loading ? <Skeleton /> : student?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Género</p>
                  <p className="font-medium">
                    {loading ? <Skeleton /> : student?.gender}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="border-l border-muted-foreground/20 h-full mr-6" />
              <div className="flex-1">
                <div className="mb-6">
                  {loading ? (
                    <Skeleton circle={true} height={192} width={192} />
                  ) : (
                    <img
                      src={imageUrl!}
                      alt="Student Photo"
                      className="w-48 h-48 rounded-full object-cover mx-auto"
                    />
                  )}
                </div>
                <div className="bg-background rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Documentos</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground">
                          Admission Letter
                        </p>
                        <p className="font-medium">
                          {loading ? <Skeleton /> : "admission_letter.pdf"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {loading ? <Skeleton /> : "Version 1.2 (2023-04-15)"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
                          <i className="mdi mdi-download w-5 h-5"></i>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
                          <i className="mdi mdi-eye w-5 h-5"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <BackButton onClick={goBackToStudents}>Volver</BackButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default StudentProfile;

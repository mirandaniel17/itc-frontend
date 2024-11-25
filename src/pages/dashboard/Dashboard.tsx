import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import Layout from "../../components/Layout";

const Dashboard: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState<any[]>([]);
  const [enrollmentsData, setEnrollmentsData] = useState<any[]>([]);
  const [studentsByCourse, setStudentsByCourse] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchEnrollmentsByDate = async (token: string) => {
    const response = await fetch(`${API_URL}/dashboard/enrollments-by-date`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      return Object.keys(result).map((date) => ({
        x: date,
        y: result[date].count,
      }));
    } else {
      throw new Error("Error al cargar los datos de inscripciones");
    }
  };

  const fetchStudentsByCourse = async (token: string) => {
    const response = await fetch(`${API_URL}/dashboard/students-by-course`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      return Object.keys(result).map((course) => ({
        id: course,
        label: course,
        value: result[course],
      }));
    } else {
      throw new Error("Error al cargar los datos de estudiantes por curso");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/dashboard/counts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          setData([
            { category: "Usuarios", value: result.totalUsers },
            { category: "Estudiantes", value: result.totalStudents },
            { category: "Docentes", value: result.totalTeachers },
            { category: "Cursos", value: result.totalCourses },
            { category: "Inscripciones", value: result.totalEnrollments },
            { category: "Pagos", value: result.totalPayments },
          ]);
        } else {
          setError("Error al cargar los datos");
        }

        const enrollments = await fetchEnrollmentsByDate(token as string);
        setEnrollmentsData(enrollments);

        const students = await fetchStudentsByCourse(token as string);
        setStudentsByCourse(students);

        setLoading(false);
      } catch (error) {
        setError("Hubo un problema con la solicitud");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto">
        <h1 className="text-center text-4xl font-bold mb-5">
          Panel de Control
        </h1>

        {loading ? (
          <div className="text-center text-xl">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div>
            <div className="w-full h-[400px] mb-8">
              <ResponsiveBar
                data={data}
                keys={["value"]}
                indexBy="category"
                margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                colors={{ scheme: "set2" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Categorías",
                  legendPosition: "middle",
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Total",
                  legendPosition: "middle",
                  legendOffset: -50,
                }}
                tooltip={({ value, indexValue }) => (
                  <strong>
                    {indexValue}: {value}
                  </strong>
                )}
                animate={true}
                motionConfig="wobbly"
              />
            </div>

            <h1 className="text-center text-lg font-bold mb-5">
              Inscripciones a lo largo del Tiempo
            </h1>
            <div className="w-full h-[400px] mb-8">
              <ResponsiveLine
                data={[{ id: "Inscripciones", data: enrollmentsData }]}
                margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", stacked: true }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Fecha",
                  legendPosition: "middle",
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Inscripciones",
                  legendPosition: "middle",
                  legendOffset: -50,
                }}
                colors={{ scheme: "set2" }}
                enablePoints={true}
                pointSize={10}
                enableArea={true}
                areaOpacity={0.15}
                animate={true}
                motionConfig="wobbly"
              />
            </div>

            <h1 className="text-center text-lg font-bold mb-5">
              Estudiantes por Curso
            </h1>
            <div className="w-full h-[400px] mb-8">
              <ResponsivePie
                data={studentsByCourse}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: "set2" }}
                borderWidth={1}
                borderColor="inherit:darker(0.2)"
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="white"
                arcLabelsRadiusOffset={0.5}
                arcLabelsTextColor="white"
                animate={true}
                motionConfig="wobbly"
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateX: 0,
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

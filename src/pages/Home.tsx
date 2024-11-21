import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const Home = () => {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalModalities: 0,
    totalRooms: 0,
    totalShifts: 0,
    totalPayments: 0,
  });

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/api/dashboard/counts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-account text-4xl text-blue-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Usuarios Administrativos
                </h2>
                <p className="text-black py-1">{counts.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-school text-4xl text-green-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Estudiantes
                </h2>
                <p className="text-black py-1">{counts.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-human-male-board text-4xl text-purple-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Profesores
                </h2>
                <p className="text-black py-1">{counts.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-book-open text-4xl text-yellow-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Cursos
                </h2>
                <p className="text-black py-1">{counts.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-account-check text-4xl text-indigo-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Inscripciones
                </h2>
                <p className="text-black py-1">{counts.totalEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-view-grid text-4xl text-orange-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Modalidades
                </h2>
                <p className="text-black py-1">{counts.totalModalities}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-office-building text-4xl text-cyan-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Aulas
                </h2>
                <p className="text-black py-1">{counts.totalRooms}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-clock-outline text-4xl text-gray-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Horarios
                </h2>
                <p className="text-black py-1">{counts.totalShifts}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-cash-multiple text-4xl text-yellow-300 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Pagos
                </h2>
                <p className="text-black py-1">{counts.totalShifts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

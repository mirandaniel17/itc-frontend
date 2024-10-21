import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const Home = () => {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
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
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-2 space-y-4 md:space-y-0">
          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg w-full md:w-1/3">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center my-4">
              <i className="mdi mdi-account text-4xl text-blue-500 mr-4"></i>
              <div>
                <h2 className="text-black text-md font-bold pb-2">
                  Total de Usuarios
                </h2>
                <p className="text-black py-1">{counts.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg w-full md:w-1/3">
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

          <div className="relative bg-white block p-6 border border-gray-100 rounded-lg w-full md:w-1/3">
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
        </div>
      </div>
    </Layout>
  );
};

export default Home;

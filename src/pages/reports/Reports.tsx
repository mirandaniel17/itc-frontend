import React, { useState, useEffect } from "react";
import SelectInput from "../../components/SelectInput";
import ExcelButton from "../../components/ExcelButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { Course } from "../../types/course";
import Layout from "../../components/Layout";
registerLocale("es", es);

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/courses", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching courses");
      }

      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedCourse) {
      alert("Por favor selecciona un curso.");
      return;
    }

    const selectedCourseName = courses.find(
      (course) => course.id === selectedCourse
    )?.name;

    let endpoint = "";
    let fileName = "";

    const courseNameSlug = selectedCourseName
      ? selectedCourseName.toLowerCase().replace(/ /g, "-")
      : "curso";

    switch (reportType) {
      case "attendance":
        if (!startDate || !endDate) {
          alert(
            "Por favor selecciona ambas fechas para el reporte de asistencias."
          );
          return;
        }
        endpoint = "/api/export-attendance-report";
        fileName = `reporte_asistencias_${
          startDate.toISOString().split("T")[0]
        }_al_${endDate.toISOString().split("T")[0]}.xlsx`;
        break;

      case "enrollment":
        endpoint = "/api/export-enrollment-report";
        fileName = `reporte_inscripciones_curso_${courseNameSlug}.xlsx`;
        break;

      case "grades":
        endpoint = "/api/export-grades-report";
        fileName = `reporte_notas_curso_${courseNameSlug}.xlsx`;
        break;

      default:
        alert("Por favor selecciona un tipo de reporte válido.");
        return;
    }

    const requestData: Record<string, any> = { course_id: selectedCourse };

    if (reportType === "attendance" && startDate && endDate) {
      requestData.start_date = startDate.toISOString().split("T")[0];
      requestData.end_date = endDate.toISOString().split("T")[0];
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Error generating report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Sección de Reportes</h1>
        <h2 className="text-xl font-bold mb-4">
          Selecciona el tipo de Reporte
        </h2>
        <SelectInput
          value={reportType || ""}
          onChange={(e) => setReportType(e.target.value)}
          className="mb-4 w-full p-2 border rounded"
        >
          <option value="">Selecciona un tipo de reporte</option>
          <option value="attendance">Reporte de Asistencias</option>
          <option value="enrollment">Reporte de Inscripciones</option>
          <option value="grades">Reporte de Notas</option>
        </SelectInput>

        {reportType && (
          <div className="mt-4">
            <h2>Selecciona Curso</h2>
            <SelectInput
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              className="mb-4 w-full p-2 border rounded"
            >
              <option value="">Selecciona un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} - Paralelo {course.parallel}
                </option>
              ))}
            </SelectInput>

            {reportType === "attendance" && (
              <div className="mb-4">
                <div className="flex flex-col">
                  <label className="block mb-2">Fecha de Inicio:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 rounded-sm text-sm tracking-normal border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="block mb-2">Fecha Final:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 rounded-sm text-sm tracking-normal border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}

            <ExcelButton onClick={handleGenerateReport}>
              Descargar en Excel
            </ExcelButton>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;

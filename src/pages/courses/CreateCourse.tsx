import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { Teacher } from "../../types/teacher";
import { Modality } from "../../types/modality";
import Layout from "../../components/Layout";
registerLocale("es", es);

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    teacher_id: "",
    modality_id: "",
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/teachers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTeachers(data.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchModalities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/modalities", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setModalities(data.data);
      } catch (error) {
        console.error("Error fetching modalities:", error);
      }
    };

    fetchTeachers();
    fetchModalities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeacherChange = (selectedOption: any) => {
    setFormData({ ...formData, teacher_id: selectedOption.value });
  };

  const handleModalityChange = (selectedOption: any) => {
    setFormData({ ...formData, modality_id: selectedOption.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStartDate) {
      setErrors({ start_date: ["La fecha de inicio es obligatoria"] });
      return;
    }
    if (!selectedEndDate) {
      setErrors({ end_date: ["La fecha de finalización es obligatoria"] });
      return;
    }

    const courseData = {
      ...formData,
      start_date: selectedStartDate.toISOString().split("T")[0],
      end_date: selectedEndDate
        ? selectedEndDate.toISOString().split("T")[0]
        : null,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/courses", {
        state: { message: "Curso registrado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error creating course:", error);
      setAlertMessage("Error al registrar el curso");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

  const teacherOptions = Array.isArray(teachers)
    ? teachers.map((teacher) => ({
        value: teacher.id,
        label: `${teacher.last_name} ${teacher.second_last_name} ${teacher.name} - ${teacher.ci}`,
      }))
    : [];

  const modalityOptions = Array.isArray(modalities)
    ? modalities.map((modality) => ({
        value: modality.id,
        label: modality.name,
      }))
    : [];

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            Registrar Curso
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {showAlert && <Alert message={alertMessage} color={alertColor} />}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
              <div className="flex flex-col">
                <InputLabel htmlFor="name">Nombre del Curso</InputLabel>
                <TextInput
                  type="text"
                  name="name"
                  placeholder="Nombre del Curso"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="description">Descripción</InputLabel>
                <TextInput
                  type="text"
                  name="description"
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={handleChange}
                />
                <InputError message={errors.description?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="start_date">Fecha de Inicio</InputLabel>
                <DatePicker
                  selected={selectedStartDate}
                  onChange={(date: Date | null) => setSelectedStartDate(date)}
                  locale="es"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha de inicio"
                  className="w-full p-3 text-xs tracking-tighter"
                  required
                />
                <InputError message={errors.start_date?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="end_date">
                  Fecha de Finalización
                </InputLabel>
                <DatePicker
                  selected={selectedEndDate}
                  onChange={(date: Date | null) => setSelectedEndDate(date)}
                  locale="es"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha de finalización"
                  className="w-full p-3 text-xs tracking-tighter"
                  required
                />
                <InputError message={errors.end_date?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="teacher_id">Docente</InputLabel>
                <Select
                  options={teacherOptions}
                  onChange={handleTeacherChange}
                  isSearchable
                  placeholder="Buscar docente"
                  className="w-full text-xs tracking-tighter"
                />
                <InputError message={errors.teacher_id?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="modality_id">Modalidad</InputLabel>
                <Select
                  options={modalityOptions}
                  onChange={handleModalityChange}
                  placeholder="Seleccionar Modalidad"
                  className="w-full text-xs tracking-tighter"
                />
                <InputError message={errors.modality_id?.[0]} />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <SubmitButton type="submit">Guardar</SubmitButton>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default CreateCourse;

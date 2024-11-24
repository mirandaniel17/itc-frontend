import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import BackButton from "../../components/BackButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { Teacher } from "../../types/teacher";
import { Modality } from "../../types/modality";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";
registerLocale("es", es);

const EditCourse = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    teacher_id: "",
    modality_id: "",
    parallel: "",
    cost: "",
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async (
      endpoint: string,
      setState: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      const token = localStorage.getItem("token");
      let allData: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await fetch(
            `${API_URL}/${endpoint}?page=${currentPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          allData = [...allData, ...data.data];
          totalPages = data.last_page;
          currentPage++;
        }

        setState(allData);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/courses/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFormData({
          name: data.name,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          teacher_id: data.teacher_id,
          modality_id: data.modality_id,
          parallel: data.parallel || "",
          cost: data.cost || "",
        });
        setSelectedStartDate(new Date(data.start_date));
        if (data.end_date) {
          setSelectedEndDate(new Date(data.end_date));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    fetchCourse();
    fetchAllData("teachers", setTeachers);
    fetchAllData("modalities", setModalities);
  }, [id]);

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

    const updatedCourseData = {
      ...formData,
      start_date: selectedStartDate.toISOString().split("T")[0],
      end_date: selectedEndDate
        ? selectedEndDate.toISOString().split("T")[0]
        : null,
      cost: parseFloat(formData.cost),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCourseData),
      });
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/courses", {
        state: { message: "Curso actualizado con éxito", color: "green" },
      });
    } catch (error) {
      setAlertMessage("Error al actualizar el curso");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.last_name} ${teacher.second_last_name} ${teacher.name} - ${teacher.ci}`,
  }));

  const modalityOptions = modalities.map((modality) => ({
    value: modality.id,
    label: modality.name,
  }));

  const goBackToCourses = () => {
    navigate("/courses");
  };

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            Actualizar datos del Curso
          </h2>
          {showAlert && <Alert message={alertMessage} color={alertColor} />}
          {loading ? (
            <Skeleton height={40} count={8} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  <InputLabel htmlFor="parallel">Paralelo</InputLabel>
                  <SelectInput
                    name="parallel"
                    value={formData.parallel}
                    onChange={handleChange}
                    className="block w-full p-3 text-xs tracking-tighter border rounded-md"
                  >
                    <option value="" disabled>
                      Seleccionar Paralelo
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </SelectInput>
                  <InputError message={errors.parallel?.[0]} />
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
                  <InputLabel htmlFor="teacher_id">Docente</InputLabel>
                  <Select
                    options={teacherOptions}
                    onChange={handleTeacherChange}
                    value={teacherOptions.find(
                      (option) => option.value === Number(formData.teacher_id)
                    )}
                    isSearchable
                    placeholder="Buscar docente"
                    className="w-full text-sm tracking-normal"
                  />
                  <InputError message={errors.teacher_id?.[0]} />
                </div>

                <div className="flex flex-col">
                  <InputLabel htmlFor="modality_id">Modalidad</InputLabel>
                  <Select
                    options={modalityOptions}
                    onChange={handleModalityChange}
                    value={modalityOptions.find(
                      (option) => option.value === Number(formData.modality_id)
                    )}
                    placeholder="Seleccionar Modalidad"
                    className="w-full text-sm tracking-normal"
                  />
                  <InputError message={errors.modality_id?.[0]} />
                </div>

                <div className="flex flex-col">
                  <InputLabel htmlFor="cost">Costo</InputLabel>
                  <TextInput
                    type="number"
                    name="cost"
                    placeholder="Costo del Curso"
                    value={formData.cost}
                    onChange={handleChange}
                  />
                  <InputError message={errors.cost?.[0]} />
                </div>
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
                  className="w-full p-3 rounded-sm text-sm tracking-normal border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
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
                  className="w-full p-3 rounded-sm text-sm tracking-normal border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  required
                />
                <InputError message={errors.end_date?.[0]} />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <BackButton onClick={goBackToCourses}>Volver</BackButton>
                <SubmitButton type="submit">Actualizar</SubmitButton>
              </div>
            </form>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default EditCourse;

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import InputError from "../../components/InputError";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";

registerLocale("es", es);

const EditTeacher = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    last_name: "",
    second_last_name: "",
    name: "",
    dateofbirth: "",
    placeofbirth: "",
    ci: "",
    phone: "",
    gender: "",
    specialty: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/teachers/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          last_name: data.last_name || "",
          second_last_name: data.second_last_name || "",
          name: data.name || "",
          ci: data.ci || "",
          dateofbirth: data.dateofbirth
            ? new Date(data.dateofbirth).toISOString().split("T")[0]
            : "",
          placeofbirth: data.placeofbirth || "",
          phone: data.phone || "",
          gender: data.gender || "",
          specialty: data.specialty || "",
        });
        setSelectedDate(data.dateofbirth ? new Date(data.dateofbirth) : null);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setErrors({ dateofbirth: ["La fecha de nacimiento es obligatoria"] });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/teachers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          dateofbirth: selectedDate.toISOString(),
        }),
      });
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/teachers", {
        state: {
          message: "Datos del docente actualizados con éxito",
          color: "green",
        },
      });
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            Editar Docente
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col">
                <InputLabel htmlFor="name">Nombres</InputLabel>
                <TextInput
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="last_name">Apellido Paterno</InputLabel>
                <TextInput
                  type="text"
                  name="last_name"
                  placeholder="Apellido Paterno"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.last_name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="second_last_name">
                  Apellido Materno
                </InputLabel>
                <TextInput
                  type="text"
                  name="second_last_name"
                  placeholder="Apellido Materno"
                  value={formData.second_last_name}
                  onChange={handleChange}
                />
                <InputError message={errors.second_last_name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="ci">Cédula de Identidad (CI)</InputLabel>
                <TextInput
                  type="text"
                  name="ci"
                  placeholder="Cédula de Identidad"
                  value={formData.ci}
                  onChange={handleChange}
                  className="w-full p-3"
                />
                <InputError message={errors.ci?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="dateofbirth">
                  Fecha de Nacimiento
                </InputLabel>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  locale="es"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Ingresar fecha"
                  maxDate={new Date()}
                  className="w-full p-2 text-xs tracking-tighter"
                  required
                />
                <InputError message={errors.dateofbirth?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="placeofbirth">
                  Lugar de Nacimiento
                </InputLabel>
                <SelectInput
                  name="placeofbirth"
                  value={formData.placeofbirth}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Seleccionar Departamento
                  </option>
                  <option value="LA PAZ">La Paz</option>
                  <option value="COCHABAMBA">Cochabamba</option>
                  <option value="SANTA CRUZ">Santa Cruz</option>
                  <option value="ORURO">Oruro</option>
                  <option value="POTOSI">Potosí</option>
                  <option value="SUCRE">Sucre</option>
                  <option value="TARIJA">Tarija</option>
                  <option value="BENI">Beni</option>
                  <option value="PANDO">Pando</option>
                </SelectInput>
                <InputError message={errors.placeofbirth?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="phone">Teléfono</InputLabel>
                <TextInput
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.phone?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="gender">Género</InputLabel>
                <SelectInput
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Seleccionar Género
                  </option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </SelectInput>
                <InputError message={errors.gender?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="specialty">Especialidad</InputLabel>
                <TextInput
                  type="text"
                  name="specialty"
                  placeholder="Especialidad"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.specialty?.[0]} />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <SubmitButton type="submit">Actualizar</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeacher;

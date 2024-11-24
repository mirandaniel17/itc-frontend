import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import BackButton from "../../components/BackButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import InputError from "../../components/InputError";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import Layout from "../../components/Layout";
registerLocale("es", es);

const CreateTeacher = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    second_last_name: "",
    ci: "",
    phone: "",
    gender: "",
    specialty: "",
    dateofbirth: "",
    placeofbirth: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ["phone", "ci"]; // Campos que solo aceptan números
    const textFields = ["name", "last_name", "second_last_name"]; // Campos que no aceptan números

    if (numericFields.includes(name)) {
      const numericRegex = /^[0-9]*$/;
      if (!numericRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: ["Este campo solo debe contener números."],
        }));
        return;
      } else {
        setErrors((prevErrors) => {
          const { [name]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    if (textFields.includes(name)) {
      const textRegex = /^[a-zA-ZÀ-ÿ\s]*$/; // Permite letras, tildes y espacios
      if (!textRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: [
            "Este campo no debe contener números ni caracteres especiales, excepto tildes.",
          ],
        }));
        return;
      } else {
        setErrors((prevErrors) => {
          const { [name]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setErrors({ dateofbirth: ["La fecha de nacimiento es obligatoria"] });
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        data.append(key, formData[key as keyof typeof formData] as string);
      }
    }

    if (selectedDate) {
      data.append("dateofbirth", selectedDate.toISOString());
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/teachers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: data,
      });
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/teachers", {
        state: { message: "Docente registrado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al registrar al docente:", error);
    }
  };

  const goBackToTeachers = () => {
    navigate("/teachers");
  };

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            FORMULARIO DE REGISTRO DE DOCENTE
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col">
                <InputLabel htmlFor="name">Nombres</InputLabel>
                <TextInput
                  type="text"
                  name="name"
                  placeholder="Nombres"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3"
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
                  className="w-full p-3"
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
                  className="w-full p-3"
                  required
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
                  required
                />
                <InputError message={errors.ci?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="phone">Teléfono</InputLabel>
                <TextInput
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3"
                  required
                />
                <InputError message={errors.phone?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="placeofbirth">
                  Lugar de Nacimiento
                </InputLabel>
                <SelectInput
                  name="placeofbirth"
                  value={formData.placeofbirth}
                  onChange={handleChange}
                  className="w-full p-3"
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
                <InputLabel htmlFor="dateofbirth">
                  Fecha de Nacimiento
                </InputLabel>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  locale="es"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Ingresar fecha"
                  maxDate={new Date()}
                  className="w-full p-3 rounded-sm text-sm tracking-normal border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  required
                />
                <InputError message={errors.dateofbirth?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="specialty">Especialidad</InputLabel>
                <TextInput
                  type="text"
                  name="specialty"
                  placeholder="Especialidad"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full p-3"
                />
                <InputError message={errors.specialty?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="gender">Género</InputLabel>
                <SelectInput
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3"
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
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <BackButton onClick={goBackToTeachers}>Volver</BackButton>
              <SubmitButton type="submit">Guardar</SubmitButton>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default CreateTeacher;

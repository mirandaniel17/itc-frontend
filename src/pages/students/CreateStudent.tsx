import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
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

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    second_last_name: "",
    ci: "",
    dateofbirth: "",
    placeofbirth: "",
    phone: "",
    gender: "",
    status: true,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageName, setImageName] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
      setPreviewImage(URL.createObjectURL(file));
      setIsUploading(true);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageName("");
    setPreviewImage(null);
    setUploadProgress(0);
    setIsUploading(false);
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
    if (image) {
      data.append("image", image);
    }
    if (selectedDate) {
      data.append("dateofbirth", selectedDate.toISOString());
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/students", {
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
      navigate("/students", {
        state: { message: "Estudiante registrado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al registrar al estudiante:", error);
    }
  };

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            FORMULARIO DE REGISTRO DE ESTUDIANTE
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
                  className="w-full p-3 text-xs tracking-tighter"
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

              <div className="flex flex-col">
                <InputLabel htmlFor="image">
                  Fotografía del Estudiante
                </InputLabel>
                <input
                  type="file"
                  id="image-upload"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImage && (
                  <div className="relative mt-3">
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Vista previa"
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                        style={{ maxHeight: "300px" }}
                      />
                      {isUploading && (
                        <div
                          className="absolute bottom-0 left-0 h-2 bg-green-500"
                          style={{
                            width: `${uploadProgress}%`,
                            transition: "width 0.3s ease",
                          }}
                        ></div>
                      )}
                      {uploadProgress === 100 && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                          <p className="text-lg font-bold shadow-lg">
                            Imagen subida exitosamente
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition-all duration-200"
                      onClick={handleRemoveImage}
                    >
                      <i className="mdi mdi-close"></i>
                    </button>
                  </div>
                )}
                {imageName && <p className="mt-2">{imageName}</p>}
                <InputError message={errors.image?.[0]} />
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

export default CreateStudent;

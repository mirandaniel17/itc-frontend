import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    second_last_name: "",
    ci: "",
    program_type: "",
    school_cycle: "",
    shift: "",
    parallel: "",
    dateofbirth: "",
    placeofbirth: "",
    phone: "",
    gender: "",
    status: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        data.append(key, formData[key as keyof typeof formData] as string);
      }
    }
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/students", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/students");
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <Navbar />
      <div className="p-6 sm:ml-64 flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Crear Estudiante
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Nombres
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombres"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="last_name"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Apellido Paterno
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Apellido Paterno"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="second_last_name"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="second_last_name"
                  placeholder="Apellido Materno"
                  value={formData.second_last_name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="ci"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Cédula de Identidad (CI)
                </label>
                <input
                  type="text"
                  name="ci"
                  placeholder="Cédula de Identidad"
                  value={formData.ci}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="program_type"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Tipo de Programa
                </label>
                <select
                  name="program_type"
                  value={formData.program_type}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="" disabled>
                    Seleccionar Tipo de Programa
                  </option>
                  <option value="MODULAR">Modular</option>
                  <option value="CARRERA">Carrera</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="school_cycle"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Ciclo Escolar
                </label>
                <input
                  type="text"
                  name="school_cycle"
                  placeholder="Ciclo Escolar"
                  value={formData.school_cycle}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="shift"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Turno
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="" disabled>
                    Seleccionar Turno
                  </option>
                  <option value="MAÑANA">Mañana</option>
                  <option value="TARDE">Tarde</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="parallel"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Paralelo
                </label>
                <input
                  type="text"
                  name="parallel"
                  placeholder="Paralelo"
                  value={formData.parallel}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="dateofbirth"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="dateofbirth"
                  value={formData.dateofbirth}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="placeofbirth"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Lugar de Nacimiento
                </label>
                <select
                  name="placeofbirth"
                  value={formData.placeofbirth}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
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
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="gender"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="" disabled>
                    Seleccionar Género
                  </option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="image"
                  className="block mb-1 text-xs font-medium text-gray-700"
                >
                  Fotografía del Estudiante
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              {previewImage && (
                <div className="flex flex-col">
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Vista Previa
                  </label>
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    className="w-52 h-auto border rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition-all"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;

import React, { useState, useEffect } from "react";

interface StudentFormProps {
  onSubmit: (formData: any) => void;
  initialData?: any; // Si está presente, estamos en modo edición
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData }) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    first_name: "",
    second_name: "",
    last_name: "",
    second_last_name: "",
    dateofbirth: "",
    placeofbirth: "",
    phone: "",
    gender: "",
  });

  useEffect(() => {
    if (initialData) {
      // Si tenemos datos iniciales, rellenamos el formulario con ellos
      setFormData({
        first_name: initialData.first_name || "",
        second_name: initialData.second_name || "",
        last_name: initialData.last_name || "",
        second_last_name: initialData.second_last_name || "",
        dateofbirth: initialData.dateofbirth
          ? new Date(initialData.dateofbirth).toISOString().split("T")[0]
          : "",
        placeofbirth: initialData.placeofbirth || "",
        phone: initialData.phone || "",
        gender: initialData.gender || "",
        name: "", // Campos vacíos, no utilizados en edición
        email: "", // Campos vacíos, no utilizados en edición
        password: "", // Campos vacíos, no utilizados en edición
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-5 p-2 md:grid-cols-1">
        {/* Campos para el modo de creación */}
        {!initialData && (
          <>
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nombre de Usuario"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                required={!initialData}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                required={!initialData}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                required={!initialData}
              />
            </div>
          </>
        )}

        {/* Campos comunes para creación y edición */}
        <div className="flex flex-col">
          <label
            htmlFor="first_name"
            className="block mb-1 text-xs font-medium text-gray-700"
          >
            Primer Nombre
          </label>
          <input
            type="text"
            name="first_name"
            placeholder="Primer Nombre"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="second_name"
            className="block mb-1 text-xs font-medium text-gray-700"
          >
            Segundo Nombre
          </label>
          <input
            type="text"
            name="second_name"
            placeholder="Segundo Nombre"
            value={formData.second_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
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
            htmlFor="dateofbirth"
            className="block mb-1 text-xs font-medium text-gray-700"
          >
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="dateofbirth"
            placeholder="Fecha de Nacimiento"
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
          <input
            type="text"
            name="placeofbirth"
            placeholder="Lugar de Nacimiento"
            value={formData.placeofbirth}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
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
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="gender"
            className="block mb-1 text-xs font-medium text-gray-700"
          >
            Género
          </label>
          <input
            type="text"
            name="gender"
            placeholder="Género"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm text-center me-2 mb-4"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default StudentForm;

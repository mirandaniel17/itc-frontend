import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";

const CreateModality = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration_in_months: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/modalities", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/modalities", {
        state: { message: "Modalidad registrada con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al registrar la modalidad:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            Formulario de Registro de Modalidad
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
              <div className="flex flex-col">
                <InputLabel htmlFor="name">Nombre de la Modalidad</InputLabel>
                <TextInput
                  type="text"
                  name="name"
                  placeholder="Nombre de la Modalidad"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3"
                  required
                />
                <InputError message={errors.name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="duration_in_months">
                  Duración (Meses)
                </InputLabel>
                <TextInput
                  type="number"
                  name="duration_in_months"
                  placeholder="Duración en Meses"
                  value={formData.duration_in_months}
                  onChange={handleChange}
                  className="w-full p-3"
                  required
                />
                <InputError message={errors.duration_in_months?.[0]} />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <SubmitButton type="submit">Guardar</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModality;

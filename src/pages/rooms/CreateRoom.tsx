import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import BackButton from "../../components/BackButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Layout from "../../components/Layout";

const CreateRoom = () => {
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/rooms", {
        state: { message: "Aula creada exitosamente", color: "green" },
      });
    } catch (error) {
      console.error("Error al crear el aula:", error);
    }
  };

  const goBackToRooms = () => {
    navigate("/rooms");
  };

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            FORMULARIO DE CREACIÓN DE AULA
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <InputLabel htmlFor="name">Nombre del Aula</InputLabel>
              <TextInput
                type="text"
                name="name"
                placeholder="Nombre del Aula"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3"
                required
              />
              <InputError message={errors.name?.[0]} />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <BackButton onClick={goBackToRooms}>Volver</BackButton>
              <SubmitButton type="submit">Guardar</SubmitButton>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default CreateRoom;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Layout from "../../components/Layout";

const EditRoom = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/api/rooms/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({ name: data.name });
      } catch (error) {
        console.error("Error al obtener los datos de la sala:", error);
      }
    };

    fetchRoom();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/rooms", {
        state: { message: "Sala actualizada exitosamente", color: "green" },
      });
    } catch (error) {
      console.error("Error al actualizar la sala:", error);
    }
  };

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            EDITAR SALA
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <InputLabel htmlFor="name">Nombre de la Sala</InputLabel>
              <TextInput
                type="text"
                name="name"
                placeholder="Nombre de la Sala"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3"
                required
              />
              <InputError message={errors.name?.[0]} />
            </div>

            <div className="flex justify-end mt-4">
              <SubmitButton type="submit">Guardar Cambios</SubmitButton>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default EditRoom;

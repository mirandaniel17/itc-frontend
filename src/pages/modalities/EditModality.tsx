import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";

const EditModality = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    duration_in_months: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModality = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/modalities/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          name: data.name || "",
          duration_in_months: data.duration_in_months || "",
        });
      } catch (error) {
        console.error("Error fetching modality:", error);
      }
    };
    fetchModality();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/modalities/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/modalities", {
        state: {
          message: "Modalidad actualizada con éxito",
          color: "green",
        },
      });
    } catch (error) {
      console.error("Error updating modality:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            Editar Modalidad
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Campo de nombre de la modalidad */}
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

              {/* Campo de duración en meses */}
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
              <SubmitButton type="submit">Actualizar</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModality;

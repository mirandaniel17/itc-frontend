import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import BackButton from "../../components/BackButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Skeleton from "react-loading-skeleton";
import Layout from "../../components/Layout";

const EditDiscount = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/discounts/${id}`,
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
          name: data.name || "",
          percentage: data.percentage || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discount:", error);
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/discounts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/discounts", {
        state: { message: "Descuento actualizado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al actualizar el descuento:", error);
    }
  };
  const goBackToRooms = () => {
    navigate("/discounts");
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
          Editar Descuento
        </h2>
        {loading ? (
          <Skeleton height={40} count={8} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col">
                <InputLabel htmlFor="name">Nombre del Descuento</InputLabel>
                <TextInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="percentage">Porcentaje (%)</InputLabel>
                <TextInput
                  type="number"
                  name="percentage"
                  step="0.01"
                  value={formData.percentage}
                  onChange={handleChange}
                  required
                />
                <InputError message={errors.percentage?.[0]} />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <BackButton onClick={goBackToRooms}>Volver</BackButton>
              <SubmitButton type="submit">Actualizar</SubmitButton>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default EditDiscount;

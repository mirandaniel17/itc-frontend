import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import BackButton from "../../components/BackButton";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Select from "react-select";
import { Room } from "../../types/room";

const CreateShift = () => {
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    room_id: "",
  });

  const [rooms, setRooms] = useState<{ value: string; label: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();
  const goBackToRooms = () => {
    navigate("/shifts");
  };

  useEffect(() => {
    const fetchAllRooms = async () => {
      const token = localStorage.getItem("token");
      let allRooms: Room[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await fetch(
            `http://127.0.0.1:8000/api/rooms?page=${currentPage}&per_page=100`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) throw new Error("Error al obtener las aulas");

          const data = await response.json();
          allRooms = [...allRooms, ...data.data];
          totalPages = data.last_page;
          currentPage++;
        }

        setRooms(
          allRooms.map((room) => ({
            value: room.id.toString(),
            label: room.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchAllRooms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData({
      ...formData,
      room_id: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/shifts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error("Error al guardar el turno");
      }

      navigate("/shifts", {
        state: { message: "Turno creado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al crear el turno:", error);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
          FORMULARIO DE REGISTRO DE TURNOS
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col">
              <InputLabel htmlFor="name">Nombre del Turno</InputLabel>
              <TextInput
                type="text"
                name="name"
                placeholder="Nombre del Turno"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputError message={errors.name?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="room_id">Aula</InputLabel>
              <Select
                options={rooms}
                onChange={handleSelectChange}
                placeholder="Seleccionar Aula"
                isSearchable
                className="w-full text-sm tracking-normal"
              />
              <InputError message={errors.room_id?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="start_time">Hora de Inicio</InputLabel>
              <TextInput
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
              <InputError message={errors.start_time?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="end_time">Hora de Finalización</InputLabel>
              <TextInput
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
              <InputError message={errors.end_time?.[0]} />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <BackButton onClick={goBackToRooms}>Volver</BackButton>
            <SubmitButton type="submit">Guardar</SubmitButton>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateShift;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import InputError from "../../components/InputError";
import Layout from "../../components/Layout";
import { Room } from "../../types/room";

const CreateShift = () => {
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    room_id: "",
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/rooms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRooms(data.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/shifts", {
        state: { message: "Turno creado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al crear el turno:", error);
    }
  };

  return (
    <div>
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
                  className="w-full p-3"
                  required
                />
                <InputError message={errors.name?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="room_id">Sala</InputLabel>
                <SelectInput
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  className="w-full p-3"
                  required
                >
                  <option value="" disabled>
                    Seleccionar Sala
                  </option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.room_id?.[0]} />
              </div>

              <div className="flex flex-col">
                <InputLabel htmlFor="start_time">Hora de Inicio</InputLabel>
                <TextInput
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full p-3"
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
                  className="w-full p-3"
                  required
                />
                <InputError message={errors.end_time?.[0]} />
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

export default CreateShift;

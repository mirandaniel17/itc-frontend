import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import SelectInput from "../../components/SelectInput";
import InputError from "../../components/InputError";
import Skeleton from "react-loading-skeleton";
import Layout from "../../components/Layout";
import { Room } from "../../types/room"; // Asegúrate de importar Room

const EditShift = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    room_id: "",
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const goBackToRooms = () => {
    navigate("/shifts");
  };
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchShiftAndRooms = async () => {
      try {
        const token = localStorage.getItem("token");

        const shiftResponse = await fetch(
          `${API_URL}/shifts/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!shiftResponse.ok) {
          throw new Error(`HTTP error! status: ${shiftResponse.status}`);
        }

        const shiftData = await shiftResponse.json();

        let allRooms: Room[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const roomResponse = await fetch(
            `${API_URL}/rooms?page=${currentPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!roomResponse.ok) {
            throw new Error(`HTTP error! status: ${roomResponse.status}`);
          }

          const roomData = await roomResponse.json();
          allRooms = [...allRooms, ...roomData.data];
          totalPages = roomData.last_page;
          currentPage++;
        }

        setFormData({
          name: shiftData.name || "",
          start_time: shiftData.start_time || "",
          end_time: shiftData.end_time || "",
          room_id: shiftData.room_id || "",
        });

        setRooms(allRooms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shift and rooms:", error);
        setLoading(false);
      }
    };

    fetchShiftAndRooms();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/shifts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/shifts", {
        state: { message: "Turno actualizado con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
          Editar Turno
        </h2>
        {loading ? (
          <Skeleton height={40} count={8} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col">
                <InputLabel htmlFor="name">Nombre del Turno</InputLabel>
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
                <InputLabel htmlFor="room_id">Aula</InputLabel>
                <SelectInput
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Seleccionar Aula
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
              <SubmitButton type="submit">Actualizar</SubmitButton>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default EditShift;

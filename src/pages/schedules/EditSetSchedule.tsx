import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import SelectInput from "../../components/SelectInput";
import SubmitButton from "../../components/SubmitButton";
import Alert from "../../components/Alert";

const EditSetSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shift_id: "",
  });
  const [shifts, setShifts] = useState<
    { id: string; name: string; start_time: string; end_time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("green");

  useEffect(() => {
    const fetchScheduleData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [scheduleRes, shiftsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/schedules/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://127.0.0.1:8000/api/shifts", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!scheduleRes.ok || !shiftsRes.ok) {
          throw new Error("Error al cargar los datos");
        }

        const scheduleData = await scheduleRes.json();
        const shiftsData = await shiftsRes.json();

        setFormData({
          shift_id: scheduleData.shift_id || "",
        });

        setShifts(shiftsData.data);
      } catch (error) {
        setAlertMessage("Error al cargar los datos");
        setAlertColor("red");
        setShowAlert(true);
      } finally {
        setLoading(false);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };

    fetchScheduleData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/schedules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar el horario");

      setAlertMessage("Horario actualizado correctamente");
      setAlertColor("green");
      setShowAlert(true);
      setTimeout(() => navigate("/schedules"), 3000);
    } catch {
      setAlertMessage("Error al actualizar el horario");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

  return (
    <Layout>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Horario</h2>
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Turno</label>
              <SelectInput
                value={formData.shift_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shift_id: e.target.value,
                  }))
                }
              >
                <option value="">Selecciona un turno</option>
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({shift.start_time} - {shift.end_time})
                  </option>
                ))}
              </SelectInput>
            </div>
            <SubmitButton type="submit">Actualizar</SubmitButton>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default EditSetSchedule;

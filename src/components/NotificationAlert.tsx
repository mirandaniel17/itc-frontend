import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotificationAlert = () => {
  const [latestNotification, setLatestNotification] = useState<any | null>(
    null
  );
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
        }
        throw new Error("Error fetching notifications");
      }

      const data = await response.json();

      if (data.length > 0) {
        setLatestNotification(data[0]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(
        `http://localhost:8000/api/notifications/${id}/mark-as-read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLatestNotification(null);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (!latestNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">Nueva Notificación</p>
          <p className="font-bold">Alerta de Faltas</p>
          <p>
            <strong>Estudiante:</strong> {latestNotification.data.student_name}
          </p>
          <small>
            {new Date(latestNotification.created_at).toLocaleString()}
          </small>
        </div>
        <button
          onClick={() => markAsRead(latestNotification.id)}
          className="text-gray-500 hover:text-gray-800 focus:outline-none ml-2"
        >
          <span className="mdi mdi-check"></span>
        </button>
      </div>
    </div>
  );
};

export default NotificationAlert;

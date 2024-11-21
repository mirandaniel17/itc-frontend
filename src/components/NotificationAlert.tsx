import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotificationAlert = () => {
  const [latestNotification, setLatestNotification] = useState<any | null>(
    null
  );
  const [previousNotificationId, setPreviousNotificationId] = useState<
    string | null
  >(null);
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

      if (data.length > 0 && data[0].id !== previousNotificationId) {
        setLatestNotification(data[0]);
        setPreviousNotificationId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [previousNotificationId, navigate]);

  if (!latestNotification) return null;

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

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg p-6 border border-gray-200 z-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-bold">Nueva Notificación</h1>
          {latestNotification.data.course_name ? (
            <>
              <p className="font-bold">Finalización del Curso</p>
              <p>
                <strong>Curso:</strong> {latestNotification.data.course_name}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold">Alerta de Faltas</p>
              <p>
                <strong>Estudiante:</strong>{" "}
                {latestNotification.data.student_name}
              </p>
            </>
          )}
          <small>
            {new Date(latestNotification.created_at).toLocaleString()}
          </small>
        </div>
        <button
          onClick={() => markAsRead(latestNotification.id)}
          className="text-gray-500 hover:text-gray-800 focus:outline-none ml-2"
        >
          <p className="ms-2 text-blue-700 font-bold underline">
            NO VOLVER A MOSTRAR
          </p>
        </button>
      </div>
    </div>
  );
};

export default NotificationAlert;

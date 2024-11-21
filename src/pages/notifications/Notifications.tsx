import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/notifications/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
        }
        throw new Error("Error fetching notifications");
      }

      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
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

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date() } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
        {loading ? (
          <Skeleton count={5} height={50} />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="border-b py-4">
              <h3 className="text-2xl font-bold">Alerta de Falta</h3>
              <div
                className={`${
                  notification.read_at ? "text-gray-500" : "font-bold"
                }`}
              >
                <p>
                  <strong>Estudiante:</strong> {notification.data.student_name}
                </p>
                <p>
                  <strong>Faltas acumuladas:</strong>{" "}
                  {notification.data.absence_count}
                </p>
                <div className="flex justify-between mt-2">
                  <small>
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                  <div className="space-x-2">
                    {!notification.read_at && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Marcar como leído
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay notificaciones.</p>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;

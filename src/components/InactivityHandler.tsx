import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const InactivityHandler = ({ logout }: { logout: () => void }) => {
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

  const resetTimer = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    setShowWarning(false);
    startInactivityTimer();
  };

  const startInactivityTimer = () => {
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      logoutTimer.current = setTimeout(logoutUser, 45000); // 45 segundos para cerrar sesión
    }, 300000); // 5 minutos de inactividad
  };

  useEffect(() => {
    startInactivityTimer();

    const activityEvents = ["click", "keypress", "scroll", "mousemove"];
    const handleActivity = resetTimer;

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);

  return (
    <>
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              Has estado inactivo durante 5 minutos. ¿Deseas continuar?
            </p>
            <button
              onClick={resetTimer}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 tracking-tight text-sm"
            >
              Deseo continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InactivityHandler;

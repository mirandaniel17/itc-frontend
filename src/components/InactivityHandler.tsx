import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InactivityHandler = ({ logout }: { logout: () => void }) => {
  const [isInactive, setIsInactive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isWarningActive, setIsWarningActive] = useState(false);
  const navigate = useNavigate();

  const logoutUser = () => {
    setIsInactive(true);
    logout();
    navigate("/login");
  };

  const resetTimer = () => {
    if (!isWarningActive) {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      startInactivityTimer();
    } else {
      setShowWarning(false);
      setIsWarningActive(false);
    }
  };

  let warningTimer: ReturnType<typeof setTimeout>;
  let logoutTimer: ReturnType<typeof setTimeout>;

  const startInactivityTimer = () => {
    // 5 minutos de inactividad
    warningTimer = setTimeout(() => {
      setShowWarning(true);
      setIsWarningActive(true);
      // 45 segundos para responder antes de cerrar sesión
      logoutTimer = setTimeout(logoutUser, 45000);
    }, 300000); // 5 minutos
  };

  useEffect(() => {
    startInactivityTimer();

    const activityEvents = ["mousemove", "keydown", "click"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
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

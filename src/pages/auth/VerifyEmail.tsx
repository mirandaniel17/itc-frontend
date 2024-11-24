import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Alert from "../../components/Alert";

const VerifyEmail = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id, hash } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/email/verify/${id}/${hash}`, {
          method: "GET",
        });

        if (response.ok) {
          setVerificationStatus("Correo verificado exitosamente.");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setVerificationStatus(
            "El enlace de verificación no es válido o ha expirado."
          );
        }
      } catch (error) {
        setVerificationStatus("Error al verificar el correo.");
      }
    };

    verifyEmail();
  }, [id, hash, navigate]);

  return (
    <div>
      {verificationStatus ? (
        <Alert
          message={verificationStatus}
          color={verificationStatus.includes("exitosamente") ? "green" : "red"}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default VerifyEmail;

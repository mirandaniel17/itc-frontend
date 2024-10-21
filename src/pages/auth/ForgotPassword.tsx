import { useState, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthFormContainer from "../../components/AuthFormContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import Alert from "../../components/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setAlertMessage("");
    setAlertColor("red");

    try {
      const response = await fetch(
        "http://localhost:8000/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setAlertMessage(
          "Enlace de restablecimiento de contraseña enviado a tu correo."
        );
        setAlertColor("green");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setAlertMessage(
          "Error al enviar el correo. Verifica el email ingresado."
        );
      }
    } catch (error) {
      setAlertMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <AuthFormContainer title="Enviar Correo de Verificación">
      {alertMessage && <Alert message={alertMessage} color={alertColor} />}{" "}
      {/* Color dinámico */}
      <form onSubmit={submit}>
        <PrimaryInput
          label="Correo Electrónico"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryButton text="Enviar" type="submit" />
      </form>
    </AuthFormContainer>
  );
};

export default ForgotPassword;

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthFormContainer from "../../components/AuthFormContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import Alert from "../../components/Alert";

const ResetPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red"); // Estado para el color de la alerta
  const navigate = useNavigate();

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setAlertMessage("");
    setAlertColor("red"); // Por defecto, color rojo para errores

    try {
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (response.ok) {
        setAlertMessage("Contraseña restablecida con éxito.");
        setAlertColor("green");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const data = await response.json();
        setAlertMessage(data.message || "Error al restablecer la contraseña.");
      }
    } catch (error) {
      setAlertMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <AuthFormContainer title="Restablecer Contraseña">
      {alertMessage && <Alert message={alertMessage} color={alertColor} />}{" "}
      {/* Color dinámico */}
      <form onSubmit={submit}>
        <PrimaryInput
          label="Correo Electrónico"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryInput
          label="Nueva Contraseña"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryInput
          label="Confirmar Contraseña"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <PrimaryButton text="Restablecer Contraseña" type="submit" />
      </form>
    </AuthFormContainer>
  );
};

export default ResetPassword;

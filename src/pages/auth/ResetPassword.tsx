import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";

const ResetPassword = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState<
    "red" | "green" | "blue" | "yellow"
  >("red");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/reset-password/email/${token}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el correo electrónico.");
        }
        return response.json();
      })
      .then((data) => {
        setEmail(data.email);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertColor("red");
      });
  }, [token]);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setAlertMessage("");
    setErrors({});

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
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setAlertMessage(
            data.message || "Error al restablecer la contraseña."
          );
        }
      }
    } catch (error) {
      setAlertMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <AuthContainer title="Restablecer Contraseña">
      {alertMessage && <Alert message={alertMessage} color={alertColor} />}
      <form onSubmit={submit}>
        <PrimaryInput
          label="Correo Electrónico"
          type="email"
          value={email}
          readOnly
          placeholder="Ingresa tu correo electrónico"
        />
        <InputError message={errors.email?.[0]} />

        <PrimaryInput
          label="Nueva Contraseña"
          type="password"
          value={password}
          placeholder="Ingresa tu nueva contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputError message={errors.password?.[0]} />

        <PrimaryInput
          label="Confirmar Contraseña"
          type="password"
          value={passwordConfirmation}
          placeholder="Confirma tu nueva contraseña"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <InputError message={errors.password_confirmation?.[0]} />

        <PrimaryButton text="RESTABLECER CONTRASEÑA" type="submit" />
      </form>
    </AuthContainer>
  );
};

export default ResetPassword;

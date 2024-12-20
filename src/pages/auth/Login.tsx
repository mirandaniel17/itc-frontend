import { SyntheticEvent, useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import AuthFormContainer from "../../components/AuthFormContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [verifiedMessage, setVerifiedMessage] = useState<string | null>(null);

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "1") {
      setVerifiedMessage(
        "Correo verificado exitosamente. Ahora puedes iniciar sesión."
      );
    }
  }, [searchParams]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAlertMessage("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        navigate("/home", { replace: true });
      } else {
        const data = await response.json();
        setAlertMessage(data.message || "Error de autenticación.");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    } catch (error) {
      setAlertMessage("Error de conexión con el servidor.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  return (
    <AuthFormContainer title="Iniciar Sesión">
      {verifiedMessage && <Alert message={verifiedMessage} color="green" />}{" "}
      {alertMessage && <Alert message={alertMessage} color="red" />}{" "}
      <form onSubmit={submit} className="mt-8 space-y-4">
        <PrimaryInput
          label="Correo Electrónico"
          type="email"
          placeholder="Ingresar Correo Electrónico"
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryInput
          label="Contraseña"
          type="password"
          placeholder="Ingresar Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputError message={errorMessage} />
        <div className="flex items-center justify-between">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <PrimaryButton text="INGRESAR" type="submit" />
        <p className="text-sm font-light text-gray-500">
          ¿No te registraste?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:underline"
          >
            Registrarse
          </Link>
        </p>
      </form>
    </AuthFormContainer>
  );
};

export default Login;

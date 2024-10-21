import AuthFormContainer from "../../components/AuthFormContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { SyntheticEvent, useState } from "react";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrors({});

    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (response.ok) {
      setSuccessMessage(
        "Registro exitoso. Por favor, verifica tu correo electrónico."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  return (
    <div>
      <AuthFormContainer title="Registrarse">
        {successMessage && <Alert message={successMessage} color="green" />}
        <form onSubmit={submit} className="space-y-4 md:space-y-6 mt-2">
          <PrimaryInput
            label="Usuario"
            type="text"
            placeholder="Ingresar Nombre de Usuario"
            onChange={(e) => setName(e.target.value)}
          />
          <InputError message={errors?.name?.[0] || ""} />
          <PrimaryInput
            label="Correo Electrónico"
            type="email"
            placeholder="Ingresar Correo Electrónico"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputError message={errors?.email?.[0] || ""} />
          <PrimaryInput
            label="Contraseña"
            type="password"
            placeholder="Ingresar Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputError message={errors?.password?.[0] || ""} />
          <PrimaryButton text="Registrar" type="submit" />
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            ¿Tienes acceso?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </AuthFormContainer>
    </div>
  );
};

export default Register;

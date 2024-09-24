import AuthFormContainer from "../../components/AuthFormContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { SyntheticEvent, useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
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
      navigate("/login");
    } else {
      console.log("error signing up.");
    }
  };

  return (
    <div>
      <AuthFormContainer title="Registrarse">
        <form onSubmit={submit} className="space-y-4 md:space-y-6">
          <PrimaryInput
            label="Usuario"
            type="text"
            placeholder="Ingresar Nombre de Usuario"
            onChange={(e) => setName(e.target.value)}
          />
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

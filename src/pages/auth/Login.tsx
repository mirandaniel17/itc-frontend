import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthFormContainer from "../../components/AuthFormContainer";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";
import FormLabel from "../../components/FormLabel";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      navigate("/home", { replace: true });
    }
  };

  return (
    <AuthFormContainer title="Iniciar Sesión">
      <form onSubmit={submit} className="space-y-4 md:space-y-6">
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
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <FormLabel text="Recuérdame" />
            </div>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-white hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <PrimaryButton text="Ingresar" type="submit" />
        <p className="text-sm font-light text-gray-500">
          ¿No te registraste?{" "}
          <a
            href="/register"
            className="font-medium text-primary-600 hover:underline"
          >
            Registrarse
          </a>
        </p>
      </form>
    </AuthFormContainer>
  );
};

export default Login;

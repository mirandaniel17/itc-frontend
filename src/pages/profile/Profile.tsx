import { useEffect, useState } from "react";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Layout from "../../components/Layout";
import Alert from "../../components/Alert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    roles: [],
    permissions: [],
    userAgent: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");
  const [showAlert, setShowAlert] = useState(false);

  const getDeviceIcon = () => {
    if (/Mobi|Android/i.test(userData.userAgent)) {
      return <i className="mdi mdi-cellphone text-xl" />;
    } else {
      return <i className="mdi mdi-desktop-mac text-xl" />;
    }
  };

  const getBrowserIcon = () => {
    if (userData.userAgent.includes("Chrome")) {
      return <i className="mdi mdi-google-chrome text-xl" />;
    } else if (userData.userAgent.includes("Firefox")) {
      return <i className="mdi mdi-firefox text-xl" />;
    } else if (
      userData.userAgent.includes("Safari") &&
      !userData.userAgent.includes("Chrome")
    ) {
      return <i className="mdi mdi-apple-safari text-xl" />;
    } else {
      return <i className="mdi mdi-web text-xl" />;
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        return response.json();
      })
      .then((data) => {
        setUserData({
          name: data.user.name,
          email: data.user.email,
          roles: data.roles,
          permissions: data.permissions,
          userAgent: data.userAgent,
        });
        setEditData({
          name: data.user.name,
          email: data.user.email,
          currentPassword: "",
          newPassword: "",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setAlertMessage("Error al cargar los datos del usuario.");
        setAlertColor("red");
        setShowAlert(true);
        setIsLoading(false);
        console.log(error);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editData.name,
        email: editData.email,
        currentPassword: editData.currentPassword,
        newPassword: editData.newPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || "Error al actualizar el perfil");
          });
        }
        return response.json();
      })
      .then((data) => {
        setUserData((prevData) => ({
          ...prevData,
          name: data.user.name,
          email: data.user.email,
        }));
        setAlertMessage("Perfil actualizado con éxito.");
        setAlertColor("green");
        setShowAlert(true);
        setIsEditing(false);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertColor("red");
        setShowAlert(true);
      });
  };

  return (
    <div>
      <Layout>
        {showAlert && <Alert message={alertMessage} color={alertColor} />}
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            {!isEditing ? (
              <div>
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Información del Perfil
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Detalles e información del usuario.
                  </p>
                </div>
                <div>
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Nombre de Usuario
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                        {isLoading ? <Skeleton width={200} /> : userData.name}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Correo Electrónico
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                        {isLoading ? <Skeleton width={250} /> : userData.email}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Roles
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                        {isLoading ? (
                          <Skeleton width={300} />
                        ) : (
                          userData.roles.join(", ")
                        )}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Permisos
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                        {isLoading ? (
                          <Skeleton width={300} />
                        ) : (
                          userData.permissions.join(", ")
                        )}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Dispositivo/Navegador
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                        {isLoading ? (
                          <Skeleton width={200} />
                        ) : (
                          <>
                            {getDeviceIcon()} {getBrowserIcon()}{" "}
                            {userData.userAgent}
                          </>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
                  <button
                    onClick={handleEdit}
                    className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <InputLabel htmlFor="name" value="Nombre de Usuario" />
                <TextInput
                  name="name"
                  className="block w-full"
                  value={editData.name}
                  onChange={handleInputChange}
                  required
                />
                <InputError />

                <InputLabel htmlFor="email" value="Correo Electrónico" />
                <TextInput
                  name="email"
                  className="block w-full"
                  value={editData.email}
                  onChange={handleInputChange}
                  required
                />
                <InputError />

                <InputLabel
                  htmlFor="currentPassword"
                  value="Contraseña Actual"
                />
                <TextInput
                  name="currentPassword"
                  type="password"
                  className="block w-full"
                  value={editData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
                <InputError />

                <InputLabel htmlFor="newPassword" value="Nueva Contraseña" />
                <TextInput
                  name="newPassword"
                  type="password"
                  className="block w-full"
                  value={editData.newPassword}
                  onChange={handleInputChange}
                />
                <InputError />

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-4"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Profile;

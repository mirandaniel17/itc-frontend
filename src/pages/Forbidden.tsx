import React from "react";

const Forbidden: React.FC = () => {
  return (
    <div className="text-center mt-5">
      <h1>403 - Acceso Denegado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
    </div>
  );
};

export default Forbidden;

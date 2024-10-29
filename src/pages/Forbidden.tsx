import React from "react";

const Forbidden: React.FC = () => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 tracking-tight font-extrabold lg:text-9xl text-sky-900 dark:text-primary-500">
              403
            </h1>
            <p className="mb-4 tracking-tight font-bold text-gray-900 md:text-6xl dark:text-white">
              Acceso Denegado
            </p>
            <p className="mb-4 text-2xl font-light text-gray-500 dark:text-gray-400">
              Lo sentimos, no tienes permiso para acceder a esta página.{" "}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Forbidden;

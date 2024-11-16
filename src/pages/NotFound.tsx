import React from "react";

const NotFound: React.FC = () => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 tracking-tight font-extrabold lg:text-9xl text-sky-900 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 tracking-tight font-bold text-gray-900 md:text-6xl dark:text-white">
              Oops...Algo salió mal
            </p>
            <p className="mb-4 text-2xlfont-light text-gray-500 dark:text-gray-400">
              Lo sentimos, no podemos encontrar esa página. Encontrarás mucho
              para explorar en la página de inicio.{" "}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;

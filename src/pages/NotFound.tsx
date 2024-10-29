import React from "react";
import { Link } from "react-router-dom";

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
              Oops...Algo salió
            </p>
            <p className="mb-4 text-2xlfont-light text-gray-500 dark:text-gray-400">
              Lo sentimos, no podemos encontrar esa página. Encontrarás mucho
              para explorar en la página de inicio.{" "}
            </p>
            <Link
              to="/"
              className="inline-flex text-white bg-sky-800 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Volver
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;

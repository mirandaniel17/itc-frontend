import { ReactNode } from "react";

interface AuthFormContainerProps {
  title: string;
  children: ReactNode;
}

const AuthFormContainer = ({ title, children }: AuthFormContainerProps) => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 mt-4">
      <div className="w-full max-w-md p-2 rounded-md space-y-4 bg-white shadow-md dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthFormContainer;

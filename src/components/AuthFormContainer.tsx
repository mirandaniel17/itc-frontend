import { ReactNode } from "react";

interface AuthFormContainerProps {
  title: string;
  children: ReactNode;
}

const AuthFormContainer = ({ title, children }: AuthFormContainerProps) => {
  return (
    <section className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <a href="javascript:void(0)">
            <img
              src="/itc_logo.png"
              alt="logo"
              className="w-32 mb-4 mx-auto block"
            />
          </a>
          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthFormContainer;

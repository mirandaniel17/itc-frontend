import { ReactNode } from "react";

interface AuthFormContainerProps {
  title: string;
  children: ReactNode;
}

const AuthFormContainer = ({ title, children }: AuthFormContainerProps) => {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      <div className="flex flex-col items-center justify-center py-6 px-4 min-h-screen">
        <div className="max-w-md w-full">
          <a href="">
            <img
              src="/itc_logo.png"
              alt="logo"
              className="w-32 mb-4 mx-auto block"
            />
          </a>
          <div className="p-8 rounded-2xl bg-white shadow-lg">
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

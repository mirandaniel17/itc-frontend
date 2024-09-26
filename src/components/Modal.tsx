import React from "react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  title,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-md shadow-lg dark:bg-gray-800 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 bg-sky-700">
          <h3 className="text-sm font-semibold text-white">{title}</h3>{" "}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="mdi mdi-close text-white"></span>
          </button>
        </div>
        <div className="mt-2 px-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

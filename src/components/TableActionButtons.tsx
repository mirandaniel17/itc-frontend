import React from "react";

interface TableActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <td className="px-6 py-4">
      <button
        type="button"
        onClick={onEdit}
        className="text-white text-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-white text-xs bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2"
      >
        Eliminar
      </button>
    </td>
  );
};

export default TableActionButtons;

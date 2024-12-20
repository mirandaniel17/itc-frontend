import React from "react";

interface TableRowProps {
  children: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return (
    <tr className="bg-white border-b uppercase dark:bg-gray-800 text-center dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      {children}
    </tr>
  );
};

export default TableRow;

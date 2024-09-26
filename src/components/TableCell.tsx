import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ children, isHeader }) => {
  return isHeader ? (
    <th
      scope="row"
      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
    >
      {children}
    </th>
  ) : (
    <td className="px-6 py-4 text-xs">{children}</td>
  );
};

export default TableCell;

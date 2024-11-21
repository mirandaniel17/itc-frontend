import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  colSpan?: number;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader,
  colSpan,
  className,
}) => {
  return isHeader ? (
    <th
      scope="row"
      className={`flex items-center px-6 py-4 text-gray-100 whitespace-nowrap dark:text-white ${
        className || ""
      }`}
      colSpan={colSpan}
    >
      {children}
    </th>
  ) : (
    <td className={`px-6 py-4 ${className || ""}`} colSpan={colSpan}>
      {children}
    </td>
  );
};

export default TableCell;

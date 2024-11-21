import React from "react";

interface TableHeadProps {
  headers: string[];
}

const TableHead: React.FC<TableHeadProps> = ({ headers }) => {
  return (
    <thead className="text-sm text-gray-700 uppercase font-bold text-center bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {headers.map((header) => (
          <th key={header} scope="col" className="px-6 py-3">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;

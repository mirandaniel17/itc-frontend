import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = parseInt(event.target.value, 10);
    if (selectedPage !== currentPage) {
      onPageChange(selectedPage);
    }
  };

  return (
    <nav
      className="flex items-center justify-between pt-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Mostrando{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {(currentPage - 1) * 10 + 1}-
          {Math.min(currentPage * 10, totalPages * 10)}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalPages * 10}
        </span>
      </span>
      <div className="relative">
        <select
          value={currentPage}
          onChange={handlePageChange}
          className="block appearance-none w-full text-sm font-bold bg-white border border-gray-300 text-gray-500 py-2 px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-blue-500"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              Página {page}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"></div>
      </div>
    </nav>
  );
};

export default Pagination;

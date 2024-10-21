import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../components/Table";
import TableHead from "../../components/TableHead";
import TableBody from "../../components/TableBody";
import TableRow from "../../components/TableRow";
import TableCell from "../../components/TableCell";
import TableActionButtons from "../../components/TableActionButtons";
import Pagination from "../../components/Pagination";
import AddButton from "../../components/AddButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import Alert from "../../components/Alert";
import { Discount } from "../../types/discount";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Layout from "../../components/Layout";

const Discounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDiscounts = async (page: number, query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/discounts?per_page=10&page=${page}&query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDiscounts(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching discounts:", error);
      setLoading(false);
    }
  };

  const debouncedFetchDiscounts = debounce((query: string, page: number) => {
    fetchDiscounts(page, query);
  }, 500);

  useEffect(() => {
    if (location.state?.message) {
      showAlertWithMessage(
        location.state.message,
        location.state.color || "blue"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchDiscounts(currentPage, searchQuery);
  }, [currentPage]);

  const handleEdit = (discount: Discount) => {
    navigate(`/discounts/edit/${discount.id}`);
    showAlertWithMessage("Descuento actualizado con éxito", "green");
  };

  const handleDeleteClick = (id: number) => {
    setDiscountToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (discountToDelete !== null) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/discounts/${discountToDelete}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setIsConfirmationModalOpen(false);
        setDiscountToDelete(null);
        fetchDiscounts(currentPage, searchQuery);
        showAlertWithMessage("Descuento eliminado con éxito", "red");
      } catch (error) {
        console.error("Error deleting discount:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmationModalOpen(false);
    setDiscountToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNew = () => {
    navigate("/discounts/create");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchDiscounts(query, 1);
  };

  const showAlertWithMessage = (message: string, color: string) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <div>
      <Layout>
        {showAlert && <Alert message={alertMessage} color={alertColor} />}
        <div className="flex justify-between items-center mb-4">
          <form>
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <span className="mdi mdi-magnify"></span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block max-w-2xl p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Buscar"
              />
            </div>
          </form>
          <AddButton label="Nuevo" onClick={handleNew} />
        </div>

        <Table>
          <TableHead headers={["Nombre", "Porcentaje", "Acciones"]} />
          <TableBody>
            {loading
              ? [...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton width={100} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={150} height={20} />
                    </TableCell>
                  </TableRow>
                ))
              : discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.percentage}%</TableCell>
                    <TableActionButtons
                      actions={[
                        {
                          label: "Editar",
                          onClick: () => handleEdit(discount),
                          className:
                            "text-white text-xs bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                        },
                        {
                          label: "Eliminar",
                          onClick: () => handleDeleteClick(discount.id),
                          className:
                            "text-white text-xs bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg px-4 py-1.5 text-center me-2 mb-2",
                        },
                      ]}
                    />
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {loading ? (
          <Skeleton width={300} height={30} />
        ) : (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Layout>

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar este descuento?"
        isVisible={isConfirmationModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Discounts;

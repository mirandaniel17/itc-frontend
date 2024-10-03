import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
const Roles = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-2 sm:ml-64">
        <Navbar />
        <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white m-4">
          <h1>Roles</h1>
        </div>
      </div>
      <h1>Roles</h1>
    </div>
  );
};

export default Roles;

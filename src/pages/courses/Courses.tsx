import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Courses = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Navbar />
        <div className="p-4 border-2 border-gray-200 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white m-2">
            
        </div>
      </div>
    </div>
  );
};

export default Courses;

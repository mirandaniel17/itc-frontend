import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white">
          <h1>Inicio</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
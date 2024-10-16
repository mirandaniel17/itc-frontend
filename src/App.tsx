import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "../src/pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import InactivityHandler from "./components/InactivityHandler";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Users from "./pages/users/Users";
import Students from "./pages/students/Students";
import CreateStudent from "./pages/students/CreateStudent";
import EditStudent from "./pages/students/EditStudent";
import Permissions from "./pages/users/Permissions";
import Roles from "./pages/users/Roles";
import UserDetail from "./pages/users/UserDetail";
import Teachers from "./pages/teachers/Teachers";
import CreateTeacher from "./pages/teachers/CreateTeacher";
import EditTeacher from "./pages/teachers/EditTeacher";
import Courses from "./pages/courses/Courses";
import Modalities from "./pages/modalities/Modalities";
import CreateModality from "./pages/modalities/CreateModality";
import EditModality from "./pages/modalities/EditModality";
import CreateCourse from "./pages/courses/CreateCourse";
import EditCourse from "./pages/courses/EditCourse";
import Profile from "./pages/profile/Profile";
import StudentProfile from "./pages/students/StudentProfile";

function App() {
  const logout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <div className="App">
      <BrowserRouter>
        <AppContent logout={logout} />
      </BrowserRouter>
    </div>
  );
}

const AppContent = ({ logout }: { logout: () => void }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <InactivityHandler logout={logout} />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId/permissions"
          element={
            <ProtectedRoute>
              <Permissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId/roles"
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/create"
          element={
            <ProtectedRoute>
              <CreateStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <ProtectedRoute>
              <EditStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/profile/:id"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/create"
          element={
            <ProtectedRoute>
              <CreateTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/edit/:id"
          element={
            <ProtectedRoute>
              <EditTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute>
              <EditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modalities"
          element={
            <ProtectedRoute>
              <Modalities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modalities/create"
          element={
            <ProtectedRoute>
              <CreateModality />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modalities/edit/:id"
          element={
            <ProtectedRoute>
              <EditModality />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;

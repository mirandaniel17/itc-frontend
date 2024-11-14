import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../src/pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import EmailRedirect from "./pages/auth/EmailRedirect";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import InactivityHandler from "./components/InactivityHandler";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Users from "./pages/users/Users";
import Students from "./pages/students/Students";
import CreateStudent from "./pages/students/CreateStudent";
import EditStudent from "./pages/students/EditStudent";
import Permissions from "./pages/users/Permissions";
import Roles from "./pages/users/Roles";
import UserDetail from "./pages/users/UserDetail";
import RolesPermissions from "./pages/users/RolesPermissions";
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
import Shifts from "./pages/shifts/Shifts";
import Discounts from "./pages/discounts/Discounts";
import CreateShift from "./pages/shifts/CreateShift";
import CreateDiscount from "./pages/discounts/CreateDiscount";
import EditShift from "./pages/shifts/EditShift";
import EditDiscount from "./pages/discounts/EditDiscount";
import Enrollments from "./pages/enrollments/Enrollments";
import CreateEnrollment from "./pages/enrollments/CreateEnrollment";
import SetSchedule from "./pages/schedules/SetSchedule";
import CreateSetSchedule from "./pages/schedules/CreateSetSchedule";
import EditSetSchedule from "./pages/schedules/EditSetSchedule";
import Attendances from "./pages/attendances/Attendances";
import Rooms from "./pages/rooms/Rooms";
import CreateRoom from "./pages/rooms/CreateRoom";
import EditRoom from "./pages/rooms/EditRoom";
import Notifications from "./pages/notifications/Notifications";
import NotificationAlert from "./components/NotificationAlert";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  const logout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticated && <NotificationAlert />}
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
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId/permissions"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <Permissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId/roles"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId/roles-permissions"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <RolesPermissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute requiredPermission="Consultar Estudiantes">
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/create"
          element={
            <ProtectedRoute requiredPermission="Consultar Estudiantes">
              <CreateStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Consultar Estudiantes">
              <EditStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/profile/:id"
          element={
            <ProtectedRoute requiredPermission="Consultar Estudiantes">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/create"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <CreateTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Gestión de Usuarios">
              <EditTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <EditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modalities"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <Modalities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modalities/create"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <CreateModality />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modalities/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
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
        <Route
          path="/shifts"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <Shifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shifts/create"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <CreateShift />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shifts/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <EditShift />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discounts"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <Discounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discounts/create"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <CreateDiscount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discounts/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <EditDiscount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enrollments"
          element={
            <ProtectedRoute requiredPermission="Inscripciones">
              <Enrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enrollments/create"
          element={
            <ProtectedRoute requiredPermission="Inscripciones">
              <CreateEnrollment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/create"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <CreateRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/edit/:id"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <EditRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <SetSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules/create"
          element={
            <ProtectedRoute>
              <CreateSetSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules/edit/:id"
          element={
            <ProtectedRoute>
              <EditSetSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendances"
          element={
            <ProtectedRoute requiredPermission="Gestión de Cursos">
              <Attendances />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email/verify/:id/:hash" element={<VerifyEmail />} />
        <Route path="/api/email/verify/:id/:hash" element={<EmailRedirect />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;

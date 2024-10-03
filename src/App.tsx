import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Users from "./pages/users/Users";
import Index from "./pages/students/Index";
import Create from "./pages/students/Create";
import Edit from "./pages/students/Edit";
import Roles from "./pages/users/Roles";
import UserDetail from "./pages/users/UserDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
            path="/users/roles"
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
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

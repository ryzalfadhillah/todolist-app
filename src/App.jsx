import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ChecklistDetailPage from "./pages/Dashboard/ChecklistDetailPage";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checklist/:id"
          element={
            <PrivateRoute>
              <ChecklistDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<LoginPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;

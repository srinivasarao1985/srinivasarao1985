import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from './context/authStore';
import Navbar from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AdminDashboard } from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  }, [token, getCurrentUser]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard accessible to all users - interactions require login */}
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessagesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <PrivateRoute>
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Default route - go to dashboard for browsing, login if needed */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;

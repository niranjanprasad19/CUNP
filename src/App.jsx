import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Placements from './pages/Placements';
import AppLayout from './layouts/AppLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // In a real app we would check auth state, but for the MVP skeleton logic:
  const { currentUser } = useAuth();
  // Note: currentUser might be null initially while loading. AuthContext handles loading state.
  // However, since we wrapped everything in AuthProvider which handles !loading, strictly checking currentUser here is safe *after* loading.
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="events" element={<Events />} />
          <Route path="placements" element={<Placements />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

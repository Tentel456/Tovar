import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

// Component to protect routes that require admin privileges
const AdminRoute = () => {
  const { currentUser, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  // Redirect to home if not authenticated or not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/products" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default AdminRoute; 
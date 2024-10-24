import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, adminRequired = false }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    const decoded = jwtDecode(token);
    if (adminRequired && !decoded.isAdmin) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default PrivateRoute;

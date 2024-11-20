// src/components/routing/PrivateRoutes.js
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
    // Get authentication status from your auth management system
    // This is just an example - replace with your actual auth check
    const isAuthenticated = localStorage.getItem('accessToken') !== null;

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" />;
};

export default PrivateRoutes;
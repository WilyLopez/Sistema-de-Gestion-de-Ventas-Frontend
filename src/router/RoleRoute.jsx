// src/router/RoleRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Spinner from '@components/ui/Spinner';

const RoleRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    const userRole = user?.rol?.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

    console.log(" RoleRoute check:", {
        isLoading,
        isAuthenticated,
        userRole,
        normalizedAllowedRoles,
        path: window.location.pathname
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log(" No autenticado, redirigiendo a /login");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
        console.log(" Rol no autorizado:", userRole, "permitidos:", normalizedAllowedRoles);
        return <Navigate to="/unauthorized" replace />;
    }

    console.log("Acceso permitido a", userRole);
    return children;
};

export default RoleRoute;
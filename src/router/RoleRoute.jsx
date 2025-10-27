// src/router/RoleRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { ROLES } from '@utils/constants';

/**
 * Componente que protege rutas según el rol del usuario
 */
const RoleRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.rol?.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

    console.log(' Verificación de rol:', {
        usuario: user?.nombre,
        rolOriginal: user?.rol,
        rolNormalizado: userRole,
        rolesPermitidos: normalizedAllowedRoles
    });

    // Si no tiene el rol permitido, redirigir a unauthorized
    if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
        console.warn('Acceso denegado - Rol no autorizado');
        return <Navigate to="/unauthorized" replace />;
    }

    // Si todo está bien, mostrar el componente
    return children;
};

export default RoleRoute;
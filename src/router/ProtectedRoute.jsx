import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Spinner from '@components/ui/Spinner';

/**
 * HOC que protege rutas privadas
 * Verifica si el usuario está autenticado antes de renderizar
 * 
 * @param {React.Component} children - Componente a proteger
 * @returns {React.Component} - Componente protegido o redirección
 */
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    // Mostrar spinner mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-dark-muted">
                        Verificando autenticación...
                    </p>
                </div>
            </div>
        );
    }

    // Si no hay usuario, redirigir a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Usuario autenticado, renderizar contenido
    return children;
};

export default ProtectedRoute;
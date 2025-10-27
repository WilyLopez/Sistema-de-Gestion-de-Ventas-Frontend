//src/pages/common/Unauthorized.jsx
import { useNavigate } from 'react-router-dom';
import { Shield, Home, LogIn, AlertCircle } from 'lucide-react';
import Button from '@components/ui/Button';
import { useAuth } from '@context/AuthContext';

/**
 * Página No Autorizado - Acceso Denegado
 * Se muestra cuando el usuario no tiene permisos para acceder a una ruta
 */
const Unauthorized = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Icono de seguridad */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                            <Shield className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white dark:bg-dark-card rounded-full p-2 shadow-lg">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Mensaje principal */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-4">
                    Acceso Denegado
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-dark-muted mb-2">
                    No tienes permisos para acceder a esta página.
                </p>
                
                {user && (
                    <div className="bg-gray-100 dark:bg-dark-hover rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700 dark:text-dark-text">
                            <strong>Usuario actual:</strong> {user.nombre} {user.apellido}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-muted">
                            <strong>Rol:</strong> {user.rol?.nombre || user.rol}
                        </p>
                    </div>
                )}

                <p className="text-gray-500 dark:text-dark-muted mb-8">
                    Contacta al administrador del sistema si necesitas acceso a esta funcionalidad.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/admin/dashboard')}
                        leftIcon={<Home className="w-5 h-5" />}
                    >
                        Ir al Dashboard
                    </Button>

                    {user ? (
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            leftIcon={<LogIn className="w-5 h-5" />}
                        >
                            Cerrar Sesión
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/login')}
                            leftIcon={<LogIn className="w-5 h-5" />}
                        >
                            Iniciar Sesión
                        </Button>
                    )}
                </div>

                {/* Información de permisos */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        <strong>¿Por qué veo esta página?</strong>
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 text-left space-y-1">
                        <li>• Tu rol actual no tiene permisos para esta sección</li>
                        <li>• La página requiere privilegios de administrador</li>
                        <li>• El acceso ha sido restringido temporalmente</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
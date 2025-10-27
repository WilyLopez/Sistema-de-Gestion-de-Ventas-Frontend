//src/pages/common/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import Button from '@components/ui/Button';

/**
 * Página 404 - Página No Encontrada
 * Se muestra cuando el usuario accede a una ruta que no existe
 */
const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Icono de advertencia */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white dark:bg-dark-card rounded-full p-2 shadow-lg">
                            <span className="text-2xl font-bold text-red-600">404</span>
                        </div>
                    </div>
                </div>

                {/* Mensaje principal */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
                    Página No Encontrada
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-dark-muted mb-2">
                    ¡Ups! La página que buscas no existe.
                </p>
                
                <p className="text-gray-500 dark:text-dark-muted mb-8">
                    Es posible que la dirección haya cambiado o que hayas ingresado 
                    una URL incorrecta.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/admin/dashboard')}
                        leftIcon={<Home className="w-5 h-5" />}
                        className="flex-1 sm:flex-none"
                    >
                        Ir al Dashboard
                    </Button>
                    
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="flex-1 sm:flex-none"
                    >
                        Volver Atrás
                    </Button>
                </div>

                {/* Información adicional */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>¿Necesitas ayuda?</strong>
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Si crees que esto es un error, contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
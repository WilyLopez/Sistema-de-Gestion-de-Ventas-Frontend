import { Link } from 'react-router-dom';

/**
 * Componente Logo
 * Muestra el logo de la aplicación con versión para tema claro y oscuro
 */
const Logo = ({ className = '', collapsed = false }) => {

    return (
        <Link
            to="/"
            className={`flex items-center gap-2 transition-all ${className}`}
        >
            {collapsed ? (
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white font-bold text-xl">
                    S
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white font-bold text-xl">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight text-gray-900 dark:text-dark-text">
                            SGVIA
                        </span>
                        <span className="text-xs text-gray-500 dark:text-dark-muted leading-tight">
                            Sistema de Ventas
                        </span>
                    </div>
                </>
            )}
        </Link>
    );
};

export default Logo;
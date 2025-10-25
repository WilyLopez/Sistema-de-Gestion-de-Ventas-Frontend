import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Componente Breadcrumb
 * Navegación tipo "migaja de pan" que muestra la ruta actual
 */
const Breadcrumb = ({ items, className = '' }) => {
    const location = useLocation();

    const defaultItems = items || generateBreadcrumbsFromPath(location.pathname);

    return (
        <nav className={`flex items-center gap-2 text-sm ${className}`}>
            <Link
                to="/"
                className="flex items-center text-gray-500 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {defaultItems.map((item, index) => {
                const isLast = index === defaultItems.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-dark-muted" />

                        {isLast || !item.path ? (
                            <span className="font-medium text-gray-900 dark:text-dark-text">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                className="text-gray-500 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

/**
 * Genera breadcrumbs automáticamente desde la ruta actual
 */
const generateBreadcrumbsFromPath = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const label = formatSegment(segment);

        return { label, path };
    });

    return breadcrumbs;
};

/**
 * Formatea un segmento de URL para mostrarlo como label
 */
const formatSegment = (segment) => {
    const specialCases = {
        admin: 'Administración',
        vendedor: 'Vendedor',
        empleado: 'Empleado',
        usuarios: 'Usuarios',
        productos: 'Productos',
        ventas: 'Ventas',
        clientes: 'Clientes',
        proveedores: 'Proveedores',
        categorias: 'Categorías',
        inventario: 'Inventario',
        devoluciones: 'Devoluciones',
        reportes: 'Reportes',
        auditoria: 'Auditoría',
        configuracion: 'Configuración',
        crear: 'Crear',
        editar: 'Editar',
        dashboard: 'Dashboard',
    };

    return specialCases[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

export default Breadcrumb;

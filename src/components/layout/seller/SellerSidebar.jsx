import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    FileText,
    Users,
    RotateCcw,
    Package,
    BarChart3,
} from 'lucide-react';

const MENU_ITEMS = [
    {
        icon: ShoppingCart,
        label: 'Nueva Venta',
        path: '/vendedor/nueva-venta',
        highlighted: true, // Destacado para acción principal
    },
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/vendedor/dashboard',
    },
    {
        icon: FileText,
        label: 'Mis Ventas',
        path: '/vendedor/mis-ventas',
    },
    {
        icon: Users,
        label: 'Clientes',
        path: '/vendedor/clientes',
    },
    {
        icon: RotateCcw,
        label: 'Devoluciones',
        path: '/vendedor/devoluciones',
    },
    {
        icon: Package,
        label: 'Consultar Stock',
        path: '/vendedor/stock',
    },
    {
        icon: BarChart3,
        label: 'Mi Reporte Diario',
        path: '/vendedor/reporte-diario',
    },
];

const SellerSidebar = ({ isCollapsed }) => {
    return (
        <aside
            className={`
                fixed left-0 top-16 h-[calc(100vh-4rem)]
                bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border
                transition-all duration-300 ease-in-out z-20
                ${isCollapsed ? 'w-16' : 'w-64'}
                overflow-y-auto
            `}
        >
            <nav className="p-2 space-y-1">
                {MENU_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                            transition-all duration-200 group
                            ${item.highlighted && !isActive
                                ? 'bg-primary-500 text-white hover:bg-primary-600 font-medium shadow-md'
                                : isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-hover'
                            }
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon className={`
                            w-5 h-5 flex-shrink-0 transition-transform
                            group-hover:scale-110
                        `} />
                        {!isCollapsed && (
                            <span className="text-sm">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default SellerSidebar;
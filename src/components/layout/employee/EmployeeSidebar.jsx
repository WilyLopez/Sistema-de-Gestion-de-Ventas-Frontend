import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    AlertTriangle,
    History,
    FileText,
    ShoppingCart,
    Warehouse,
    RotateCcw,
    Search,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

const MENU_GROUPS = [
    {
        id: 'dashboard',
        label: null,
        collapsible: false,
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/empleado/dashboard' },
        ],
    },
    {
        id: 'stock',
        label: 'Stock',
        icon: Package,
        collapsible: true,
        items: [
            { icon: Package, label: 'Consultar', path: '/empleado/stock' },
            { icon: AlertTriangle, label: 'Alertas', path: '/empleado/stock/alertas' },
            { icon: History, label: 'Movimientos', path: '/empleado/stock/movimientos' },
        ],
    },
    {
        id: 'reports',
        label: 'Reportes',
        icon: FileText,
        collapsible: true,
        items: [
            { icon: ShoppingCart, label: 'Ventas', path: '/empleado/reportes/ventas' },
            { icon: Warehouse, label: 'Inventario', path: '/empleado/reportes/inventario' },
            { icon: RotateCcw, label: 'Devoluciones', path: '/empleado/reportes/devoluciones' },
        ],
    },
    {
        id: 'search',
        label: null,
        collapsible: false,
        items: [
            { icon: Search, label: 'Búsqueda Avanzada', path: '/empleado/busqueda' },
        ],
    },
];

const EmployeeSidebar = ({ isCollapsed }) => {
    const [openGroups, setOpenGroups] = useState(['dashboard', 'stock']);

    const toggleGroup = (groupId) => {
        setOpenGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

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
            <nav className="p-2">
                {MENU_GROUPS.map((group) => (
                    <div key={group.id} className="mb-1">
                        {/* Header del grupo */}
                        {group.label && !isCollapsed && (
                            <button
                                onClick={() => group.collapsible && toggleGroup(group.id)}
                                disabled={!group.collapsible}
                                className={`
                                    w-full flex items-center justify-between px-3 py-2 mt-3
                                    text-xs font-semibold text-gray-500 dark:text-dark-muted 
                                    uppercase tracking-wider transition-colors
                                    ${group.collapsible
                                        ? 'hover:text-gray-700 dark:hover:text-dark-text cursor-pointer'
                                        : 'cursor-default'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {group.icon && <group.icon className="w-4 h-4" />}
                                    <span>{group.label}</span>
                                </div>
                                {group.collapsible && (
                                    openGroups.includes(group.id) ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )
                                )}
                            </button>
                        )}

                        {/* Items del grupo */}
                        {(isCollapsed || !group.collapsible || openGroups.includes(group.id)) && (
                            <div className="space-y-0.5 mt-1">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            transition-all duration-200 group
                                            ${isActive
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                                : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-hover'
                                            }
                                            ${isCollapsed ? 'justify-center' : (group.label ? 'pl-6' : '')}
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
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default EmployeeSidebar;
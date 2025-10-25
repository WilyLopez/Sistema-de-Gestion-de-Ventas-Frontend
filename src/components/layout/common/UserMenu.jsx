import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Key, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import ConfirmDialog from '@components/alerts/ConfirmDialog';

/**
 * Componente UserMenu
 * Dropdown con opciones del usuario autenticado
 */
const UserMenu = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setShowLogoutConfirm(false);
    };

    const menuItems = [
        {
            icon: User,
            label: 'Ver Perfil',
            onClick: () => {
                navigate('/perfil');
                setIsOpen(false);
            },
        },
        {
            icon: Key,
            label: 'Cambiar Contraseña',
            onClick: () => {
                navigate('/cambiar-password');
                setIsOpen(false);
            },
        },
        {
            icon: Settings,
            label: 'Preferencias',
            onClick: () => {
                navigate('/configuracion');
                setIsOpen(false);
            },
        },
        {
            icon: HelpCircle,
            label: 'Ayuda',
            onClick: () => {
                navigate('/ayuda');
                setIsOpen(false);
            },
        },
        {
            divider: true,
        },
        {
            icon: LogOut,
            label: 'Cerrar Sesión',
            onClick: () => {
                setIsOpen(false);
                setShowLogoutConfirm(true);
            },
            danger: true,
        },
    ];

    return (
        <>
            <div ref={menuRef} className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold">
                        {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                    </div>

                    <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text">
                            {user?.nombre} {user?.apellido}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-dark-muted">
                            {user?.rol}
                        </div>
                    </div>

                    <ChevronDown
                        className={`w-4 h-4 text-gray-500 dark:text-dark-muted transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-dark-border py-2 z-50 animate-scale-in">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
                            <div className="text-sm font-medium text-gray-900 dark:text-dark-text">
                                {user?.nombre} {user?.apellido}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-dark-muted">
                                {user?.email}
                            </div>
                        </div>

                        {menuItems.map((item, index) => {
                            if (item.divider) {
                                return (
                                    <div
                                        key={index}
                                        className="my-2 border-t border-gray-200 dark:border-dark-border"
                                    />
                                );
                            }

                            const Icon = item.icon;

                            return (
                                <button
                                    key={index}
                                    onClick={item.onClick}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${item.danger
                                            ? 'text-danger hover:bg-red-50 dark:hover:bg-red-900/10'
                                            : 'text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-hover'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="¿Cerrar sesión?"
                message="¿Está seguro que desea salir del sistema?"
                confirmText="Cerrar sesión"
                cancelText="Cancelar"
                type="question"
            />
        </>
    );
};

export default UserMenu;
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Key, Settings, Moon, Sun, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { useNotifications } from '@hooks/useNotifications';
import Badge from '@components/ui/Badge';
import React from 'react';

/**
 * Mapeo de roles a colores de badge
 */
const ROLE_COLORS = {
    ADMINISTRATOR: 'bg-red-500',
    SELLER: 'bg-blue-500',
    EMPLOYEE: 'bg-green-500',
};

/**
 * Componente UserMenu
 * Dropdown con perfil y opciones de usuario
 */
const UserMenu = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { addNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Cerrar con tecla Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            addNotification({ type: 'success', message: 'Logged out successfully' });
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            addNotification({ type: 'error', message: 'Failed to log out. Please try again.' });
        }
    };

    const menuItems = [
        {
            icon: User,
            label: 'View Profile',
            onClick: () => {
                navigate('/perfil');
                setIsOpen(false);
            },
        },
        {
            icon: Key,
            label: 'Change Password',
            onClick: () => {
                navigate('/change-password');
                setIsOpen(false);
            },
        },
        {
            icon: Settings,
            label: 'Preferences',
            onClick: () => {
                navigate('/preferences');
                setIsOpen(false);
            },
        },
        {
            type: 'divider',
        },
        {
            icon: theme === 'dark' ? Sun : Moon,
            label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
            onClick: () => {
                toggleTheme();
            },
            rightContent: (
                <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                </div>
            ),
        },
        {
            icon: HelpCircle,
            label: 'Help',
            onClick: () => {
                navigate('/help');
                setIsOpen(false);
            },
        },
        {
            type: 'divider',
        },
        {
            icon: LogOut,
            label: 'Logout',
            onClick: handleLogout,
            variant: 'danger',
        },
    ];

    if (!user) return null;

    return (
        <div ref={menuRef} className="relative">
            {/* Botón de usuario */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>

                {/* Información de usuario (oculta en móvil) */}
                <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-text">
                        {user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-dark-muted">
                        {user.role}
                    </span>
                </div>

                {/* Chevron */}
                <ChevronDown className={`
                    w-4 h-4 text-gray-500 dark:text-dark-muted transition-transform duration-200
                    ${isOpen ? 'rotate-180' : ''}
                `} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-50 animate-fade-in">
                    {/* Header del dropdown */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-base font-semibold">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">
                                    {user.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant="custom"
                                        className={`${ROLE_COLORS[user.role] || 'bg-gray-500'} text-white text-xs px-2 py-0.5`}
                                    >
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        {user.email && (
                            <p className="text-xs text-gray-500 dark:text-dark-muted mt-2 truncate">
                                {user.email}
                            </p>
                        )}
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                        {menuItems.map((item, index) => {
                            if (item.type === 'divider') {
                                return (
                                    <div
                                        key={`divider-${index}`}
                                        className="my-1 border-t border-gray-200 dark:border-dark-border"
                                    />
                                );
                            }

                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                        ${item.variant === 'danger'
                                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
                                            : 'text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-hover'
                                        }
                                    `}
                                >
                                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.rightContent}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(UserMenu);
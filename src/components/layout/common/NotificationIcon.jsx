import { Bell } from 'lucide-react';
import { useNotifications } from '@hooks/useNotifications';
import Tooltip from '@components/ui/Tooltip';
import Badge from '@components/ui/Badge';

/**
 * Componente NotificationIcon
 * Ícono de campana con contador de notificaciones no leídas
 */
const NotificationIcon = ({ onClick, className = '' }) => {
    const { unreadCount } = useNotifications();

    return (
        <Tooltip content="Notificaciones">
            <button
                onClick={onClick}
                className={`relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors ${className}`}
                aria-label="Notificaciones"
            >
                <Bell className="w-5 h-5 text-gray-700 dark:text-dark-text" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-danger rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
        </Tooltip>
    );
};

export default NotificationIcon;
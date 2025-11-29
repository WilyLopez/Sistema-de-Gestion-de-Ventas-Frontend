import { AlertTriangle, AlertCircle, Info, RotateCcw, XCircle, Package, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Checkbox from '@components/ui/Checkbox';
import Badge from '@components/ui/Badge';

const ALERT_ICONS = {
    STOCK_MINIMO: AlertTriangle,
    STOCK_AGOTADO: AlertCircle,
    STOCK_EXCESIVO: Package,
    REORDEN: Info,
    DEVOLUCION_PENDIENTE: RotateCcw,
    VENTA_ANULADA: XCircle,
    ACTUALIZACION_SISTEMA: Info,
};

const URGENCY_STYLES = {
    CRITICO: {
        bg: 'bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-100/70 dark:hover:from-red-900/30 dark:hover:to-red-900/20',
        border: 'border-l-4 border-red-500 shadow-sm shadow-red-500/20',
        icon: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        badge: 'bg-red-500 shadow-sm',
        dot: 'bg-red-500',
    },
    ALTO: {
        bg: 'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 hover:from-orange-100 hover:to-orange-100/70 dark:hover:from-orange-900/30 dark:hover:to-orange-900/20',
        border: 'border-l-4 border-orange-500 shadow-sm shadow-orange-500/20',
        icon: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        badge: 'bg-orange-500 shadow-sm',
        dot: 'bg-orange-500',
    },
    MEDIO: {
        bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 hover:from-yellow-100 hover:to-yellow-100/70 dark:hover:from-yellow-900/30 dark:hover:to-yellow-900/20',
        border: 'border-l-4 border-yellow-500 shadow-sm shadow-yellow-500/20',
        icon: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        badge: 'bg-yellow-500 shadow-sm',
        dot: 'bg-yellow-500',
    },
    BAJO: {
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 hover:from-blue-100 hover:to-blue-100/70 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20',
        border: 'border-l-4 border-blue-500 shadow-sm shadow-blue-500/20',
        icon: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        badge: 'bg-blue-500 shadow-sm',
        dot: 'bg-blue-500',
    },
};

const formatTimeAgo = (dateString) => {
    try {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Fecha inválida';
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: es,
        });
    } catch (error) {
        console.error(error);
        return 'Fecha inválida';
    }
};

const NotificationItem = ({
    notification,
    onClick,
    onSelect,
    selected = false,
}) => {
    const {
        id,
        type,
        nivelUrgencia,
        message,
        createdAt,
        isRead,
        producto,
        stockActual,
    } = notification;

    const styles = URGENCY_STYLES[nivelUrgencia] || URGENCY_STYLES.BAJO;
    const IconComponent = ALERT_ICONS[type] || Info;
    const timeAgo = formatTimeAgo(createdAt);
    const truncatedMessage = message && message.length > 120
        ? `${message.substring(0, 120)}...`
        : message || 'Sin mensaje';

    const handleClick = (e) => {
        if (e.target.type !== 'checkbox' && !e.target.closest('input[type="checkbox"]')) {
            onClick(notification);
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect(id);
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative flex items-start gap-3 p-4 
                cursor-pointer transition-all duration-300 ease-out
                ${styles.bg} ${styles.border}
                border-b border-gray-200 dark:border-dark-border
                ${selected ? 'ring-2 ring-primary-500 ring-inset scale-[0.99]' : ''}
                ${!isRead ? 'font-medium' : 'opacity-75'}
                hover:scale-[0.99] active:scale-[0.98]
            `}
        >
            <div className="flex-shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={selected}
                    onChange={handleCheckboxChange}
                    aria-label={`Seleccionar notificación ${id}`}
                />
            </div>

            <div className={`flex-shrink-0 p-2 rounded-lg ${styles.iconBg} transition-transform duration-300 ${!isRead ? 'scale-110' : ''}`}>
                <IconComponent className={`w-5 h-5 ${styles.icon}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                        variant="custom"
                        className={`${styles.badge} text-white text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wide`}
                    >
                        {nivelUrgencia}
                    </Badge>

                    {producto && producto.nombre && (
                        <span className="text-xs font-semibold text-gray-800 dark:text-dark-text truncate bg-white/50 dark:bg-dark-bg/50 px-2 py-0.5 rounded-md">
                            {producto.nombre}
                        </span>
                    )}
                </div>

                <p className={`
                    text-sm mb-2 leading-relaxed
                    ${isRead
                        ? 'text-gray-600 dark:text-dark-muted'
                        : 'text-gray-900 dark:text-dark-text font-semibold'
                    }
                `}>
                    {truncatedMessage}
                </p>

                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-dark-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeAgo}</span>
                    </div>

                    {producto && type !== 'STOCK_EXCESIVO' && (
                        <>
                            <span className="text-gray-300 dark:text-dark-border">|</span>
                            <div className={`flex items-center gap-1.5 font-medium ${(stockActual !== undefined ? stockActual : producto.stockActual) <= producto.stockMinimo
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}>
                                <Package className="w-3.5 h-3.5" />
                                <span>
                                    {stockActual !== undefined ? stockActual : producto.stockActual}
                                    {producto.stockMinimo && ` / ${producto.stockMinimo}`}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!isRead && (
                <div className="flex-shrink-0 pt-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${styles.dot} animate-pulse shadow-lg`} />
                </div>
            )}
        </div>
    );
};

export default NotificationItem;
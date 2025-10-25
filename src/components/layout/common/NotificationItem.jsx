import { AlertTriangle, AlertCircle, Info, RotateCcw, XCircle, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Checkbox from '@components/ui/Checkbox';
import Badge from '@components/ui/Badge';

/**
 * Mapeo de tipos de alerta a iconos
 */
const ALERT_ICONS = {
    STOCK_MINIMO: AlertTriangle,
    STOCK_AGOTADO: AlertCircle,
    STOCK_EXCESIVO: Package,
    REORDEN: Info,
    DEVOLUCION_PENDIENTE: RotateCcw,
    VENTA_ANULADA: XCircle,
    ACTUALIZACION_SISTEMA: Info,
};

/**
 * Mapeo de niveles de urgencia a estilos
 */
const URGENCY_STYLES = {
    CRITICO: {
        bg: 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20',
        border: 'border-l-4 border-red-500',
        icon: 'text-red-600 dark:text-red-400',
        badge: 'bg-red-500',
    },
    ALTO: {
        bg: 'bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20',
        border: 'border-l-4 border-orange-500',
        icon: 'text-orange-600 dark:text-orange-400',
        badge: 'bg-orange-500',
    },
    MEDIO: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20',
        border: 'border-l-4 border-yellow-500',
        icon: 'text-yellow-600 dark:text-yellow-400',
        badge: 'bg-yellow-500',
    },
    BAJO: {
        bg: 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20',
        border: 'border-l-4 border-blue-500',
        icon: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-500',
    },
};

/**
 * Componente NotificationItem
 * Representa un item individual de notificación en la lista
 * 
 * @param {Object} notification - Objeto de notificación
 * @param {Function} onClick - Callback al hacer clic en el item
 * @param {Function} onSelect - Callback al seleccionar checkbox
 * @param {boolean} selected - Si el item está seleccionado
 */
const NotificationItem = ({
    notification,
    onClick,
    onSelect,
    selected = false,
}) => {
    const {
        id,
        tipoAlerta,
        nivelUrgencia,
        mensaje,
        fechaGeneracion,
        leida,
        producto,
    } = notification;

    // Obtener estilos según urgencia
    const styles = URGENCY_STYLES[nivelUrgencia] || URGENCY_STYLES.BAJO;

    // Obtener ícono según tipo
    const IconComponent = ALERT_ICONS[tipoAlerta] || Info;

    // Formatear fecha relativa
    const timeAgo = formatDistanceToNow(new Date(fechaGeneracion), {
        addSuffix: true,
        locale: es,
    });

    // Truncar mensaje si es muy largo
    const truncatedMessage = mensaje.length > 100 
        ? `${mensaje.substring(0, 100)}...` 
        : mensaje;

    const handleClick = (e) => {
        // Evitar que el clic en checkbox active el onClick del item
        if (e.target.type !== 'checkbox') {
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
                cursor-pointer transition-all duration-200
                ${styles.bg} ${styles.border}
                border-b border-gray-200 dark:border-dark-border
                ${selected ? 'ring-2 ring-primary-500 ring-inset' : ''}
            `}
        >
            {/* Checkbox de selección */}
            <div className="flex-shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={selected}
                    onChange={handleCheckboxChange}
                    aria-label={`Seleccionar notificación ${id}`}
                />
            </div>

            {/* Ícono de tipo de alerta */}
            <div className={`flex-shrink-0 pt-1 ${styles.icon}`}>
                <IconComponent className="w-5 h-5" />
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
                {/* Header: Badge + Producto */}
                <div className="flex items-center gap-2 mb-1">
                    <Badge
                        variant="custom"
                        className={`${styles.badge} text-white text-xs px-2 py-0.5`}
                    >
                        {nivelUrgencia}
                    </Badge>
                    
                    {producto && (
                        <span className="text-xs font-medium text-gray-700 dark:text-dark-text truncate">
                            {producto.nombre}
                        </span>
                    )}
                </div>

                {/* Mensaje */}
                <p className={`
                    text-sm mb-1
                    ${leida 
                        ? 'text-gray-600 dark:text-dark-muted' 
                        : 'text-gray-900 dark:text-dark-text font-medium'
                    }
                `}>
                    {truncatedMessage}
                </p>

                {/* Footer: Fecha + Stock info (si aplica) */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                    <span>{timeAgo}</span>
                    
                    {producto && tipoAlerta !== 'STOCK_EXCESIVO' && (
                        <>
                            <span>•</span>
                            <span>
                                Stock: {producto.stockActual}/{producto.stockMinimo || producto.stockMaximo}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Indicador de no leída */}
            {!leida && (
                <div className="flex-shrink-0 pt-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                </div>
            )}
        </div>
    );
};

export default NotificationItem;
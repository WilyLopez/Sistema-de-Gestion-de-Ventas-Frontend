import { useEffect } from 'react';
import { X, Trash2, Check, AlertTriangle, AlertCircle, Info, RotateCcw, XCircle, Package, Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import { useNotifications } from '@hooks/useNotifications';

const ALERT_ICONS = {
    STOCK_MINIMO: AlertTriangle,
    STOCK_AGOTADO: AlertCircle,
    STOCK_EXCESIVO: Package,
    REORDEN: Info,
    DEVOLUCION_PENDIENTE: RotateCcw,
    VENTA_ANULADA: XCircle,
    ACTUALIZACION_SISTEMA: Info,
};

const URGENCY_CONFIG = {
    CRITICO: {
        color: 'text-red-600 dark:text-red-400',
        bgIcon: 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/20',
        badge: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-200 dark:border-red-900/50',
    },
    ALTO: {
        color: 'text-orange-600 dark:text-orange-400',
        bgIcon: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-900/20',
        badge: 'bg-gradient-to-r from-orange-500 to-orange-600',
        border: 'border-orange-200 dark:border-orange-900/50',
    },
    MEDIO: {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgIcon: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-900/20',
        badge: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        border: 'border-yellow-200 dark:border-yellow-900/50',
    },
    BAJO: {
        color: 'text-blue-600 dark:text-blue-400',
        bgIcon: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/20',
        badge: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-200 dark:border-blue-900/50',
    },
};

const ALERT_LABELS = {
    STOCK_MINIMO: 'Stock Mínimo',
    STOCK_AGOTADO: 'Stock Agotado',
    STOCK_EXCESIVO: 'Stock Excesivo',
    REORDEN: 'Reorden Automática',
    DEVOLUCION_PENDIENTE: 'Devolución Pendiente',
    VENTA_ANULADA: 'Venta Anulada',
    ACTUALIZACION_SISTEMA: 'Actualización del Sistema',
};

const NotificationModal = ({ notification, isOpen, onClose }) => {
    const { markAsRead, deleteNotification } = useNotifications();

    useEffect(() => {
        if (isOpen && notification && !notification.isRead) {
            markAsRead(notification.id);
        }
    }, [isOpen, notification, markAsRead]);

    if (!notification) return null;

    const {
        id,
        type,
        nivelUrgencia,
        message,
        createdAt,
        isRead,
        readAt,
        readBy,
        producto,
        stockActual,
        stockUmbral,
    } = notification;

    const config = URGENCY_CONFIG[nivelUrgencia] || URGENCY_CONFIG.BAJO;
    const IconComponent = ALERT_ICONS[type] || Info;
    const alertLabel = ALERT_LABELS[type] || 'Notificación';

    const formatSafeDate = (dateString, formatString) => {
        try {
            if (!dateString) return 'Fecha no disponible';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return format(date, formatString, { locale: es });
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Fecha inválida';
        }
    };

    const formattedDate = formatSafeDate(createdAt, "dd 'de' MMMM 'de' yyyy - HH:mm");

    const handleDelete = async () => {
        try {
            await deleteNotification(id);
            onClose();
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-200 dark:border-dark-border">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 p-4 rounded-xl shadow-md ${config.bgIcon}`}>
                        <IconComponent className={`w-8 h-8 ${config.color}`} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                                {alertLabel}
                            </h2>
                            <Badge
                                variant="custom"
                                className={`${config.badge} text-white text-xs px-3 py-1 font-bold uppercase tracking-wide shadow-md`}
                            >
                                {nivelUrgencia}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-all hover:rotate-90 duration-300"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5 text-gray-500 dark:text-dark-muted" />
                </button>
            </div>

            <div className="space-y-6 mb-6">
                <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-bg rounded-xl p-5 border-2 ${config.border} shadow-sm`}>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-dark-text mb-3 uppercase tracking-wide">
                        Descripción
                    </h3>
                    <p className="text-base text-gray-700 dark:text-dark-text leading-relaxed">
                        {message}
                    </p>
                </div>

                {producto && (
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-bg rounded-xl p-5 border-2 border-gray-200 dark:border-dark-border shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-dark-text mb-4 uppercase tracking-wide flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Información del Producto
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                                <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">Nombre</span>
                                <p className="text-sm text-gray-900 dark:text-dark-text font-bold mt-1">
                                    {producto.nombre}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                                <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">Código</span>
                                <p className="text-sm text-gray-900 dark:text-dark-text font-bold mt-1">
                                    {producto.codigo}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                                <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">Stock Actual</span>
                                <p className={`text-sm font-bold mt-1 ${(stockActual !== undefined ? stockActual : producto.stockActual) <= producto.stockMinimo
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-green-600 dark:text-green-400'
                                    }`}>
                                    {stockActual !== undefined ? stockActual : producto.stockActual} unidades
                                </p>
                            </div>
                            <div className="bg-white dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                                <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">Stock Mínimo</span>
                                <p className="text-sm text-gray-900 dark:text-dark-text font-bold mt-1">
                                    {producto.stockMinimo || stockUmbral} unidades
                                </p>
                            </div>
                            {producto.precio && (
                                <div className="bg-white dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border sm:col-span-2">
                                    <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">Precio</span>
                                    <p className="text-sm text-gray-900 dark:text-dark-text font-bold mt-1">
                                        S/ {producto.precio.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isRead && readAt && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/50">
                        <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-xs text-gray-700 dark:text-dark-text">
                            <p className="font-semibold mb-0.5">Notificación leída</p>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-dark-muted">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatSafeDate(readAt, "dd/MM/yyyy 'a las' HH:mm")}
                                </span>
                                {readBy && readBy.nombre && (
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {readBy.nombre}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-gray-200 dark:border-dark-border">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    className="px-6 py-2.5 font-semibold"
                >
                    Cerrar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="px-6 py-2.5 font-semibold"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                >
                    Eliminar
                </Button>
            </div>
        </Modal>
    );
};

export default NotificationModal;
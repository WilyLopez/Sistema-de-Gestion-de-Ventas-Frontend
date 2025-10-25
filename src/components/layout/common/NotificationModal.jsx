import { useEffect } from 'react';
import { X, Trash2, Check, AlertTriangle, AlertCircle, Info, RotateCcw, XCircle, Package } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import { useNotifications } from '@hooks/useNotifications';

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
const URGENCY_CONFIG = {
    CRITICO: {
        color: 'text-red-600 dark:text-red-400',
        bgIcon: 'bg-red-100 dark:bg-red-900/20',
        badge: 'bg-red-500',
    },
    ALTO: {
        color: 'text-orange-600 dark:text-orange-400',
        bgIcon: 'bg-orange-100 dark:bg-orange-900/20',
        badge: 'bg-orange-500',
    },
    MEDIO: {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgIcon: 'bg-yellow-100 dark:bg-yellow-900/20',
        badge: 'bg-yellow-500',
    },
    BAJO: {
        color: 'text-blue-600 dark:text-blue-400',
        bgIcon: 'bg-blue-100 dark:bg-blue-900/20',
        badge: 'bg-blue-500',
    },
};

/**
 * Mapeo de tipos de alerta a etiquetas legibles
 */
const ALERT_LABELS = {
    STOCK_MINIMO: 'Stock Mínimo',
    STOCK_AGOTADO: 'Stock Agotado',
    STOCK_EXCESIVO: 'Stock Excesivo',
    REORDEN: 'Reorden Automática',
    DEVOLUCION_PENDIENTE: 'Devolución Pendiente',
    VENTA_ANULADA: 'Venta Anulada',
    ACTUALIZACION_SISTEMA: 'Actualización del Sistema',
};

/**
 * Componente NotificationModal
 * Modal con detalle completo de una notificación
 * 
 * @param {Object} notification - Notificación a mostrar
 * @param {boolean} isOpen - Estado de apertura del modal
 * @param {Function} onClose - Callback al cerrar
 */
const NotificationModal = ({ notification, isOpen, onClose }) => {
    const { markAsRead, deleteNotification } = useNotifications();

    // Marcar como leída al abrir (si no está leída)
    useEffect(() => {
        if (isOpen && notification && !notification.leida) {
            markAsRead(notification.id);
        }
    }, [isOpen, notification, markAsRead]);

    if (!notification) return null;

    const {
        id,
        tipoAlerta,
        nivelUrgencia,
        mensaje,
        fechaGeneracion,
        leida,
        fechaLectura,
        usuarioLector,
        producto,
    } = notification;

    // Configuración de estilos
    const config = URGENCY_CONFIG[nivelUrgencia] || URGENCY_CONFIG.BAJO;
    const IconComponent = ALERT_ICONS[tipoAlerta] || Info;
    const alertLabel = ALERT_LABELS[tipoAlerta] || 'Notificación';

    // Formatear fechas
    const formattedDate = format(new Date(fechaGeneracion), "dd 'de' MMMM 'de' yyyy - HH:mm", {
        locale: es,
    });

    const handleDelete = async () => {
        try {
            await deleteNotification(id);
            onClose();
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-dark-border">
                <div className="flex items-start gap-3">
                    {/* Ícono */}
                    <div className={`flex-shrink-0 p-3 rounded-lg ${config.bgIcon}`}>
                        <IconComponent className={`w-6 h-6 ${config.color}`} />
                    </div>

                    {/* Título y badges */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                                {alertLabel}
                            </h2>
                            <Badge
                                variant="custom"
                                className={`${config.badge} text-white text-xs px-2 py-0.5`}
                            >
                                {nivelUrgencia}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5 text-gray-500 dark:text-dark-muted" />
                </button>
            </div>

            {/* Body */}
            <div className="space-y-4 mb-6">
                {/* Mensaje */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                        Descripción
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                        {mensaje}
                    </p>
                </div>

                {/* Información del producto */}
                {producto && (
                    <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text mb-3">
                            Información del Producto
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-dark-muted">Nombre:</span>
                                <p className="text-gray-900 dark:text-dark-text font-medium">
                                    {producto.nombre}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-dark-muted">Código:</span>
                                <p className="text-gray-900 dark:text-dark-text font-medium">
                                    {producto.codigo}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-dark-muted">Stock Actual:</span>
                                <p className={`font-medium ${
                                    producto.stockActual <= producto.stockMinimo
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-green-600 dark:text-green-400'
                                }`}>
                                    {producto.stockActual} unidades
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-dark-muted">Stock Mínimo:</span>
                                <p className="text-gray-900 dark:text-dark-text font-medium">
                                    {producto.stockMinimo} unidades
                                </p>
                            </div>
                            {producto.precio && (
                                <div>
                                    <span className="text-gray-500 dark:text-dark-muted">Precio:</span>
                                    <p className="text-gray-900 dark:text-dark-text font-medium">
                                        S/ {producto.precio.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Estado de lectura */}
                {leida && fechaLectura && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                        <Check className="w-4 h-4" />
                        <span>
                            Leída el {format(new Date(fechaLectura), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                            {usuarioLector && ` por ${usuarioLector.nombre}`}
                        </span>
                    </div>
                )}
            </div>

            {/* Footer con acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    className="px-4"
                >
                    Cerrar
                </Button>
                
                <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="px-4"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                >
                    Eliminar
                </Button>
            </div>
        </Modal>
    );
};

export default NotificationModal;
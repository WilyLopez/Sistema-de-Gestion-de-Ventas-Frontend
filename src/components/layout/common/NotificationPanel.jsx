import { useState, useMemo } from 'react';
import { X, Trash2, CheckCheck, Filter, Bell } from 'lucide-react';
import { useNotifications } from '@hooks/useNotifications';
import NotificationItem from './NotificationItem';
import NotificationModal from './NotificationModal';
import Button from '@components/ui/Button';
import Checkbox from '@components/ui/Checkbox';
import Spinner from '@components/ui/Spinner';

/**
 * Filtros disponibles
 */
const FILTERS = {
    ALL: { id: 'all', label: 'Todas' },
    UNREAD: { id: 'unread', label: 'No leídas' },
    READ: { id: 'read', label: 'Leídas' },
};

/**
 * Componente NotificationPanel
 * Panel lateral deslizante con lista completa de notificaciones
 * 
 * @param {boolean} isOpen - Estado de apertura del panel
 * @param {Function} onClose - Callback al cerrar el panel
 */
const NotificationPanel = ({ isOpen, onClose }) => {
    const {
        notifications,
        unreadCount,
        isLoading,
        markAllAsRead,
        deleteMultiple,
    } = useNotifications();

    // Estado local
    const [activeFilter, setActiveFilter] = useState(FILTERS.ALL.id);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalNotification, setModalNotification] = useState(null);

    // Filtrar notificaciones según filtro activo
    const filteredNotifications = useMemo(() => {
        switch (activeFilter) {
            case FILTERS.UNREAD.id:
                return notifications.filter(n => !n.leida);
            case FILTERS.READ.id:
                return notifications.filter(n => n.leida);
            default:
                return notifications;
        }
    }, [notifications, activeFilter]);

    // Verificar si todas las notificaciones visibles están seleccionadas
    const allSelected = filteredNotifications.length > 0 && 
        selectedIds.length === filteredNotifications.length;

    // Handlers
    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setSelectedIds([]); // Limpiar selección al cambiar filtro
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredNotifications.map(n => n.id));
        }
    };

    const handleSelectItem = (id) => {
        setSelectedIds(prev => 
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const handleItemClick = (notification) => {
        setModalNotification(notification);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;

        try {
            await deleteMultiple(selectedIds);
            setSelectedIds([]);
        } catch (error) {
            console.error('Error al eliminar notificaciones:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        }
    };

    const handleClosePanel = () => {
        setSelectedIds([]);
        setActiveFilter(FILTERS.ALL.id);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`
                    fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={handleClosePanel}
                aria-hidden={!isOpen}
            />

            {/* Panel lateral */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-full sm:w-[480px] 
                    bg-white dark:bg-dark-bg shadow-2xl z-50
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    flex flex-col
                `}
            >
                {/* Header */}
                <div className="flex-shrink-0 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                                    Notificaciones
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-dark-muted">
                                    {unreadCount > 0 ? (
                                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                                            {unreadCount} sin leer
                                        </span>
                                    ) : (
                                        'Todo al día'
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClosePanel}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                            aria-label="Cerrar panel"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-dark-muted" />
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center gap-2 px-4 pb-4">
                        {Object.values(FILTERS).map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterChange(filter.id)}
                                className={`
                                    flex-1 px-4 py-2 text-sm font-medium rounded-lg
                                    transition-all duration-200
                                    ${activeFilter === filter.id
                                        ? 'bg-primary-500 text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-hover'
                                    }
                                `}
                            >
                                {filter.label}
                                {filter.id === FILTERS.UNREAD.id && unreadCount > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de notificaciones */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner size="lg" />
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                            <Bell className="w-16 h-16 text-gray-300 dark:text-dark-muted mb-4" />
                            <p className="text-gray-500 dark:text-dark-muted font-medium">
                                {activeFilter === FILTERS.UNREAD.id
                                    ? 'No tienes notificaciones sin leer'
                                    : activeFilter === FILTERS.READ.id
                                    ? 'No tienes notificaciones leídas'
                                    : 'No hay notificaciones'}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-dark-muted mt-1">
                                Las alertas importantes aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={handleItemClick}
                                    onSelect={handleSelectItem}
                                    selected={selectedIds.includes(notification.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con acciones globales */}
                {filteredNotifications.length > 0 && (
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card p-4">
                        {/* Seleccionar todas */}
                        <div className="flex items-center justify-between mb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-dark-text">
                                    Seleccionar todas ({filteredNotifications.length})
                                </span>
                            </label>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center gap-2">
                            {/* Eliminar seleccionadas */}
                            <Button
                                variant="danger"
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.length === 0}
                                className="flex-1"
                                leftIcon={<Trash2 className="w-4 h-4" />}
                            >
                                Eliminar ({selectedIds.length})
                            </Button>

                            {/* Marcar todas como leídas */}
                            {unreadCount > 0 && activeFilter !== FILTERS.READ.id && (
                                <Button
                                    variant="primary"
                                    onClick={handleMarkAllAsRead}
                                    className="flex-1"
                                    leftIcon={<CheckCheck className="w-4 h-4" />}
                                >
                                    Marcar todas
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            <NotificationModal
                notification={modalNotification}
                isOpen={!!modalNotification}
                onClose={() => setModalNotification(null)}
            />
        </>
    );
};

export default NotificationPanel;
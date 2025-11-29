import { useState, useMemo } from 'react';
import { X, Trash2, CheckCheck, Bell, BellOff, Sparkles } from 'lucide-react';
import { useNotifications } from '@hooks/useNotifications';
import NotificationItem from './NotificationItem';
import NotificationModal from './NotificationModal';
import Button from '@components/ui/Button';
import Checkbox from '@components/ui/Checkbox';
import Spinner from '@components/ui/Spinner';

const FILTERS = {
    ALL: { id: 'all', label: 'Todas', icon: Bell },
    UNREAD: { id: 'unread', label: 'No leídas', icon: Sparkles },
    READ: { id: 'read', label: 'Leídas', icon: CheckCheck },
};

const NotificationPanel = ({ isOpen, onClose }) => {
    const {
        notifications,
        unreadCount,
        isLoading,
        markAllAsRead,
        deleteMultiple,
    } = useNotifications();

    const [activeFilter, setActiveFilter] = useState(FILTERS.ALL.id);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalNotification, setModalNotification] = useState(null);

    const filteredNotifications = useMemo(() => {
        switch (activeFilter) {
            case FILTERS.UNREAD.id:
                return notifications.filter(n => !n.isRead);
            case FILTERS.READ.id:
                return notifications.filter(n => n.isRead);
            default:
                return notifications;
        }
    }, [notifications, activeFilter]);

    const allSelected = filteredNotifications.length > 0 &&
        selectedIds.length === filteredNotifications.length;

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setSelectedIds([]);
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
            <div
                className={`
                    fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={handleClosePanel}
                aria-hidden={!isOpen}
            />

            <div
                className={`
                    fixed top-0 right-0 h-full w-full sm:w-[520px] 
                    bg-gradient-to-br from-white to-gray-50 dark:from-dark-bg dark:to-dark-card 
                    shadow-2xl z-50
                    transform transition-all duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    flex flex-col
                `}
            >
                <div className="flex-shrink-0 border-b-2 border-gray-200 dark:border-dark-border bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 shadow-lg">
                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Bell className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Notificaciones
                                </h2>
                                <p className="text-sm text-white/80">
                                    {unreadCount > 0 ? (
                                        <span className="font-semibold">
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
                            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all hover:rotate-90 duration-300 backdrop-blur-sm"
                            aria-label="Cerrar panel"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-5 pb-4">
                        {Object.values(FILTERS).map((filter) => {
                            const IconComponent = filter.icon;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => handleFilterChange(filter.id)}
                                    className={`
                                        flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg
                                        transition-all duration-200
                                        ${activeFilter === filter.id
                                            ? 'bg-white text-primary-600 shadow-md scale-105'
                                            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                        }
                                    `}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    {filter.label}
                                    {filter.id === FILTERS.UNREAD.id && unreadCount > 0 && (
                                        <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-bold ${activeFilter === filter.id
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-white/20'
                                            }`}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner size="lg" />
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                            <div className="mb-4 p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-card dark:to-dark-hover rounded-full">
                                <BellOff className="w-16 h-16 text-gray-400 dark:text-dark-muted" />
                            </div>
                            <p className="text-gray-700 dark:text-dark-text font-bold text-lg mb-2">
                                {activeFilter === FILTERS.UNREAD.id
                                    ? 'Sin notificaciones pendientes'
                                    : activeFilter === FILTERS.READ.id
                                        ? 'Sin notificaciones leídas'
                                        : 'Sin notificaciones'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-dark-muted">
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

                {filteredNotifications.length > 0 && (
                    <div className="flex-shrink-0 border-t-2 border-gray-200 dark:border-dark-border bg-gradient-to-r from-gray-50 to-white dark:from-dark-card dark:to-dark-bg p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <Checkbox
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm font-semibold text-gray-700 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    Seleccionar todas ({filteredNotifications.length})
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="danger"
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.length === 0}
                                className="flex-1 font-semibold shadow-md hover:shadow-lg transition-shadow"
                                leftIcon={<Trash2 className="w-4 h-4" />}
                            >
                                Eliminar ({selectedIds.length})
                            </Button>

                            {unreadCount > 0 && activeFilter !== FILTERS.READ.id && (
                                <Button
                                    variant="primary"
                                    onClick={handleMarkAllAsRead}
                                    className="flex-1 font-semibold shadow-md hover:shadow-lg transition-shadow"
                                    leftIcon={<CheckCheck className="w-4 h-4" />}
                                >
                                    Marcar todas
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <NotificationModal
                notification={modalNotification}
                isOpen={!!modalNotification}
                onClose={() => setModalNotification(null)}
            />
        </>
    );
};

export default NotificationPanel;
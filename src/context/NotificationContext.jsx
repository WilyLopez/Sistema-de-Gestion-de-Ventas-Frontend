import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { get, del, put } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";
import { NOTIFICATIONS_CONFIG, NOTIFICATION_TYPES } from "@utils/constants";
import { useSound } from "@hooks/useSound";
import { AuthContext } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const { playCritical, playNotification } = useSound();
    const { isAuthenticated, user } = useContext(AuthContext);

    const fetchNotifications = useCallback(async () => {
        if (!NOTIFICATIONS_CONFIG.ENABLED || !isAuthenticated) {
            return;
        }

        try {
            setIsLoading(true);
            const data = await get(ENDPOINTS.ALERTAS.BASE);

            const notificationsArray = (data && Array.isArray(data.content)) ? data.content : [];

            const transformedNotifications = notificationsArray.map(n => {
                if (!n.idAlerta) {
                    console.warn('Notificación sin ID:', n);
                }

                return {
                    id: n.idAlerta,
                    type: n.tipoAlerta,
                    message: n.mensaje,
                    createdAt: n.fechaAlerta,
                    isRead: n.leida,
                    priority: NOTIFICATION_TYPES[n.tipoAlerta]?.priority || 1,
                    nivelUrgencia: n.nivelUrgencia,
                    producto: n.producto,
                    readAt: n.fechaLectura,
                    readBy: n.usuarioNotificado,
                    leida: n.leida,
                    stockActual: n.stockActual,
                    stockUmbral: n.stockUmbral,
                };
            });

            const sortedNotifications = transformedNotifications.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotifications(sortedNotifications);

            const unread = sortedNotifications.filter((n) => !n.isRead).length;
            setUnreadCount(unread);

            const criticalUnread = sortedNotifications.filter(
                (n) => !n.isRead && n.priority >= 3
            );

            if (criticalUnread.length > 0) {
                playCritical();
            }

            setErrorCount(0);
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
            setErrorCount((prev) => prev + 1);
        } finally {
            setIsLoading(false);
        }
    }, [playCritical, isAuthenticated]);

    useEffect(() => {
        if (!NOTIFICATIONS_CONFIG.ENABLED || !isAuthenticated || errorCount >= 3) {
            return;
        }

        fetchNotifications();

        const intervalId = setInterval(
            fetchNotifications,
            NOTIFICATIONS_CONFIG.REFRESH_INTERVAL || 30000
        );

        return () => clearInterval(intervalId);
    }, [fetchNotifications, isAuthenticated, errorCount]);

    const markAsRead = async (id) => {
        try {
            if (!id || id === 'undefined') {
                console.error('ID de notificación inválido:', id);
                return;
            }

            if (!user?.id) {
                console.error('Usuario no autenticado o ID no disponible');
                throw new Error('Usuario no autenticado');
            }

            await put(`${ENDPOINTS.ALERTAS.MARK_READ(id)}?idUsuario=${user.id}`, {});

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === id
                        ? {
                            ...notification,
                            isRead: true,
                            leida: true,
                            readAt: new Date().toISOString(),
                            readBy: user
                        }
                        : notification
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
            throw error;
        }
    };

    const markAllAsRead = async () => {
        try {
            if (!user?.id) {
                console.error('Usuario no autenticado');
                throw new Error('Usuario no autenticado');
            }

            const unreadIds = notifications
                .filter(n => !n.isRead)
                .map(n => n.id);

            if (unreadIds.length === 0) {
                return;
            }

            const promises = unreadIds.map(id =>
                put(`${ENDPOINTS.ALERTAS.MARK_READ(id)}?idUsuario=${user.id}`, {})
            );

            await Promise.all(promises);

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                    leida: true,
                    readAt: new Date().toISOString(),
                    readBy: user
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
            throw error;
        }
    };

    const deleteNotification = async (id) => {
        try {
            if (!id || id === 'undefined') {
                console.error('ID de notificación inválido:', id);
                return;
            }

            const deletedNotification = notifications.find((n) => n.id === id);

            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) => notification.id !== id
                )
            );

            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Error al eliminar notificación:", error);
            await fetchNotifications();
            throw error;
        }
    };

    const deleteMultiple = async (ids) => {
        try {
            const validIds = ids.filter(id => id && id !== 'undefined');

            if (validIds.length === 0) {
                console.error('No hay IDs válidos para eliminar');
                return;
            }

            const deletedUnread = notifications.filter(
                (n) => validIds.includes(n.id) && !n.isRead
            ).length;

            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) => !validIds.includes(notification.id)
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - deletedUnread));
        } catch (error) {
            console.error("Error al eliminar notificaciones:", error);
            await fetchNotifications();
            throw error;
        }
    };

    const getUnreadNotifications = () => {
        return notifications.filter((n) => !n.isRead);
    };

    const getReadNotifications = () => {
        return notifications.filter((n) => n.isRead);
    };

    const getNotificationsByType = (type) => {
        return notifications.filter((n) => n.type === type);
    };

    const addNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);

        if (!notification.isRead) {
            setUnreadCount((prev) => prev + 1);

            if (NOTIFICATION_TYPES[notification.type]?.priority >= 3) {
                playCritical();
            } else {
                playNotification();
            }
        }
    };

    const value = {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteMultiple,
        getUnreadNotifications,
        getReadNotifications,
        getNotificationsByType,
        addNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationContext };
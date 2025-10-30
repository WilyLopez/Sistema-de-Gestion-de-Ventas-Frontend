import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { get, del, patch } from "@api/axios.config";
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
    const { isAuthenticated } = useContext(AuthContext);

    const fetchNotifications = useCallback(async () => {
        if (!NOTIFICATIONS_CONFIG.ENABLED || !isAuthenticated) {
            return;
        }

        try {
            setIsLoading(true);
            const data = await get(ENDPOINTS.ALERTAS.BASE);

            const notificationsArray = Array.isArray(data) ? data : [];
            
            const sortedNotifications = notificationsArray.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotifications(sortedNotifications);

            const unread = sortedNotifications.filter((n) => !n.isRead).length;
            setUnreadCount(unread);

            const criticalUnread = sortedNotifications.filter(
                (n) => !n.isRead && NOTIFICATION_TYPES[n.type]?.priority >= 3
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
            await patch(ENDPOINTS.ALERTAS.MARK_READ(id));

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await patch(ENDPOINTS.ALERTAS.MARK_ALL_READ);

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await del(ENDPOINTS.ALERTAS.DELETE(id));

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
        }
    };

    const deleteMultiple = async (ids) => {
        try {
            await Promise.all(
                ids.map((id) => del(ENDPOINTS.ALERTAS.DELETE(id)))
            );

            const deletedUnread = notifications.filter(
                (n) => ids.includes(n.id) && !n.isRead
            ).length;

            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) => !ids.includes(notification.id)
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - deletedUnread));
        } catch (error) {
            console.error("Error al eliminar notificaciones:", error);
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
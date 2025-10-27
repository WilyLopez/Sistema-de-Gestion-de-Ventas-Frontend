import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { get, del, patch } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";
import { NOTIFICATIONS_CONFIG, NOTIFICATION_TYPES } from "@utils/constants";
import { useSound } from "@hooks/useSound";
import { AuthContext } from "./AuthContext"; // Ajusta según tu estructura

// Crear contexto
const NotificationContext = createContext(null);

// Provider del contexto
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorCount, setErrorCount] = useState(0); // Contador de errores
    const { playCritical, playNotification } = useSound();
    const { isAuthenticated } = useContext(AuthContext); // Obtén el estado de autenticación

    // Fetch de notificaciones
    const fetchNotifications = useCallback(async () => {
        if (!NOTIFICATIONS_CONFIG.ENABLED || !isAuthenticated) {
            console.log("Notificaciones deshabilitadas o usuario no autenticado");
            return;
        }

        try {
            setIsLoading(true);
            const data = await get(ENDPOINTS.ALERTAS.BASE);

            // Ordenar por fecha descendente
            const sortedNotifications = data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotifications(sortedNotifications);

            // Contar no leídas
            const unread = sortedNotifications.filter((n) => !n.isRead).length;
            setUnreadCount(unread);

            // Reproducir sonido si hay notificaciones críticas nuevas
            const criticalUnread = sortedNotifications.filter(
                (n) => !n.isRead && NOTIFICATION_TYPES[n.type]?.priority >= 3
            );

            if (criticalUnread.length > 0) {
                playCritical();
            }

            // Resetear contador de errores tras éxito
            setErrorCount(0);
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
            setErrorCount((prev) => prev + 1);
            if (error.response?.status === 401) {
                console.log("Error 401: Deteniendo solicitudes y redirigiendo...");
                // Opcional: Redirigir al login
                // window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
        }
    }, [playCritical, isAuthenticated]);

    // Auto-refresh de notificaciones
    useEffect(() => {
        if (!NOTIFICATIONS_CONFIG.ENABLED || !isAuthenticated || errorCount >= 3) {
            console.log("Intervalo detenido: notificaciones deshabilitadas, usuario no autenticado o demasiados errores");
            return;
        }

        fetchNotifications();

        const intervalId = setInterval(
            fetchNotifications,
            NOTIFICATIONS_CONFIG.REFRESH_INTERVAL || 30000 // Default a 30 segundos
        );

        return () => clearInterval(intervalId);
    }, [fetchNotifications, isAuthenticated, errorCount]);

    // Marcar notificación como leída
    const markAsRead = async (id) => {
        try {
            await patch(ENDPOINTS.ALERTAS.MARK_READ(id)); // Cambiado de ALERTS a ALERTAS

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

    // Marcar todas como leídas
    const markAllAsRead = async () => {
        try {
            await patch(ENDPOINTS.ALERTAS.MARK_ALL_READ); // Cambiado de ALERTS a ALERTAS

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

    // Eliminar notificación
    const deleteNotification = async (id) => {
        try {
            await del(ENDPOINTS.ALERTAS.DELETE(id)); // Cambiado de ALERTS a ALERTAS

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

    // Eliminar múltiples notificaciones
    const deleteMultiple = async (ids) => {
        try {
            await Promise.all(
                ids.map((id) => del(ENDPOINTS.ALERTAS.DELETE(id))) // Cambiado de ALERTS a ALERTAS
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

    // Obtener notificaciones no leídas
    const getUnreadNotifications = () => {
        return notifications.filter((n) => !n.isRead);
    };

    // Obtener notificaciones leídas
    const getReadNotifications = () => {
        return notifications.filter((n) => n.isRead);
    };

    // Obtener notificaciones por tipo
    const getNotificationsByType = (type) => {
        return notifications.filter((n) => n.type === type);
    };

    // Agregar notificación manualmente (para testing o notificaciones locales)
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

    // Valor del contexto
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
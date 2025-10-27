//src/hooks/useNotifications.js
import { useContext } from "react";
import { NotificationContext } from "@context/NotificationContext";

// Hook para usar el contexto de notificaciones
export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotifications debe usarse dentro de un NotificationProvider'
        );
    }

    return context;
};

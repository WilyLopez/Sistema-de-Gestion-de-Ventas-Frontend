import { useAuth } from "./useAuth";
import {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
} from "@utils/permissions";

// Hook para verificar permisos del usuario actual
export const usePermissions = () => {
    const { user } = useAuth();

    // Verificar un permiso específico
    const can = (permission) => {
        if (!user) return false;
        return hasPermission(user.rol, permission);
    };

    // Verificar múltiples permisos (AND)
    const canAll = (permissions) => {
        if (!user) return false;
        return hasAllPermissions(user.rol, permissions);
    };

    // Verificar múltiples permisos (OR)
    const canAny = (permissions) => {
        if (!user) return false;
        return hasAnyPermission(user.rol, permissions);
    };

    // Verificar si puede crear
    const canCreate = (resource) => {
        return can(`${resource}.create`);
    };

    // Verificar si puede editar
    const canEdit = (resource) => {
        return can(`${resource}.edit`);
    };

    // Verificar si puede eliminar
    const canDelete = (resource) => {
        return can(`${resource}.delete`);
    };

    // Verificar si puede ver
    const canView = (resource) => {
        return can(`${resource}.view`);
    };

    return {
        can,
        canAll,
        canAny,
        canCreate,
        canEdit,
        canDelete,
        canView,
    };
};

import { ROLES } from "./constants";

// Matriz de permisos por rol
const PERMISSIONS_MATRIX = {
    [ROLES.ADMIN]: {
        // Usuarios
        "users.view": true,
        "users.create": true,
        "users.edit": true,
        "users.delete": true,
        "users.activate": true,
        "users.deactivate": true,

        // Roles
        "roles.view": true,
        "roles.create": true,
        "roles.edit": true,
        "roles.delete": true,

        // Productos
        "products.view": true,
        "products.create": true,
        "products.edit": true,
        "products.delete": true,
        "products.stock": true,

        // Categorías
        "categories.view": true,
        "categories.create": true,
        "categories.edit": true,
        "categories.delete": true,

        // Proveedores
        "suppliers.view": true,
        "suppliers.create": true,
        "suppliers.edit": true,
        "suppliers.delete": true,

        // Clientes
        "clients.view": true,
        "clients.create": true,
        "clients.edit": true,
        "clients.delete": true,

        // Ventas
        "sales.view": true,
        "sales.create": true,
        "sales.cancel": true,
        "sales.view_all": true,

        // Devoluciones
        "returns.view": true,
        "returns.create": true,
        "returns.process": true,
        "returns.approve": true,

        // Inventario
        "inventory.view": true,
        "inventory.entry": true,
        "inventory.exit": true,
        "inventory.adjustment": true,
        "inventory.movements": true,

        // Reportes
        "reports.view": true,
        "reports.sales": true,
        "reports.inventory": true,
        "reports.audit": true,
        "reports.export": true,

        // Auditoría
        "audit.view": true,
        "audit.export": true,

        // Configuración
        "settings.view": true,
        "settings.edit": true,

        // Notificaciones
        "notifications.view": true,
        "notifications.manage": true,
    },

    [ROLES.SELLER]: {
        // Usuarios
        "users.view": false,
        "users.create": false,
        "users.edit": false,
        "users.delete": false,

        // Roles
        "roles.view": false,
        "roles.create": false,
        "roles.edit": false,
        "roles.delete": false,

        // Productos
        "products.view": true,
        "products.create": false,
        "products.edit": false,
        "products.delete": false,
        "products.stock": false,

        // Categorías
        "categories.view": true,
        "categories.create": false,
        "categories.edit": false,
        "categories.delete": false,

        // Proveedores
        "suppliers.view": false,
        "suppliers.create": false,
        "suppliers.edit": false,
        "suppliers.delete": false,

        // Clientes
        "clients.view": true,
        "clients.create": true,
        "clients.edit": true,
        "clients.delete": false,

        // Ventas
        "sales.view": true,
        "sales.create": true,
        "sales.cancel": false,
        "sales.view_all": false, // Solo ve sus propias ventas

        // Devoluciones
        "returns.view": true,
        "returns.create": true,
        "returns.process": true,
        "returns.approve": false,

        // Inventario
        "inventory.view": true,
        "inventory.entry": false,
        "inventory.exit": false,
        "inventory.adjustment": false,
        "inventory.movements": false,

        // Reportes
        "reports.view": true,
        "reports.sales": true, // Solo reportes propios
        "reports.inventory": false,
        "reports.audit": false,
        "reports.export": true,

        // Auditoría
        "audit.view": false,
        "audit.export": false,

        // Configuración
        "settings.view": false,
        "settings.edit": false,

        // Notificaciones
        "notifications.view": true,
        "notifications.manage": false,
    },

    [ROLES.EMPLOYEE]: {
        // Usuarios
        "users.view": false,
        "users.create": false,
        "users.edit": false,
        "users.delete": false,

        // Roles
        "roles.view": false,
        "roles.create": false,
        "roles.edit": false,
        "roles.delete": false,

        // Productos
        "products.view": true,
        "products.create": false,
        "products.edit": false,
        "products.delete": false,
        "products.stock": false,

        // Categorías
        "categories.view": true,
        "categories.create": false,
        "categories.edit": false,
        "categories.delete": false,

        // Proveedores
        "suppliers.view": false,
        "suppliers.create": false,
        "suppliers.edit": false,
        "suppliers.delete": false,

        // Clientes
        "clients.view": true,
        "clients.create": false,
        "clients.edit": false,
        "clients.delete": false,

        // Ventas
        "sales.view": true,
        "sales.create": false,
        "sales.cancel": false,
        "sales.view_all": true,

        // Devoluciones
        "returns.view": true,
        "returns.create": false,
        "returns.process": false,
        "returns.approve": false,

        // Inventario
        "inventory.view": true,
        "inventory.entry": false,
        "inventory.exit": false,
        "inventory.adjustment": false,
        "inventory.movements": true,

        // Reportes
        "reports.view": true,
        "reports.sales": true,
        "reports.inventory": true,
        "reports.audit": false,
        "reports.export": true,

        // Auditoría
        "audit.view": false,
        "audit.export": false,

        // Configuración
        "settings.view": false,
        "settings.edit": false,

        // Notificaciones
        "notifications.view": true,
        "notifications.manage": false,
    },
};

// Verificar si un rol tiene un permiso específico
export const hasPermission = (role, permission) => {
    if (!role || !permission) return false;

    const rolePermissions = PERMISSIONS_MATRIX[role];

    if (!rolePermissions) return false;

    return rolePermissions[permission] === true;
};

// Verificar múltiples permisos (AND lógico)
export const hasAllPermissions = (role, permissions) => {
    if (!Array.isArray(permissions)) return false;

    return permissions.every((permission) => hasPermission(role, permission));
};

// Verificar múltiples permisos (OR lógico)
export const hasAnyPermission = (role, permissions) => {
    if (!Array.isArray(permissions)) return false;

    return permissions.some((permission) => hasPermission(role, permission));
};

// Obtener todos los permisos de un rol
export const getRolePermissions = (role) => {
    return PERMISSIONS_MATRIX[role] || {};
};

// Verificar si un usuario puede acceder a una ruta
export const canAccessRoute = (role, routePath) => {
    const routePermissions = {
        "/admin/usuarios": "users.view",
        "/admin/usuarios/crear": "users.create",
        "/admin/roles": "roles.view",
        "/admin/productos": "products.view",
        "/admin/productos/crear": "products.create",
        "/admin/categorias": "categories.view",
        "/admin/proveedores": "suppliers.view",
        "/admin/ventas": "sales.view_all",
        "/admin/devoluciones": "returns.view",
        "/admin/inventario": "inventory.view",
        "/admin/reportes": "reports.view",
        "/admin/auditoria": "audit.view",
        "/admin/configuracion": "settings.view",
        "/vendedor/nueva-venta": "sales.create",
        "/vendedor/mis-ventas": "sales.view",
        "/vendedor/clientes": "clients.view",
        "/empleado/stock": "inventory.view",
        "/empleado/reportes": "reports.view",
    };

    const requiredPermission = routePermissions[routePath];

    if (!requiredPermission) return true; // Ruta sin restricción específica

    return hasPermission(role, requiredPermission);
};

// Filtrar rutas del menú según permisos
export const getAuthorizedMenuItems = (role, menuItems) => {
    return menuItems.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(role, item.permission);
    });
};

// src/utils/permissions.js
import { ROLES } from "./constants";

// Matriz de permisos por rol
const PERMISSIONS_MATRIX = {
    [ROLES.ADMIN]: {
        "dashboard.view": true,
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
        "dashboard.view": true,
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
        "dashboard.view": true,
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
    // Mapeo EXACTO basado en tu routes.config.js
    const routePermissions = {
        // ==================== ADMIN ====================
        "/admin/dashboard": "dashboard.view",
        
        // Usuarios - Admin
        "/admin/usuarios": "users.view",
        "/admin/usuarios/crear": "users.create",
        "/admin/usuarios/:id/editar": "users.edit", 
        "/admin/usuarios/:id": "users.view",
        
        // Roles - Admin
        "/admin/roles": "roles.view",
        
        // Productos - Admin
        "/admin/productos": "products.view",
        "/admin/productos/crear": "products.create",
        "/admin/productos/:id/editar": "products.edit",
        "/admin/productos/:id": "products.view",
        
        // Categorías - Admin
        "/admin/categorias": "categories.view",
        
        // Proveedores - Admin  
        "/admin/proveedores": "suppliers.view",
        
        // Inventario - Admin
        "/admin/inventario": "inventory.view",
        
        // Ventas - Admin
        "/admin/ventas": "sales.view_all",
        "/admin/ventas/:id": "sales.view_all",
        
        // Devoluciones - Admin
        "/admin/devoluciones": "returns.view",
        
        // Reportes - Admin
        "/admin/reportes": "reports.view",
        
        // Auditoría - Admin
        "/admin/auditoria": "audit.view",
        
        // Configuración - Admin
        "/admin/configuracion": "settings.view",

        // ==================== VENDEDOR ====================
        "/vendedor/dashboard": "dashboard.view",
        "/vendedor/nueva-venta": "sales.create",
        "/vendedor/mis-ventas": "sales.view",
        "/vendedor/mis-ventas/:id": "sales.view",
        "/vendedor/clientes": "clients.view",
        "/vendedor/clientes/crear": "clients.create",
        "/vendedor/devoluciones": "returns.view",
        "/vendedor/stock": "products.view",
        "/vendedor/reporte-diario": "reports.view",

        // ==================== EMPLEADO ====================  
        "/empleado/dashboard": "dashboard.view",
        "/empleado/stock": "inventory.view",
        "/empleado/stock/alertas": "inventory.view",
        "/empleado/stock/movimientos": "inventory.movements",
        "/empleado/reportes/ventas": "reports.sales",
        "/empleado/reportes/inventario": "reports.inventory",
        "/empleado/reportes/devoluciones": "reports.view",
        "/empleado/busqueda": "products.view",

        // ==================== RUTAS COMUNES ====================
        "/perfil": true,
        "/cambiar-contrasena": true,
        "/preferencias": true,
        "/ayuda": true,
        "/unauthorized": true,
        
        // ==================== RUTAS PÚBLICAS ====================
        "/login": true,
        "/recuperar-contrasena": true,
        "*": true, // NotFound - acceso público
    };

    // Buscar coincidencia exacta primero
    let requiredPermission = routePermissions[routePath];

    // Si no hay coincidencia exacta, buscar patrones con parámetros
    if (requiredPermission === undefined) {
        const routeKeys = Object.keys(routePermissions);
        const matchingKey = routeKeys.find(key => {
            if (key.includes(':')) {
                // Convertir patrón de ruta a regex (maneja :id, :param, etc.)
                const pattern = key.replace(/:[^/]+/g, '[^/]+');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(routePath);
            }
            return false;
        });
        
        requiredPermission = matchingKey ? routePermissions[matchingKey] : undefined;
    }

    // Si no está en el mapeo, denegar por defecto (seguridad)
    if (requiredPermission === undefined) {
        console.warn(`🔒 Ruta no mapeada: ${routePath} - Acceso denegado por defecto`);
        return false;
    }
    
    // Si es `true`, acceso libre (solo requiere autenticación para rutas comunes)
    if (requiredPermission === true) {
        // Para rutas públicas, no requiere autenticación
        const publicRoutes = ['/login', '/recuperar-contrasena', '/unauthorized', '*'];
        if (publicRoutes.includes(routePath)) return true;
        
        // Para rutas comunes, requiere que el usuario esté autenticado
        // (esto se manejará en ProtectedRoute)
        return true;
    }

    return hasPermission(role, requiredPermission);
};

// Función mejorada para obtener título de página
export const getRouteTitle = (routePath) => {
    const routeTitles = {
        // Admin
        "/admin/dashboard": "Dashboard",
        "/admin/usuarios": "Usuarios",
        "/admin/usuarios/crear": "Crear Usuario", 
        "/admin/usuarios/:id/editar": "Editar Usuario",
        "/admin/usuarios/:id": "Detalle de Usuario",
        "/admin/roles": "Roles y Permisos",
        "/admin/productos": "Productos",
        "/admin/productos/crear": "Crear Producto",
        "/admin/productos/:id/editar": "Editar Producto",
        "/admin/productos/:id": "Detalle de Producto",
        "/admin/categorias": "Categorías", 
        "/admin/proveedores": "Proveedores",
        "/admin/inventario": "Stock y Alertas",
        "/admin/ventas": "Ventas",
        "/admin/ventas/:id": "Detalle de Venta",
        "/admin/devoluciones": "Devoluciones",
        "/admin/reportes": "Reportes", 
        "/admin/auditoria": "Auditoría",
        "/admin/configuracion": "Configuración del Sistema",

        // Vendedor
        "/vendedor/dashboard": "Dashboard",
        "/vendedor/nueva-venta": "Nueva Venta", 
        "/vendedor/mis-ventas": "Mis Ventas",
        "/vendedor/mis-ventas/:id": "Detalle de Venta",
        "/vendedor/clientes": "Clientes",
        "/vendedor/clientes/crear": "Registrar Cliente",
        "/vendedor/devoluciones": "Devoluciones",
        "/vendedor/stock": "Consultar Stock", 
        "/vendedor/reporte-diario": "Reporte Diario",

        // Empleado  
        "/empleado/dashboard": "Dashboard",
        "/empleado/stock": "Consultar Stock",
        "/empleado/stock/alertas": "Alertas de Stock",
        "/empleado/stock/movimientos": "Movimientos de Inventario",
        "/empleado/reportes/ventas": "Reporte de Ventas", 
        "/empleado/reportes/inventario": "Reporte de Inventario",
        "/empleado/reportes/devoluciones": "Reporte de Devoluciones",
        "/empleado/busqueda": "Búsqueda Avanzada",

        // Comunes
        "/perfil": "Mi Perfil", 
        "/cambiar-contrasena": "Cambiar Contraseña",
        "/preferencias": "Preferencias",
        "/ayuda": "Ayuda",
        
        // Públicas
        "/login": "Iniciar Sesión",
        "/recuperar-contrasena": "Recuperar Contraseña",
        "/unauthorized": "No Autorizado",
        "*": "Página No Encontrada",
    };

    // Buscar coincidencia exacta primero
    let title = routeTitles[routePath];

    // Si no hay coincidencia exacta, buscar patrones con parámetros
    if (title === undefined) {
        const routeKeys = Object.keys(routeTitles);
        const matchingKey = routeKeys.find(key => {
            if (key.includes(':')) {
                const pattern = key.replace(/:[^/]+/g, '[^/]+');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(routePath);
            }
            return false;
        });
        
        title = matchingKey ? routeTitles[matchingKey] : "SGVIA";
    }

    return title || "SGVIA";
};

// Filtrar rutas del menú según permisos
export const getAuthorizedMenuItems = (role, menuItems) => {
    return menuItems.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(role, item.permission);
    });
};

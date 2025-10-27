// src/router/routes.config.js
import { ROLES } from '@utils/constants';

/**
 * Configuración centralizada de rutas del sistema
 * Incluye metadata: requiresAuth, allowedRoles, title
 */
const routesConfig = {
    // ==================== RUTAS PÚBLICAS ====================
    public: {
        login: {
            path: '/login',
            requiresAuth: false,
        },
        forgotPassword: {
            path: '/recuperar-contrasena',
            requiresAuth: false,
        },
    },

    // ==================== RUTAS ADMINISTRADOR ====================
    admin: {
        dashboard: {
            path: '/admin/dashboard',
            allowedRoles: [ROLES.ADMIN],
            title: 'Dashboard',
        },
        
        // Usuarios
        usuarios: {
            path: '/admin/usuarios',
            allowedRoles: [ROLES.ADMIN],
            title: 'Usuarios',
        },
        usuarioCrear: {
            path: '/admin/usuarios/crear',
            allowedRoles: [ROLES.ADMIN],
            title: 'Crear Usuario',
        },
        usuarioEditar: {
            path: '/admin/usuarios/:id/editar',
            allowedRoles: [ROLES.ADMIN],
            title: 'Editar Usuario',
        },
        usuarioDetalle: {
            path: '/admin/usuarios/:id',
            allowedRoles: [ROLES.ADMIN],
            title: 'Detalle de Usuario',
        },

        // Roles
        roles: {
            path: '/admin/roles',
            allowedRoles: [ROLES.ADMIN],
            title: 'Roles y Permisos',
        },

        // Productos
        productos: {
            path: '/admin/productos',
            allowedRoles: [ROLES.ADMIN],
            title: 'Productos',
        },
        productoCrear: {
            path: '/admin/productos/crear',
            allowedRoles: [ROLES.ADMIN],
            title: 'Crear Producto',
        },
        productoEditar: {
            path: '/admin/productos/:id/editar',
            allowedRoles: [ROLES.ADMIN],
            title: 'Editar Producto',
        },
        productoDetalle: {
            path: '/admin/productos/:id',
            allowedRoles: [ROLES.ADMIN],
            title: 'Detalle de Producto',
        },

        // Categorías
        categorias: {
            path: '/admin/categorias',
            allowedRoles: [ROLES.ADMIN],
            title: 'Categorías',
        },

        // Proveedores
        proveedores: {
            path: '/admin/proveedores',
            allowedRoles: [ROLES.ADMIN],
            title: 'Proveedores',
        },

        // Inventario
        inventario: {
            path: '/admin/inventario',
            allowedRoles: [ROLES.ADMIN],
            title: 'Stock y Alertas',
        },

        // Ventas
        ventas: {
            path: '/admin/ventas',
            allowedRoles: [ROLES.ADMIN],
            title: 'Ventas',
        },
        ventaDetalle: {
            path: '/admin/ventas/:id',
            allowedRoles: [ROLES.ADMIN],
            title: 'Detalle de Venta',
        },

        // Devoluciones
        devoluciones: {
            path: '/admin/devoluciones',
            allowedRoles: [ROLES.ADMIN],
            title: 'Devoluciones',
        },

        // Reportes
        reportes: {
            path: '/admin/reportes',
            allowedRoles: [ROLES.ADMIN],
            title: 'Reportes',
        },

        // Auditoría
        auditoria: {
            path: '/admin/auditoria',
            allowedRoles: [ROLES.ADMIN],
            title: 'Auditoría',
        },

        // Configuración
        configuracion: {
            path: '/admin/configuracion',
            allowedRoles: [ROLES.ADMIN],
            title: 'Configuración del Sistema',
        },
    },

    // ==================== RUTAS VENDEDOR ====================
    seller: {
        dashboard: {
            path: '/vendedor/dashboard',
            allowedRoles: [ROLES.SELLER],
            title: 'Dashboard',
        },
        nuevaVenta: {
            path: '/vendedor/nueva-venta',
            allowedRoles: [ROLES.SELLER],
            title: 'Nueva Venta',
        },
        misVentas: {
            path: '/vendedor/mis-ventas',
            allowedRoles: [ROLES.SELLER],
            title: 'Mis Ventas',
        },
        ventaDetalle: {
            path: '/vendedor/mis-ventas/:id',
            allowedRoles: [ROLES.SELLER],
            title: 'Detalle de Venta',
        },
        clientes: {
            path: '/vendedor/clientes',
            allowedRoles: [ROLES.SELLER],
            title: 'Clientes',
        },
        clienteCrear: {
            path: '/vendedor/clientes/crear',
            allowedRoles: [ROLES.SELLER],
            title: 'Registrar Cliente',
        },
        devoluciones: {
            path: '/vendedor/devoluciones',
            allowedRoles: [ROLES.SELLER],
            title: 'Devoluciones',
        },
        stock: {
            path: '/vendedor/stock',
            allowedRoles: [ROLES.SELLER],
            title: 'Consultar Stock',
        },
        reporteDiario: {
            path: '/vendedor/reporte-diario',
            allowedRoles: [ROLES.SELLER],
            title: 'Reporte Diario',
        },
    },

    // ==================== RUTAS EMPLEADO ====================
    employee: {
        dashboard: {
            path: '/empleado/dashboard',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Dashboard',
        },
        stock: {
            path: '/empleado/stock',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Consultar Stock',
        },
        stockAlertas: {
            path: '/empleado/stock/alertas',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Alertas de Stock',
        },
        stockMovimientos: {
            path: '/empleado/stock/movimientos',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Movimientos de Inventario',
        },
        reportesVentas: {
            path: '/empleado/reportes/ventas',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Reporte de Ventas',
        },
        reportesInventario: {
            path: '/empleado/reportes/inventario',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Reporte de Inventario',
        },
        reportesDevoluciones: {
            path: '/empleado/reportes/devoluciones',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Reporte de Devoluciones',
        },
        busqueda: {
            path: '/empleado/busqueda',
            allowedRoles: [ROLES.EMPLOYEE],
            title: 'Búsqueda Avanzada',
        },
    },

    // ==================== RUTAS COMUNES ====================
    common: {
        perfil: {
            path: '/perfil',
            allowedRoles: [ROLES.ADMIN, ROLES.SELLER, ROLES.EMPLOYEE],
            title: 'Mi Perfil',
        },
        cambiarContrasena: {
            path: '/cambiar-contrasena',
            allowedRoles: [ROLES.ADMIN, ROLES.SELLER, ROLES.EMPLOYEE],
            title: 'Cambiar Contraseña',
        },
        preferencias: {
            path: '/preferencias',
            allowedRoles: [ROLES.ADMIN, ROLES.SELLER, ROLES.EMPLOYEE],
            title: 'Preferencias',
        },
        ayuda: {
            path: '/ayuda',
            allowedRoles: [ROLES.ADMIN, ROLES.SELLER, ROLES.EMPLOYEE],
            title: 'Ayuda',
        },
        unauthorized: {
            path: '/unauthorized',
            requiresAuth: false,
        },
        notFound: {
            path: '*',
            requiresAuth: false,
        },
    },
};

export default routesConfig;
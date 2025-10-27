//src/api/endpoints.js
const ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        LOGOUT: "/api/auth/logout",
        REFRESH: "/api/auth/refresh",
        VALIDATE: "/api/auth/validate",
    },
    USUARIOS: {
        BASE: "/api/usuarios",
        BY_ID: (id) => `/api/usuarios/${id}`,
        ACTIVAR: (id) => `/api/usuarios/${id}/activar`,
        DESACTIVAR: (id) => `/api/usuarios/${id}`,
        BY_ESTADO: (estado) => `/api/usuarios/estado/${estado}`,
        BUSCAR: "/api/usuarios/buscar",
        CAMBIAR_CONTRASENA: (id) => `/api/usuarios/${id}/cambiar-contrasena`,
        PERFIL: "/api/usuarios/perfil",
        ESTADISTICAS: "/api/usuarios/estadisticas",
    },
    ROLES: {
        BASE: "/api/roles",
        BY_ID: (id) => `/api/roles/${id}`,
        BY_NOMBRE: (nombre) => `/api/roles/nombre/${nombre}`,
        ACTIVOS: "/api/roles/activos",
        ASIGNAR_PERMISOS: (id) => `/api/roles/${id}/permisos`,
        REMOVER_PERMISO: (id, idPermiso) =>
            `/api/roles/${id}/permisos/${idPermiso}`,
        OBTENER_PERMISOS: (id) => `/api/roles/${id}/permisos`,
        TIENE_PERMISO: (id, nombrePermiso) =>
            `/api/roles/${id}/tiene-permiso/${nombrePermiso}`,
        EXISTE_NOMBRE: "/api/roles/existe-nombre",
        ESTADISTICAS: "/api/roles/estadisticas",
    },
    PRODUCTOS: {
        BASE: "/api/productos",
        BY_ID: (id) => `/api/productos/${id}`,
        BY_CODIGO: (codigo) => `/api/productos/codigo/${codigo}`,
        BUSCAR: "/api/productos/buscar",
        BY_CATEGORIA: (idCategoria) =>
            `/api/productos/categoria/${idCategoria}`,
        BY_GENERO: (genero) => `/api/productos/genero/${genero}`,
        BY_MARCA: (marca) => `/api/productos/marca/${marca}`,
        BY_RANGO_PRECIO: "/api/productos/precio",
        STOCK_BAJO: "/api/productos/stock-bajo",
        AGOTADOS: "/api/productos/agotados",
        ACTUALIZAR_STOCK: (id) => `/api/productos/${id}/stock`,
        VERIFICAR_STOCK: (id) => `/api/productos/${id}/verificar-stock`,
        MARGEN_GANANCIA: (id) => `/api/productos/${id}/margen-ganancia`,
    },
    CATEGORIAS: {
        BASE: "/api/categorias",
        BY_ID: (id) => `/api/categorias/${id}`,
        ACTIVAS: "/api/categorias/activas",
        BUSCAR: "/api/categorias/buscar",
        TIENE_PRODUCTOS: (id) => `/api/categorias/${id}/tiene-productos`,
        EXISTE_NOMBRE: "/api/categorias/existe-nombre",
    },
    PROVEEDORES: {
        BASE: "/api/proveedores",
        BY_ID: (id) => `/api/proveedores/${id}`,
        BY_RUC: (ruc) => `/api/proveedores/ruc/${ruc}`,
        ACTIVOS: "/api/proveedores/activos",
        BUSCAR: "/api/proveedores/buscar",
        VALIDAR_RUC: (ruc) => `/api/proveedores/validar-ruc/${ruc}`,
        EXISTE_RUC: (ruc) => `/api/proveedores/existe-ruc/${ruc}`,
        ESTADISTICAS: "/api/proveedores/estadisticas",
    },
    CLIENTES: {
        BASE: "/api/clientes",
        BY_ID: (id) => `/api/clientes/${id}`,
        BY_DOCUMENTO: "/api/clientes/documento",
        ACTIVOS: "/api/clientes/activos",
        BUSCAR: "/api/clientes/buscar",
        VALIDAR_DOCUMENTO: "/api/clientes/validar-documento",
        EXISTE_DOCUMENTO: "/api/clientes/existe-documento",
        EXISTE_CORREO: "/api/clientes/existe-correo",
        ESTADISTICAS: "/api/clientes/estadisticas",
    },
    VENTAS: {
        BASE: "/api/ventas",
        BY_ID: (id) => `/api/ventas/${id}`,
        BY_CODIGO: (codigo) => `/api/ventas/codigo/${codigo}`,
        BUSCAR: "/api/ventas/buscar",
        ANULAR: (id) => `/api/ventas/${id}/anular`,
        PUEDE_ANULARSE: (id) => `/api/ventas/${id}/puede-anularse`,
        BY_PERIODO: "/api/ventas/periodo",
        ESTADISTICAS: "/api/ventas/estadisticas",
    },
    DEVOLUCIONES: {
        BASE: "/api/devoluciones",
        BY_ID: (id) => `/api/devoluciones/${id}`,
        BY_VENTA: (idVenta) => `/api/devoluciones/venta/${idVenta}`,
        APROBAR: (id) => `/api/devoluciones/${id}/aprobar`,
        RECHAZAR: (id) => `/api/devoluciones/${id}/rechazar`,
        COMPLETAR: (id) => `/api/devoluciones/${id}/completar`,
        BUSCAR: "/api/devoluciones/buscar",
        VERIFICAR_PLAZO: (idVenta) =>
            `/api/devoluciones/verificar-plazo/${idVenta}`,
        VALIDAR_CANTIDAD: "/api/devoluciones/validar-cantidad",
        BY_PERIODO: "/api/devoluciones/periodo",
        ANALISIS_MOTIVOS: "/api/devoluciones/analisis-motivos",
        PRODUCTOS_MAS_DEVUELTOS: "/api/devoluciones/productos-mas-devueltos",
    },
    INVENTARIO: {
        BASE: "/api/inventario",
        ENTRADA: "/api/inventario/entrada",
        AJUSTE: "/api/inventario/ajuste",
        DEVOLUCION: "/api/inventario/devolucion",
        BY_PRODUCTO: (idProducto) => `/api/inventario/producto/${idProducto}`,
        TRAZABILIDAD: (idProducto) =>
            `/api/inventario/trazabilidad/${idProducto}`,
        BUSCAR: "/api/inventario/buscar",
        RESUMEN_PRODUCTO: (idProducto) =>
            `/api/inventario/producto/${idProducto}/resumen`,
    },
    ALERTAS: {
        BASE: "/api/alertas",
        NO_LEIDAS: "/api/alertas/no-leidas",
        CRITICAS: "/api/alertas/criticas",
        MARCAR_LEIDA: (id) => `/api/alertas/${id}/marcar-leida`,
        MARK_READ: (id) => `/api/alertas/${id}/marcar-leida`,
        MARK_ALL_READ: "/api/alertas/marcar-todas-leidas", 
        DELETE: (id) => `/api/alertas/${id}`,
        BUSCAR: "/api/alertas/buscar",
        CONTEO_POR_URGENCIA: "/api/alertas/conteo-por-urgencia",
        VERIFICAR: "/api/alertas/verificar",
        RESUMEN: "/api/alertas/resumen",
    },
    PEDIDOS: {
        BASE: "/api/pedidos",
        BY_ID: (id) => `/api/pedidos/${id}`,
        ACTUALIZAR_ESTADO: (id) => `/api/pedidos/${id}/estado`,
        CANCELAR: (id) => `/api/pedidos/${id}/cancelar`,
        BUSCAR: "/api/pedidos/buscar",
        ATRASADOS: "/api/pedidos/atrasados",
        BY_CLIENTE: (idCliente) => `/api/pedidos/cliente/${idCliente}`,
        BY_USUARIO: (idUsuario) => `/api/pedidos/usuario/${idUsuario}`,
        BY_ESTADO: (estado) => `/api/pedidos/estado/${estado}`,
        GENERAR_CODIGO: "/api/pedidos/generar-codigo",
    },
    REPORTES: {
        VENTAS_EXCEL: "/api/reportes/ventas/excel",
        STOCK_EXCEL: "/api/reportes/stock/excel",
        STOCK_BAJO_EXCEL: "/api/reportes/stock-bajo/excel",
        MOVIMIENTOS_EXCEL: "/api/reportes/movimientos/excel",
        DEVOLUCIONES_EXCEL: "/api/reportes/devoluciones/excel",
        COMPROBANTE_PDF: (idVenta) =>
            `/api/reportes/comprobante/${idVenta}/pdf`,
        DASHBOARD: "/api/reportes/dashboard",
        VENTAS_POR_CATEGORIA: "/api/reportes/ventas-por-categoria",
        TOP_PRODUCTOS: "/api/reportes/top-productos",
        TEST: "/api/reportes/test",
        DISPONIBLES: "/api/reportes/disponibles",
    },
};

export const buildUrlWithParams = (baseUrl, params = {}) => {
    const cleanParams = Object.entries(params)
        .filter(
            ([, value]) => value !== null && value !== undefined && value !== ""
        )
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    const queryString = new URLSearchParams(cleanParams).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const buildDevolucionesSearchUrl = (filtros) => {
    return buildUrlWithParams(ENDPOINTS.DEVOLUCIONES.BUSCAR, {
        idVenta: filtros.idVenta,
        idCliente: filtros.idCliente,
        idUsuario: filtros.idUsuario,
        estado: filtros.estado,
        fechaInicio: filtros.fechaInicio?.toISOString(),
        fechaFin: filtros.fechaFin?.toISOString(),
        page: filtros.page || 0,
        size: filtros.size || 20,
        sort: filtros.sort || "fechaDevolucion,desc",
    });
};

export const buildInventarioSearchUrl = (filtros) => {
    return buildUrlWithParams(ENDPOINTS.INVENTARIO.BUSCAR, {
        idProducto: filtros.idProducto,
        tipoMovimiento: filtros.tipoMovimiento,
        idUsuario: filtros.idUsuario,
        fechaInicio: filtros.fechaInicio?.toISOString(),
        fechaFin: filtros.fechaFin?.toISOString(),
        page: filtros.page || 0,
        size: filtros.size || 20,
        sort: filtros.sort || "fechaMovimiento,desc",
    });
};

export const buildVentasSearchUrl = (filtros) => {
    return buildUrlWithParams(ENDPOINTS.VENTAS.BUSCAR, {
        codigoVenta: filtros.codigoVenta,
        idCliente: filtros.idCliente,
        idUsuario: filtros.idUsuario,
        estado: filtros.estado,
        idMetodoPago: filtros.idMetodoPago,
        fechaInicio: filtros.fechaInicio?.toISOString(),
        fechaFin: filtros.fechaFin?.toISOString(),
        page: filtros.page || 0,
        size: filtros.size || 20,
        sort: filtros.sort || "fechaCreacion,desc",
    });
};

export const buildPedidosSearchUrl = (filtros) => {
    return buildUrlWithParams(ENDPOINTS.PEDIDOS.BUSCAR, {
        codigoPedido: filtros.codigoPedido,
        idCliente: filtros.idCliente,
        idUsuario: filtros.idUsuario,
        estado: filtros.estado,
        fechaInicio: filtros.fechaInicio?.toISOString(),
        fechaFin: filtros.fechaFin?.toISOString(),
        page: filtros.page || 0,
        size: filtros.size || 20,
        sort: filtros.sort || "fechaCreacion,desc",
    });
};

export const buildAlertasSearchUrl = (filtros) => {
    return buildUrlWithParams(ENDPOINTS.ALERTAS.BUSCAR, {
        idProducto: filtros.idProducto,
        tipoAlerta: filtros.tipoAlerta,
        nivelUrgencia: filtros.nivelUrgencia,
        leida: filtros.leida,
        fechaInicio: filtros.fechaInicio?.toISOString(),
        fechaFin: filtros.fechaFin?.toISOString(),
        page: filtros.page || 0,
        size: filtros.size || 20,
        sort: filtros.sort || "fechaGeneracion,desc",
    });
};

export const buildReporteUrl = (
    baseUrl,
    fechaInicio,
    fechaFin,
    additionalParams = {}
) => {
    return buildUrlWithParams(baseUrl, {
        fechaInicio: fechaInicio?.toISOString(),
        fechaFin: fechaFin?.toISOString(),
        ...additionalParams,
    });
};

export const PAGINATION_DEFAULTS = {
    PAGE: 0,
    SIZE: 20,
    SORT_ASC: "asc",
    SORT_DESC: "desc",
};

export const COMMON_SORTS = {
    PRODUCTOS: {
        NOMBRE: "nombre,asc",
        CODIGO: "codigo,asc",
        PRECIO: "precioVenta,asc",
        STOCK: "stock,asc",
    },
    VENTAS: {
        FECHA_DESC: "fechaCreacion,desc",
        FECHA_ASC: "fechaCreacion,asc",
        TOTAL_DESC: "total,desc",
        CODIGO: "codigoVenta,asc",
    },
    DEVOLUCIONES: {
        FECHA_DESC: "fechaDevolucion,desc",
        FECHA_ASC: "fechaDevolucion,asc",
        ESTADO: "estado,asc",
    },
    INVENTARIO: {
        FECHA_DESC: "fechaMovimiento,desc",
        TIPO: "tipoMovimiento,asc",
    },
    ALERTAS: {
        URGENCIA: "nivelUrgencia,desc",
        FECHA_DESC: "fechaGeneracion,desc",
    },
};

export default ENDPOINTS;

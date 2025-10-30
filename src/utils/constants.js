//src/utils/constants.js
// ROLES DEL SISTEMA
export const ROLES = {
    ADMIN: "ADMINISTRADOR",
    SELLER: "VENDEDOR",
    EMPLOYEE: "EMPLEADO",
};

// ESTADOS DE VENTA
export const SALE_STATUS = {
    PAID: "PAGADO",
    CANCELLED: "ANULADO",
    PENDING: "PENDIENTE",
};

// ESTADOS DE PEDIDO
export const ORDER_STATUS = {
    PENDING: "PENDIENTE",
    IN_PROCESS: "EN_PROCESO",
    SHIPPED: "ENVIADO",
    DELIVERED: "ENTREGADO",
    CANCELLED: "CANCELADO",
};

// ESTADOS DE DEVOLUCIÓN
export const RETURN_STATUS = {
    PENDING: "PENDIENTE",
    APPROVED: "APROBADA",
    REJECTED: "RECHAZADA",
    COMPLETED: "COMPLETADA",
};

// TIPOS DE DOCUMENTO
export const DOCUMENT_TYPES = {
    DNI: {
        code: "DNI",
        label: "DNI",
        length: 8,
        pattern: /^\d{8}$/,
    },
    RUC: {
        code: "RUC",
        label: "RUC",
        length: 11,
        pattern: /^\d{11}$/,
    },
    CE: {
        code: "CE",
        label: "Carnet de Extranjería",
        length: 9,
        pattern: /^\d{9}$/,
    },
};

// MÉTODOS DE PAGO
export const PAYMENT_METHODS = {
    CASH: "EFECTIVO",
    CREDIT_CARD: "TARJETA_CREDITO",
    DEBIT_CARD: "TARJETA_DEBITO",
    TRANSFER: "TRANSFERENCIA",
    YAPE: "YAPE",
    PLIN: "PLIN",
};

// TIPOS DE MOVIMIENTO DE INVENTARIO
export const MOVEMENT_TYPES = {
    ENTRY: "ENTRADA",
    EXIT: "SALIDA",
    ADJUSTMENT: "AJUSTE",
    RETURN: "DEVOLUCION",
};

// GÉNEROS DE PRODUCTOS
export const PRODUCT_GENDER = {
    MAN: "HOMBRE",
    WOMAN: "MUJER",
    UNISEX: "UNISEX",
    BOY: "NIÑO",
    GIRL: "NIÑA",
};

// TALLAS
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// MATERIALES
export const MATERIALS = [
    "ALGODÓN",
    "POLIÉSTER",
    "LANA",
    "MEZCLA",
    "SEDA",
    "LINO",
    "CUERO",
    "SINTÉTICO",
];

// TIPOS DE NOTIFICACIÓN
export const NOTIFICATION_TYPES = {
    STOCK_LOW: {
        id: "STOCK_LOW",
        label: "Stock Bajo",
        icon: "AlertTriangle",
        color: "warning",
        sound: "notification.mp3",
        priority: 2,
    },
    STOCK_OUT: {
        id: "STOCK_OUT",
        label: "Stock Agotado",
        icon: "AlertCircle",
        color: "danger",
        sound: "alert-critical.mp3",
        priority: 3,
    },
    STOCK_EXCESS: {
        id: "STOCK_EXCESS",
        label: "Stock Excesivo",
        icon: "Info",
        color: "info",
        sound: null,
        priority: 0,
    },
    RETURN_PENDING: {
        id: "RETURN_PENDING",
        label: "Devolución Pendiente",
        icon: "RotateCcw",
        color: "info",
        sound: "notification.mp3",
        priority: 1,
    },
    SALE_CANCELLED: {
        id: "SALE_CANCELLED",
        label: "Venta Anulada",
        icon: "XCircle",
        color: "danger",
        sound: "notification.mp3",
        priority: 1,
    },
    SYSTEM_UPDATE: {
        id: "SYSTEM_UPDATE",
        label: "Actualización Sistema",
        icon: "Info",
        color: "info",
        sound: null,
        priority: 0,
    },
};

// FILTROS DE NOTIFICACIONES
export const NOTIFICATION_FILTERS = {
    ALL: "all",
    UNREAD: "unread",
    READ: "read",
};

// NIVELES DE STOCK
export const STOCK_LEVELS = {
    CRITICAL: 2,
    LOW: 5,
    NORMAL: 10,
};

// CONFIGURACIÓN DE PAGINACIÓN
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
};

// TASAS DE IMPUESTOS
export const TAX_RATES = {
    IGV: 0.18, // 18% Perú
};

// PLAZOS
export const DEADLINES = {
    RETURN_DAYS: 30,
    CANCELLATION_HOURS: 24,
};

// FORMATOS DE FECHA
export const DATE_FORMATS = {
    SHORT: "dd/MM/yyyy",
    LONG: "dd/MM/yyyy HH:mm:ss",
    TIME_ONLY: "HH:mm",
    ISO: "yyyy-MM-dd'T'HH:mm:ss",
};

// CONFIGURACIÓN DE SESIÓN
export const SESSION = {
    TOKEN_KEY: "sgvia_token",
    USER_KEY: "sgvia_user",
    THEME_KEY: "sgvia_theme",
    SOUND_KEY: "sgvia_sound_enabled",
    TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000, // 30 minutos
};

// MENSAJES DEL SISTEMA
export const MESSAGES = {
    SUCCESS: {
        CREATED: "Registro creado exitosamente",
        UPDATED: "Registro actualizado exitosamente",
        DELETED: "Registro eliminado exitosamente",
        SAVED: "Guardado exitosamente",
    },
    ERROR: {
        GENERIC: "Ha ocurrido un error inesperado",
        NETWORK: "Error de conexión. Verifica tu internet",
        UNAUTHORIZED: "No tienes permisos para realizar esta acción",
        NOT_FOUND: "Recurso no encontrado",
        VALIDATION: "Por favor, corrige los errores en el formulario",
        SESSION_EXPIRED:
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
    },
    CONFIRM: {
        DELETE: "¿Estás seguro de eliminar este registro?",
        CANCEL: "¿Estás seguro de cancelar esta operación?",
        LOGOUT: "¿Deseas cerrar sesión?",
    },
};

// CONFIGURACIÓN DE SONIDOS
export const SOUNDS = {
    ENABLED: import.meta.env.VITE_ENABLE_SOUNDS === "true",
    VOLUME: 0.5,
    FILES: {
        SUCCESS: "success.mp3",
        ERROR: "error.mp3",
        NOTIFICATION: "notification.mp3",
        CRITICAL: "alert-critical.mp3",
    },
};

// CONFIGURACIÓN DE NOTIFICACIONES EN TIEMPO REAL
export const NOTIFICATIONS_CONFIG = {
    ENABLED: import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true",
    REFRESH_INTERVAL:
        parseInt(import.meta.env.VITE_NOTIFICATION_REFRESH_INTERVAL) || 30000,
    MAX_DISPLAY: 5,
};

// CONFIGURACIÓN DE EXPORTACIÓN
export const EXPORT_CONFIG = {
    FORMATS: ["XLSX", "CSV", "PDF"],
    MAX_ROWS: 10000,
};

// REGLAS DE VALIDACIÓN
export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 6,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    CODIGO_MAX_LENGTH: 50,
    PHONE_LENGTH: 9,
    MAX_DISCOUNT_PERCENT: 50,
};

// AGREGAR AL FINAL DE TU constants.js

/**
 * Estilos de urgencia para notificaciones
 * Usados en NotificationItem y NotificationModal
 */
export const URGENCY_STYLES = {
    CRITICO: {
        bg: "bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20",
        border: "border-l-4 border-red-500",
        icon: "text-red-600 dark:text-red-400",
        badge: "bg-red-500",
        bgIcon: "bg-red-100 dark:bg-red-900/20",
        color: "text-red-600 dark:text-red-400",
    },
    ALTO: {
        bg: "bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20",
        border: "border-l-4 border-orange-500",
        icon: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-500",
        bgIcon: "bg-orange-100 dark:bg-orange-900/20",
        color: "text-orange-600 dark:text-orange-400",
    },
    MEDIO: {
        bg: "bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20",
        border: "border-l-4 border-yellow-500",
        icon: "text-yellow-600 dark:text-yellow-400",
        badge: "bg-yellow-500",
        bgIcon: "bg-yellow-100 dark:bg-yellow-900/20",
        color: "text-yellow-600 dark:text-yellow-400",
    },
    BAJO: {
        bg: "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20",
        border: "border-l-4 border-blue-500",
        icon: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-500",
        bgIcon: "bg-blue-100 dark:bg-blue-900/20",
        color: "text-blue-600 dark:text-blue-400",
    },
};

/**
 * Mapeo de tipos de alerta a etiquetas legibles en español
 */
export const ALERT_LABELS = {
    STOCK_MINIMO: "Stock Mínimo",
    STOCK_AGOTADO: "Stock Agotado",
    STOCK_EXCESIVO: "Stock Excesivo",
    REORDEN: "Reorden Automática",
    DEVOLUCION_PENDIENTE: "Devolución Pendiente",
    VENTA_ANULADA: "Venta Anulada",
    ACTUALIZACION_SISTEMA: "Actualización del Sistema",
};

/**
 * Mapeo de iconos de lucide-react por tipo de alerta
 * (Usar en conjunto con: import { AlertTriangle } from 'lucide-react')
 */
export const ALERT_ICON_NAMES = {
    STOCK_MINIMO: "AlertTriangle",
    STOCK_AGOTADO: "AlertCircle",
    STOCK_EXCESIVO: "Package",
    REORDEN: "Info",
    DEVOLUCION_PENDIENTE: "RotateCcw",
    VENTA_ANULADA: "XCircle",
    ACTUALIZACION_SISTEMA: "Info",
};

// API ENDPOINTS BASE
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// DEBUG MODE
export const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === "true";

export const ERROR_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
};

// Para estados de carga
export const LOADING_STATES = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
};

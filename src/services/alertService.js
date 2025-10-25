import { get, post, put, paginated} from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

/**
 * Servicio de gestión de alertas de stock
 * RF-011: Sistema de Alertas de Stock
 * 
 * Funcionalidades:
 * - Consulta de alertas no leídas y críticas
 * - Búsqueda avanzada con filtros múltiples
 * - Marcado de alertas como leídas
 * - Verificación automática de stock
 * - Obtención de resúmenes y estadísticas
 * 
 * @module alertService
 * @author Wilian Lopez
 */
const alertService = {
    /**
     * Obtener alertas no leídas con paginación
     * Lista todas las alertas pendientes ordenadas por urgencia (CRITICO > ALTO > MEDIO > BAJO)
     * 
     * @param {number} [page=0] - Número de página (base 0)
     * @param {number} [size=20] - Tamaño de página (max recomendado: 50)
     * @returns {Promise<Object>} Página de alertas no leídas
     * @returns {Object.content} Array de alertas
     * @returns {Object.totalElements} Total de alertas
     * @returns {Object.totalPages} Total de páginas
     * 
     * @example
     * const { content, totalElements } = await alertService.getUnread(0, 10);
     * console.log(`${totalElements} alertas pendientes`);
     */
    getUnread: async (page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.ALERTS.UNREAD,
            page,
            size
        );
        return response;
    },

    /**
     * Obtener solo alertas críticas no leídas
     * Retorna alertas de nivel CRITICO (generalmente stock agotado)
     * que requieren atención inmediata
     * 
     * @returns {Promise<Array>} Lista de alertas críticas
     * 
     * @example
     * const criticas = await alertService.getCritical();
     * if (criticas.length > 0) {
     *   showNotification(`¡${criticas.length} alertas críticas!`);
     * }
     */
    getCritical: async () => {
        const response = await get(ENDPOINTS.ALERTS.CRITICAL);
        return response;
    },

    /**
     * Obtener todas las alertas (leídas y no leídas) con paginación
     * 
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de todas las alertas
     * 
     * @example
     * const allAlerts = await alertService.getAll(0, 50);
     */
    getAll: async (page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.ALERTS.BASE,
            page,
            size
        );
        return response;
    },

    /**
     * Marcar alerta como leída
     * Registra el usuario y fecha de lectura
     * 
     * @param {number} alertId - ID de la alerta
     * @param {number} userId - ID del usuario que marca como leída
     * @returns {Promise<void>} Sin contenido (204)
     * @throws {Error} Si la alerta no existe (404) o parámetros inválidos (400)
     * 
     * @example
     * await alertService.markAsRead(123, currentUser.id);
     */
    markAsRead: async (alertId, userId) => {
        await put(
            ENDPOINTS.ALERTS.MARK_READ(alertId),
            null,
            { params: { idUsuario: userId } }
        );
    },

    /**
     * Buscar alertas con filtros múltiples
     * Permite combinación de filtros opcionales para búsqueda avanzada
     * 
     * @param {Object} filters - Objeto con filtros opcionales
     * @param {number} [filters.idProducto] - ID del producto
     * @param {string} [filters.tipoAlerta] - Tipo: STOCK_MINIMO | STOCK_AGOTADO | STOCK_EXCESIVO | REORDEN
     * @param {string} [filters.nivelUrgencia] - Nivel: BAJO | MEDIO | ALTO | CRITICO
     * @param {boolean} [filters.leida] - Estado de lectura (true/false)
     * @param {string} [filters.fechaInicio] - Fecha inicial ISO 8601 (ej: 2025-01-01T00:00:00)
     * @param {string} [filters.fechaFin] - Fecha final ISO 8601
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de alertas filtradas
     * 
     * @example
     * // Buscar alertas críticas no leídas de un producto específico
     * const alertas = await alertService.searchWithFilters({
     *   idProducto: 45,
     *   nivelUrgencia: 'CRITICO',
     *   leida: false
     * }, 0, 10);
     * 
     * @example
     * // Buscar alertas en un rango de fechas
     * const alertas = await alertService.searchWithFilters({
     *   fechaInicio: '2025-10-01T00:00:00',
     *   fechaFin: '2025-10-31T23:59:59',
     *   tipoAlerta: 'STOCK_AGOTADO'
     * });
     */
    searchWithFilters: async (filters = {}, page = 0, size = 20) => {
        const params = {
            page,
            size,
            ...filters
        };

        const response = await get(ENDPOINTS.ALERTS.SEARCH, { params });
        return response;
    },

    /**
     * Contar alertas no leídas por nivel de urgencia
     * Útil para badges de notificación en navbar o dashboard
     * 
     * @returns {Promise<Object>} Objeto con conteo por nivel
     * @returns {number} .CRITICO - Cantidad de alertas críticas
     * @returns {number} .ALTO - Cantidad de alertas de prioridad alta
     * @returns {number} .MEDIO - Cantidad de alertas de prioridad media
     * @returns {number} .BAJO - Cantidad de alertas de prioridad baja
     * 
     * @example
     * const conteo = await alertService.countByUrgency();
     * // { CRITICO: 5, ALTO: 12, MEDIO: 8, BAJO: 3 }
     * 
     * const total = Object.values(conteo).reduce((sum, val) => sum + val, 0);
     * setBadgeCount(total);
     */
    countByUrgency: async () => {
        const response = await get(ENDPOINTS.ALERTS.COUNT_BY_URGENCY);
        return response;
    },

    /**
     * Verificar stock y generar alertas automáticamente
     * Ejecuta proceso que revisa todos los productos y genera alertas según umbrales
     * Requiere rol: ADMINISTRADOR o VENDEDOR
     * 
     * Tipos de alertas generadas:
     * - STOCK_AGOTADO: stockActual = 0 (CRITICO)
     * - STOCK_MINIMO: stockActual <= stockMinimo (ALTO)
     * - REORDEN: se sugiere realizar pedido (MEDIO)
     * - STOCK_EXCESIVO: stockActual > stockMaximo (BAJO)
     * 
     * @returns {Promise<Object>} Resultado de la verificación
     * @returns {number} .alertasGeneradas - Cantidad de alertas creadas
     * @returns {Array} .alertas - Detalle de alertas generadas
     * @returns {string} .mensaje - Mensaje descriptivo
     * @returns {string} .timestamp - Fecha/hora de verificación
     * 
     * @example
     * const resultado = await alertService.verifyAndGenerate();
     * console.log(resultado.mensaje);
     * // "Verificación completada: 7 alerta(s) generada(s)"
     * 
     * if (resultado.alertasGeneradas > 0) {
     *   notifyUser(`Se generaron ${resultado.alertasGeneradas} nuevas alertas`);
     * }
     */
    verifyAndGenerate: async () => {
        const response = await post(ENDPOINTS.ALERTS.VERIFY);
        return response;
    },

    /**
     * Obtener resumen de alertas para dashboard
     * Proporciona estadísticas agregadas y alertas críticas
     * Ideal para widgets de dashboard principal
     * 
     * @returns {Promise<Object>} Resumen completo de alertas
     * @returns {number} .totalNoLeidas - Total de alertas pendientes
     * @returns {Object} .conteoPorUrgencia - Desglose por nivel de urgencia
     * @returns {number} .alertasCriticas - Cantidad de alertas críticas
     * @returns {boolean} .requiereAtencionInmediata - Si hay alertas críticas
     * @returns {string} .timestamp - Fecha/hora del resumen
     * 
     * @example
     * const resumen = await alertService.getSummary();
     * // {
     * //   totalNoLeidas: 28,
     * //   conteoPorUrgencia: { CRITICO: 5, ALTO: 12, MEDIO: 8, BAJO: 3 },
     * //   alertasCriticas: 5,
     * //   requiereAtencionInmediata: true,
     * //   timestamp: "2025-10-24T16:30:00"
     * // }
     * 
     * if (resumen.requiereAtencionInmediata) {
     *   showCriticalAlert(resumen.alertasCriticas);
     * }
     */
    getSummary: async () => {
        const response = await get(ENDPOINTS.ALERTS.SUMMARY);
        return response;
    },

    /**
     * Obtener alerta por ID
     * 
     * @param {number} id - ID de la alerta
     * @returns {Promise<Object>} Alerta encontrada
     * @throws {Error} Si la alerta no existe (404)
     * 
     * @example
     * const alerta = await alertService.getById(123);
     * console.log(alerta.tipoAlerta, alerta.nivelUrgencia);
     */
    getById: async (id) => {
        const response = await get(`${ENDPOINTS.ALERTS.BASE}/${id}`);
        return response;
    },

    /**
     * Marcar múltiples alertas como leídas (utilidad)
     * Función auxiliar para operaciones batch
     * 
     * @param {number[]} alertIds - Array de IDs de alertas
     * @param {number} userId - ID del usuario
     * @returns {Promise<Object[]>} Resultados de cada operación
     * 
     * @example
     * const ids = [1, 2, 3, 4, 5];
     * const resultados = await alertService.markMultipleAsRead(ids, userId);
     * console.log(`${resultados.length} alertas marcadas como leídas`);
     */
    markMultipleAsRead: async (alertIds, userId) => {
        const promises = alertIds.map(id => 
            alertService.markAsRead(id, userId).catch(err => ({
                id,
                error: err.message
            }))
        );
        return await Promise.all(promises);
    },

    /**
     * Obtener alertas por producto específico
     * Wrapper para búsqueda filtrada por producto
     * 
     * @param {number} productId - ID del producto
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de alertas del producto
     * 
     * @example
     * const alertasProducto = await alertService.getByProduct(45);
     */
    getByProduct: async (productId, page = 0, size = 20) => {
        return await alertService.searchWithFilters(
            { idProducto: productId },
            page,
            size
        );
    },

    /**
     * Obtener alertas por tipo específico
     * 
     * @param {string} tipo - STOCK_MINIMO | STOCK_AGOTADO | STOCK_EXCESIVO | REORDEN
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de alertas del tipo especificado
     * 
     * @example
     * const agotados = await alertService.getByType('STOCK_AGOTADO');
     */
    getByType: async (tipo, page = 0, size = 20) => {
        return await alertService.searchWithFilters(
            { tipoAlerta: tipo },
            page,
            size
        );
    },

    /**
     * Obtener alertas por rango de fechas
     * 
     * @param {string} fechaInicio - Fecha inicio ISO 8601
     * @param {string} fechaFin - Fecha fin ISO 8601
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de alertas en el rango
     * 
     * @example
     * const alertasMes = await alertService.getByDateRange(
     *   '2025-10-01T00:00:00',
     *   '2025-10-31T23:59:59'
     * );
     */
    getByDateRange: async (fechaInicio, fechaFin, page = 0, size = 20) => {
        return await alertService.searchWithFilters(
            { fechaInicio, fechaFin },
            page,
            size
        );
    },

    /**
     * Verificar si hay alertas críticas pendientes
     * Método rápido para checks de estado
     * 
     * @returns {Promise<boolean>} true si hay alertas críticas
     * 
     * @example
     * const hayCriticas = await alertService.hasCriticalAlerts();
     * if (hayCriticas) {
     *   showUrgentNotification();
     * }
     */
    hasCriticalAlerts: async () => {
        const criticas = await alertService.getCritical();
        return criticas.length > 0;
    },

    /**
     * Obtener conteo total de alertas no leídas
     * Útil para badges de notificación simples
     * 
     * @returns {Promise<number>} Total de alertas no leídas
     * 
     * @example
     * const total = await alertService.getTotalUnread();
     * setBadgeCount(total);
     */
    getTotalUnread: async () => {
        const conteo = await alertService.countByUrgency();
        return Object.values(conteo).reduce((sum, val) => sum + val, 0);
    },

    /**
     * Polling de alertas (para actualizaciones en tiempo real)
     * Función auxiliar para implementar polling manual
     * 
     * @param {Function} callback - Función a ejecutar con las alertas
     * @param {number} [interval=30000] - Intervalo en ms (default: 30s)
     * @returns {Function} Función para detener el polling
     * 
     * @example
     * // Iniciar polling cada 30 segundos
     * const stopPolling = alertService.startPolling(
     *   async (alertas) => {
     *     setAlertCount(alertas.totalNoLeidas);
     *     if (alertas.requiereAtencionInmediata) {
     *       playSound();
     *     }
     *   },
     *   30000
     * );
     * 
     * // Detener polling cuando se desmonta el componente
     * return () => stopPolling();
     */
    startPolling: (callback, interval = 30000) => {
        const poll = async () => {
            try {
                const resumen = await alertService.getSummary();
                callback(resumen);
            } catch (error) {
                console.error('Error en polling de alertas:', error);
            }
        };

        // Ejecutar inmediatamente
        poll();

        // Configurar intervalo
        const intervalId = setInterval(poll, interval);

        // Retornar función para detener
        return () => clearInterval(intervalId);
    },
};

export default alertService;
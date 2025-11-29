// src/services/ReporteService.js
import { get } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const ReporteService = {
    /**
     * RF-014: Obtener datos del dashboard
     * Retorna KPIs, métricas y estadísticas clave del sistema
     */
    getDashboardData: async () => {
        try {
            const response = await get(ENDPOINTS.REPORTES.DASHBOARD);
            return response;
        } catch (error) {
            console.error('Error al obtener datos del dashboard:', error);
            throw error;
        }
    },

    /**
     * RF-014: Generar y descargar reporte de ventas Excel
     */
    generateVentasExcel: async (fechaInicio, fechaFin) => {
        try {
            const response = await get(ENDPOINTS.REPORTES.VENTAS_EXCEL, {
                params: { 
                    fechaInicio: ReporteService.formatDate(fechaInicio),
                    fechaFin: ReporteService.formatDate(fechaFin)
                },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error al generar reporte de ventas:', error);
            throw error;
        }
    },

    /**
     * RF-014: Generar y descargar reporte de stock Excel
     */
    generateStockExcel: async () => {
        try {
            const response = await get(ENDPOINTS.REPORTES.STOCK_EXCEL, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error al generar reporte de stock:', error);
            throw error;
        }
    },

    /**
     * RF-014: Generar y descargar reporte de stock bajo Excel
     */
    generateStockBajoExcel: async () => {
        try {
            const response = await get(ENDPOINTS.REPORTES.STOCK_BAJO_EXCEL, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error al generar reporte de stock bajo:', error);
            throw error;
        }
    },

    /**
     * RF-014: Generar y descargar reporte de movimientos Excel
     */
    generateMovimientosExcel: async (fechaInicio, fechaFin) => {
        try {
            const response = await get(ENDPOINTS.REPORTES.MOVIMIENTOS_EXCEL, {
                params: { 
                    fechaInicio: ReporteService.formatDate(fechaInicio),
                    fechaFin: ReporteService.formatDate(fechaFin)
                },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error al generar reporte de movimientos:', error);
            throw error;
        }
    },

    /**
     * RF-014: Generar y descargar reporte de devoluciones Excel
     */
    generateDevolucionesExcel: async (fechaInicio, fechaFin) => {
        try {
            const response = await get(ENDPOINTS.REPORTES.DEVOLUCIONES_EXCEL, {
                params: { 
                    fechaInicio: ReporteService.formatDate(fechaInicio),
                    fechaFin: ReporteService.formatDate(fechaFin)
                },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error al generar reporte de devoluciones:', error);
            throw error;
        }
    },

    /**
     * RF-014: Generar comprobante PDF de venta
     */
    generateComprobantePDF: async (ventaId) => {
        try {
            const response = await get(ENDPOINTS.REPORTES.COMPROBANTE_PDF(ventaId), {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error al generar comprobante PDF:', error);
            throw error;
        }
    },

    /**
     * RF-014: Obtener ventas por categoría
     */
    getVentasPorCategoria: async (fechaInicio, fechaFin) => {
        try {
            const response = await get(ENDPOINTS.REPORTES.VENTAS_POR_CATEGORIA, {
                params: { 
                    fechaInicio: ReporteService.formatDate(fechaInicio),
                    fechaFin: ReporteService.formatDate(fechaFin)
                }
            });
            return response;
        } catch (error) {
            console.error('Error al obtener ventas por categoría:', error);
            throw error;
        }
    },

    /**
     * RF-014: Obtener top productos más vendidos
     */
    getTopProductos: async (fechaInicio, fechaFin, limite = 10) => {
        try {
            const response = await get(ENDPOINTS.REPORTES.TOP_PRODUCTOS, {
                params: { 
                    fechaInicio: ReporteService.formatDate(fechaInicio),
                    fechaFin: ReporteService.formatDate(fechaFin),
                    limite
                }
            });
            return response;
        } catch (error) {
            console.error('Error al obtener top productos:', error);
            throw error;
        }
    },

    /**
     * Obtiene el reporte diario de ventas para un vendedor.
     * @param {number} userId - El ID del usuario (vendedor).
     * @param {string} date - La fecha del reporte en formato 'YYYY-MM-DD'.
     */
    getSellerDailyReport: async (userId, date) => {
        if (!userId || !date) {
            throw new Error("User ID and date are required for the seller daily report.");
        }
        try {
            const response = await get(ENDPOINTS.REPORTES.VENDEDOR_DIARIO, {
                params: {
                    idUsuario: userId,
                    fecha: date
                }
            });
            return response;
        } catch (error) {
            console.error(`Error fetching daily report for user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * RF-014: Obtener reportes disponibles
     */
    getAvailableReports: async () => {
        try {
            const response = await get(ENDPOINTS.REPORTES.DISPONIBLES);
            return response;
        } catch (error) {
            console.error('Error al obtener reportes disponibles:', error);
            throw error;
        }
    },

    /**
     * Test del servicio de reportes
     */
    testService: async () => {
        try {
            const response = await get(ENDPOINTS.REPORTES.TEST);
            return response;
        } catch (error) {
            console.error('Error en test del servicio:', error);
            throw error;
        }
    },

    // ==================== FUNCIONES DE DESCARGA ====================

    /**
     * Descargar blob como archivo
     */
    downloadBlob: (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    /**
     * Descargar reporte de ventas Excel
     */
    downloadVentasExcel: async (fechaInicio, fechaFin) => {
        const blob = await ReporteService.generateVentasExcel(fechaInicio, fechaFin);
        const filename = `reporte_ventas_${ReporteService.getTimestamp()}.xlsx`;
        ReporteService.downloadBlob(blob, filename);
    },

    /**
     * Descargar reporte de stock Excel
     */
    downloadStockExcel: async () => {
        const blob = await ReporteService.generateStockExcel();
        const filename = `reporte_stock_${ReporteService.getTimestamp()}.xlsx`;
        ReporteService.downloadBlob(blob, filename);
    },

    /**
     * Descargar reporte de stock bajo Excel
     */
    downloadStockBajoExcel: async () => {
        const blob = await ReporteService.generateStockBajoExcel();
        const filename = `reporte_stock_bajo_${ReporteService.getTimestamp()}.xlsx`;
        ReporteService.downloadBlob(blob, filename);
    },

    /**
     * Descargar reporte de movimientos Excel
     */
    downloadMovimientosExcel: async (fechaInicio, fechaFin) => {
        const blob = await ReporteService.generateMovimientosExcel(fechaInicio, fechaFin);
        const filename = `reporte_movimientos_${ReporteService.getTimestamp()}.xlsx`;
        ReporteService.downloadBlob(blob, filename);
    },

    /**
     * Descargar reporte de devoluciones Excel
     */
    downloadDevolucionesExcel: async (fechaInicio, fechaFin) => {
        const blob = await ReporteService.generateDevolucionesExcel(fechaInicio, fechaFin);
        const filename = `reporte_devoluciones_${ReporteService.getTimestamp()}.xlsx`;
        ReporteService.downloadBlob(blob, filename);
    },

    /**
     * Descargar o abrir comprobante PDF
     */
    downloadComprobantePDF: async (ventaId, openInNewTab = false) => {
        const blob = await ReporteService.generateComprobantePDF(ventaId);
        const filename = `comprobante_venta_${ventaId}.pdf`;
        
        if (openInNewTab) {
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } else {
            ReporteService.downloadBlob(blob, filename);
        }
    },

    // ==================== UTILIDADES ====================

    /**
     * Formatear fecha para la API (ISO 8601)
     */
    formatDate: (date) => {
        if (!date) return null;
        
        // Si ya es string, verificar si está en formato correcto
        if (typeof date === 'string') {
            return date;
        }

        // Si es Date, convertir a ISO string
        if (date instanceof Date) {
            return date.toISOString();
        }

        return null;
    },

    /**
     * Obtener timestamp para nombres de archivo
     */
    getTimestamp: () => {
        const now = new Date();
        return now.toISOString()
            .replace(/[:.]/g, '-')
            .slice(0, -5)
            .replace('T', '_');
    },

    /**
     * Obtener rango del mes actual
     */
    getCurrentMonthRange: () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        return {
            fechaInicio: firstDay,
            fechaFin: lastDay
        };
    },

    /**
     * Obtener rango de hoy
     */
    getTodayRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        
        return {
            fechaInicio: start,
            fechaFin: end
        };
    },

    /**
     * Obtener rango de la semana actual
     */
    getCurrentWeekRange: () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return {
            fechaInicio: start,
            fechaFin: end
        };
    },

    /**
     * Validar rango de fechas
     */
    validateDateRange: (fechaInicio, fechaFin) => {
        if (!fechaInicio || !fechaFin) {
            throw new Error('Las fechas son requeridas');
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        if (inicio > fin) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha fin');
        }
        
        // Validar que no sea un rango muy grande (ej: más de 1 año)
        const diffDays = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
        if (diffDays > 365) {
            throw new Error('El rango de fechas no puede ser mayor a 1 año');
        }
        
        return true;
    },

    /**
     * Verificar si el servicio está disponible
     */
    checkHealth: async () => {
        try {
            const response = await ReporteService.testService();
            return response.estado === 'OK';
        } catch (error) {
            console.error('Servicio de reportes no disponible:', error);
            return false;
        }
    },
};

export default ReporteService;
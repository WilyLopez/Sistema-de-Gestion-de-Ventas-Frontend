// src/pages/admin/Reports/ReportDashboard.jsx
import { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    Calendar
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Spinner from '@components/ui/Spinner';
import Alert from '@components/alerts/Alert';
import reporteService from '@services/ReporteService';
import { formatCurrency, formatNumber } from '@utils/formatters';

/**
 * Dashboard de Reportes
 * Vista principal con acceso a todos los reportes del sistema
 */
const ReportDashboard = () => {
    // Estados de datos
    const [dashboardData, setDashboardData] = useState(null);

    // Estados de fechas para reportes
    const [dateRange, setDateRange] = useState({
        fechaInicio: getFirstDayOfMonth(),
        fechaFin: getCurrentDate(),
    });

    // Estados de carga
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingReport, setDownloadingReport] = useState(null);

    // Estados de mensajes
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    // Funciones auxiliares para fechas
    function getFirstDayOfMonth() {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    }

    function getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Cargar datos del dashboard
    const loadDashboard = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const data = await reporteService.getDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            setErrorMessage('Error al cargar los datos del dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar cambio de fechas
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Descargar reporte
    const handleDownloadReport = async (reportType) => {
        setDownloadingReport(reportType);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Validar fechas si el reporte las requiere
            if (['ventas', 'movimientos', 'devoluciones'].includes(reportType)) {
                if (new Date(dateRange.fechaInicio) > new Date(dateRange.fechaFin)) {
                    setErrorMessage('La fecha de inicio no puede ser mayor a la fecha fin');
                    setDownloadingReport(null);
                    return;
                }
            }

            switch (reportType) {
                case 'ventas':
                    await reporteService.downloadVentasExcel(dateRange.fechaInicio, dateRange.fechaFin);
                    break;
                case 'stock':
                    await reporteService.downloadStockExcel();
                    break;
                case 'stock-bajo':
                    await reporteService.downloadStockBajoExcel();
                    break;
                case 'movimientos':
                    await reporteService.downloadMovimientosExcel(dateRange.fechaInicio, dateRange.fechaFin);
                    break;
                case 'devoluciones':
                    await reporteService.downloadDevolucionesExcel(dateRange.fechaInicio, dateRange.fechaFin);
                    break;
                default:
                    throw new Error('Tipo de reporte no válido');
            }

            setSuccessMessage('Reporte generado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al descargar reporte:', error);
            setErrorMessage('Error al generar el reporte. Intenta nuevamente.');
        } finally {
            setDownloadingReport(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando dashboard..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Dashboard de Reportes
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Genera y descarga reportes del sistema en formato Excel
                </p>
            </div>

            {/* Mensajes */}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {/* KPIs principales */}
            {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Ventas */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">Total Ventas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                    {formatCurrency(dashboardData.totalVentas || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Cantidad Ventas */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">Cantidad Ventas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                    {formatNumber(dashboardData.cantidadVentas || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Total Productos */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">Total Productos</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                    {formatNumber(dashboardData.totalProductos || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    {/* Alertas Stock */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">Alertas Stock</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                    {formatNumber(dashboardData.alertasStock || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Selector de rango de fechas */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Rango de Fechas para Reportes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Fecha Inicio"
                        type="date"
                        name="fechaInicio"
                        value={dateRange.fechaInicio}
                        onChange={handleDateChange}
                        fullWidth
                    />
                    <Input
                        label="Fecha Fin"
                        type="date"
                        name="fechaFin"
                        value={dateRange.fechaFin}
                        onChange={handleDateChange}
                        fullWidth
                    />
                </div>
                <p className="text-sm text-gray-500 dark:text-dark-muted mt-2">
                    Este rango se aplicará a los reportes de ventas, movimientos y devoluciones
                </p>
            </div>

            {/* Grid de reportes disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reporte de Ventas */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                                Reporte de Ventas
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-4">
                                Descarga el detalle completo de todas las ventas realizadas en el período seleccionado.
                            </p>
                            <Button
                                variant="success"
                                size="md"
                                onClick={() => handleDownloadReport('ventas')}
                                loading={downloadingReport === 'ventas'}
                                disabled={downloadingReport !== null}
                                leftIcon={<Download className="w-4 h-4" />}
                                fullWidth
                            >
                                {downloadingReport === 'ventas' ? 'Generando...' : 'Descargar Excel'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reporte de Stock */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                                Reporte de Stock
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-4">
                                Inventario completo de productos con stock actual, mínimo y valorización.
                            </p>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => handleDownloadReport('stock')}
                                loading={downloadingReport === 'stock'}
                                disabled={downloadingReport !== null}
                                leftIcon={<Download className="w-4 h-4" />}
                                fullWidth
                            >
                                {downloadingReport === 'stock' ? 'Generando...' : 'Descargar Excel'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reporte de Stock Bajo */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                                Reporte de Stock Bajo
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-4">
                                Lista de productos con stock bajo o agotado que requieren reposición urgente.
                            </p>
                            <Button
                                variant="warning"
                                size="md"
                                onClick={() => handleDownloadReport('stock-bajo')}
                                loading={downloadingReport === 'stock-bajo'}
                                disabled={downloadingReport !== null}
                                leftIcon={<Download className="w-4 h-4" />}
                                fullWidth
                            >
                                {downloadingReport === 'stock-bajo' ? 'Generando...' : 'Descargar Excel'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reporte de Movimientos */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                                Reporte de Movimientos
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-4">
                                Historial de todos los movimientos de inventario: entradas, salidas y ajustes.
                            </p>
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => handleDownloadReport('movimientos')}
                                loading={downloadingReport === 'movimientos'}
                                disabled={downloadingReport !== null}
                                leftIcon={<Download className="w-4 h-4" />}
                                fullWidth
                            >
                                {downloadingReport === 'movimientos' ? 'Generando...' : 'Descargar Excel'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reporte de Devoluciones */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                                Reporte de Devoluciones
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-4">
                                Detalle de todas las devoluciones procesadas con motivos y estados.
                            </p>
                            <Button
                                variant="danger"
                                size="md"
                                onClick={() => handleDownloadReport('devoluciones')}
                                loading={downloadingReport === 'devoluciones'}
                                disabled={downloadingReport !== null}
                                leftIcon={<Download className="w-4 h-4" />}
                                fullWidth
                            >
                                {downloadingReport === 'devoluciones' ? 'Generando...' : 'Descargar Excel'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                    💡 <strong>Tip:</strong> Los reportes se generan en formato Excel (.xlsx) y se descargarán automáticamente.
                    Asegúrate de tener habilitadas las descargas en tu navegador.
                </p>
            </div>
        </div>
    );
};

export default ReportDashboard;
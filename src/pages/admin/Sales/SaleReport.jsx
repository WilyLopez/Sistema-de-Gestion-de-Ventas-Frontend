// src/pages/admin/Sales/SaleReport.jsx
import { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    DollarSign, 
    ShoppingCart, 
    Users, 
    Calendar,
    Download,
    RefreshCw
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';
import Spinner from '@components/ui/Spinner';
import Alert from '@components/alerts/Alert';
import ventaService from '@services/VentaService';
import { formatCurrency, formatNumber } from '@utils/formatters';

/**
 * Página de Reportes de Ventas
 * Estadísticas y métricas de ventas con filtros de fecha
 */
const SaleReport = () => {
    // Estados de datos
    const [statistics, setStatistics] = useState(null);
    const [sales, setSales] = useState([]);
    
    // Estados de filtros
    const [dateRange, setDateRange] = useState({
        fechaInicio: getFirstDayOfMonth(),
        fechaFin: getCurrentDate(),
    });
    
    // Estados de carga
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    
    // Estados de mensajes
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadReport();
    }, []);

    // Funciones auxiliares para fechas
    function getFirstDayOfMonth() {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    }

    function getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Cargar reporte
    const loadReport = async () => {
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const [statsData, salesData] = await Promise.all([
                ventaService.getStatistics(dateRange.fechaInicio, dateRange.fechaFin),
                ventaService.getByPeriodo(dateRange.fechaInicio, dateRange.fechaFin),
            ]);
            
            setStatistics(statsData);
            setSales(salesData);
        } catch (error) {
            console.error('Error al cargar reporte:', error);
            setErrorMessage('Error al cargar el reporte de ventas');
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

    // Aplicar filtro
    const handleApplyFilter = () => {
        if (new Date(dateRange.fechaInicio) > new Date(dateRange.fechaFin)) {
            setErrorMessage('La fecha de inicio no puede ser mayor a la fecha fin');
            return;
        }
        loadReport();
    };

    // Exportar reporte
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // TODO: Implementar exportación a Excel/PDF
            console.log('Exportando reporte...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error al exportar:', error);
            setErrorMessage('Error al exportar el reporte');
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando reporte..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Reporte de Ventas
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Estadísticas y métricas de ventas por período
                    </p>
                </div>
                <Button
                    variant="success"
                    size="md"
                    onClick={handleExport}
                    loading={isExporting}
                    disabled={isExporting}
                    leftIcon={<Download className="w-4 h-4" />}
                >
                    Exportar
                </Button>
            </div>

            {/* Mensajes */}
            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {/* Filtros de fecha */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Fecha Inicio"
                        type="date"
                        name="fechaInicio"
                        value={dateRange.fechaInicio}
                        onChange={handleDateChange}
                        leftIcon={<Calendar className="w-4 h-4" />}
                        fullWidth
                    />
                    <Input
                        label="Fecha Fin"
                        type="date"
                        name="fechaFin"
                        value={dateRange.fechaFin}
                        onChange={handleDateChange}
                        leftIcon={<Calendar className="w-4 h-4" />}
                        fullWidth
                    />
                    <div className="flex items-end">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleApplyFilter}
                            leftIcon={<RefreshCw className="w-4 h-4" />}
                            fullWidth
                        >
                            Actualizar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Ventas */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Total Ventas</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                {formatCurrency(statistics?.totalVentas || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    {statistics?.crecimientoVentas !== undefined && (
                        <div className="mt-4 flex items-center gap-1">
                            <TrendingUp className={`w-4 h-4 ${statistics.crecimientoVentas >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                            <span className={`text-sm font-medium ${statistics.crecimientoVentas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {statistics.crecimientoVentas >= 0 ? '+' : ''}{statistics.crecimientoVentas.toFixed(1)}%
                            </span>
                            <span className="text-sm text-gray-500 dark:text-dark-muted">vs período anterior</span>
                        </div>
                    )}
                </div>

                {/* Cantidad de Ventas */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Cantidad Ventas</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                {formatNumber(statistics?.cantidadVentas || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dark-muted mt-4">
                        Transacciones realizadas
                    </p>
                </div>

                {/* Ticket Promedio */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Ticket Promedio</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                {formatCurrency(statistics?.ticketPromedio || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dark-muted mt-4">
                        Por transacción
                    </p>
                </div>

                {/* Clientes Únicos */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Clientes Únicos</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                {formatNumber(statistics?.clientesUnicos || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dark-muted mt-4">
                        Clientes diferentes
                    </p>
                </div>
            </div>

            {/* Tabla de ventas del período */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
                <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                        Ventas del Período
                    </h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-hover">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-dark-muted">
                                        No hay ventas en este período
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.idVenta} className="hover:bg-gray-50 dark:hover:bg-dark-hover">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-primary-600 dark:text-primary-400">
                                                {sale.codigo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                            {new Date(sale.fecha).toLocaleDateString('es-PE')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                            {sale.cliente?.nombre} {sale.cliente?.apellido}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-dark-text">
                                            {formatCurrency(sale.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                                sale.estado === 'PAGADO' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : sale.estado === 'ANULADO'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}>
                                                {sale.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Resumen adicional */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-dark-muted mb-2">
                            Ventas Completadas
                        </h4>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatNumber(statistics.ventasCompletadas || 0)}
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-dark-muted mb-2">
                            Ventas Anuladas
                        </h4>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {formatNumber(statistics.ventasAnuladas || 0)}
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-dark-muted mb-2">
                            Productos Vendidos
                        </h4>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatNumber(statistics.productosVendidos || 0)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaleReport;
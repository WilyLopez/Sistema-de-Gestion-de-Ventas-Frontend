//src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    Users,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';
import KPICard from '@components/charts/KPICard';
import SalesChart from '@components/charts/SalesChart';
import PieChart from '@components/charts/PieChart';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Spinner from '@components/ui/Spinner';
import alertService from '@services/AlertaService';
import productService from '@services/ProductoService';
import reporteService from '@services/ReporteService';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Dashboard del Administrador
 * Vista principal con KPIs, gráficos y alertas usando API real
 */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [error, setError] = useState(null);

    // Cargar todos los datos del dashboard
    useEffect(() => {
        loadDashboardData();
        loadAlerts();
        loadLowStockProducts();

        // Polling de alertas cada 30 segundos
        const stopPolling = alertService.startPolling((resumen) => {
            if (resumen.requiereAtencionInmediata) {
                loadAlerts(); // Recargar alertas si hay críticas nuevas
            }
        }, 30000);

        return () => stopPolling();
    }, []);

    /**
     * Cargar datos principales del dashboard desde API
     */
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Llamada a la API real de reportes
            const data = await reporteService.getDashboardData();

            setDashboardData(data);
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            setError('No se pudieron cargar los datos del dashboard');
            toast.error('Error al cargar el dashboard');

            // Datos fallback en caso de error
            setDashboardData(getFallbackData());
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cargar alertas críticas
     */
    const loadAlerts = async () => {
        try {
            const response = await alertService.getCritical();
            setAlerts(response.slice(0, 5)); // Solo primeras 5
        } catch (error) {
            console.error('Error al cargar alertas:', error);
            setAlerts([]);
        }
    };

    /**
     * Cargar productos con stock bajo
     */
    const loadLowStockProducts = async () => {
        try {
            const products = await productService.getLowStock();
            setLowStockProducts(products.slice(0, 5)); // Solo primeros 5
        } catch (error) {
            console.error('Error al cargar productos con stock bajo:', error);
            setLowStockProducts([]);
        }
    };

    /**
     * Refrescar todos los datos
     */
    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            loadDashboardData(),
            loadAlerts(),
            loadLowStockProducts(),
        ]);
        setRefreshing(false);
        toast.success('Datos actualizados');
    };

    /**
     * Marcar alerta como leída
     */
    const handleMarkAlertAsRead = async (alertId) => {
        try {
            await alertService.markAsRead(alertId, user.id);
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert.idAlerta !== alertId));
            toast.success('Alerta marcada como leída');
        } catch (error) {
            console.error('Error al marcar alerta:', error);
            toast.error('No se pudo marcar la alerta');
        }
    };

    /**
     * Datos de respaldo en caso de error
     */
    const getFallbackData = () => ({
        ventasHoy: {
            total: 0,
            cantidad: 0,
            cambio: '0%',
            tendencia: 'neutral',
        },
        ventasMes: {
            total: 0,
            cantidad: 0,
            cambio: '0%',
            tendencia: 'neutral',
        },
        productosStock: {
            total: 0,
            criticos: 0,
            agotados: 0,
        },
        clientes: {
            total: 0,
            nuevos: 0,
        },
        ventasPorDia: [],
        topCategorias: [],
    });

    // Función helper para formatear números de manera segura
    const formatCurrency = (value) => {
        const amount = dashboardData?.ventasHoy?.total || value || 0;
        return amount.toLocaleString('es-PE', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    };

    const formatNumber = (value) => {
        return (dashboardData?.[value.path]?.[value.property] || value.default || 0).toLocaleString('es-PE');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando dashboard..." />
            </div>
        );
    }

    if (error && !dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="w-16 h-16 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                    Error al cargar el dashboard
                </h2>
                <p className="text-gray-600 dark:text-dark-muted text-center max-w-md">
                    {error}
                </p>
                <Button onClick={handleRefresh} leftIcon={<RefreshCw className="w-4 h-4" />}>
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con botón de refrescar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Bienvenido, {user?.nombre} {user?.apellido}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    leftIcon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
                >
                    Actualizar
                </Button>
            </div>

            {/* Mensaje de error si existe pero hay datos */}
            {error && dashboardData && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Algunos datos pueden no estar actualizados. {error}
                        </p>
                    </div>
                </div>
            )}

            {/* KPIs principales - CORREGIDOS CON OPERADOR OPCIONAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Ventas Hoy"
                    value={`S/ ${formatCurrency(dashboardData?.ventasHoy?.total)}`}
                    subtitle={`${dashboardData?.ventasHoy?.cantidad || 0} ventas`}
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={dashboardData?.ventasHoy?.tendencia || 'neutral'}
                    trendValue={dashboardData?.ventasHoy?.cambio || '0%'}
                    iconBgColor="bg-green-100 dark:bg-green-900/20"
                    iconColor="text-green-600 dark:text-green-400"
                    onClick={() => navigate('/admin/ventas')}
                />

                <KPICard
                    title="Ventas del Mes"
                    value={`S/ ${dashboardData?.ventasMes?.total?.toLocaleString('es-PE', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                    }) || '0.00'}`}
                    subtitle={`${dashboardData?.ventasMes?.cantidad || 0} ventas`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={dashboardData?.ventasMes?.tendencia || 'neutral'}
                    trendValue={dashboardData?.ventasMes?.cambio || '0%'}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                    iconColor="text-blue-600 dark:text-blue-400"
                />

                <KPICard
                    title="Productos en Stock"
                    value={dashboardData?.productosStock?.total || 0}
                    subtitle={`${dashboardData?.productosStock?.criticos || 0} críticos`}
                    icon={<Package className="w-6 h-6" />}
                    trend={dashboardData?.productosStock?.agotados > 0 ? 'down' : 'neutral'}
                    trendValue={`${dashboardData?.productosStock?.agotados || 0} agotados`}
                    iconBgColor="bg-orange-100 dark:bg-orange-900/20"
                    iconColor="text-orange-600 dark:text-orange-400"
                    onClick={() => navigate('/admin/inventario')}
                />

                <KPICard
                    title="Clientes"
                    value={dashboardData?.clientes?.total || 0}
                    subtitle={`${dashboardData?.clientes?.nuevos || 0} nuevos este mes`}
                    icon={<Users className="w-6 h-6" />}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/20"
                    iconColor="text-purple-600 dark:text-purple-400"
                    onClick={() => navigate('/admin/clientes')}
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart
                    data={dashboardData?.ventasPorDia || []}
                    title="Ventas de la Última Semana"
                    type="area"
                    height={300}
                />

                <PieChart
                    data={dashboardData?.topCategorias || []}
                    title="Ventas por Categoría"
                    height={300}
                />
            </div>

            {/* Alertas y Stock Bajo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alertas Críticas */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Alertas Críticas
                                {alerts.length > 0 && (
                                    <Badge variant="danger" size="sm" rounded>
                                        {alerts.length}
                                    </Badge>
                                )}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/admin/inventario')}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Ver todas
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {alerts.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-300 dark:text-dark-muted mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-dark-muted">
                                    No hay alertas críticas
                                </p>
                                <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
                                    ¡Todo está bajo control!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert.idAlerta}
                                        className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 group hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                                                {alert.producto?.nombre || 'Producto sin nombre'}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-dark-muted truncate">
                                                {alert.mensaje}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-dark-muted mt-1">
                                                {new Date(alert.fechaGeneracion).toLocaleDateString('es-PE')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge 
                                                variant="custom" 
                                                className="bg-red-500 text-white flex-shrink-0"
                                                size="sm"
                                            >
                                                {alert.nivelUrgencia}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMarkAlertAsRead(alert.idAlerta)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                            >
                                                Marcar leída
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Productos con Stock Bajo */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-500" />
                                Stock Bajo
                                {lowStockProducts.length > 0 && (
                                    <Badge variant="warning" size="sm" rounded>
                                        {lowStockProducts.length}
                                    </Badge>
                                )}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/admin/productos')}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Ver todos
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {lowStockProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-300 dark:text-dark-muted mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-dark-muted">
                                    No hay productos con stock bajo
                                </p>
                                <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
                                    El inventario está bien abastecido
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.idProducto}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-hover rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/productos/${product.idProducto}`)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded bg-gray-200 dark:bg-dark-card flex items-center justify-center flex-shrink-0">
                                                {product.imagenUrl ? (
                                                    <img
                                                        src={product.imagenUrl}
                                                        alt={product.nombre}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <Package className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate">
                                                    {product.nombre}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-dark-muted">
                                                    Código: {product.codigo}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="custom"
                                                className={
                                                    product.stock === 0
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                }
                                                size="sm"
                                            >
                                                {product.stock} / {product.stockMinimo}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Accesos rápidos */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                    Accesos Rápidos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/admin/ventas/crear')}
                        leftIcon={<ShoppingCart className="w-5 h-5" />}
                        className="justify-start"
                    >
                        Nueva Venta
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/admin/productos/crear')}
                        leftIcon={<Package className="w-5 h-5" />}
                        className="justify-start"
                    >
                        Nuevo Producto
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/admin/ventas')}
                        leftIcon={<ShoppingCart className="w-5 h-5" />}
                        className="justify-start"
                    >
                        Ver Ventas
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/admin/reportes')}
                        leftIcon={<TrendingUp className="w-5 h-5" />}
                        className="justify-start"
                    >
                        Reportes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
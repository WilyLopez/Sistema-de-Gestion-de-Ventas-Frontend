// src/pages/seller/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Users,
    Package,
    Calendar,
    Award,
    Target,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import VentaService from '@services/VentaService';
import ProductoService from '@services/ProductoService';
import ClienteService from '@services/ClienteService';
import KPICard from '@components/charts/KPICard';
import SalesChart from '@components/charts/SalesChart';
import BarChart from '@components/charts/BarChart';
import Button from '@components/ui/Button';
import Select from '@components/ui/Select';
import Spinner from '@components/ui/Spinner';
import Badge from '@components/ui/Badge';
import { formatCurrency, formatDate } from '@utils/formatters';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Estados
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState('today'); // today, week, month
    const [dashboardData, setDashboardData] = useState({
        kpis: {
            totalVentasHoy: 0,
            montoVentasHoy: 0,
            clientesAtendidos: 0,
            ticketPromedio: 0,
            metaMensual: 0,
            progreso: 0,
        },
        salesTrend: [],
        topProducts: [],
        recentSales: [],
        lowStockAlerts: [],
    });

    // ==================== EFECTOS ====================

    useEffect(() => {
        loadDashboardData();
    }, [period]);

    // ==================== CARGA DE DATOS ====================

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const { fechaInicio, fechaFin } = getDateRange(period);

            // Cargar datos en paralelo
            const [salesStats, topProducts, recentSales, lowStock] = await Promise.all([
                loadSalesStatistics(fechaInicio, fechaFin),
                loadTopProducts(fechaInicio, fechaFin),
                loadRecentSales(),
                loadLowStockAlerts(),
            ]);

            setDashboardData({
                kpis: salesStats,
                salesTrend: generateSalesTrend(fechaInicio, fechaFin),
                topProducts,
                recentSales,
                lowStockAlerts: lowStock,
            });
        } catch (error) {
            console.error('Error cargando dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDateRange = (periodType) => {
        const now = new Date();
        let fechaInicio, fechaFin;

        switch (periodType) {
            case 'today':
                fechaInicio = new Date(now.setHours(0, 0, 0, 0));
                fechaFin = new Date(now.setHours(23, 59, 59, 999));
                break;
            case 'week':
                fechaInicio = new Date(now.setDate(now.getDate() - 7));
                fechaFin = new Date();
                break;
            case 'month':
                fechaInicio = new Date(now.setDate(now.getDate() - 30));
                fechaFin = new Date();
                break;
            default:
                fechaInicio = new Date(now.setHours(0, 0, 0, 0));
                fechaFin = new Date(now.setHours(23, 59, 59, 999));
        }

        return { fechaInicio, fechaFin };
    };

    const loadSalesStatistics = async (fechaInicio, fechaFin) => {
        try {
            // Obtener ventas del usuario en el período
            const response = await VentaService.buscar(
                {
                    idUsuario: user.id,
                    fechaInicio: fechaInicio.toISOString(),
                    fechaFin: fechaFin.toISOString(),
                },
                0,
                1000
            );

            const ventas = response.content || [];

            // Calcular KPIs
            const totalVentas = ventas.filter(v => v.estado === 'PAGADO').length;
            const montoTotal = ventas
                .filter(v => v.estado === 'PAGADO')
                .reduce((sum, v) => sum + (v.total || 0), 0);

            // Clientes únicos
            const clientesUnicos = new Set(ventas.map(v => v.idCliente)).size;

            // Ticket promedio
            const ticketPromedio = totalVentas > 0 ? montoTotal / totalVentas : 0;

            // Meta mensual (ejemplo: 50,000)
            const metaMensual = 50000;
            const progreso = (montoTotal / metaMensual) * 100;

            return {
                totalVentasHoy: totalVentas,
                montoVentasHoy: montoTotal,
                clientesAtendidos: clientesUnicos,
                ticketPromedio,
                metaMensual,
                progreso: Math.min(progreso, 100),
            };
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            return {
                totalVentasHoy: 0,
                montoVentasHoy: 0,
                clientesAtendidos: 0,
                ticketPromedio: 0,
                metaMensual: 50000,
                progreso: 0,
            };
        }
    };

    const generateSalesTrend = (fechaInicio, fechaFin) => {
        // Generar datos de tendencia por día
        const days = [];
        const daysDiff = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= daysDiff; i++) {
            const date = new Date(fechaInicio);
            date.setDate(date.getDate() + i);

            days.push({
                fecha: formatDate(date),
                ventas: Math.random() * 5000 + 1000, // Simulado - reemplazar con datos reales
                cantidad: Math.floor(Math.random() * 20 + 5),
            });
        }

        return days;
    };

    const loadTopProducts = async (fechaInicio, fechaFin) => {
        try {
            // Obtener ventas del período
            const response = await VentaService.buscar(
                {
                    idUsuario: user.id,
                    fechaInicio: fechaInicio.toISOString(),
                    fechaFin: fechaFin.toISOString(),
                },
                0,
                1000
            );

            const ventas = response.content || [];

            // Agrupar productos vendidos
            const productosVendidos = {};

            ventas.forEach(venta => {
                if (venta.detalles) {
                    venta.detalles.forEach(detalle => {
                        const key = detalle.idProducto;
                        if (!productosVendidos[key]) {
                            productosVendidos[key] = {
                                name: detalle.nombreProducto || 'Producto',
                                value: 0,
                                cantidad: 0,
                            };
                        }
                        productosVendidos[key].value += detalle.subtotal || 0;
                        productosVendidos[key].cantidad += detalle.cantidad || 0;
                    });
                }
            });

            // Convertir a array y ordenar
            const topProducts = Object.values(productosVendidos)
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);

            return topProducts;
        } catch (error) {
            console.error('Error cargando top productos:', error);
            return [];
        }
    };

    const loadRecentSales = async () => {
        try {
            const response = await VentaService.buscar(
                {
                    idUsuario: user.id,
                },
                0,
                5
            );

            return response.content || [];
        } catch (error) {
            console.error('Error cargando ventas recientes:', error);
            return [];
        }
    };

    const loadLowStockAlerts = async () => {
        try {
            const lowStock = await ProductoService.getLowStock();
            return lowStock.slice(0, 5); // Solo los primeros 5
        } catch (error) {
            console.error('Error cargando alertas de stock:', error);
            return [];
        }
    };

    // ==================== RENDER ====================

    if (isLoading) {
        return <Spinner fullScreen text="Cargando dashboard..." />;
    }

    const { kpis, salesTrend, topProducts, recentSales, lowStockAlerts } = dashboardData;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                        Dashboard - {user.nombre}
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Resumen de tu actividad de ventas
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        value={period}
                        onChange={setPeriod}
                        options={[
                            { value: 'today', label: 'Hoy' },
                            { value: 'week', label: 'Últimos 7 días' },
                            { value: 'month', label: 'Últimos 30 días' },
                        ]}
                        className="w-48"
                    />
                    <Button
                        variant="primary"
                        onClick={() => navigate('/vendedor/nueva-venta')}
                        leftIcon={<ShoppingCart className="w-4 h-4" />}
                    >
                        Nueva Venta
                    </Button>
                </div>
            </div>

            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Ventas del Período"
                    value={kpis.totalVentasHoy}
                    subtitle={`${formatCurrency(kpis.montoVentasHoy)}`}
                    icon={<ShoppingCart className="w-6 h-6" />}
                    iconBgColor="bg-primary-100 dark:bg-primary-900/20"
                    iconColor="text-primary-600 dark:text-primary-400"
                    trend="up"
                    trendValue="+12%"
                />

                <KPICard
                    title="Monto Vendido"
                    value={formatCurrency(kpis.montoVentasHoy)}
                    subtitle="Total en el período"
                    icon={<DollarSign className="w-6 h-6" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/20"
                    iconColor="text-green-600 dark:text-green-400"
                    trend="up"
                    trendValue="+8.5%"
                />

                <KPICard
                    title="Clientes Atendidos"
                    value={kpis.clientesAtendidos}
                    subtitle="Clientes únicos"
                    icon={<Users className="w-6 h-6" />}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                    iconColor="text-blue-600 dark:text-blue-400"
                    trend="up"
                    trendValue="+15"
                />

                <KPICard
                    title="Ticket Promedio"
                    value={formatCurrency(kpis.ticketPromedio)}
                    subtitle="Por venta"
                    icon={<TrendingUp className="w-6 h-6" />}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/20"
                    iconColor="text-purple-600 dark:text-purple-400"
                    trend="up"
                    trendValue="+5.2%"
                />
            </div>

            {/* Meta Mensual */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                                Meta Mensual
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                {formatCurrency(kpis.montoVentasHoy)} de {formatCurrency(kpis.metaMensual)}
                            </p>
                        </div>
                    </div>
                    <Badge variant={kpis.progreso >= 100 ? 'success' : 'warning'} size="lg">
                        {kpis.progreso.toFixed(1)}%
                    </Badge>
                </div>
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 dark:bg-dark-hover rounded-full h-4 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${kpis.progreso >= 100
                                ? 'bg-green-500'
                                : kpis.progreso >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-blue-500'
                            }`}
                        style={{ width: `${kpis.progreso}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-dark-muted mt-2">
                    {kpis.progreso >= 100
                        ? '¡Felicitaciones! Has alcanzado tu meta 🎉'
                        : `Te falta ${formatCurrency(kpis.metaMensual - kpis.montoVentasHoy)} para alcanzar tu meta`}
                </p>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tendencia de Ventas */}
                <SalesChart
                    data={salesTrend}
                    type="area"
                    title="Tendencia de Ventas"
                    height={300}
                />

                {/* Top Productos */}
                <BarChart
                    data={topProducts}
                    title="Top 5 Productos Más Vendidos"
                    dataKey="value"
                    nameKey="name"
                    height={300}
                />
            </div>

            {/* Secciones Inferiores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ventas Recientes */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Ventas Recientes
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/vendedor/mis-ventas')}
                        >
                            Ver todas
                        </Button>
                    </div>
                    <div className="p-4 space-y-3">
                        {recentSales.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-dark-muted py-8">
                                No hay ventas recientes
                            </p>
                        ) : (
                            recentSales.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-hover rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors cursor-pointer"
                                    onClick={() => navigate(`/vendedor/mis-ventas`)}
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {sale.codigoVenta}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            {sale.nombreCliente || 'Cliente General'}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-dark-muted">
                                            {formatDate(sale.fechaCreacion)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-dark-text">
                                            {formatCurrency(sale.total)}
                                        </p>
                                        <Badge
                                            variant={sale.estado === 'PAGADO' ? 'success' : 'warning'}
                                            size="sm"
                                        >
                                            {sale.estado}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Alertas de Stock Bajo */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Productos con Stock Bajo
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/vendedor/stock')}
                        >
                            Ver todos
                        </Button>
                    </div>
                    <div className="p-4 space-y-3">
                        {lowStockAlerts.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-dark-muted py-8">
                                No hay alertas de stock bajo
                            </p>
                        ) : (
                            lowStockAlerts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-dark-text">
                                                {product.nombre}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                {product.codigo}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="warning" size="sm">
                                        Stock: {product.stock}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">¿Listo para más ventas?</h3>
                        <p className="opacity-90">
                            Continúa alcanzando tus metas. ¡Cada venta cuenta!
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => navigate('/vendedor/nueva-venta')}
                        leftIcon={<ShoppingCart className="w-5 h-5" />}
                    >
                        Iniciar Venta
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
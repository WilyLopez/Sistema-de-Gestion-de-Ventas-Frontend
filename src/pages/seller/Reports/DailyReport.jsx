import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import Card from '@components/ui/Card';
import Spinner from '@components/ui/Spinner';
import { DollarSign, Hash, ShoppingCart, BarChart2 } from 'lucide-react';
import KPICard from '@components/charts/KPICard';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { formatCurrency, formatDate } from '@utils/formatters';
import ReporteService from '@services/ReporteService';

const DailyReport = () => {
    const { user } = useAuth();
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = async () => {
        if (!user || !user.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await ReporteService.getSellerDailyReport(user.id, reportDate);
            setReportData(data);
        } catch (err) {
            console.error("Error fetching daily report:", err);
            setError("No se pudo cargar el reporte. Intente de nuevo más tarde.");
            setReportData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [user, reportDate]);

    const handleDateChange = (e) => {
        setReportDate(e.target.value);
    };

    return (
        <div className="space-y-8">
            <Card>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Reporte Diario de Vendedor</h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Un resumen de tu actividad de ventas para el día seleccionado.
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <Input
                            type="date"
                            value={reportDate}
                            onChange={handleDateChange}
                            label="Seleccionar Fecha"
                            className="w-full md:w-auto"
                        />
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" text="Generando reporte..." />
                </div>
            ) : error ? (
                <Card>
                    <div className="p-6 text-center text-red-500">{error}</div>
                </Card>
            ) : reportData && reportData.numeroTransacciones > 0 ? (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <KPICard
                            title="Ingresos Totales"
                            value={formatCurrency(reportData.totalVentas)}
                            icon={<DollarSign className="w-6 h-6 text-green-500" />}
                            tooltip="Suma total de todas las ventas del día."
                        />
                        <KPICard
                            title="Nº de Transacciones"
                            value={reportData.numeroTransacciones}
                            icon={<Hash className="w-6 h-6 text-blue-500" />}
                            tooltip="Cantidad total de ventas individuales realizadas."
                        />
                        <KPICard
                            title="Promedio por Venta"
                            value={formatCurrency(reportData.promedioPorVenta)}
                            icon={<BarChart2 className="w-6 h-6 text-yellow-500" />}
                            tooltip="Ingreso total dividido por el número de transacciones."
                        />
                    </div>

                    {/* Products Sold Table */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Productos Vendidos</h2>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                                    <thead className="bg-gray-50 dark:bg-dark-card">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-dark-bg divide-y divide-gray-200 dark:divide-dark-border">
                                        {reportData.productosVendidos.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{item.nombre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-dark-muted">{item.cantidad}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-700 dark:text-dark-text">{formatCurrency(item.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                </>
            ) : (
                <Card>
                    <div className="p-6 text-center text-gray-500">No hay datos de ventas para el día seleccionado.</div>
                </Card>
            )}
        </div>
    );
};

export default DailyReport;
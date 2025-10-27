import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * Componente SalesChart
 * Gráfico de ventas con recharts
 * 
 * @param {Array} data - Datos del gráfico [{fecha, ventas, cantidad}]
 * @param {string} type - Tipo: 'line' | 'area'
 * @param {string} title - Título del gráfico
 * @param {number} height - Altura del gráfico
 */
const SalesChart = ({
    data = [],
    type = 'area',
    title = 'Ventas',
    height = 300,
}) => {
    // Formatear moneda para tooltip
    const formatCurrency = (value) => {
        return `S/ ${value?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Tooltip personalizado
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-dark-card p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border">
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text mb-2">
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.name === 'Ventas' ? formatCurrency(entry.value) : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                    {title}
                </h3>
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-dark-muted">
                    No hay datos disponibles
                </div>
            </div>
        );
    }

    const Chart = type === 'area' ? AreaChart : LineChart;
    const ChartElement = type === 'area' ? Area : Line;

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={height}>
                <Chart data={data}>
                    <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="fecha" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `S/ ${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ChartElement
                        type="monotone"
                        dataKey="ventas"
                        name="Ventas"
                        stroke="#3b82f6"
                        fill={type === 'area' ? 'url(#colorVentas)' : undefined}
                        strokeWidth={2}
                    />
                    <ChartElement
                        type="monotone"
                        dataKey="cantidad"
                        name="Cantidad"
                        stroke="#10b981"
                        fill={type === 'area' ? 'none' : undefined}
                        strokeWidth={2}
                    />
                </Chart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
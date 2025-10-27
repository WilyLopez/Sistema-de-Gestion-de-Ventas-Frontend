import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

/**
 * Componente BarChart
 * Gráfico de barras con recharts
 * 
 * @param {Array} data - Datos [{name, value}]
 * @param {string} title - Título del gráfico
 * @param {string} dataKey - Key del valor (default: 'value')
 * @param {string} nameKey - Key del nombre (default: 'name')
 * @param {number} height - Altura
 * @param {Array} colors - Array de colores para las barras
 */
const BarChart = ({
    data = [],
    title = 'Gráfico de Barras',
    dataKey = 'value',
    nameKey = 'name',
    height = 300,
    colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
}) => {
    // Tooltip personalizado
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-dark-card p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border">
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                        {payload[0].payload[nameKey]}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                        Valor: {payload[0].value?.toLocaleString('es-PE')}
                    </p>
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

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey={nameKey} 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey={dataKey} name="Valor" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
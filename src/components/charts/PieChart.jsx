import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * Componente PieChart
 * Gráfico circular con recharts
 * 
 * @param {Array} data - Datos [{name, value}]
 * @param {string} title - Título del gráfico
 * @param {number} height - Altura
 * @param {Array} colors - Colores personalizados
 */
const PieChart = ({
    data = [],
    title = 'Distribución',
    height = 300,
    colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
}) => {
    // Calcular total
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    // Tooltip personalizado
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / total) * 100).toFixed(1);
            return (
                <div className="bg-white dark:bg-dark-card p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border">
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                        {payload[0].name}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                        Valor: {payload[0].value?.toLocaleString('es-PE')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        {percentage}% del total
                    </p>
                </div>
            );
        }
        return null;
    };

    // Renderizar etiquetas personalizadas
    const renderLabel = (entry) => {
        const percentage = ((entry.value / total) * 100).toFixed(0);
        return `${percentage}%`;
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
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
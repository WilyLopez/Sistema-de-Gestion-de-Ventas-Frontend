import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Componente KPICard
 * Tarjeta para mostrar indicadores clave de rendimiento
 * 
 * @param {string} title - Título del KPI
 * @param {string|number} value - Valor principal
 * @param {string} subtitle - Subtítulo o descripción
 * @param {ReactNode} icon - Ícono del KPI
 * @param {string} trend - Tendencia: 'up' | 'down' | 'neutral'
 * @param {string|number} trendValue - Valor del cambio (ej: "+15%")
 * @param {string} iconBgColor - Color de fondo del ícono
 * @param {string} iconColor - Color del ícono
 * @param {Function} onClick - Callback al hacer clic
 */
const KPICard = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendValue,
    iconBgColor = 'bg-primary-100 dark:bg-primary-900/20',
    iconColor = 'text-primary-600 dark:text-primary-400',
    onClick,
}) => {
    // Determinar color de tendencia
    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return 'text-green-600 dark:text-green-400';
            case 'down':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-500 dark:text-dark-muted';
        }
    };

    // Determinar ícono de tendencia
    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4" />;
            case 'down':
                return <TrendingDown className="w-4 h-4" />;
            default:
                return <Minus className="w-4 h-4" />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                bg-white dark:bg-dark-card rounded-lg shadow-md p-6
                border border-gray-200 dark:border-dark-border
                transition-all duration-200
                ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-primary-500 dark:hover:border-primary-500' : ''}
            `}
        >
            <div className="flex items-start justify-between">
                {/* Contenido principal */}
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-dark-muted mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                            {subtitle}
                        </p>
                    )}
                    
                    {/* Tendencia */}
                    {trend && trendValue && (
                        <div className={`flex items-center gap-1 mt-2 ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span className="text-sm font-medium">{trendValue}</span>
                        </div>
                    )}
                </div>

                {/* Ícono */}
                {icon && (
                    <div className={`p-3 rounded-lg ${iconBgColor}`}>
                        <div className={`w-6 h-6 ${iconColor}`}>
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KPICard;
import { useNavigate } from 'react-router-dom';
import { Eye, Check, AlertTriangle, AlertCircle, Info, Package } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import alertService from '@services/alertService';
import { useAuth } from '@hooks/useAuth';

/**
 * Tabla de Alertas de Stock
 * Extiende BaseTable con configuración específica para alertas
 */
const AlertTable = ({ onMarkAsRead }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Mapeo de iconos por tipo
    const alertIcons = {
        STOCK_MINIMO: AlertTriangle,
        STOCK_AGOTADO: AlertCircle,
        STOCK_EXCESIVO: Package,
        REORDEN: Info,
    };

    // Mapeo de colores por urgencia
    const urgencyColors = {
        CRITICO: {
            bg: 'bg-red-100 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-400',
            badge: 'bg-red-500 text-white',
        },
        ALTO: {
            bg: 'bg-orange-100 dark:bg-orange-900/20',
            text: 'text-orange-700 dark:text-orange-400',
            badge: 'bg-orange-500 text-white',
        },
        MEDIO: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/20',
            text: 'text-yellow-700 dark:text-yellow-400',
            badge: 'bg-yellow-500 text-white',
        },
        BAJO: {
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-700 dark:text-blue-400',
            badge: 'bg-blue-500 text-white',
        },
    };

    // Configuración de columnas
    const columns = [
        {
            key: 'nivelUrgencia',
            label: 'Urgencia',
            sortable: true,
            render: (value) => {
                const colors = urgencyColors[value] || urgencyColors.BAJO;
                return (
                    <Badge variant="custom" className={colors.badge}>
                        {value}
                    </Badge>
                );
            },
        },
        {
            key: 'tipoAlerta',
            label: 'Tipo',
            sortable: true,
            render: (value) => {
                const Icon = alertIcons[value] || Info;
                return (
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
                        <span className="text-sm">
                            {value?.replace('_', ' ')}
                        </span>
                    </div>
                );
            },
        },
        {
            key: 'producto',
            label: 'Producto',
            sortable: false,
            render: (value) => {
                if (!value) return '-';
                return (
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-text">
                            {value.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            Código: {value.codigo}
                        </p>
                    </div>
                );
            },
        },
        {
            key: 'mensaje',
            label: 'Mensaje',
            sortable: false,
            render: (value) => (
                <span className="text-sm text-gray-700 dark:text-dark-text line-clamp-2">
                    {value}
                </span>
            ),
        },
        {
            key: 'producto',
            label: 'Stock',
            sortable: false,
            render: (value) => {
                if (!value) return '-';
                const stockActual = value.stockActual;
                const stockMinimo = value.stockMinimo;
                
                let badgeClass = 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
                
                if (stockActual === 0) {
                    badgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
                } else if (stockActual <= stockMinimo) {
                    badgeClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
                }

                return (
                    <div className="text-sm">
                        <Badge variant="custom" className={badgeClass}>
                            {stockActual} / {stockMinimo}
                        </Badge>
                    </div>
                );
            },
        },
        {
            key: 'fechaGeneracion',
            label: 'Fecha',
            sortable: true,
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                return (
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                            {date.toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: 'short',
                            })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            {date.toLocaleTimeString('es-PE', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                );
            },
        },
        {
            key: 'leida',
            label: 'Estado',
            sortable: true,
            render: (value) => (
                <Badge
                    variant={value ? 'success' : 'danger'}
                    className={
                        value
                            ? 'bg-gray-500 text-white'
                            : 'bg-primary-500 text-white'
                    }
                >
                    {value ? 'Leída' : 'Nueva'}
                </Badge>
            ),
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver producto',
            onClick: (row) => {
                if (row.producto) {
                    navigate(`/admin/productos/${row.producto.id}`);
                }
            },
        },
        {
            icon: <Check className="w-4 h-4" />,
            label: 'Marcar como leída',
            onClick: (row) => {
                if (!row.leida && user) {
                    onMarkAsRead && onMarkAsRead(row.id, user.id);
                }
            },
        },
    ];

    // Función para obtener datos con paginación
    const fetchData = async (page, size, sort, filters) => {
        try {
            const response = await alertService.getAll(page, size);
            return response;
        } catch (error) {
            console.error('Error al cargar alertas:', error);
            throw error;
        }
    };

    // Función de exportación
    const handleExport = async () => {
        try {
            // TODO: Implementar exportación
            console.log('Exportando alertas...');
        } catch (error) {
            console.error('Error al exportar:', error);
        }
    };

    return (
        <BaseTable
            columns={columns}
            fetchData={fetchData}
            actions={actions}
            onExport={handleExport}
            selectable={true}
            searchable={true}
            searchPlaceholder="Buscar por producto, tipo de alerta..."
            emptyMessage="No hay alertas registradas"
        />
    );
};

export default AlertTable;
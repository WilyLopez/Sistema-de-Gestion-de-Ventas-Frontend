// src/components/tables/InventoryTable.jsx
import { 
    ArrowDownCircle, 
    ArrowUpCircle, 
    Edit, 
    RotateCcw, 
    Package,
    Eye 
} from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import inventarioService from '@services/InventarioService';
import { formatDateTime, formatNumber } from '@utils/formatters';

/**
 * Tabla de Movimientos de Inventario
 * Extiende BaseTable con configuración específica para inventario
 */
const InventoryTable = ({ onViewDetail, refreshTrigger, filters = {} }) => {
    // Configuración de columnas
    const columns = [
        {
            key: 'fechaMovimiento',
            label: 'Fecha',
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900 dark:text-dark-text">
                    {formatDateTime(value)}
                </span>
            ),
        },
        {
            key: 'tipoMovimiento',
            label: 'Tipo',
            sortable: true,
            render: (value) => {
                const config = {
                    ENTRADA: {
                        icon: ArrowDownCircle,
                        label: 'Entrada',
                        className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                    },
                    SALIDA: {
                        icon: ArrowUpCircle,
                        label: 'Salida',
                        className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                    },
                    AJUSTE: {
                        icon: Edit,
                        label: 'Ajuste',
                        className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                    },
                    DEVOLUCION: {
                        icon: RotateCcw,
                        label: 'Devolución',
                        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                    },
                };

                const movConfig = config[value] || config.ENTRADA;
                const Icon = movConfig.icon;

                return (
                    <Badge variant="custom" className={movConfig.className}>
                        <span className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5" />
                            {movConfig.label}
                        </span>
                    </Badge>
                );
            },
        },
        {
            key: 'producto',
            label: 'Producto',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-text">
                            {value?.nombre || 'Producto'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            Código: {value?.codigo || row.idProducto}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'cantidad',
            label: 'Cantidad',
            sortable: true,
            render: (value, row) => {
                const isPositive = row.tipoMovimiento === 'ENTRADA' || row.tipoMovimiento === 'DEVOLUCION';
                const color = isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400';
                
                return (
                    <span className={`font-semibold ${color}`}>
                        {isPositive ? '+' : '-'}{formatNumber(value)}
                    </span>
                );
            },
        },
        {
            key: 'stockAnterior',
            label: 'Stock Anterior',
            sortable: false,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-dark-muted">
                    {formatNumber(value)}
                </span>
            ),
        },
        {
            key: 'stockNuevo',
            label: 'Stock Nuevo',
            sortable: false,
            render: (value) => (
                <span className="text-sm font-medium text-gray-900 dark:text-dark-text">
                    {formatNumber(value)}
                </span>
            ),
        },
        {
            key: 'usuario',
            label: 'Usuario',
            sortable: false,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-dark-muted">
                    {value?.username || value?.nombre || 'Sistema'}
                </span>
            ),
        },
        {
            key: 'observacion',
            label: 'Observación',
            sortable: false,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-dark-muted line-clamp-2">
                    {value || '-'}
                </span>
            ),
        },
    ];

    // Configuración de acciones
    const actions = onViewDetail ? [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver detalle',
            onClick: (row) => onViewDetail && onViewDetail(row),
        },
    ] : [];

    // Función para obtener datos con paginación y filtros
    const fetchData = async (page, size) => {
        try {
            if (Object.keys(filters).length > 0) {
                const response = await inventarioService.search(filters, page, size);
                return response;
            } else {
                const response = await inventarioService.getAll(page, size);
                return response;
            }
        } catch (error) {
            console.error('Error al cargar movimientos de inventario:', error);
            throw error;
        }
    };

    return (
        <BaseTable
            key={refreshTrigger}
            columns={columns}
            fetchData={fetchData}
            actions={actions}
            searchable={false}
            emptyMessage="No hay movimientos de inventario registrados"
        />
    );
};

export default InventoryTable;
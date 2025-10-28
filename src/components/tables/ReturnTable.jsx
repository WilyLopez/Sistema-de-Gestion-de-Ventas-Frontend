// src/components/tables/ReturnTable.jsx
import { Eye, CheckCircle, XCircle, Clock, PackageCheck } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import devolucionService from '@services/DevolucionService';
import { formatDateTime, formatCurrency } from '@utils/formatters';
import { RETURN_STATUS } from '@utils/constants';

/**
 * Tabla de Devoluciones
 * Extiende BaseTable con configuración específica para devoluciones
 */
const ReturnTable = ({ onViewDetail, onApprove, onReject, refreshTrigger, filters = {} }) => {
    // Configuración de estados
    const statusConfig = {
        [RETURN_STATUS.PENDING]: {
            icon: Clock,
            label: 'Pendiente',
            className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
        },
        [RETURN_STATUS.APPROVED]: {
            icon: CheckCircle,
            label: 'Aprobada',
            className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
        },
        [RETURN_STATUS.REJECTED]: {
            icon: XCircle,
            label: 'Rechazada',
            className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
        },
        [RETURN_STATUS.COMPLETED]: {
            icon: PackageCheck,
            label: 'Completada',
            className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
        },
    };

    // Configuración de columnas
    const columns = [
        {
            key: 'fechaDevolucion',
            label: 'Fecha Devolución',
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900 dark:text-dark-text">
                    {formatDateTime(value)}
                </span>
            ),
        },
        {
            key: 'venta',
            label: 'Venta',
            sortable: false,
            render: (value) => (
                <div>
                    <p className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
                        {value?.codigo || '-'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        {value?.fecha && new Date(value.fecha).toLocaleDateString('es-PE')}
                    </p>
                </div>
            ),
        },
        {
            key: 'cliente',
            label: 'Cliente',
            sortable: false,
            render: (value) => {
                if (!value) return '-';
                return (
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                            {value.nombre} {value.apellido}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            {value.tipoDocumento}: {value.numeroDocumento}
                        </p>
                    </div>
                );
            },
        },
        {
            key: 'detalles',
            label: 'Productos',
            sortable: false,
            render: (value) => {
                if (!value || value.length === 0) return '-';
                const totalProductos = value.length;
                const totalCantidad = value.reduce((sum, det) => sum + det.cantidad, 0);
                return (
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                            {totalProductos} producto{totalProductos !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            {totalCantidad} unidad{totalCantidad !== 1 ? 'es' : ''}
                        </p>
                    </div>
                );
            },
        },
        {
            key: 'totalDevolucion',
            label: 'Total',
            sortable: true,
            render: (value) => (
                <span className="text-base font-bold text-gray-900 dark:text-dark-text">
                    {formatCurrency(value)}
                </span>
            ),
        },
        {
            key: 'motivo',
            label: 'Motivo',
            sortable: false,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-dark-muted line-clamp-2">
                    {value || '-'}
                </span>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
            render: (value) => {
                const config = statusConfig[value] || statusConfig[RETURN_STATUS.PENDING];
                const Icon = config.icon;
                return (
                    <Badge variant="custom" className={config.className}>
                        <span className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5" />
                            {config.label}
                        </span>
                    </Badge>
                );
            },
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver detalle',
            onClick: (row) => onViewDetail && onViewDetail(row),
        },
        {
            icon: <CheckCircle className="w-4 h-4" />,
            label: (row) => row.estado === RETURN_STATUS.PENDING ? 'Aprobar' : 'Aprobada',
            onClick: (row) => {
                if (row.estado === RETURN_STATUS.PENDING && onApprove) {
                    onApprove(row);
                }
            },
            variant: (row) => row.estado === RETURN_STATUS.PENDING ? 'success' : 'default',
        },
        {
            icon: <XCircle className="w-4 h-4" />,
            label: (row) => row.estado === RETURN_STATUS.PENDING ? 'Rechazar' : 'Rechazada',
            onClick: (row) => {
                if (row.estado === RETURN_STATUS.PENDING && onReject) {
                    onReject(row);
                }
            },
            variant: (row) => row.estado === RETURN_STATUS.PENDING ? 'danger' : 'default',
        },
    ];

    // Función para obtener datos con paginación y filtros
    const fetchData = async (page, size, sort) => {
        try {
            const response = await devolucionService.search(filters, page, size, sort);
            return response;
        } catch (error) {
            console.error('Error al cargar devoluciones:', error);
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
            emptyMessage="No hay devoluciones registradas"
        />
    );
};

export default ReturnTable;
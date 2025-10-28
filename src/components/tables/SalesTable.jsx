// src/components/tables/SalesTable.jsx
import { useNavigate } from 'react-router-dom';
import { Eye, XCircle, FileText } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import saleService from '@services/VentaService';
import { SALE_STATUS, PAYMENT_METHODS } from '@utils/constants';

/**
 * Tabla de Ventas
 * Extiende BaseTable con configuración específica para ventas
 */
const SalesTable = ({ onCancel, userRole }) => {
    const navigate = useNavigate();

    // Mapeo de colores por estado
    const statusColors = {
        [SALE_STATUS.PAID]: 'bg-green-500 text-white',
        [SALE_STATUS.CANCELLED]: 'bg-red-500 text-white',
        [SALE_STATUS.PENDING]: 'bg-yellow-500 text-white',
    };

    // Configuración de columnas
    const columns = [
        {
            key: 'codigo',
            label: 'Código',
            sortable: true,
            render: (value) => (
                <span className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
                    {value}
                </span>
            ),
        },
        {
            key: 'fecha',
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
                                year: 'numeric',
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
            key: 'usuario',
            label: 'Vendedor',
            sortable: false,
            render: (value) => value?.nombre || '-',
        },
        {
            key: 'metodoPago',
            label: 'Método Pago',
            sortable: false,
            render: (value) => {
                const paymentLabels = {
                    [PAYMENT_METHODS.CASH]: 'Efectivo',
                    [PAYMENT_METHODS.CREDIT_CARD]: 'T. Crédito',
                    [PAYMENT_METHODS.DEBIT_CARD]: 'T. Débito',
                    [PAYMENT_METHODS.TRANSFER]: 'Transferencia',
                    [PAYMENT_METHODS.YAPE]: 'Yape',
                    [PAYMENT_METHODS.PLIN]: 'Plin',
                };
                return (
                    <Badge variant="custom" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        {paymentLabels[value] || value}
                    </Badge>
                );
            },
        },
        {
            key: 'total',
            label: 'Total',
            sortable: true,
            render: (value) => (
                <span className="text-lg font-bold text-gray-900 dark:text-dark-text">
                    S/ {value?.toFixed(2)}
                </span>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
            render: (value) => (
                <Badge
                    variant="custom"
                    className={statusColors[value] || 'bg-gray-500 text-white'}
                >
                    {value}
                </Badge>
            ),
        },
    ];

    // Configuración de acciones base
    const actions = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver detalle',
            onClick: (row) => {
                const basePath = userRole === 'ADMINISTRADOR' ? '/admin' : '/vendedor';
                navigate(`${basePath}/ventas/${row.id}`);
            },
        },
        {
            icon: <FileText className="w-4 h-4" />,
            label: 'Ver comprobante',
            onClick: (row) => {
                // TODO: Implementar vista de comprobante
                console.log('Ver comprobante:', row.id);
            },
        },
    ];

    // Solo admin puede anular ventas
    if (userRole === 'ADMINISTRADOR') {
        actions.push({
            icon: <XCircle className="w-4 h-4" />,
            label: 'Anular venta',
            variant: 'danger',
            onClick: (row) => {
                if (row.estado === SALE_STATUS.PAID) {
                    onCancel && onCancel(row);
                }
            },
        });
    }

    // Función para obtener datos con paginación
    const fetchData = async (page, size, sort) => {
        try {
            const response = await saleService.getAll(page, size, sort);
            return response;
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            throw error;
        }
    };

    // Función de exportación
    const handleExport = async () => {
        try {
            // TODO: Implementar exportación
            console.log('Exportando ventas...');
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
            searchPlaceholder="Buscar por código, cliente..."
            emptyMessage="No hay ventas registradas"
        />
    );
};

export default SalesTable;
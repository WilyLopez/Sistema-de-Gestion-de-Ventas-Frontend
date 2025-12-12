//src/components/tables/ProductTable.jsx
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Package } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import productService from '@services/ProductoService';

/**
 * Tabla de Productos
 * Extiende BaseTable con configuración específica para productos
 */
const ProductTable = ({ onDelete }) => {
    const navigate = useNavigate();

    // Configuración de columnas
    const columns = [
        {
            key: 'codigo',
            label: 'Código',
            sortable: true,
            render: (value) => (
                <span className="font-mono text-sm font-medium">{value}</span>
            ),
        },
        {
            key: 'nombre',
            label: 'Producto',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    {row.imagenUrl ? (
                        <img
                            src={row.imagenUrl}
                            alt={value}
                            className="w-10 h-10 rounded object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 dark:bg-dark-hover flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-text">
                            {value}
                        </p>
                        {row.marca && (
                            <p className="text-xs text-gray-500 dark:text-dark-muted">
                                {row.marca}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'nombreCategoria',
            label: 'Categoría',
            sortable: true,
            render: (value, row) => row.nombreCategoria || '-',
        },
        {
            key: 'talla',
            label: 'Talla',
            sortable: false,
            render: (value) => (
                <Badge variant="custom" className="bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-dark-text">
                    {value || '-'}
                </Badge>
            ),
        },
        {
            key: 'color',
            label: 'Color',
            sortable: false,
            render: (value) => value || '-',
        },
        {
            key: 'precioVenta',
            label: 'Precio',
            sortable: true,
            render: (value) => (
                <span className="font-medium">
                    S/ {value?.toFixed(2)}
                </span>
            ),
        },
        {
            key: 'stockActual',
            label: 'Stock',
            sortable: true,
            render: (value, row) => {
                let badgeClass = 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';

                if (value === 0) {
                    badgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
                } else if (value <= row.stockMinimo) {
                    badgeClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
                }

                return (
                    <Badge variant="custom" className={badgeClass}>
                        {value} unid.
                    </Badge>
                );
            },
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
            render: (value) => (
                <Badge
                    variant={value ? 'success' : 'danger'}
                    className={
                        value
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                    }
                >
                    {value ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver detalle',
            onClick: (row) => {
                if (!row.idProducto) {
                    console.error('ID de producto no válido:', row);
                    return;
                }
                navigate(`/admin/productos/${row.idProducto}`);
            },
        },
        {
            icon: <Edit className="w-4 h-4" />,
            label: 'Editar',
            onClick: (row) => {
                if (!row.idProducto) {
                    console.error('ID de producto no válido:', row);
                    return;
                }
                navigate(`/admin/productos/${row.idProducto}/editar`);
            },
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: 'Eliminar',
            variant: 'danger',
            onClick: (row) => onDelete && onDelete(row),
        },
    ];

    // Función para obtener datos con paginación
    const fetchData = async (page, size, sort, searchQuery = '') => {
        try {
            const response = await productService.getAll(page, size, sort, searchQuery);
            return response;
        } catch (error) {
            console.error('Error al cargar productos:', error);
            throw error;
        }
    };

    // Función de exportación
    const handleExport = async () => {
        try {
            // TODO: Implementar exportación
            console.log('Exportando productos...');
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
            searchPlaceholder="Buscar por código, nombre o marca..."
            emptyMessage="No hay productos registrados"
        />
    );
};

export default ProductTable;
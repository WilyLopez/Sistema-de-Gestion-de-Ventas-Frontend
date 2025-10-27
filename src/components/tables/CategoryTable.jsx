// src/components/tables/CategoryTable.jsx
import { Edit, Trash2, Package } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import categoriaService from '@services/CategoriaService';
import { formatDate } from '@utils/formatters';

/**
 * Tabla de Categorías
 * Extiende BaseTable con configuración específica para categorías
 */
const CategoryTable = ({ onEdit, onDelete, refreshTrigger }) => {
    // Configuración de columnas
    const columns = [
        {
            key: 'nombre',
            label: 'Nombre',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-text">
                            {value}
                        </p>
                        {row.descripcion && (
                            <p className="text-xs text-gray-500 dark:text-dark-muted line-clamp-1">
                                {row.descripcion}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'cantidadProductos',
            label: 'Productos',
            sortable: true,
            render: (value) => (
                <Badge 
                    variant="custom" 
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                >
                    {value || 0} productos
                </Badge>
            ),
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
                    {value ? 'Activa' : 'Inactiva'}
                </Badge>
            ),
        },
        {
            key: 'fechaCreacion',
            label: 'Fecha de Creación',
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-dark-muted">
                    {formatDate(value)}
                </span>
            ),
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            icon: <Edit className="w-4 h-4" />,
            label: 'Editar',
            onClick: (row) => onEdit && onEdit(row),
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: 'Eliminar',
            variant: 'danger',
            onClick: (row) => onDelete && onDelete(row),
        },
    ];

    // Función para obtener datos con paginación
    const fetchData = async (page, size) => {
        try {
            const response = await categoriaService.getAll(page, size);
            return response;
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            throw error;
        }
    };

    return (
        <BaseTable
            key={refreshTrigger}
            columns={columns}
            fetchData={fetchData}
            actions={actions}
            searchable={true}
            searchPlaceholder="Buscar categorías..."
            emptyMessage="No hay categorías registradas"
        />
    );
};

export default CategoryTable;
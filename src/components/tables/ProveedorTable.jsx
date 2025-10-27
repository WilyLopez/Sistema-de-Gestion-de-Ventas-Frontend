// src/components/tables/ProveedorTable.jsx
import { Edit, Trash2, Building2, Phone, Mail } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import proveedorService from '@services/ProveedorService';
import { formatRUC, formatPhone, formatDate } from '@utils/formatters';

/**
 * Tabla de Proveedores
 * Extiende BaseTable con configuración específica para proveedores
 */
const ProveedorTable = ({ onEdit, onDelete, refreshTrigger }) => {
    // Configuración de columnas
    const columns = [
        {
            key: 'ruc',
            label: 'RUC',
            sortable: true,
            render: (value) => (
                <span className="font-mono text-sm font-medium">
                    {formatRUC(value)}
                </span>
            ),
        },
        {
            key: 'razonSocial',
            label: 'Razón Social',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-text">
                            {value}
                        </p>
                        {row.nombreComercial && (
                            <p className="text-xs text-gray-500 dark:text-dark-muted">
                                {row.nombreComercial}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'contacto',
            label: 'Contacto',
            sortable: false,
            render: (value, row) => (
                <div className="space-y-1">
                    {row.telefono && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                            <Phone className="w-3.5 h-3.5" />
                            {formatPhone(row.telefono)}
                        </div>
                    )}
                    {row.correo && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-muted">
                            <Mail className="w-3.5 h-3.5" />
                            {row.correo}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'direccion',
            label: 'Dirección',
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
        {
            key: 'fechaCreacion',
            label: 'Fecha de Registro',
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
            const response = await proveedorService.getAll(page, size);
            return response;
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
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
            searchPlaceholder="Buscar por RUC o razón social..."
            emptyMessage="No hay proveedores registrados"
        />
    );
};

export default ProveedorTable;
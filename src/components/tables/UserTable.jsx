import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import userService from '@services/UsuarioService';
import { ROLES } from '@utils/constants';

const UserTable = ({ onDelete, onActivate, onDeactivate }) => {
    const navigate = useNavigate();
    const roleColors = {
        [ROLES.ADMIN]: 'bg-red-500 text-white',
        [ROLES.SELLER]: 'bg-blue-500 text-white',
        [ROLES.EMPLOYEE]: 'bg-green-500 text-white',
    };

    const columns = [
        {
            key: 'username',
            label: 'Usuario',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                        {row.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-text">
                            {value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            {row.correo}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'nombre',
            label: 'Nombre Completo',
            sortable: true,
            render: (value, row) => (
                <span>
                    {value} {row.apellido}
                </span>
            ),
        },
        {
            key: 'nombreRol',
            label: 'Rol',
            sortable: true,
            render: (value) => (
                <Badge
                    variant="custom"
                    className={roleColors[value] || 'bg-gray-500 text-white'}
                >
                    {value}
                </Badge>
            ),
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            sortable: false,
            render: (value) => value || '-',
        },
        {
            key: 'fechaCreacion',
            label: 'Fecha Registro',
            sortable: true,
            render: (value) => {
                if (!value) return '-';
                return new Date(value).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
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

    const actions = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver detalle',
            onClick: (row) => navigate(`/admin/usuarios/${row.idUsuario}`),
        },
        {
            icon: <Edit className="w-4 h-4" />,
            label: 'Editar',
            onClick: (row) => navigate(`/admin/usuarios/${row.idUsuario}/editar`),
        },
        {
            icon: (row) => (row.estado ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />),
            label: (row) => (row.estado ? 'Desactivar' : 'Activar'),
            onClick: (row) => {
                if (row.estado) {
                    onDeactivate && onDeactivate(row);
                } else {
                    onActivate && onActivate(row);
                }
            },
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: 'Eliminar',
            variant: 'danger',
            onClick: (row) => onDelete && onDelete(row),
        },
    ];

    const fetchData = async (page, size) => {
        try {
            const response = await userService.getAll(page, size);
            return response;
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            throw error;
        }
    };

    const handleExport = async () => {
        try {
            console.log('Exportando usuarios...');
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
            searchPlaceholder="Buscar por nombre, usuario o email..."
            emptyMessage="No hay usuarios registrados"
        />
    );
};

export default UserTable;
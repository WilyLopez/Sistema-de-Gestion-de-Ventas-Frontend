import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Shield, Lock } from 'lucide-react';
import BaseTable from './BaseTable';
import Badge from '@components/ui/Badge';
import RolService from '@services/RolService';
import toast from 'react-hot-toast';

const RoleTable = ({ onDelete, refreshKey }) => {
    const navigate = useNavigate();

    const columns = [
        {
            key: 'nombre',
            label: 'Nombre',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-dark-text">
                        {value}
                    </span>
                    {RolService.isRolSistema(row.nombre) && (
                        <Badge variant="info" size="sm">
                            <Lock className="w-3 h-3 mr-1 inline" />
                            Sistema
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            sortable: false,
            render: (value) => (
                <span className="text-gray-600 dark:text-dark-muted line-clamp-2">
                    {value || 'Sin descripción'}
                </span>
            ),
        },
        {
            key: 'nivelAcceso',
            label: 'Nivel de Acceso',
            sortable: true,
            render: (value) => {
                const getBadgeColor = (nivel) => {
                    if (nivel >= 8) return 'danger';
                    if (nivel >= 5) return 'warning';
                    return 'success';
                };

                return (
                    <Badge variant={getBadgeColor(value)} size="sm">
                        Nivel {value}
                    </Badge>
                );
            },
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
            render: (value) => (
                <Badge variant={value ? 'success' : 'danger'}>
                    {value ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
        {
            key: 'fechaCreacion',
            label: 'Fecha de Creación',
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-dark-muted">
                    {new Date(value).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Ver detalles',
            icon: <Eye className="w-4 h-4" />,
            onClick: (role) => navigate(`/admin/roles/${role.idRol}`),
        },
        {
            label: 'Editar',
            icon: <Edit className="w-4 h-4" />,
            onClick: (role) => navigate(`/admin/roles/${role.idRol}/editar`),
        },
        {
            label: 'Eliminar',
            icon: <Trash2 className="w-4 h-4" />,
            variant: 'danger',
            onClick: (role) => {
                if (!RolService.isRolSistema(role.nombre)) {
                    onDelete(role);
                }
            },
        },
    ];

    const fetchData = async (page, size) => {
        try {
            return await RolService.getAll(page, size);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            toast.error('No se pudieron cargar los roles. Por favor, intenta de nuevo.');
            throw error;
        }
    };

    return (
        <BaseTable
            columns={columns}
            fetchData={fetchData}
            actions={actions}
            searchable={true}
            searchPlaceholder="Buscar roles por nombre..."
            emptyMessage="No hay roles registrados"
            key={refreshKey}
        />
    );
};

export default RoleTable;
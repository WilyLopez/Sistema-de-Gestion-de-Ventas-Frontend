//src/pages/admin/Roles/RoleList.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield } from 'lucide-react';
import RoleTable from '@components/tables/RoleTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import RolService from '@services/RolService';
import toast from 'react-hot-toast';

/**
 * Página de Lista de Roles
 * CRUD completo con tabla y acciones
 */
const RoleList = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Manejar eliminación
    const handleDelete = (role) => {
        // Verificar si es un rol del sistema
        if (RolService.isRolSistema(role.nombre)) {
            toast.error('No se pueden eliminar roles del sistema');
            return;
        }

        setSelectedRole(role);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedRole) return;

        setIsDeleting(true);
        try {
            await RolService.delete(selectedRole.idRol);
            setShowDeleteModal(false);
            setSelectedRole(null);
            setRefreshKey(prev => prev + 1);
            toast.success('Rol eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            const message = error.parsedError?.message || 'Error al eliminar el rol';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary-600" />
                        Gestión de Roles
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra los roles y permisos del sistema
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/admin/roles/crear')}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Nuevo Rol
                </Button>
            </div>

            {/* Alerta informativa */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Sobre los roles del sistema
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Los roles <span className="font-semibold">Administrador</span>,
                            <span className="font-semibold"> Vendedor</span> y
                            <span className="font-semibold"> Empleado</span> son roles del sistema y no pueden ser eliminados ni modificados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <RoleTable
                key={refreshKey}
                onDelete={handleDelete}
            />

            {/* Modal de confirmación de eliminación */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => !isDeleting && setShowDeleteModal(false)}
                title="Eliminar Rol"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-dark-text">
                        ¿Estás seguro de que deseas eliminar el rol{' '}
                        <span className="font-semibold">{selectedRole?.nombre}</span>?
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Esta acción no se puede deshacer y afectará a todos los usuarios con este rol.
                    </p>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            loading={isDeleting}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RoleList;
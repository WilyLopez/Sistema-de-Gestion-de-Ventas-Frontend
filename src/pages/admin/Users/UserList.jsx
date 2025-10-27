import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import UserTable from '@components/tables/UserTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import userService from '@services/UsuarioService';

const UserList = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        setIsDeleting(true);
        try {
            await userService.delete(selectedUser.idUsuario);
            setShowDeleteModal(false);
            setSelectedUser(null);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleActivate = async (user) => {
        try {
            await userService.activate(user.idUsuario);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error al activar usuario:', error);
        }
    };

    const handleDeactivate = async (user) => {
        try {
            await userService.deactivate(user.idUsuario);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error al desactivar usuario:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra los usuarios del sistema
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/admin/usuarios/crear')}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Nuevo Usuario
                </Button>
            </div>
            <UserTable
                key={refreshKey}
                onDelete={handleDelete}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
            />
            <Modal
                isOpen={showDeleteModal}
                onClose={() => !isDeleting && setShowDeleteModal(false)}
                title="Eliminar Usuario"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-dark-text">
                        ¿Estás seguro de que deseas eliminar al usuario{' '}
                        <span className="font-semibold">{selectedUser?.username}</span>?
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Esta acción no se puede deshacer.
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

export default UserList;
// src/pages/admin/Proveedores/ProveedorList.jsx
import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import ProveedorTable from '@components/tables/ProveedorTable';
import ProveedorForm from '@components/forms/ProveedorForm';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Alert from '@components/alerts/Alert';
import proveedorService from '../../../services/ProveedorService';
import { MESSAGES } from '@utils/constants';

/**
 * Página de Gestión de Proveedores
 * Lista, crea, edita y elimina proveedores en modales
 */
const ProveedorList = () => {
    // Estados para modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estados de datos
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Estados de carga
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estados de mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ===== HANDLERS DE CREAR =====
    const handleOpenCreate = () => {
        setShowCreateModal(true);
        setErrorMessage('');
    };

    const handleCreate = async (proveedorData) => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await proveedorService.create(proveedorData);
            setSuccessMessage(MESSAGES.SUCCESS.CREATED);
            setShowCreateModal(false);
            setRefreshKey(prev => prev + 1);

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;

            if (error.response?.status === 400) {
                errorMsg = error.response.data.message || MESSAGES.ERROR.VALIDATION;
                if (error.response.data.errors) {
                    errorMsg = Object.values(error.response.data.errors).join(', ');
                }
            } else if (error.response?.status === 409) {
                errorMsg = 'Ya existe un proveedor con ese RUC';
            }

            setErrorMessage(errorMsg);
            console.error('Error al crear proveedor:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLERS DE EDITAR =====
    const handleOpenEdit = (proveedor) => {
        setSelectedProveedor(proveedor);
        setShowEditModal(true);
        setErrorMessage('');
    };

    const handleEdit = async (proveedorData) => {
        if (!selectedProveedor) return;

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await proveedorService.update(selectedProveedor.idProveedor, proveedorData);
            setSuccessMessage(MESSAGES.SUCCESS.UPDATED);
            setShowEditModal(false);
            setSelectedProveedor(null);
            setRefreshKey(prev => prev + 1);

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;

            if (error.response?.status === 400) {
                errorMsg = error.response.data.message || MESSAGES.ERROR.VALIDATION;
                if (error.response.data.errors) {
                    errorMsg = Object.values(error.response.data.errors).join(', ');
                }
            }

            setErrorMessage(errorMsg);
            console.error('Error al actualizar proveedor:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLERS DE ELIMINAR =====
    const handleOpenDelete = (proveedor) => {
        setSelectedProveedor(proveedor);
        setShowDeleteModal(true);
        setErrorMessage('');
    };

    const handleDelete = async () => {
        if (!selectedProveedor) return;

        setIsDeleting(true);

        try {
            await proveedorService.delete(selectedProveedor.idProveedor);
            setSuccessMessage(MESSAGES.SUCCESS.DELETED);
            setShowDeleteModal(false);
            setSelectedProveedor(null);
            setRefreshKey(prev => prev + 1);

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;

            if (error.response?.status === 409) {
                errorMsg = 'No se puede eliminar este proveedor porque tiene pedidos asociados';
            }

            setErrorMessage(errorMsg);
            console.error('Error al eliminar proveedor:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // ===== HANDLERS DE CANCELAR =====
    const handleCancelCreate = () => {
        setShowCreateModal(false);
        setErrorMessage('');
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setSelectedProveedor(null);
        setErrorMessage('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Proveedores
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra los proveedores de productos
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleOpenCreate}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Nuevo Proveedor
                </Button>
            </div>

            {/* Mensajes de éxito/error */}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {/* Tabla de proveedores */}
            <ProveedorTable
                refreshTrigger={refreshKey}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
            />

            {/* Modal de Crear */}
            <Modal
                isOpen={showCreateModal}
                onClose={handleCancelCreate}
                title="Nuevo Proveedor"
                size="lg"
            >
                <ProveedorForm
                    onSubmit={handleCreate}
                    onCancel={handleCancelCreate}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal de Editar */}
            <Modal
                isOpen={showEditModal}
                onClose={handleCancelEdit}
                title="Editar Proveedor"
                size="lg"
            >
                <ProveedorForm
                    initialData={selectedProveedor}
                    onSubmit={handleEdit}
                    onCancel={handleCancelEdit}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal de Eliminar */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => !isDeleting && setShowDeleteModal(false)}
                title="Eliminar Proveedor"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                                ¿Estás seguro?
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-400">
                                Estás a punto de eliminar el proveedor{' '}
                                <span className="font-semibold">{selectedProveedor?.razonSocial}</span>
                                {' '}(RUC: {selectedProveedor?.ruc}).
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                        Esta acción no se puede deshacer y puede afectar los pedidos asociados.
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
                            onClick={handleDelete}
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

export default ProveedorList;
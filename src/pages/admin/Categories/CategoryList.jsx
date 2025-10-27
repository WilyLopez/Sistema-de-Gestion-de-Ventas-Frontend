// src/pages/admin/Categories/CategoryList.jsx
import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import CategoryTable from '@components/tables/CategoryTable';
import CategoryForm from '@components/forms/CategoryForm';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Alert from '@components/alerts/Alert';
import categoriaService from '@services/CategoriaService';
import { MESSAGES } from '@utils/constants';

/**
 * Página de Gestión de Categorías
 * Lista, crea, edita y elimina categorías en modales
 */
const CategoryList = () => {
    // Estados para modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Estados de datos
    const [selectedCategory, setSelectedCategory] = useState(null);
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

    const handleCreate = async (categoryData) => {
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            await categoriaService.create(categoryData);
            setSuccessMessage(MESSAGES.SUCCESS.CREATED);
            setShowCreateModal(false);
            setRefreshKey(prev => prev + 1);
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;
            
            if (error.response?.status === 400) {
                errorMsg = error.response.data.message || MESSAGES.ERROR.VALIDATION;
            } else if (error.response?.status === 409) {
                errorMsg = 'Ya existe una categoría con ese nombre';
            }
            
            setErrorMessage(errorMsg);
            console.error('Error al crear categoría:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLERS DE EDITAR =====
    const handleOpenEdit = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
        setErrorMessage('');
    };

    const handleEdit = async (categoryData) => {
        if (!selectedCategory) return;
        
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            await categoriaService.update(selectedCategory.idCategoria, categoryData);
            setSuccessMessage(MESSAGES.SUCCESS.UPDATED);
            setShowEditModal(false);
            setSelectedCategory(null);
            setRefreshKey(prev => prev + 1);
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;
            
            if (error.response?.status === 400) {
                errorMsg = error.response.data.message || MESSAGES.ERROR.VALIDATION;
            } else if (error.response?.status === 409) {
                errorMsg = 'Ya existe una categoría con ese nombre';
            }
            
            setErrorMessage(errorMsg);
            console.error('Error al actualizar categoría:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLERS DE ELIMINAR =====
    const handleOpenDelete = async (category) => {
        // Verificar si tiene productos asociados
        try {
            const hasProducts = await categoriaService.hasProducts(category.idCategoria);
            
            if (hasProducts) {
                setErrorMessage('No se puede eliminar esta categoría porque tiene productos asociados');
                return;
            }
            
            setSelectedCategory(category);
            setShowDeleteModal(true);
        } catch (error) {
            console.error('Error al verificar productos:', error);
            setErrorMessage('Error al verificar si la categoría tiene productos');
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        
        setIsDeleting(true);
        
        try {
            await categoriaService.delete(selectedCategory.idCategoria);
            setSuccessMessage(MESSAGES.SUCCESS.DELETED);
            setShowDeleteModal(false);
            setSelectedCategory(null);
            setRefreshKey(prev => prev + 1);
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;
            
            if (error.response?.status === 409) {
                errorMsg = 'No se puede eliminar esta categoría porque tiene productos asociados';
            }
            
            setErrorMessage(errorMsg);
            console.error('Error al eliminar categoría:', error);
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
        setSelectedCategory(null);
        setErrorMessage('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra las categorías de productos
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleOpenCreate}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Nueva Categoría
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

            {/* Tabla de categorías */}
            <CategoryTable
                refreshTrigger={refreshKey}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
            />

            {/* Modal de Crear */}
            <Modal
                isOpen={showCreateModal}
                onClose={handleCancelCreate}
                title="Nueva Categoría"
                size="md"
            >
                <CategoryForm
                    onSubmit={handleCreate}
                    onCancel={handleCancelCreate}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal de Editar */}
            <Modal
                isOpen={showEditModal}
                onClose={handleCancelEdit}
                title="Editar Categoría"
                size="md"
            >
                <CategoryForm
                    initialData={selectedCategory}
                    onSubmit={handleEdit}
                    onCancel={handleCancelEdit}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal de Eliminar */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => !isDeleting && setShowDeleteModal(false)}
                title="Eliminar Categoría"
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
                                Estás a punto de eliminar la categoría{' '}
                                <span className="font-semibold">{selectedCategory?.nombre}</span>.
                            </p>
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-dark-muted">
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

export default CategoryList;
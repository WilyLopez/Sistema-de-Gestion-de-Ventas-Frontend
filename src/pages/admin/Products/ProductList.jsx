// src/pages/admin/Products/ProductList.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProductTable from '@components/tables/ProductTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import productService from '@services/ProductoService';

/**
 * Página principal de gestión de productos
 * Lista todos los productos con opciones de CRUD
 */
const ProductList = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Manejar eliminación
    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDelete = async () => {
        if (!selectedProduct) return;

        setIsDeleting(true);
        try {
            await productService.delete(selectedProduct.idProducto);
            setShowDeleteModal(false);
            setSelectedProduct(null);
            // Refrescar tabla
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            // TODO: Mostrar toast de error
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Productos
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra el catálogo de productos
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/admin/productos/crear')}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Nuevo Producto
                </Button>
            </div>

            {/* Tabla de productos */}
            <ProductTable
                key={refreshKey}
                onDelete={handleDelete}
            />

            {/* Modal de confirmación de eliminación */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => !isDeleting && setShowDeleteModal(false)}
                title="Eliminar Producto"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-dark-text">
                        ¿Estás seguro de que deseas eliminar el producto{' '}
                        <span className="font-semibold">{selectedProduct?.nombre}</span>?
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Esta acción no se puede deshacer y puede afectar el inventario.
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

export default ProductList;
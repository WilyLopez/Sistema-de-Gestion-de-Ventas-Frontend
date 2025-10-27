// src/pages/admin/Products/ProductEdit.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@components/forms/ProductForm';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import productService from '@services/ProductoService';

/**
 * Página de Edición de Producto
 */
const ProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const data = await productService.getById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error al cargar producto:', error);
            // TODO: Mostrar toast de error y redirigir
            navigate('/admin/productos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (productData) => {
        setIsSubmitting(true);
        try {
            await productService.update(id, productData);
            // TODO: Mostrar toast de éxito
            navigate('/admin/productos');
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            // TODO: Mostrar toast de error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/productos');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando producto..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/productos')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="mb-4"
                >
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Editar Producto
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Modifica la información del producto
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <ProductForm
                    initialData={product}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default ProductEdit;
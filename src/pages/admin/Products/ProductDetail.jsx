import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    Package,
    DollarSign,
    Tag,
    Layers,
    Calendar,
    TrendingUp,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Spinner from '@components/ui/Spinner';
import productService from '@services/ProductoService';
import { formatCurrency, formatDate } from '@utils/formatters';
import { PRODUCT_GENDER } from '@utils/constants';

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [margin, setMargin] = useState(null);

    useEffect(() => {
        if (!id || id === "undefined" || id === "null" || id.trim() === "") {
            console.error('ID de producto no válido:', id);
            navigate('/admin/productos');
            return;
        }

        loadProduct();
    }, [id, navigate]);

    const loadProduct = async () => {
        setIsLoading(true);
        const productId = Number(id);
        if (isNaN(productId) || productId <= 0) {
            console.error('ID de producto no es un número válido:', id);
            navigate('/admin/productos');
            setIsLoading(false);
            return;
        }

        try {
            const data = await productService.getById(productId);
            setProduct(data);

            try {
                const marginData = await productService.getMargin(productId);
                setMargin(marginData);
            } catch (error) {
                console.log('No se pudo cargar el margen:', error);
            }
        } catch (error) {
            console.error('Error al cargar producto:', error);
            navigate('/admin/productos');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando producto..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mt-4">
                        Error al cargar el producto
                    </h2>
                    <p className="text-gray-600 dark:text-dark-muted mt-2">
                        El producto no existe o el ID es inválido.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/admin/productos')}
                        className="mt-4"
                    >
                        Volver a la lista de productos
                    </Button>
                </div>
            </div>
        );
    }

    const getStockStatus = () => {
        if (product.stockActual === 0) {
            return {
                label: 'Agotado',
                color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                icon: <AlertTriangle className="w-4 h-4" />
            };
        } else if (product.stockActual <= product.stockMinimo) {
            return {
                label: 'Stock Bajo',
                color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                icon: <AlertTriangle className="w-4 h-4" />
            };
        } else {
            return {
                label: 'Stock Normal',
                color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                icon: <CheckCircle className="w-4 h-4" />
            };
        }
    };

    const stockStatus = getStockStatus();

    return (
        <div className="space-y-6">
            {/* Resto del código JSX permanece igual */}
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
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                            Detalle de Producto
                        </h1>
                        <p className="text-gray-600 dark:text-dark-muted mt-1">
                            Información completa del producto
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/admin/productos/${id}/editar`)}
                        leftIcon={<Edit className="w-4 h-4" />}
                    >
                        Editar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <div className="flex gap-6 mb-6">
                            <div className="flex-shrink-0">
                                {product.imagenUrl ? (
                                    <img
                                        src={product.imagenUrl}
                                        alt={product.nombre}
                                        className="w-32 h-32 rounded-lg object-cover border border-gray-200 dark:border-dark-border"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-dark-hover flex items-center justify-center border border-gray-200 dark:border-dark-border">
                                        <Package className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
                                    {product.nombre}
                                </h2>
                                <p className="text-gray-600 dark:text-dark-muted mb-3">
                                    Código: <span className="font-mono font-medium">{product.codigo}</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="custom"
                                        className={product.estado
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }
                                    >
                                        {product.estado ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                    <Badge variant="custom" className={stockStatus.color}>
                                        <span className="flex items-center gap-1">
                                            {stockStatus.icon}
                                            {stockStatus.label}
                                        </span>
                                    </Badge>
                                    {product.genero && (
                                        <Badge variant="custom" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                            {product.genero}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {product.marca && (
                                <div className="flex items-start gap-3">
                                    <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Marca</p>
                                        <p className="text-gray-900 dark:text-dark-text font-medium">
                                            {product.marca}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {product.categoria && (
                                <div className="flex items-start gap-3">
                                    <Layers className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Categoría</p>
                                        <p className="text-gray-900 dark:text-dark-text font-medium">
                                            {product.categoria.nombre || product.categoria}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {product.talla && (
                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Talla</p>
                                        <p className="text-gray-900 dark:text-dark-text font-medium">
                                            {product.talla}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {product.color && (
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5 rounded border border-gray-300"
                                        style={{ backgroundColor: product.color.toLowerCase() }}
                                    />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Color</p>
                                        <p className="text-gray-900 dark:text-dark-text font-medium">
                                            {product.color}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {product.material && (
                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Material</p>
                                        <p className="text-gray-900 dark:text-dark-text font-medium">
                                            {product.material}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {product.descripcion && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-2">
                                    Descripción
                                </h3>
                                <p className="text-gray-700 dark:text-dark-text">
                                    {product.descripcion}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Estadísticas de Ventas
                        </h3>
                        <p className="text-gray-500 dark:text-dark-muted text-center py-8">
                            No hay datos de ventas disponibles
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Precios
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted mb-1">
                                    Precio de Compra
                                </p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                                    {formatCurrency(product.precioCompra)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted mb-1">
                                    Precio de Venta
                                </p>
                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {formatCurrency(product.precioVenta)}
                                </p>
                            </div>
                            {margin && (
                                <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Margen de Ganancia
                                        </p>
                                    </div>
                                    <p className="text-xl font-semibold text-green-600">
                                        {margin.porcentaje}% ({formatCurrency(margin.monto)})
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Inventario
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted mb-1">
                                    Stock Actual
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                    {product.stockActual} unidades
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted mb-1">
                                    Stock Mínimo
                                </p>
                                <p className="text-lg font-medium text-gray-700 dark:text-dark-text">
                                    {product.stockMinimo} unidades
                                </p>
                            </div>
                            {product.stockActual <= product.stockMinimo && product.stockActual > 0 && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Stock por debajo del mínimo
                                    </p>
                                </div>
                            )}
                            {product.stockActual === 0 && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-800 dark:text-red-400 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Producto agotado
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Información de Registro
                        </h3>
                        <div className="space-y-4">
                            {product.fechaCreacion && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Fecha de Registro
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {formatDate(product.fechaCreacion)}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {product.fechaModificacion && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Última Modificación
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {formatDate(product.fechaModificacion)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
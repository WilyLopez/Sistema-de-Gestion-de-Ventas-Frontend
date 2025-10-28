// src/pages/admin/Inventory/StockAlerts.jsx
import { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Package, RefreshCw, Search } from 'lucide-react';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Input from '@components/ui/Input';
import Spinner from '@components/ui/Spinner';
import productService from '@services/ProductoService';
import { formatNumber } from '@utils/formatters';

/**
 * Vista de Alertas de Stock
 * Muestra productos con stock bajo y agotados
 */
const StockAlerts = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('low'); // 'low' | 'out'

    useEffect(() => {
        loadStockAlerts();
    }, []);

    const loadStockAlerts = async () => {
        setIsLoading(true);
        try {
            const [lowStock, outOfStock] = await Promise.all([
                productService.getLowStock(),
                productService.getOutOfStock(),
            ]);

            setLowStockProducts(lowStock || []);
            setOutOfStockProducts(outOfStock || []);
        } catch (error) {
            console.error('Error al cargar alertas de stock:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar productos según búsqueda
    const filterProducts = (products) => {
        if (!searchTerm) return products;

        return products.filter(product =>
            product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredLowStock = filterProducts(lowStockProducts);
    const filteredOutOfStock = filterProducts(outOfStockProducts);

    // Renderizar card de producto
    const renderProductCard = (product, type) => {
        const isOutOfStock = type === 'out';

        return (
            <div
                key={product.idProducto}
                className={`
                    p-4 rounded-lg border-l-4 
                    ${isOutOfStock
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                    }
                `}
            >
                <div className="flex items-start gap-4">
                    {/* Imagen o ícono */}
                    <div className="flex-shrink-0">
                        {product.imagenUrl ? (
                            <img
                                src={product.imagenUrl}
                                alt={product.nombre}
                                className="w-16 h-16 rounded object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded bg-gray-200 dark:bg-dark-hover flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">
                                    {product.nombre}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">
                                    Código: <span className="font-mono">{product.codigo}</span>
                                </p>
                            </div>

                            {/* Badge de alerta */}
                            <Badge
                                variant="custom"
                                className={
                                    isOutOfStock
                                        ? 'bg-red-500 text-white'
                                        : 'bg-yellow-500 text-white'
                                }
                            >
                                {isOutOfStock ? (
                                    <span className="flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Agotado
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Stock Bajo
                                    </span>
                                )}
                            </Badge>
                        </div>

                        {/* Stock actual y mínimo */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-dark-muted">Stock Actual</p>
                                <p className={`font-semibold ${isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                    {formatNumber(product.stockActual)} unidades
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-dark-muted">Stock Mínimo</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {formatNumber(product.stockMinimo)} unidades
                                </p>
                            </div>
                        </div>

                        {/* Categoría */}
                        {product.categoria && (
                            <div className="mt-2">
                                <Badge variant="custom" className="bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-dark-text">
                                    {product.categoria.nombre || product.categoria}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando alertas de stock..." />
            </div>
        );
    }

    const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Alertas de Stock
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Productos con stock bajo o agotados que requieren atención
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={loadStockAlerts}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                    Actualizar
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Total Alertas</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-1">
                                {totalAlerts}
                            </p>
                        </div>
                        <AlertTriangle className="w-12 h-12 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Stock Bajo</p>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                {lowStockProducts.length}
                            </p>
                        </div>
                        <AlertTriangle className="w-12 h-12 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">Agotados</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                                {outOfStockProducts.length}
                            </p>
                        </div>
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 border border-gray-200 dark:border-dark-border">
                <Input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                    fullWidth
                />
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow border border-gray-200 dark:border-dark-border">
                <div className="border-b border-gray-200 dark:border-dark-border">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('low')}
                            className={`
                                flex-1 px-6 py-4 text-sm font-medium transition-colors
                                ${activeTab === 'low'
                                    ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600'
                                    : 'text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text'
                                }
                            `}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Stock Bajo ({filteredLowStock.length})
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('out')}
                            className={`
                                flex-1 px-6 py-4 text-sm font-medium transition-colors
                                ${activeTab === 'out'
                                    ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600'
                                    : 'text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text'
                                }
                            `}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Agotados ({filteredOutOfStock.length})
                            </span>
                        </button>
                    </div>
                </div>

                {/* Contenido del tab */}
                <div className="p-6">
                    {activeTab === 'low' && (
                        <div className="space-y-4">
                            {filteredLowStock.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-dark-muted">
                                        {searchTerm
                                            ? 'No se encontraron productos con stock bajo'
                                            : 'No hay productos con stock bajo'}
                                    </p>
                                </div>
                            ) : (
                                filteredLowStock.map(product => renderProductCard(product, 'low'))
                            )}
                        </div>
                    )}

                    {activeTab === 'out' && (
                        <div className="space-y-4">
                            {filteredOutOfStock.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-dark-muted">
                                        {searchTerm
                                            ? 'No se encontraron productos agotados'
                                            : 'No hay productos agotados'}
                                    </p>
                                </div>
                            ) : (
                                filteredOutOfStock.map(product => renderProductCard(product, 'out'))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockAlerts;
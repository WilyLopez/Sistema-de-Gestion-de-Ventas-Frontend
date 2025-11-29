// src/pages/seller/Products/ProductSearch.jsx
import { useState, useEffect, useMemo } from 'react';
import { Search, Package, DollarSign, Filter, X, Sparkles } from 'lucide-react';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';
import Spinner from '@components/ui/Spinner';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Select from '@components/ui/Select';
import { useDebounce } from '@hooks/useDebounce';
import productService from '@services/ProductoService';
import categoriaService from '@services/CategoriaService';
import { formatCurrency } from '@utils/formatters';

// Componente Skeleton para loading
const ProductSkeleton = () => (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
        </div>
    </div>
);

// Componente Empty State
const EmptyState = ({ hasFilters, onClearFilters }) => (
    <div className="text-center py-16 px-4">
        <div className="relative inline-block">
            <Package className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
            <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-primary-500 animate-pulse" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-dark-text">
            {hasFilters ? 'No hay productos con estos filtros' : 'No se encontraron productos'}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted max-w-md mx-auto">
            {hasFilters
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'Comienza a buscar productos por nombre, código o usa los filtros disponibles'
            }
        </p>
        {hasFilters && (
            <Button
                onClick={onClearFilters}
                variant="outline"
                className="mt-6"
                leftIcon={<X className="w-4 h-4" />}
            >
                Limpiar todos los filtros
            </Button>
        )}
    </div>
);

const ProductSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        idCategoria: '',
        precioMin: '',
        precioMax: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 12,
        totalPages: 0,
        totalElements: 0
    });
    const [error, setError] = useState(null);

    // Debounce para búsqueda en tiempo real
    const debouncedSearchQuery = useDebounce(searchQuery, 400);
    const debouncedPrecioMin = useDebounce(filters.precioMin, 600);
    const debouncedPrecioMax = useDebounce(filters.precioMax, 600);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const activeCategories = await categoriaService.getActive();
                setCategories(activeCategories.map(cat => ({
                    value: cat.idCategoria,
                    label: cat.nombre
                })));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Búsqueda automática en tiempo real
    const performSearch = async (page = 0) => {
        // Solo mostrar loading skeleton en carga inicial
        if (page === 0 && isInitialLoad) {
            setIsLoading(true);
        }

        setError(null);

        const searchFilters = {
            texto: debouncedSearchQuery,
            idCategoria: filters.idCategoria,
            precioMin: debouncedPrecioMin,
            precioMax: debouncedPrecioMax
        };

        try {
            const response = await productService.search(searchFilters, page, pagination.size);
            setProducts(response.content);
            setPagination(prev => ({
                ...prev,
                page: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
            }));
        } catch (err) {
            console.error('Error searching products:', err);
            setError('No se pudieron cargar los productos. Intente de nuevo más tarde.');
            setProducts([]);
        } finally {
            setIsLoading(false);
            setIsInitialLoad(false);
        }
    };

    // Auto-búsqueda cuando cambian los filtros
    useEffect(() => {
        performSearch(0);
    }, [debouncedSearchQuery, filters.idCategoria, debouncedPrecioMin, debouncedPrecioMax]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setFilters({
            idCategoria: '',
            precioMin: '',
            precioMax: '',
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            performSearch(newPage);
        }
    };

    const getStockColor = (stock) => {
        if (stock === 0) return 'danger';
        if (stock <= 10) return 'warning';
        return 'success';
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchQuery || filters.idCategoria || filters.precioMin || filters.precioMax;
    }, [searchQuery, filters]);

    // Contador de filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (filters.idCategoria) count++;
        if (filters.precioMin) count++;
        if (filters.precioMax) count++;
        return count;
    }, [searchQuery, filters]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-8 rounded-xl shadow-sm border border-primary-200 dark:border-primary-800">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                            Catálogo de Productos
                        </h1>
                        <p className="text-gray-600 dark:text-dark-muted mt-2">
                            {pagination.totalElements > 0
                                ? `${pagination.totalElements} producto${pagination.totalElements !== 1 ? 's' : ''} disponible${pagination.totalElements !== 1 ? 's' : ''}`
                                : 'Explora nuestro catálogo completo'
                            }
                        </p>
                    </div>
                    {activeFiltersCount > 0 && (
                        <Badge variant="primary" className="text-sm">
                            {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Search and Filters Card */}
            <Card className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Input
                        placeholder="Buscar por nombre, código o descripción..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-5 h-5 text-gray-400" />}
                        rightIcon={searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        className="text-base"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-dark-muted pointer-events-none">
                        {debouncedSearchQuery !== searchQuery && searchQuery && '⏳'}
                    </span>
                </div>

                {/* Filters Toggle */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filtros avanzados</span>
                        <Badge variant={showFilters ? "primary" : "secondary"} size="sm">
                            {showFilters ? 'Ocultar' : 'Mostrar'}
                        </Badge>
                    </button>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            leftIcon={<X className="w-4 h-4" />}
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Limpiar todo
                        </Button>
                    )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-dark-border animate-in fade-in slide-in-from-top-2 duration-300">
                        <Select
                            label="Categoría"
                            placeholder="Todas las categorías"
                            value={filters.idCategoria}
                            onChange={(value) => handleFilterChange('idCategoria', value)}
                            options={[
                                { value: '', label: 'Todas las categorías' },
                                ...categories
                            ]}
                        />
                        <Input
                            label="Precio Mínimo"
                            type="number"
                            placeholder="S/ 0.00"
                            value={filters.precioMin}
                            onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                            leftIcon={<DollarSign className="w-4 h-4 text-gray-400" />}
                        />
                        <Input
                            label="Precio Máximo"
                            type="number"
                            placeholder="S/ 1000.00"
                            value={filters.precioMax}
                            onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                            leftIcon={<DollarSign className="w-4 h-4 text-gray-400" />}
                        />
                    </div>
                )}
            </Card>

            {/* Results */}
            <div className="min-h-[500px]">
                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                        <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                            {products.map(product => (
                                <Card
                                    key={product.idProducto}
                                    className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.imagenUrl || 'https://via.placeholder.com/300'}
                                            alt={product.nombre}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <Badge
                                            variant={getStockColor(product.stock)}
                                            className="absolute top-3 right-3 shadow-md"
                                        >
                                            Stock: {product.stock}
                                        </Badge>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-dark-text line-clamp-2 flex-grow">
                                            {product.nombre}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-dark-muted mt-2 font-mono">
                                            {product.codigo}
                                        </p>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                                {formatCurrency(product.precioVenta)}
                                            </span>
                                            <Badge variant="secondary" size="sm">
                                                {product.nombreCategoria}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 p-4 bg-gray-50 dark:bg-dark-card rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-dark-muted">
                                    Mostrando {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} de {pagination.totalElements} productos
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 0}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i;
                                            } else if (pagination.page < 3) {
                                                pageNum = i;
                                            } else if (pagination.page > pagination.totalPages - 4) {
                                                pageNum = pagination.totalPages - 5 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${pageNum === pagination.page
                                                            ? 'bg-primary-600 text-white shadow-md'
                                                            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border'
                                                        }`}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page + 1 >= pagination.totalPages}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        hasFilters={hasActiveFilters}
                        onClearFilters={clearAllFilters}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductSearch;
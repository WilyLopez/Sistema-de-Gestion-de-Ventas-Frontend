// src/components/fragments/seller/ProductSearch.jsx
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Input from '@components/ui/Input';
import Spinner from '@components/ui/Spinner';
import ProductoService from '@services/ProductoService';
import { useDebounce } from '@hooks/useDebounce';
import { formatCurrency } from '@utils/formatters';
import { useSaleContext } from '@context/SaleContext';

const ProductSearch = () => {
    const { addToCart } = useSaleContext();
    const searchInputRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Búsqueda de productos
    useEffect(() => {
        if (debouncedSearch.trim().length >= 2) {
            searchProducts(debouncedSearch);
        } else {
            setProducts([]);
            setShowResults(false);
        }
    }, [debouncedSearch]);

    // Auto-focus
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.product-search-container')) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchProducts = async (query) => {
        try {
            setIsSearching(true);
            const response = await ProductoService.search({ nombre: query }, 0, 10);
            setProducts(response.content || []);
            setShowResults(true);
        } catch (error) {
            console.error('Error buscando productos:', error);
            setProducts([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectProduct = (product) => {
        try {
            addToCart(product);
            setSearchQuery('');
            setShowResults(false);
            searchInputRef.current?.focus();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="product-search-container relative">
            <Input
                ref={searchInputRef}
                placeholder="Buscar producto por nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                autoComplete="off"
            />

            {showResults && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-4 text-center">
                            <Spinner size="sm" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-dark-muted">
                            No se encontraron productos
                        </div>
                    ) : (
                        products.map((product) => (
                            <button
                                key={product.idProducto}
                                onClick={() => handleSelectProduct(product)}
                                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-dark-border last:border-0 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {product.nombre}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Código: {product.codigo} • Stock: {product.stock}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-primary-600 dark:text-primary-400 ml-4">
                                        {formatCurrency(product.precioVenta)}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
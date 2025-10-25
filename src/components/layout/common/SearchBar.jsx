import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@hooks/useDebounce';
import productService from '@services/productService';
import userService from '@services/userService';
import saleService from '@services/saleService';
import { useAuth } from '@hooks/useAuth';
import { usePermissions } from '@hooks/usePermissions';

/**
 * Componente SearchBar
 * Búsqueda global con resultados agrupados por tipo
 */
const SearchBar = ({ className = '' }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 500);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { can } = usePermissions();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchGlobal = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const allResults = [];

                const productResults = await productService.search(debouncedQuery, 0, 5);
                if (productResults.content?.length > 0) {
                    allResults.push({
                        type: 'Productos',
                        icon: '📦',
                        items: productResults.content.map((p) => ({
                            id: p.idProducto,
                            title: p.nombre,
                            subtitle: `${p.codigo} - ${p.marca || 'Sin marca'}`,
                            route: `/productos/${p.idProducto}`,
                        })),
                    });
                }

                if (can('sales.view')) {
                    try {
                        const sale = await saleService.getByCode(debouncedQuery);
                        allResults.push({
                            type: 'Ventas',
                            icon: '💵',
                            items: [
                                {
                                    id: sale.idVenta,
                                    title: sale.codigoVenta,
                                    subtitle: `Cliente: ${sale.cliente?.nombre || 'N/A'}`,
                                    route: `/ventas/${sale.idVenta}`,
                                },
                            ],
                        });
                    } catch (error) {
                        
                    }
                }

                if (can('users.view')) {
                    const userResults = await userService.searchByName(debouncedQuery, 0, 5);
                    if (userResults.content?.length > 0) {
                        allResults.push({
                            type: 'Usuarios',
                            icon: '👤',
                            items: userResults.content.map((u) => ({
                                id: u.idUsuario,
                                title: `${u.nombre} ${u.apellido}`,
                                subtitle: u.username,
                                route: `/admin/usuarios/${u.idUsuario}`,
                            })),
                        });
                    }
                }

                setResults(allResults);
                setIsOpen(true);
            } catch (error) {
                console.error('Error en búsqueda global:', error);
            } finally {
                setLoading(false);
            }
        };

        searchGlobal();
    }, [debouncedQuery, can]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const handleResultClick = (route) => {
        navigate(route);
        handleClear();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-muted" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar productos, ventas, usuarios..."
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isOpen && (query.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card rounded-lg shadow-2xl border border-gray-200 dark:border-dark-border max-h-96 overflow-y-auto custom-scrollbar z-50">
                    {loading && (
                        <div className="p-4 text-center text-gray-500 dark:text-dark-muted">
                            Buscando...
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="p-4 text-center text-gray-500 dark:text-dark-muted">
                            No se encontraron resultados
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="py-2">
                            {results.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase">
                                        {group.icon} {group.type}
                                    </div>
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleResultClick(item.route)}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                                        >
                                            <div className="font-medium text-gray-900 dark:text-dark-text">
                                                {item.title}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-dark-muted">
                                                {item.subtitle}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
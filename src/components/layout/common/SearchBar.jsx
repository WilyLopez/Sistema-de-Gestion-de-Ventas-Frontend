import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, User, ShoppingCart, Users } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useDebounce } from '@hooks/useDebounce';
import productService from '@services/ProductoService';
import userService from '@services/UsuarioService';
import saleService from '@services/VentaService';
import clientService from '@services/ClienteService';

/**
 * Configuración de búsqueda por rol
 */
const SEARCH_CONFIG = {
    ADMINISTRADOR: {
        modules: ['productos', 'usuarios', 'ventas', 'clientes'],
        placeholder: 'Buscar productos, usuarios, ventas, clientes...',
    },
    VENDEDOR: {
        modules: ['productos', 'clientes', 'ventas'],
        placeholder: 'Buscar productos, clientes, ventas...',
    },
    EMPLEADO: {
        modules: ['productos'],
        placeholder: 'Buscar productos...',
    },
};

/**
 * Iconos por tipo de resultado
 */
const RESULT_ICONS = {
    producto: Package,
    usuario: User,
    venta: ShoppingCart,
    cliente: Users,
};

/**
 * Componente SearchBar con búsqueda global inteligente
 */
const SearchBar = ({ className = '' }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    
    const debouncedQuery = useDebounce(query, 300);

    // Configuración según rol
    const config = SEARCH_CONFIG[user?.rol] || SEARCH_CONFIG.EMPLEADO;

    // Buscar cuando cambia el query debounced
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const searchResults = [];

                // Buscar productos
                if (config.modules.includes('productos')) {
                    const productos = await productService.search(debouncedQuery);
                    searchResults.push(
                        ...productos.slice(0, 3).map(p => ({
                            type: 'producto',
                            id: p.id,
                            title: p.nombre,
                            subtitle: `Código: ${p.codigo} | Stock: ${p.stockActual}`,
                            path: user?.rol === 'ADMINISTRADOR' 
                                ? `/admin/productos/${p.id}` 
                                : `/vendedor/productos/${p.id}`,
                        }))
                    );
                }

                // Buscar clientes (Admin y Vendedor)
                if (config.modules.includes('clientes')) {
                    const clientes = await clientService.search(debouncedQuery);
                    searchResults.push(
                        ...clientes.slice(0, 3).map(c => ({
                            type: 'cliente',
                            id: c.id,
                            title: `${c.nombre} ${c.apellido}`,
                            subtitle: `${c.tipoDocumento}: ${c.numeroDocumento}`,
                            path: user?.rol === 'ADMINISTRADOR'
                                ? `/admin/clientes/${c.id}`
                                : `/vendedor/clientes/${c.id}`,
                        }))
                    );
                }

                // Buscar usuarios (solo Admin)
                if (config.modules.includes('usuarios')) {
                    const usuarios = await userService.search(debouncedQuery);
                    searchResults.push(
                        ...usuarios.slice(0, 2).map(u => ({
                            type: 'usuario',
                            id: u.id,
                            title: u.nombre,
                            subtitle: `${u.username} - ${u.rol}`,
                            path: `/admin/usuarios/${u.id}`,
                        }))
                    );
                }

                // Buscar ventas
                if (config.modules.includes('ventas')) {
                    const ventas = await saleService.search(debouncedQuery);
                    searchResults.push(
                        ...ventas.slice(0, 2).map(v => ({
                            type: 'venta',
                            id: v.id,
                            title: `Venta ${v.codigo}`,
                            subtitle: `Cliente: ${v.cliente?.nombre} | Total: S/ ${v.total.toFixed(2)}`,
                            path: user?.rol === 'ADMINISTRADOR'
                                ? `/admin/ventas/${v.id}`
                                : `/vendedor/mis-ventas/${v.id}`,
                        }))
                    );
                }

                setResults(searchResults.slice(0, 10));
            } catch (error) {
                console.error('Error en búsqueda:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery, config.modules, user?.rol]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Navegación con teclado
    const handleKeyDown = (e) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelectResult(results[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSelectResult = (result) => {
        navigate(result.path);
        setQuery('');
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        inputRef.current?.focus();
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            {/* Input de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-muted" />
                
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedIndex(0);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={config.placeholder}
                    className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-dark-hover rounded transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-400 dark:text-dark-muted" />
                    </button>
                )}
            </div>

            {/* Resultados */}
            {isOpen && (query.length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 animate-fade-in">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-dark-muted">
                            Buscando...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-dark-muted">
                            No se encontraron resultados para "{query}"
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((result, index) => {
                                const IconComponent = RESULT_ICONS[result.type];
                                return (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelectResult(result)}
                                        className={`
                                            w-full flex items-start gap-3 px-4 py-3 text-left transition-colors
                                            ${index === selectedIndex
                                                ? 'bg-primary-50 dark:bg-primary-900/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-dark-hover'
                                            }
                                        `}
                                    >
                                        <IconComponent className={`
                                            w-5 h-5 mt-0.5 flex-shrink-0
                                            ${index === selectedIndex
                                                ? 'text-primary-600 dark:text-primary-400'
                                                : 'text-gray-400 dark:text-dark-muted'
                                            }
                                        `} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`
                                                text-sm font-medium truncate
                                                ${index === selectedIndex
                                                    ? 'text-primary-600 dark:text-primary-400'
                                                    : 'text-gray-900 dark:text-dark-text'
                                                }
                                            `}>
                                                {result.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-dark-muted truncate">
                                                {result.subtitle}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer con ayuda */}
                    {results.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card/50 text-xs text-gray-500 dark:text-dark-muted flex items-center justify-between">
                            <span>Usa ↑↓ para navegar</span>
                            <span>Enter para seleccionar</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
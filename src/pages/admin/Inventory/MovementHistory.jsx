// src/pages/admin/Inventory/MovementHistory.jsx
import { useState, useEffect } from 'react';
import { History, Filter, Download, Calendar } from 'lucide-react';
import InventoryTable from '@components/tables/InventoryTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Alert from '@components/alerts/Alert';
import productService from '@services/ProductoService';

/**
 * Historial de Movimientos de Inventario
 * Visualiza movimientos con filtros avanzados
 */
const MovementHistory = () => {
    // Estados para filtros
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [tempFilters, setTempFilters] = useState({
        idProducto: '',
        tipoMovimiento: '',
        fechaInicio: '',
        fechaFin: '',
    });

    // Estados de datos
    const [refreshKey, setRefreshKey] = useState(0);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    
    // Estados de mensajes
    const [successMessage, setSuccessMessage] = useState('');

    // Cargar productos para el filtro
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await productService.getAll(0, 100);
            setProducts(response.content || []);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    // ===== HANDLERS DE FILTROS =====
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplyFilters = () => {
        // Limpiar filtros vacíos
        const cleanFilters = Object.entries(tempFilters).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        setFilters(cleanFilters);
        setShowFilterModal(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleClearFilters = () => {
        setTempFilters({
            idProducto: '',
            tipoMovimiento: '',
            fechaInicio: '',
            fechaFin: '',
        });
        setFilters({});
        setShowFilterModal(false);
        setRefreshKey(prev => prev + 1);
    };

    // Handler para exportar
    const handleExport = () => {
        // TODO: Implementar exportación a Excel
        setSuccessMessage('Exportación iniciada...');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Contar filtros activos
    const activeFiltersCount = Object.keys(filters).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text flex items-center gap-3">
                        <History className="w-8 h-8" />
                        Historial de Movimientos
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Consulta el historial completo de movimientos de inventario
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowFilterModal(true)}
                        leftIcon={<Filter className="w-4 h-4" />}
                    >
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                    <Button
                        variant="success"
                        size="md"
                        onClick={handleExport}
                        leftIcon={<Download className="w-4 h-4" />}
                    >
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Mensajes */}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {/* Filtros activos */}
            {activeFiltersCount > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                            Filtros activos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {filters.idProducto && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                                    Producto seleccionado
                                </span>
                            )}
                            {filters.tipoMovimiento && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                                    Tipo: {filters.tipoMovimiento}
                                </span>
                            )}
                            {filters.fechaInicio && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                                    Desde: {new Date(filters.fechaInicio).toLocaleDateString('es-PE')}
                                </span>
                            )}
                            {filters.fechaFin && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                                    Hasta: {new Date(filters.fechaFin).toLocaleDateString('es-PE')}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="ml-auto"
                        >
                            Limpiar todos
                        </Button>
                    </div>
                </div>
            )}

            {/* Tabla de movimientos */}
            <InventoryTable
                refreshTrigger={refreshKey}
                filters={filters}
            />

            {/* Modal de Filtros */}
            <Modal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Filtros de Búsqueda"
                size="md"
            >
                <div className="space-y-6">
                    {/* Producto */}
                    <Select
                        label="Producto"
                        name="idProducto"
                        value={tempFilters.idProducto}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: isLoadingProducts ? 'Cargando...' : 'Todos los productos' },
                            ...products.map(p => ({
                                value: p.idProducto,
                                label: `${p.nombre} (${p.codigo})`,
                            })),
                        ]}
                        disabled={isLoadingProducts}
                        fullWidth
                    />

                    {/* Tipo de Movimiento */}
                    <Select
                        label="Tipo de Movimiento"
                        name="tipoMovimiento"
                        value={tempFilters.tipoMovimiento}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'Todos los tipos' },
                            { value: 'ENTRADA', label: 'Entrada' },
                            { value: 'SALIDA', label: 'Salida' },
                            { value: 'AJUSTE', label: 'Ajuste' },
                            { value: 'DEVOLUCION', label: 'Devolución' },
                        ]}
                        fullWidth
                    />

                    {/* Rango de Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Fecha Inicio"
                            type="date"
                            name="fechaInicio"
                            value={tempFilters.fechaInicio}
                            onChange={handleFilterChange}
                            leftIcon={<Calendar className="w-4 h-4" />}
                            fullWidth
                        />
                        <Input
                            label="Fecha Fin"
                            type="date"
                            name="fechaFin"
                            value={tempFilters.fechaFin}
                            onChange={handleFilterChange}
                            leftIcon={<Calendar className="w-4 h-4" />}
                            fullWidth
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                        <Button
                            variant="secondary"
                            onClick={handleClearFilters}
                            className="flex-1"
                        >
                            Limpiar Filtros
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleApplyFilters}
                            className="flex-1"
                        >
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MovementHistory;
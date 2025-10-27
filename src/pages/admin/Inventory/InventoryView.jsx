// src/pages/admin/Inventory/InventoryView.jsx
import { useState } from 'react';
import { Plus, Filter, Download, RefreshCw } from 'lucide-react';
import InventoryTable from '@components/tables/InventoryTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Alert from '@components/alerts/Alert';
import productService from '@services/ProductoService';
import inventarioService from '@services/InventarioService';
import { MESSAGES } from '@utils/constants';

/**
 * Vista principal de Inventario
 * Muestra todos los movimientos con filtros
 */
const InventoryView = () => {
    // Estados para modales
    const [showEntradaModal, setShowEntradaModal] = useState(false);
    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    
    // Estados de datos
    const [refreshKey, setRefreshKey] = useState(0);
    const [filters, setFilters] = useState({});
    const [products, setProducts] = useState([]);
    
    // Estados de formularios
    const [entradaForm, setEntradaForm] = useState({
        idProducto: '',
        cantidad: '',
        observacion: '',
    });
    const [ajusteForm, setAjusteForm] = useState({
        idProducto: '',
        nuevoStock: '',
        observacion: '',
    });
    
    // Estados de carga
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    
    // Estados de mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ===== CARGAR PRODUCTOS =====
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

    // ===== HANDLERS DE ENTRADA =====
    const handleOpenEntrada = async () => {
        await loadProducts();
        setShowEntradaModal(true);
        setErrorMessage('');
    };

    const handleEntradaChange = (e) => {
        const { name, value } = e.target;
        setEntradaForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEntradaSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const entradaData = {
                idProducto: parseInt(entradaForm.idProducto),
                cantidad: parseInt(entradaForm.cantidad),
                observacion: entradaForm.observacion.trim(),
            };

            // Validar
            const validation = inventarioService.validateEntrada(entradaData);
            if (!validation.valido) {
                setErrorMessage(validation.errores.join(', '));
                setIsSubmitting(false);
                return;
            }

            await inventarioService.registerEntrada(entradaData);
            setSuccessMessage('Entrada registrada exitosamente');
            setShowEntradaModal(false);
            setEntradaForm({ idProducto: '', cantidad: '', observacion: '' });
            setRefreshKey(prev => prev + 1);
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
            console.error('Error al registrar entrada:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLERS DE AJUSTE =====
    const handleOpenAjuste = async () => {
        await loadProducts();
        setShowAjusteModal(true);
        setErrorMessage('');
    };

    const handleAjusteChange = (e) => {
        const { name, value } = e.target;
        setAjusteForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAjusteSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const ajusteData = {
                idProducto: parseInt(ajusteForm.idProducto),
                nuevoStock: parseInt(ajusteForm.nuevoStock),
                observacion: ajusteForm.observacion.trim(),
            };

            // Validar
            const validation = inventarioService.validateAjuste(ajusteData);
            if (!validation.valido) {
                setErrorMessage(validation.errores.join(', '));
                setIsSubmitting(false);
                return;
            }

            await inventarioService.registerAjuste(ajusteData);
            setSuccessMessage('Ajuste registrado exitosamente');
            setShowAjusteModal(false);
            setAjusteForm({ idProducto: '', nuevoStock: '', observacion: '' });
            setRefreshKey(prev => prev + 1);
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
            console.error('Error al registrar ajuste:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLERS DE FILTROS =====
    const handleApplyFilters = () => {
        setShowFilterModal(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleClearFilters = () => {
        setFilters({});
        setShowFilterModal(false);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Inventario
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Registra y visualiza movimientos de inventario
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
                    </Button>
                    <Button
                        variant="success"
                        size="md"
                        onClick={handleOpenEntrada}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Entrada
                    </Button>
                    <Button
                        variant="warning"
                        size="md"
                        onClick={handleOpenAjuste}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Ajuste
                    </Button>
                </div>
            </div>

            {/* Mensajes */}
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

            {/* Filtros activos */}
            {Object.keys(filters).length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            Filtros activos: {Object.keys(filters).length}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <InventoryTable
                refreshTrigger={refreshKey}
                filters={filters}
            />

            {/* Modal de Entrada */}
            <Modal
                isOpen={showEntradaModal}
                onClose={() => setShowEntradaModal(false)}
                title="Registrar Entrada de Inventario"
                size="md"
            >
                <form onSubmit={handleEntradaSubmit} className="space-y-4">
                    <Select
                        label="Producto"
                        name="idProducto"
                        value={entradaForm.idProducto}
                        onChange={handleEntradaChange}
                        options={[
                            { value: '', label: isLoadingProducts ? 'Cargando...' : 'Seleccionar producto' },
                            ...products.map(p => ({
                                value: p.idProducto,
                                label: `${p.nombre} (Stock: ${p.stockActual})`,
                            })),
                        ]}
                        required
                        disabled={isSubmitting || isLoadingProducts}
                        fullWidth
                    />

                    <Input
                        label="Cantidad"
                        type="number"
                        name="cantidad"
                        placeholder="0"
                        value={entradaForm.cantidad}
                        onChange={handleEntradaChange}
                        required
                        disabled={isSubmitting}
                        fullWidth
                        min="1"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                            Observación
                        </label>
                        <textarea
                            name="observacion"
                            placeholder="Motivo de la entrada (opcional)"
                            value={entradaForm.observacion}
                            onChange={handleEntradaChange}
                            disabled={isSubmitting}
                            rows={3}
                            className="block w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowEntradaModal(false)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar Entrada'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Ajuste */}
            <Modal
                isOpen={showAjusteModal}
                onClose={() => setShowAjusteModal(false)}
                title="Ajuste de Inventario"
                size="md"
            >
                <form onSubmit={handleAjusteSubmit} className="space-y-4">
                    <Select
                        label="Producto"
                        name="idProducto"
                        value={ajusteForm.idProducto}
                        onChange={handleAjusteChange}
                        options={[
                            { value: '', label: isLoadingProducts ? 'Cargando...' : 'Seleccionar producto' },
                            ...products.map(p => ({
                                value: p.idProducto,
                                label: `${p.nombre} (Stock actual: ${p.stockActual})`,
                            })),
                        ]}
                        required
                        disabled={isSubmitting || isLoadingProducts}
                        fullWidth
                    />

                    <Input
                        label="Nuevo Stock"
                        type="number"
                        name="nuevoStock"
                        placeholder="0"
                        value={ajusteForm.nuevoStock}
                        onChange={handleAjusteChange}
                        required
                        disabled={isSubmitting}
                        fullWidth
                        min="0"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                            Observación <span className="text-danger">*</span>
                        </label>
                        <textarea
                            name="observacion"
                            placeholder="Motivo del ajuste (mínimo 10 caracteres)"
                            value={ajusteForm.observacion}
                            onChange={handleAjusteChange}
                            disabled={isSubmitting}
                            rows={3}
                            required
                            minLength={10}
                            maxLength={500}
                            className="block w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                            Explica el motivo del ajuste (inventario físico, corrección de error, etc.)
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowAjusteModal(false)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="warning"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar Ajuste'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InventoryView;
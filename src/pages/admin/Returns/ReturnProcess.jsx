// src/pages/admin/Returns/ReturnProcess.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Trash2, AlertTriangle } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Alert from '@components/alerts/Alert';
import Spinner from '@components/ui/Spinner';
import ventaService from '@services/VentaService';
import devolucionService from '@services/DevolucionService';
import { formatCurrency, formatDateTime } from '@utils/formatters';
import { MESSAGES, DEADLINES } from '@utils/constants';
import { useAuth } from '@hooks/useAuth';

/**
 * Página de Procesamiento de Devolución
 * Permite crear una nueva devolución a partir de una venta
 */
const ReturnProcess = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Estados de búsqueda
    const [saleCode, setSaleCode] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // Estados de datos
    const [sale, setSale] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    
    // Estados de formulario
    const [returnReason, setReturnReason] = useState('');
    
    // Estados de carga
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estados de mensajes
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');

    // Buscar venta por código
    const handleSearchSale = async () => {
        if (!saleCode.trim()) {
            setErrorMessage('Ingresa un código de venta');
            return;
        }

        setIsSearching(true);
        setErrorMessage('');
        setWarningMessage('');
        setSale(null);
        setSelectedProducts([]);

        try {
            const saleData = await ventaService.getByCodigo(saleCode.trim());
            
            // Verificar si la venta está anulada
            if (saleData.estado === 'ANULADO') {
                setErrorMessage('Esta venta está anulada y no se pueden procesar devoluciones');
                return;
            }

            // Verificar plazo de devolución
            try {
                const plazoInfo = await devolucionService.verifyPlazo(saleData.idVenta);
                
                if (!plazoInfo.dentroDePlazo) {
                    setWarningMessage(
                        `Esta venta tiene más de ${DEADLINES.RETURN_DAYS} días. ` +
                        `La devolución puede requerir aprobación especial.`
                    );
                }
            } catch (error) {
                console.warn('No se pudo verificar el plazo:', error);
            }

            // Verificar si ya tiene devoluciones
            try {
                const existingReturns = await devolucionService.getByVenta(saleData.idVenta);
                if (existingReturns && existingReturns.length > 0) {
                    setWarningMessage('Esta venta ya tiene devoluciones registradas');
                }
            } catch (error) {
                console.warn('No se pudo verificar devoluciones existentes:', error);
            }

            setSale(saleData);
        } catch (error) {
            if (error.response?.status === 404) {
                setErrorMessage('No se encontró ninguna venta con ese código');
            } else {
                setErrorMessage(error.response?.data?.message || 'Error al buscar la venta');
            }
            console.error('Error al buscar venta:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Manejar selección de productos
    const handleProductSelect = (detalle) => {
        const existingIndex = selectedProducts.findIndex(
            p => p.idDetalleVenta === detalle.idDetalleVenta
        );

        if (existingIndex >= 0) {
            // Ya está seleccionado, removerlo
            setSelectedProducts(prev => prev.filter((_, i) => i !== existingIndex));
        } else {
            // Agregarlo con cantidad 1 por defecto
            setSelectedProducts(prev => [
                ...prev,
                {
                    idDetalleVenta: detalle.idDetalleVenta,
                    idProducto: detalle.producto.idProducto,
                    cantidad: 1,
                    maxCantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario,
                    producto: detalle.producto,
                }
            ]);
        }
    };

    // Manejar cambio de cantidad
    const handleQuantityChange = (idDetalleVenta, newQuantity) => {
        const quantity = parseInt(newQuantity);
        
        setSelectedProducts(prev => prev.map(p => {
            if (p.idDetalleVenta === idDetalleVenta) {
                // Validar que no exceda la cantidad máxima
                const validQuantity = Math.min(Math.max(1, quantity), p.maxCantidad);
                return { ...p, cantidad: validQuantity };
            }
            return p;
        }));
    };

    // Calcular totales
    const calculateTotal = () => {
        return selectedProducts.reduce((sum, p) => {
            return sum + (p.cantidad * p.precioUnitario);
        }, 0);
    };

    // Validar formulario
    const validateForm = () => {
        if (selectedProducts.length === 0) {
            setErrorMessage('Debes seleccionar al menos un producto para devolver');
            return false;
        }

        if (!returnReason.trim()) {
            setErrorMessage('Debes proporcionar un motivo para la devolución');
            return false;
        }

        if (returnReason.trim().length < 10) {
            setErrorMessage('El motivo debe tener al menos 10 caracteres');
            return false;
        }

        return true;
    };

    // Procesar devolución
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const devolucionData = {
                idVenta: sale.idVenta,
                motivo: returnReason.trim(),
                detalles: selectedProducts.map(p => ({
                    idDetalleVenta: p.idDetalleVenta,
                    cantidad: p.cantidad,
                })),
            };

            await devolucionService.create(devolucionData);
            navigate('/admin/devoluciones', {
                state: { message: 'Devolución registrada exitosamente' }
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
            console.error('Error al crear devolución:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/devoluciones')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="mb-4"
                >
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Procesar Devolución
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Registra una nueva devolución de productos
                </p>
            </div>

            {/* Mensajes */}
            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {warningMessage && (
                <Alert variant="warning" onClose={() => setWarningMessage('')}>
                    {warningMessage}
                </Alert>
            )}

            {/* Búsqueda de venta */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                    Buscar Venta
                </h3>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        placeholder="Ingresa el código de venta (Ej: V-20251027-00001)"
                        value={saleCode}
                        onChange={(e) => setSaleCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSale()}
                        disabled={isSearching}
                        leftIcon={<Search className="w-5 h-5" />}
                        className="flex-1"
                    />
                    <Button
                        variant="primary"
                        onClick={handleSearchSale}
                        loading={isSearching}
                        disabled={isSearching}
                        leftIcon={<Search className="w-4 h-4" />}
                    >
                        Buscar
                    </Button>
                </div>
            </div>

            {/* Información de la venta */}
            {sale && (
                <>
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Información de la Venta
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Código</p>
                                <p className="font-mono font-medium text-gray-900 dark:text-dark-text">
                                    {sale.codigo}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Fecha</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {formatDateTime(sale.fecha)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Cliente</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {sale.cliente?.nombre} {sale.cliente?.apellido}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Total</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
                                    {formatCurrency(sale.total)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Selección de productos */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Selecciona los Productos a Devolver
                        </h3>
                        
                        <div className="space-y-3">
                            {sale.detalles?.map((detalle) => {
                                const isSelected = selectedProducts.some(
                                    p => p.idDetalleVenta === detalle.idDetalleVenta
                                );
                                const selectedProduct = selectedProducts.find(
                                    p => p.idDetalleVenta === detalle.idDetalleVenta
                                );

                                return (
                                    <div
                                        key={detalle.idDetalleVenta}
                                        className={`
                                            p-4 rounded-lg border-2 transition-all cursor-pointer
                                            ${isSelected
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                                                : 'border-gray-200 dark:border-dark-border hover:border-gray-300'
                                            }
                                        `}
                                        onClick={() => handleProductSelect(detalle)}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Checkbox visual */}
                                            <div className={`
                                                w-5 h-5 rounded border-2 flex items-center justify-center
                                                ${isSelected
                                                    ? 'border-primary-500 bg-primary-500'
                                                    : 'border-gray-300 dark:border-dark-border'
                                                }
                                            `}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Info del producto */}
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-dark-text">
                                                    {detalle.producto?.nombre}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-dark-muted">
                                                    Precio unitario: {formatCurrency(detalle.precioUnitario)} | 
                                                    Cantidad vendida: {detalle.cantidad}
                                                </p>
                                            </div>

                                            {/* Selector de cantidad (solo si está seleccionado) */}
                                            {isSelected && (
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <label className="text-sm text-gray-600 dark:text-dark-muted">
                                                        Cantidad a devolver:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={detalle.cantidad}
                                                        value={selectedProduct?.cantidad || 1}
                                                        onChange={(e) => handleQuantityChange(
                                                            detalle.idDetalleVenta,
                                                            e.target.value
                                                        )}
                                                        className="w-20 px-3 py-1 border border-gray-300 dark:border-dark-border rounded-lg text-center"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Resumen de selección */}
                        {selectedProducts.length > 0 && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-800 dark:text-blue-400">
                                            {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''} seleccionado{selectedProducts.length !== 1 ? 's' : ''}
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Total de unidades: {selectedProducts.reduce((sum, p) => sum + p.cantidad, 0)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-blue-800 dark:text-blue-400">Total a devolver</p>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                                            {formatCurrency(calculateTotal())}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Motivo de devolución */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Motivo de la Devolución
                        </h3>
                        <textarea
                            placeholder="Describe el motivo de la devolución (mínimo 10 caracteres)"
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            disabled={isSubmitting}
                            rows={5}
                            required
                            minLength={10}
                            maxLength={500}
                            className="block w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-dark-muted">
                            {returnReason.length}/500 caracteres (mínimo 10)
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => navigate('/admin/devoluciones')}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={isSubmitting || selectedProducts.length === 0 || returnReason.trim().length < 10}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Procesando...' : 'Registrar Devolución'}
                        </Button>
                    </div>
                </>
            )}

            {/* Mensaje si no hay venta seleccionada */}
            {!sale && !isSearching && (
                <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-12 text-center border border-gray-200 dark:border-dark-border">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-dark-muted">
                        Busca una venta por su código para comenzar el proceso de devolución
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReturnProcess;
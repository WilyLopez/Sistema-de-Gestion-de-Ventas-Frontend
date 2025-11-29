// src/pages/seller/Returns/ReturnProcess.jsx
import { useState } from 'react';
import { Search, ArrowLeft, Send, AlertCircle, CheckCircle, Clock, Package, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Alert from '@components/alerts/Alert';
import { useToast } from '@hooks/useToast';
import { useAuth } from '@context/AuthContext';
import VentaService from '@services/VentaService';
import devolucionService from '@services/DevolucionService';
import { formatCurrency, formatDateTime } from '@utils/formatters';

// Skeleton Component
const ProductCardSkeleton = () => (
    <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-4 animate-pulse">
        <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
        </div>
    </div>
);

const ReturnProcess = () => {
    const [saleCode, setSaleCode] = useState('');
    const [sale, setSale] = useState(null);
    const [eligibility, setEligibility] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const [returnItems, setReturnItems] = useState({});
    const [returnReason, setReturnReason] = useState('');

    const { addToast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleFindSale = async () => {
        if (!saleCode.trim()) {
            setError('Por favor, ingrese un código de venta.');
            return;
        }
        setIsSearching(true);
        setError('');
        try {
            const foundSale = await VentaService.getByCodigo(saleCode.trim());

            const eligibilityData = await devolucionService.verifyPlazo(foundSale.idVenta);
            setEligibility(eligibilityData);

            const initialItems = {};
            foundSale.detalles.forEach(item => {
                initialItems[item.idProducto] = { ...item, returnQuantity: 0 };
            });
            setReturnItems(initialItems);

            setSale(foundSale);
            setStep(2);

        } catch (err) {
            console.error('Error finding sale:', err);
            if (err.response && err.response.status === 404) {
                setError(`No se encontró ninguna venta con el código "${saleCode.trim()}".`);
            } else {
                setError('Ocurrió un error al buscar la venta. Intente de nuevo.');
            }
            setSale(null);
            setEligibility(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const item = returnItems[productId];
        const originalQuantity = item.cantidad;

        let quantity = parseInt(newQuantity, 10);
        if (isNaN(quantity) || quantity < 0) quantity = 0;
        if (quantity > originalQuantity) quantity = originalQuantity;

        setReturnItems(prev => ({
            ...prev,
            [productId]: { ...prev[productId], returnQuantity: quantity }
        }));
    };

    const incrementQuantity = (productId) => {
        const item = returnItems[productId];
        if (item.returnQuantity < item.cantidad) {
            handleQuantityChange(productId, item.returnQuantity + 1);
        }
    };

    const decrementQuantity = (productId) => {
        const item = returnItems[productId];
        if (item.returnQuantity > 0) {
            handleQuantityChange(productId, item.returnQuantity - 1);
        }
    };

    const handleSubmitReturn = async () => {
        if (!eligibility?.dentroPlazo) {
            addToast('Esta venta está fuera del plazo de devolución.', 'error');
            return;
        }

        const detailsToReturn = Object.values(returnItems)
            .filter(item => item.returnQuantity > 0)
            .map(item => ({
                idProducto: item.idProducto,
                cantidad: item.returnQuantity
            }));

        if (detailsToReturn.length === 0) {
            addToast('Debe seleccionar al menos un producto para devolver.', 'warning');
            return;
        }

        if (!returnReason.trim()) {
            addToast('Debe proporcionar un motivo para la devolución.', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const returnData = {
                idVenta: sale.idVenta,
                idUsuario: user.id, // ✅ AGREGADO: ID del usuario autenticado
                motivo: returnReason,
                detalles: detailsToReturn
            };

            await devolucionService.create(returnData);
            addToast('Solicitud de devolución creada con éxito.', 'success');
            navigate('/vendedor/mis-ventas');

        } catch (err) {
            console.error('Error creating return:', err);
            addToast(err.message || 'Error al crear la solicitud de devolución.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetProcess = () => {
        setSaleCode('');
        setSale(null);
        setEligibility(null);
        setError('');
        setStep(1);
        setReturnItems({});
        setReturnReason('');
    };

    const totalReturnAmount = Object.values(returnItems)
        .reduce((total, item) => total + (item.returnQuantity * item.precioUnitario), 0);

    const selectedItemsCount = Object.values(returnItems)
        .filter(item => item.returnQuantity > 0).length;

    const canProcessReturn = eligibility?.dentroPlazo && totalReturnAmount > 0 && returnReason.trim();

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Procesar Devolución
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Gestiona las solicitudes de devolución de productos vendidos
                    </p>
                </div>
                {step === 2 && (
                    <Button
                        variant="outline"
                        onClick={resetProcess}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                        Nueva búsqueda
                    </Button>
                )}
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Step 1: Buscar Venta */}
            {step === 1 && (
                <div className="max-w-2xl mx-auto">
                    <Card className="p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                Buscar Venta
                            </h2>
                            <p className="text-gray-600 dark:text-dark-muted mt-2">
                                Ingresa el código de la venta para iniciar el proceso
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Input
                                placeholder="Ej: V-20241128-00003"
                                value={saleCode}
                                onChange={(e) => setSaleCode(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && !isSearching && handleFindSale()}
                                leftIcon={<Search className="w-5 h-5" />}
                                disabled={isSearching}
                                className="text-center text-lg font-mono"
                            />
                            <Button
                                onClick={handleFindSale}
                                loading={isSearching}
                                disabled={isSearching || !saleCode.trim()}
                                size="lg"
                                fullWidth
                            >
                                {isSearching ? 'Buscando...' : 'Buscar Venta'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Step 2: Process Return */}
            {step === 2 && sale && eligibility && (
                <div className="space-y-6">
                    {/* Eligibility Banner */}
                    {eligibility.dentroPlazo ? (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                                        Devolución Permitida
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        {eligibility.mensaje}. Tienes <strong>{eligibility.diasRestantes} días</strong> para completar este proceso.
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                                        PLAZO LÍMITE
                                    </div>
                                    <div className="text-sm font-bold text-green-900 dark:text-green-100">
                                        {new Date(eligibility.fechaLimite).toLocaleDateString('es-PE')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                                        Devolución No Permitida
                                    </h3>
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                        El plazo de devolución ha expirado. Solo puedes visualizar los detalles.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sale Details Card */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text">
                                Información de la Venta
                            </h2>
                            <Badge variant={sale.estado === 'PAGADO' ? 'success' : 'secondary'}>
                                {sale.estado}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Código</p>
                                <p className="font-bold text-gray-900 dark:text-dark-text font-mono text-sm">
                                    {sale.codigoVenta}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Fecha</p>
                                <p className="font-semibold text-gray-900 dark:text-dark-text text-sm">
                                    {new Date(sale.fechaCreacion).toLocaleDateString('es-PE')}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Cliente</p>
                                <p className="font-semibold text-gray-900 dark:text-dark-text text-sm truncate">
                                    {sale.nombreCliente}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Total Venta</p>
                                <p className="font-bold text-gray-900 dark:text-dark-text text-sm">
                                    {formatCurrency(sale.total)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Products Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text">
                                Seleccionar Productos
                            </h2>
                            {selectedItemsCount > 0 && (
                                <Badge variant="primary">
                                    {selectedItemsCount} {selectedItemsCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                                </Badge>
                            )}
                        </div>

                        {isSearching ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {Object.values(returnItems).map(item => {
                                    const isSelected = item.returnQuantity > 0;
                                    const isDisabled = !eligibility.dentroPlazo;

                                    return (
                                        <div
                                            key={item.idProducto}
                                            className={`
                                                bg-white dark:bg-dark-card rounded-lg border-2 transition-all duration-200
                                                ${isSelected
                                                    ? 'border-primary-500 shadow-lg ring-2 ring-primary-200 dark:ring-primary-900/50'
                                                    : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
                                                }
                                                ${isDisabled ? 'opacity-60' : ''}
                                            `}
                                        >
                                            <div className="p-4">
                                                {/* Product Info */}
                                                <div className="flex gap-3 mb-4">
                                                    <div className="w-16 h-16 bg-gray-100 dark:bg-dark-hover rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="font-bold text-gray-900 dark:text-dark-text text-sm line-clamp-2 mb-1">
                                                            {item.nombreProducto}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-1 text-xs">
                                                            <Badge variant="secondary" size="sm">{item.marca}</Badge>
                                                            <Badge variant="secondary" size="sm">{item.talla}</Badge>
                                                            <Badge variant="secondary" size="sm">{item.color}</Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pricing */}
                                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-dark-border">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-dark-muted">Precio unitario</p>
                                                        <p className="font-semibold text-gray-900 dark:text-dark-text">
                                                            {formatCurrency(item.precioUnitario)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 dark:text-dark-muted">Cantidad vendida</p>
                                                        <p className="font-semibold text-gray-900 dark:text-dark-text">
                                                            {item.cantidad} unid.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quantity Selector */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-700 dark:text-dark-text block">
                                                        Cantidad a devolver
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => decrementQuantity(item.idProducto)}
                                                            disabled={isDisabled || item.returnQuantity === 0}
                                                            className="w-10 h-10 p-0"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <input
                                                            type="number"
                                                            value={item.returnQuantity}
                                                            onChange={(e) => handleQuantityChange(item.idProducto, e.target.value)}
                                                            min={0}
                                                            max={item.cantidad}
                                                            disabled={isDisabled}
                                                            className="w-full h-10 text-center font-bold text-lg border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => incrementQuantity(item.idProducto)}
                                                            disabled={isDisabled || item.returnQuantity >= item.cantidad}
                                                            className="w-10 h-10 p-0"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Subtotal */}
                                                {isSelected && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500 dark:text-dark-muted font-medium">
                                                                Subtotal devolución
                                                            </span>
                                                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                                                {formatCurrency(item.returnQuantity * item.precioUnitario)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Summary and Submit Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Reason */}
                        <div className="lg:col-span-2">
                            <Card className="p-6 h-full">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-4">
                                    Motivo de la Devolución
                                </h2>
                                <textarea
                                    placeholder="Describe detalladamente el motivo de la devolución (defecto, talla incorrecta, cambio de opinión, etc.)..."
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    disabled={isLoading || !eligibility.dentroPlazo}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                />
                                {!eligibility.dentroPlazo && (
                                    <Alert variant="warning" className="mt-4">
                                        <AlertCircle className="w-5 h-5 inline mr-2" />
                                        Esta venta está fuera del plazo. Solo puedes visualizar los detalles.
                                    </Alert>
                                )}
                            </Card>
                        </div>

                        {/* Summary Card */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-4">
                                    Resumen
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-dark-muted">
                                            Productos seleccionados
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-dark-text">
                                            {selectedItemsCount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-dark-muted">
                                            Unidades totales
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-dark-text">
                                            {Object.values(returnItems).reduce((sum, item) => sum + item.returnQuantity, 0)}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 text-center">
                                            <p className="text-xs font-medium text-primary-900 dark:text-primary-100 mb-1">
                                                TOTAL A DEVOLVER
                                            </p>
                                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                                {formatCurrency(totalReturnAmount)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        fullWidth
                                        size="lg"
                                        onClick={handleSubmitReturn}
                                        loading={isLoading}
                                        disabled={isLoading || !canProcessReturn}
                                        leftIcon={<Send className="w-5 h-5" />}
                                        className="mt-4"
                                    >
                                        {isLoading ? 'Procesando...' : 'Confirmar Devolución'}
                                    </Button>
                                    {!canProcessReturn && eligibility.dentroPlazo && (
                                        <p className="text-xs text-center text-gray-500 dark:text-dark-muted">
                                            {selectedItemsCount === 0
                                                ? 'Selecciona al menos un producto'
                                                : 'Completa el motivo de devolución'
                                            }
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnProcess;
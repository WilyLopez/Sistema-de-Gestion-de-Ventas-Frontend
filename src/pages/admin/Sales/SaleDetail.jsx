// src/pages/admin/Sales/SaleDetail.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, 
    User, 
    Calendar, 
    CreditCard, 
    Package,
    FileText,
    XCircle,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Spinner from '@components/ui/Spinner';
import ventaService from '@services/VentaService';
import { formatCurrency, formatDateTime } from '@utils/formatters';
import { SALE_STATUS, PAYMENT_METHODS } from '@utils/constants';
import { useAuth } from '@hooks/useAuth';

/**
 * Página de Detalle de Venta
 * Vista completa de una venta específica
 */
const SaleDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    
    const [sale, setSale] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSale();
    }, [id]);

    const loadSale = async () => {
        try {
            const data = await ventaService.getById(id);
            setSale(data);
        } catch (error) {
            console.error('Error al cargar venta:', error);
            navigate('/admin/ventas');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando venta..." />
            </div>
        );
    }

    if (!sale) return null;

    // Mapeo de estados
    const statusConfig = {
        [SALE_STATUS.PAID]: {
            color: 'bg-green-500 text-white',
            icon: CheckCircle,
            label: 'Pagado',
        },
        [SALE_STATUS.CANCELLED]: {
            color: 'bg-red-500 text-white',
            icon: XCircle,
            label: 'Anulado',
        },
        [SALE_STATUS.PENDING]: {
            color: 'bg-yellow-500 text-white',
            icon: AlertCircle,
            label: 'Pendiente',
        },
    };

    // Mapeo de métodos de pago
    const paymentLabels = {
        [PAYMENT_METHODS.CASH]: 'Efectivo',
        [PAYMENT_METHODS.CREDIT_CARD]: 'Tarjeta de Crédito',
        [PAYMENT_METHODS.DEBIT_CARD]: 'Tarjeta de Débito',
        [PAYMENT_METHODS.TRANSFER]: 'Transferencia',
        [PAYMENT_METHODS.YAPE]: 'Yape',
        [PAYMENT_METHODS.PLIN]: 'Plin',
    };

    const status = statusConfig[sale.estado] || statusConfig[SALE_STATUS.PENDING];
    const StatusIcon = status.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/ventas')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="mb-4"
                >
                    Volver
                </Button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                            Detalle de Venta
                        </h1>
                        <p className="text-gray-600 dark:text-dark-muted mt-1">
                            Código: <span className="font-mono font-semibold">{sale.codigo}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="custom" className={status.color}>
                            <span className="flex items-center gap-1.5">
                                <StatusIcon className="w-4 h-4" />
                                {status.label}
                            </span>
                        </Badge>
                        <Button
                            variant="secondary"
                            size="md"
                            leftIcon={<FileText className="w-4 h-4" />}
                            onClick={() => {
                                // TODO: Generar PDF
                                console.log('Generar comprobante');
                            }}
                        >
                            Comprobante
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda - Info principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card de productos */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Productos
                        </h3>
                        
                        <div className="space-y-4">
                            {sale.detalles?.map((detalle, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-lg"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {detalle.producto?.imagenUrl ? (
                                            <img
                                                src={detalle.producto.imagenUrl}
                                                alt={detalle.producto.nombre}
                                                className="w-16 h-16 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded bg-gray-200 dark:bg-dark-border flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-dark-text">
                                                {detalle.producto?.nombre || 'Producto'}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                                {detalle.cantidad} x {formatCurrency(detalle.precioUnitario)}
                                            </p>
                                            {detalle.descuento > 0 && (
                                                <p className="text-xs text-green-600 dark:text-green-400">
                                                    Descuento: {detalle.descuento}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-dark-text">
                                            {formatCurrency(detalle.subtotal)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-dark-muted">Subtotal:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-text">
                                    {formatCurrency(sale.subtotal || 0)}
                                </span>
                            </div>
                            
                            {sale.descuentoTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-dark-muted">Descuento:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        -{formatCurrency(sale.descuentoTotal)}
                                    </span>
                                </div>
                            )}
                            
                            {sale.igv > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-dark-muted">IGV (18%):</span>
                                    <span className="font-medium text-gray-900 dark:text-dark-text">
                                        {formatCurrency(sale.igv)}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-dark-border">
                                <span className="text-gray-900 dark:text-dark-text">Total:</span>
                                <span className="text-primary-600 dark:text-primary-400">
                                    {formatCurrency(sale.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card de observaciones/motivo anulación */}
                    {(sale.observaciones || sale.motivoAnulacion) && (
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                                {sale.motivoAnulacion ? 'Motivo de Anulación' : 'Observaciones'}
                            </h3>
                            <p className={`text-sm ${sale.motivoAnulacion ? 'text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-dark-muted'}`}>
                                {sale.motivoAnulacion || sale.observaciones}
                            </p>
                        </div>
                    )}
                </div>

                {/* Columna derecha - Info complementaria */}
                <div className="space-y-6">
                    {/* Card de cliente */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Cliente
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Nombre</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {sale.cliente?.nombre} {sale.cliente?.apellido}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Documento</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {sale.cliente?.tipoDocumento}: {sale.cliente?.numeroDocumento}
                                </p>
                            </div>
                            {sale.cliente?.correo && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Correo</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {sale.cliente.correo}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card de vendedor */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Información de Venta
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Vendedor</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {sale.usuario?.nombre || sale.usuario?.username}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Fecha</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {formatDateTime(sale.fecha)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Método de Pago</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {paymentLabels[sale.metodoPago] || sale.metodoPago}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card de fechas de modificación */}
                    {(sale.fechaModificacion || sale.fechaAnulacion) && (
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                                Historial
                            </h3>
                            <div className="space-y-3">
                                {sale.fechaAnulacion && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-red-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">Fecha de Anulación</p>
                                            <p className="font-medium text-gray-900 dark:text-dark-text">
                                                {formatDateTime(sale.fechaAnulacion)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {sale.fechaModificacion && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">Última Modificación</p>
                                            <p className="font-medium text-gray-900 dark:text-dark-text">
                                                {formatDateTime(sale.fechaModificacion)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SaleDetail;
// src/components/fragments/seller/PaymentModal.jsx
import { useState } from 'react';
import { DollarSign, AlertCircle, Save } from 'lucide-react';
import Modal from '@components/ui/Modal';
import Select from '@components/ui/Select';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { formatCurrency } from '@utils/formatters';
import { PAYMENT_METHODS } from '@utils/constants';
import { useSaleContext } from '@context/SaleContext';
import { useAuth } from '@context/AuthContext';
import VentaService from '@services/VentaService';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const {
        cart,
        selectedClient,
        calculateTotals,
        isProcessing,
        setIsProcessing,
        setSaleCompleted,
        setLastSaleId
    } = useSaleContext();

    const { subtotal, igv, totalDiscount, total } = calculateTotals();

    const [metodoPago, setMetodoPago] = useState('EFECTIVO');
    const [tipoComprobante, setTipoComprobante] = useState('BOLETA');
    const [montoPagado, setMontoPagado] = useState(total.toFixed(2));

    const calculateChange = () => {
        const paid = parseFloat(montoPagado) || 0;
        return Math.max(0, paid - total);
    };

    const processSale = async () => {
        try {
            setIsProcessing(true);

            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }

            if (!selectedClient) {
                alert('Seleccione un cliente');
                return;
            }

            const paid = parseFloat(montoPagado) || 0;
            if (paid < total) {
                alert('El monto pagado es insuficiente');
                return;
            }

            const metodoPagoMap = {
                'EFECTIVO': 1,
                'TARJETA_CREDITO': 2,
                'TARJETA_DEBITO': 3,
                'YAPE': 4,
                'PLIN': 5,
                'TRANSFERENCIA': 6
            };

            const detalles = cart.map((item) => ({
                idProducto: parseInt(item.idProducto),
                cantidad: parseInt(item.cantidad),
                precioUnitario: parseFloat(item.precio),
                descuento: parseFloat(item.descuento || 0),
            }));

            const ventaData = {
                idCliente: parseInt(selectedClient.idCliente),
                idUsuario: parseInt(user.id),
                idMetodoPago: metodoPagoMap[metodoPago],
                tipoComprobante: tipoComprobante,
                subtotal: parseFloat(subtotal),
                descuentoTotal: parseFloat(totalDiscount),
                total: parseFloat(total),
                detalles: detalles,
            };

            console.log('Datos de venta:', ventaData);

            const response = await VentaService.create(ventaData);

            setLastSaleId(response.idVenta);
            setSaleCompleted(true);

            if (onSuccess) {
                onSuccess(response);
            }

            onClose();

        } catch (error) {
            console.error('Error procesando venta:', error);
            alert(error.response?.data?.mensaje || error.message || 'Error al procesar la venta');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => !isProcessing && onClose()}
            title="Procesar Pago"
            size="md"
        >
            <div className="space-y-4">
                {/* Total a Pagar */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">
                        Total a Pagar
                    </p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(total)}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-dark-muted mt-2 space-y-0.5">
                        <p>Subtotal: {formatCurrency(subtotal)}</p>
                        <p>IGV (18%): {formatCurrency(igv)}</p>
                    </div>
                </div>

                {/* Tipo de Comprobante */}
                <Select
                    label="Tipo de Comprobante"
                    value={tipoComprobante}
                    onChange={(value) => setTipoComprobante(value)}
                    options={[
                        { value: 'BOLETA', label: 'Boleta' },
                        { value: 'FACTURA', label: 'Factura' }
                    ]}
                />

                {/* Método de Pago */}
                <Select
                    label="Método de Pago"
                    value={metodoPago}
                    onChange={(value) => setMetodoPago(value)}
                    options={Object.entries(PAYMENT_METHODS).map(([key, value]) => ({
                        value,
                        label: value.replace(/_/g, ' '),
                    }))}
                />

                {/* Monto Recibido */}
                <Input
                    label="Monto Recibido"
                    type="number"
                    step="0.01"
                    value={montoPagado}
                    onChange={(e) => setMontoPagado(e.target.value)}
                    leftIcon={<DollarSign className="w-5 h-5" />}
                />

                {/* Cambio */}
                {parseFloat(montoPagado) >= total && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-dark-muted">
                                Cambio:
                            </span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(calculateChange())}
                            </span>
                        </div>
                    </div>
                )}

                {/* Monto Insuficiente */}
                {parseFloat(montoPagado) < total && montoPagado !== '' && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Monto insuficiente. Faltan {formatCurrency(total - parseFloat(montoPagado))}
                        </p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={processSale}
                        disabled={isProcessing || parseFloat(montoPagado) < total}
                        loading={isProcessing}
                        leftIcon={<Save className="w-4 h-4" />}
                    >
                        {isProcessing ? 'Procesando...' : 'Confirmar Venta'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentModal;
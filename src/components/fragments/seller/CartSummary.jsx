// src/components/fragments/seller/CartSummary.jsx
import { DollarSign, Package } from 'lucide-react';
import Button from '@components/ui/Button';
import { formatCurrency } from '@utils/formatters';
import { useSaleContext } from '@context/SaleContext';

const CartSummary = ({ onProcessSale }) => {
    const { cart, selectedClient, calculateTotals } = useSaleContext();
    const { subtotal, igv, totalDiscount, total } = calculateTotals();

    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 flex flex-col">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-dark-text">
                Resumen de Venta
            </h3>

            {/* Resumen de Items */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-dark-muted">
                    <Package className="w-5 h-5" />
                    <span className="text-sm">
                        {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} en total
                    </span>
                </div>
            </div>

            {/* Desglose de Montos */}
            <div className="space-y-3 mb-4">
                {/* Subtotal (sin IGV) */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-dark-muted">
                        Subtotal:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-dark-text">
                        {formatCurrency(subtotal)}
                    </span>
                </div>

                {/* Descuento Total */}
                {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-dark-muted">
                            Descuento:
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                            -{formatCurrency(totalDiscount)}
                        </span>
                    </div>
                )}

                {/* IGV (18%) */}
                <div className="flex justify-between text-sm border-t border-gray-200 dark:border-dark-border pt-2">
                    <span className="text-gray-600 dark:text-dark-muted">
                        IGV (18%):
                    </span>
                    <span className="font-medium text-gray-900 dark:text-dark-text">
                        {formatCurrency(igv)}
                    </span>
                </div>

                {/* Total Final */}
                <div className="border-t-2 border-gray-300 dark:border-dark-border pt-3 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                        TOTAL:
                    </span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(total)}
                    </span>
                </div>
            </div>

            {/* Botón Procesar */}
            <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onProcessSale}
                disabled={cart.length === 0 || !selectedClient}
                leftIcon={<DollarSign className="w-5 h-5" />}
            >
                Procesar Venta
            </Button>

            {/* Mensaje de ayuda */}
            {cart.length === 0 && (
                <p className="text-xs text-center text-gray-500 dark:text-dark-muted mt-2">
                    Agrega productos al carrito
                </p>
            )}
            {cart.length > 0 && !selectedClient && (
                <p className="text-xs text-center text-amber-600 dark:text-amber-400 mt-2">
                    Selecciona un cliente para continuar
                </p>
            )}
        </div>
    );
};

export default CartSummary;
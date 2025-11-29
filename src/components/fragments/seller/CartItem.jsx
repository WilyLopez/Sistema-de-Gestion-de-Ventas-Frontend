// src/components/fragments/seller/CartItem.jsx
import { Plus, Minus, X } from 'lucide-react';
import { formatCurrency } from '@utils/formatters';
import { useSaleContext } from '@context/SaleContext';

const CartItem = ({ item }) => {
    const { updateQuantity, updateDiscount, removeFromCart, calculateItemTotal } = useSaleContext();

    const handleQuantityChange = (newQuantity) => {
        try {
            updateQuantity(item.idProducto, newQuantity);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDiscountChange = (discount) => {
        try {
            updateDiscount(item.idProducto, discount);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-3 border border-gray-200 dark:border-dark-border">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-dark-text">
                        {item.nombre}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-dark-muted">
                        {item.codigo} • {formatCurrency(item.precio)} c/u
                    </p>
                </div>
                <button
                    onClick={() => removeFromCart(item.idProducto)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
                    aria-label="Eliminar producto"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-3">
                {/* Cantidad */}
                <div>
                    <label className="text-xs text-gray-600 dark:text-dark-muted mb-1 block">
                        Cantidad
                    </label>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handleQuantityChange(item.cantidad - 1)}
                            className="p-1.5 rounded bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-border transition-colors"
                            aria-label="Disminuir cantidad"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.cantidad}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="w-14 text-center border border-gray-300 dark:border-dark-border rounded px-2 py-1.5 text-sm dark:bg-dark-card dark:text-dark-text"
                        />
                        <button
                            onClick={() => handleQuantityChange(item.cantidad + 1)}
                            className="p-1.5 rounded bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-border transition-colors"
                            aria-label="Aumentar cantidad"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Descuento */}
                <div>
                    <label className="text-xs text-gray-600 dark:text-dark-muted mb-1 block">
                        Descuento %
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={item.descuento}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        className="w-full border border-gray-300 dark:border-dark-border rounded px-2 py-1.5 text-sm dark:bg-dark-card dark:text-dark-text"
                    />
                </div>

                {/* Total */}
                <div>
                    <label className="text-xs text-gray-600 dark:text-dark-muted mb-1 block">
                        Total
                    </label>
                    <p className="font-semibold text-primary-600 dark:text-primary-400 text-lg pt-1">
                        {formatCurrency(calculateItemTotal(item))}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
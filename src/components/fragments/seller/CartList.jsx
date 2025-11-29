// src/components/fragments/seller/CartList.jsx
import { ShoppingCart, Trash2 } from 'lucide-react';
import Button from '@components/ui/Button';
import CartItem from './CartItem';
import { useSaleContext } from '@context/SaleContext';

const CartList = () => {
    const { cart, clearCart } = useSaleContext();

    const handleClearCart = () => {
        if (cart.length > 0) {
            if (confirm('¿Estás seguro de limpiar todo el carrito?')) {
                clearCart();
            }
        }
    };

    return (
        <div className="flex-1 bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-dark-text flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Carrito de Compras ({cart.length} productos)
                </h3>
                {cart.length > 0 && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleClearCart}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-dark-muted">
                        <ShoppingCart className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium">El carrito está vacío</p>
                        <p className="text-sm">Busca y agrega productos para comenzar</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <CartItem key={item.idProducto} item={item} />
                    ))
                )}
            </div>
        </div>
    );
};

export default CartList;
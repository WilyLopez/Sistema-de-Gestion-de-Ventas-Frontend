// src/context/SaleContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const SaleContext = createContext(null);

export const SaleProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);

    const [paymentData, setPaymentData] = useState({
        metodoPago: "EFECTIVO",
        tipoComprobante: "BOLETA",
        montoPagado: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [saleCompleted, setSaleCompleted] = useState(false);
    const [lastSaleId, setLastSaleId] = useState(null);

    const addToCart = useCallback((product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.idProducto === product.idProducto
            );

            if (existingItem) {
                if (existingItem.cantidad >= product.stock) {
                    throw new Error(
                        `Stock insuficiente. Disponible: ${product.stock}`
                    );
                }
                return prevCart.map((item) =>
                    item.idProducto === product.idProducto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            if (product.stock < 1) {
                throw new Error("Producto sin stock");
            }

            return [
                ...prevCart,
                {
                    idProducto: product.idProducto,
                    codigo: product.codigo,
                    nombre: product.nombre,
                    precio: product.precioVenta,
                    cantidad: 1,
                    stock: product.stock,
                    descuento: 0,
                },
            ];
        });
    }, []);

    const updateQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.idProducto === productId) {
                    if (newQuantity > item.stock) {
                        throw new Error(
                            `Stock insuficiente. Disponible: ${item.stock}`
                        );
                    }
                    return { ...item, cantidad: newQuantity };
                }
                return item;
            })
        );
    }, []);

    const updateDiscount = useCallback((productId, discount) => {
        const discountValue = parseFloat(discount) || 0;
        if (discountValue < 0 || discountValue > 50) {
            throw new Error("El descuento debe estar entre 0% y 50%");
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.idProducto === productId
                    ? { ...item, descuento: discountValue }
                    : item
            )
        );
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item.idProducto !== productId)
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const calculateItemTotal = useCallback((item) => {
        const subtotal = item.precio * item.cantidad;
        const discount = subtotal * (item.descuento / 100);
        return subtotal - discount;
    }, []);

    const calculateTotals = useCallback(() => {
        const subtotal = cart.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0
        );

        const totalDiscount = cart.reduce((sum, item) => {
            const itemSubtotal = item.precio * item.cantidad;
            return sum + itemSubtotal * (item.descuento / 100);
        }, 0);

        const subtotalConDescuento = subtotal - totalDiscount;

        const igv = subtotalConDescuento * 0.18;

        const total = subtotalConDescuento + igv;

        return {
            subtotal: subtotalConDescuento,
            igv,
            totalDiscount,
            total,
        };
    }, [cart]);

    const selectClient = useCallback((client) => {
        setSelectedClient(client);
    }, []);

    const clearClient = useCallback(() => {
        setSelectedClient(null);
    }, []);

    const updatePaymentData = useCallback((data) => {
        setPaymentData((prev) => ({ ...prev, ...data }));
    }, []);

    const resetSale = useCallback(() => {
        setCart([]);
        setSelectedClient(null);
        setPaymentData({
            metodoPago: "EFECTIVO",
            tipoComprobante: "BOLETA",
            montoPagado: "",
        });
        setSaleCompleted(false);
        setLastSaleId(null);
        setIsProcessing(false);
    }, []);

    const value = {
        cart,
        selectedClient,
        paymentData,
        isProcessing,
        saleCompleted,
        lastSaleId,

        addToCart,
        updateQuantity,
        updateDiscount,
        removeFromCart,
        clearCart,

        calculateItemTotal,
        calculateTotals,

        selectClient,
        clearClient,

        updatePaymentData,

        setIsProcessing,
        setSaleCompleted,
        setLastSaleId,

        resetSale,
    };

    return (
        <SaleContext.Provider value={value}>{children}</SaleContext.Provider>
    );
};

export const useSaleContext = () => {
    const context = useContext(SaleContext);
    if (!context) {
        throw new Error("useSaleContext debe usarse dentro de SaleProvider");
    }
    return context;
};

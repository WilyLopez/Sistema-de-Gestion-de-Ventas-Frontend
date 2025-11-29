// src/pages/seller/NewSale.jsx
import { useState, useEffect } from 'react';
import { SaleProvider, useSaleContext } from '@context/SaleContext';
import ProductSearch from '@components/fragments/seller/ProductSearch';
import ProductSearchBarcode from '@components/fragments/seller/ProductSearchBarcode';
import CartList from '@components/fragments/seller/CartList';
import CartSummary from '@components/fragments/seller/CartSummary';
import ClientSelector from '@components/fragments/seller/ClientSelector';
import PaymentModal from '@components/fragments/seller/PaymentModal';
import SaleSuccessModal from '@components/fragments/seller/SaleSuccessModal';

const NewSaleContent = () => {
    const { 
        calculateTotals, 
        saleCompleted, 
        resetSale,
        lastSaleId 
    } = useSaleContext();

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [lastSaleData, setLastSaleData] = useState(null);

    const { total } = calculateTotals();

    // Auto-cerrar modal de éxito después de 5 segundos
    useEffect(() => {
        if (saleCompleted) {
            const timer = setTimeout(() => {
                handleNewSale();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [saleCompleted]);

    const handleOpenPayment = () => {
        setShowPaymentModal(true);
    };

    const handleClosePayment = () => {
        setShowPaymentModal(false);
    };

    const handlePaymentSuccess = (saleData) => {
        setLastSaleData({
            total: saleData.total,
            change: 0, // Calcular si es necesario
            codigoVenta: saleData.codigoVenta
        });
    };

    const handleNewSale = () => {
        resetSale();
        setLastSaleData(null);
    };

    const handlePrint = () => {
        // TODO: Implementar lógica de impresión
        alert('Función de impresión en desarrollo');
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* COLUMNA IZQUIERDA: Búsqueda y Carrito */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Panel de Búsqueda */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <ProductSearch />
                        <ProductSearchBarcode />
                    </div>
                </div>

                {/* Carrito */}
                <CartList />
            </div>

            {/* COLUMNA DERECHA: Cliente y Resumen */}
            <div className="w-96 flex flex-col gap-4">
                {/* Selector de Cliente */}
                <ClientSelector />

                {/* Resumen de Venta */}
                <CartSummary onProcessSale={handleOpenPayment} />
            </div>

            {/* Modal de Pago */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={handleClosePayment}
                onSuccess={handlePaymentSuccess}
            />

            {/* Modal de Éxito */}
            <SaleSuccessModal
                isOpen={saleCompleted}
                saleData={lastSaleData}
                onNewSale={handleNewSale}
                onPrint={handlePrint}
            />
        </div>
    );
};

// Wrapper con Provider
const NewSale = () => {
    return (
        <SaleProvider>
            <NewSaleContent />
        </SaleProvider>
    );
};

export default NewSale;
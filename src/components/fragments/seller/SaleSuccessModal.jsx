// src/components/fragments/seller/SaleSuccessModal.jsx
import { CheckCircle, Printer } from 'lucide-react';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { formatCurrency } from '@utils/formatters';

const SaleSuccessModal = ({ isOpen, saleData, onNewSale, onPrint }) => {
    const { total = 0, change = 0, codigoVenta = '' } = saleData || {};

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }}
            title="¡Venta Completada!"
            size="md"
            closeOnOverlayClick={false}
            showCloseButton={false}
        >
            <div className="text-center py-6">
                {/* Icono de éxito */}
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
                    ¡Venta Exitosa!
                </h3>
                <p className="text-gray-600 dark:text-dark-muted mb-4">
                    La venta ha sido registrada correctamente
                </p>

                {/* Código de venta */}
                {codigoVenta && (
                    <p className="text-sm text-gray-500 dark:text-dark-muted mb-4">
                        Código: <span className="font-mono font-semibold">{codigoVenta}</span>
                    </p>
                )}

                {/* Información de la venta */}
                <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">
                        Total Vendido
                    </p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(total)}
                    </p>

                    {change > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                Cambio: <span className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(change)}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onPrint}
                        leftIcon={<Printer className="w-4 h-4" />}
                    >
                        Imprimir
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onNewSale}
                    >
                        Nueva Venta
                    </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-dark-muted mt-4">
                    Esta ventana se cerrará automáticamente en unos segundos...
                </p>
            </div>
        </Modal>
    );
};

export default SaleSuccessModal;
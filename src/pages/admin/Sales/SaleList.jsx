// src/pages/admin/Sales/SaleList.jsx
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import SalesTable from '@components/tables/SalesTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Alert from '@components/alerts/Alert';
import Input from '@components/ui/Input';
import ventaService from '@services/VentaService';
import { MESSAGES, SALE_STATUS } from '@utils/constants';
import { useAuth } from '@hooks/useAuth';

/**
 * Página de Lista de Ventas
 * Muestra todas las ventas con opción de anulación (solo admin)
 */
const SaleList = () => {
    const { user } = useAuth();

    // Estados para modales
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    // Estados de formulario
    const [cancelReason, setCancelReason] = useState('');

    // Estados de carga
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCheckingCancel, setIsCheckingCancel] = useState(false);

    // Estados de mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Estado para refrescar tabla
    const [refreshKey, setRefreshKey] = useState(0);

    // ===== HANDLER DE ANULACIÓN =====
    const handleOpenCancel = async (sale) => {
        setErrorMessage('');

        // Verificar si la venta ya está anulada
        if (sale.estado === SALE_STATUS.CANCELLED) {
            setErrorMessage('Esta venta ya está anulada');
            return;
        }

        // Verificar si puede anularse
        setIsCheckingCancel(true);
        try {
            const canCancel = await ventaService.puedeAnularse(sale.idVenta);

            if (!canCancel) {
                setErrorMessage('Esta venta no puede ser anulada. Es posible que haya superado el plazo permitido.');
                return;
            }

            setSelectedSale(sale);
            setShowCancelModal(true);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al verificar si la venta puede anularse';
            setErrorMessage(errorMsg);
            console.error('Error al verificar anulación:', error);
        } finally {
            setIsCheckingCancel(false);
        }
    };

    const handleCancelSale = async () => {
        if (!selectedSale) return;

        // Validar motivo
        if (!cancelReason.trim()) {
            setErrorMessage('Debe proporcionar un motivo para la anulación');
            return;
        }

        if (cancelReason.trim().length < 10) {
            setErrorMessage('El motivo debe tener al menos 10 caracteres');
            return;
        }

        setIsCancelling(true);
        setErrorMessage('');

        try {
            await ventaService.anular(selectedSale.idVenta, cancelReason.trim());
            setSuccessMessage('Venta anulada exitosamente');
            setShowCancelModal(false);
            setSelectedSale(null);
            setCancelReason('');
            setRefreshKey(prev => prev + 1);

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;

            if (error.response?.status === 400) {
                errorMsg = error.response.data.message || MESSAGES.ERROR.VALIDATION;
            } else if (error.response?.status === 409) {
                errorMsg = 'No se puede anular esta venta. Puede que tenga devoluciones asociadas o haya superado el plazo.';
            }

            setErrorMessage(errorMsg);
            console.error('Error al anular venta:', error);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Ventas
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra y consulta todas las ventas realizadas
                    </p>
                </div>
            </div>

            {/* Mensajes de éxito/error */}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {/* Mensaje de verificación */}
            {isCheckingCancel && (
                <Alert variant="info">
                    Verificando si la venta puede anularse...
                </Alert>
            )}

            {/* Tabla de ventas */}
            <SalesTable
                key={refreshKey}
                onCancel={handleOpenCancel}
                userRole={user?.rol?.nombre || user?.rol}
            />

            {/* Modal de Anulación */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => !isCancelling && setShowCancelModal(false)}
                title="Anular Venta"
                size="md"
            >
                <div className="space-y-4">
                    {/* Información de la venta */}
                    <div className="p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-2">
                            Información de la Venta
                        </h4>
                        <div className="space-y-1 text-sm">
                            <p className="text-gray-600 dark:text-dark-muted">
                                <span className="font-medium">Código:</span> {selectedSale?.codigo}
                            </p>
                            <p className="text-gray-600 dark:text-dark-muted">
                                <span className="font-medium">Cliente:</span>{' '}
                                {selectedSale?.cliente?.nombre} {selectedSale?.cliente?.apellido}
                            </p>
                            <p className="text-gray-600 dark:text-dark-muted">
                                <span className="font-medium">Total:</span> S/ {selectedSale?.total?.toFixed(2)}
                            </p>
                            <p className="text-gray-600 dark:text-dark-muted">
                                <span className="font-medium">Fecha:</span>{' '}
                                {selectedSale?.fecha && new Date(selectedSale.fecha).toLocaleDateString('es-PE')}
                            </p>
                        </div>
                    </div>

                    {/* Advertencia */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                                Advertencia
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-400">
                                Esta acción no se puede deshacer. La venta será marcada como anulada
                                y el stock será reintegrado al inventario.
                            </p>
                        </div>
                    </div>

                    {/* Motivo de anulación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                            Motivo de Anulación <span className="text-danger">*</span>
                        </label>
                        <textarea
                            placeholder="Describe el motivo de la anulación (mínimo 10 caracteres)"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            disabled={isCancelling}
                            rows={4}
                            required
                            minLength={10}
                            maxLength={500}
                            className="block w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                            {cancelReason.length}/500 caracteres (mínimo 10)
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowCancelModal(false);
                                setCancelReason('');
                            }}
                            disabled={isCancelling}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleCancelSale}
                            loading={isCancelling}
                            disabled={isCancelling || cancelReason.trim().length < 10}
                            className="flex-1"
                        >
                            {isCancelling ? 'Anulando...' : 'Anular Venta'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SaleList;
// src/pages/admin/Returns/ReturnList.jsx
import { useState } from 'react';
import { Plus, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReturnTable from '@components/tables/ReturnTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import Alert from '@components/alerts/Alert';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import devolucionService from '@services/DevolucionService';
import { MESSAGES, RETURN_STATUS } from '@utils/constants';
import { useAuth } from '@hooks/useAuth';
import { formatCurrency } from '@utils/formatters';

/**
 * Página de Lista de Devoluciones
 * Muestra todas las devoluciones con opciones de aprobar/rechazar
 */
const ReturnList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Estados para modales
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    
    // Estados de datos
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [filters, setFilters] = useState({});
    const [tempFilters, setTempFilters] = useState({
        estado: '',
        fechaInicio: '',
        fechaFin: '',
    });
    
    // Estados de formulario
    const [rejectReason, setRejectReason] = useState('');
    
    // Estados de carga
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    
    // Estados de mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // Estado para refrescar tabla
    const [refreshKey, setRefreshKey] = useState(0);

    // ===== HANDLERS DE DETALLE =====
    const handleViewDetail = (returnData) => {
        setSelectedReturn(returnData);
        setShowDetailModal(true);
    };

    // ===== HANDLERS DE APROBAR =====
    const handleOpenApprove = (returnData) => {
        setSelectedReturn(returnData);
        setShowApproveModal(true);
        setErrorMessage('');
    };

    const handleApprove = async () => {
        if (!selectedReturn) return;

        setIsApproving(true);
        setErrorMessage('');

        try {
            await devolucionService.approve(selectedReturn.idDevolucion, user.idUsuario);
            setSuccessMessage('Devolución aprobada exitosamente');
            setShowApproveModal(false);
            setSelectedReturn(null);
            setRefreshKey(prev => prev + 1);
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
            console.error('Error al aprobar devolución:', error);
        } finally {
            setIsApproving(false);
        }
    };

    // ===== HANDLERS DE RECHAZAR =====
    const handleOpenReject = (returnData) => {
        setSelectedReturn(returnData);
        setShowRejectModal(true);
        setRejectReason('');
        setErrorMessage('');
    };

    const handleReject = async () => {
        if (!selectedReturn) return;

        // Validar motivo
        if (!rejectReason.trim()) {
            setErrorMessage('Debe proporcionar un motivo para el rechazo');
            return;
        }

        if (rejectReason.trim().length < 10) {
            setErrorMessage('El motivo debe tener al menos 10 caracteres');
            return;
        }

        setIsRejecting(true);
        setErrorMessage('');

        try {
            await devolucionService.reject(
                selectedReturn.idDevolucion,
                user.idUsuario,
                rejectReason.trim()
            );
            setSuccessMessage('Devolución rechazada');
            setShowRejectModal(false);
            setSelectedReturn(null);
            setRejectReason('');
            setRefreshKey(prev => prev + 1);
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
            console.error('Error al rechazar devolución:', error);
        } finally {
            setIsRejecting(false);
        }
    };

    // ===== HANDLERS DE FILTROS =====
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplyFilters = () => {
        const cleanFilters = Object.entries(tempFilters).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        setFilters(cleanFilters);
        setShowFilterModal(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleClearFilters = () => {
        setTempFilters({
            estado: '',
            fechaInicio: '',
            fechaFin: '',
        });
        setFilters({});
        setShowFilterModal(false);
        setRefreshKey(prev => prev + 1);
    };

    const activeFiltersCount = Object.keys(filters).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Gestión de Devoluciones
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Administra y procesa las devoluciones de productos
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowFilterModal(true)}
                        leftIcon={<Filter className="w-4 h-4" />}
                    >
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/admin/devoluciones/procesar')}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Nueva Devolución
                    </Button>
                </div>
            </div>

            {/* Mensajes */}
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

            {/* Filtros activos */}
            {activeFiltersCount > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            Filtros activos: {activeFiltersCount}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            )}

            {/* Tabla de devoluciones */}
            <ReturnTable
                refreshTrigger={refreshKey}
                filters={filters}
                onViewDetail={handleViewDetail}
                onApprove={handleOpenApprove}
                onReject={handleOpenReject}
            />

            {/* Modal de Detalle */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Detalle de Devolución"
                size="lg"
            >
                {selectedReturn && (
                    <div className="space-y-6">
                        {/* Información general */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Código Venta</p>
                                <p className="font-mono font-medium text-gray-900 dark:text-dark-text">
                                    {selectedReturn.venta?.codigo}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Estado</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {selectedReturn.estado}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Cliente</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {selectedReturn.cliente?.nombre} {selectedReturn.cliente?.apellido}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">Total</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
                                    {formatCurrency(selectedReturn.totalDevolucion)}
                                </p>
                            </div>
                        </div>

                        {/* Productos devueltos */}
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-3">
                                Productos Devueltos
                            </h4>
                            <div className="space-y-2">
                                {selectedReturn.detalles?.map((detalle, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-hover rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-dark-text">
                                                {detalle.producto?.nombre}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                Cantidad: {detalle.cantidad}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-dark-text">
                                            {formatCurrency(detalle.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Motivo */}
                        {selectedReturn.motivo && (
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-2">
                                    Motivo
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-dark-muted p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
                                    {selectedReturn.motivo}
                                </p>
                            </div>
                        )}

                        {/* Motivo rechazo */}
                        {selectedReturn.motivoRechazo && (
                            <div>
                                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                                    Motivo de Rechazo
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                    {selectedReturn.motivoRechazo}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal de Aprobar */}
            <Modal
                isOpen={showApproveModal}
                onClose={() => !isApproving && setShowApproveModal(false)}
                title="Aprobar Devolución"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-dark-text">
                        ¿Estás seguro de aprobar esta devolución por{' '}
                        <span className="font-semibold">{formatCurrency(selectedReturn?.totalDevolucion)}</span>?
                    </p>
                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                        El monto será reembolsado al cliente y el stock será reintegrado al inventario.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setShowApproveModal(false)}
                            disabled={isApproving}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleApprove}
                            loading={isApproving}
                            disabled={isApproving}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                            className="flex-1"
                        >
                            {isApproving ? 'Aprobando...' : 'Aprobar'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Rechazar */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => !isRejecting && setShowRejectModal(false)}
                title="Rechazar Devolución"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-dark-text">
                        Estás a punto de rechazar esta devolución. Por favor, proporciona un motivo.
                    </p>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                            Motivo de Rechazo <span className="text-danger">*</span>
                        </label>
                        <textarea
                            placeholder="Explica el motivo del rechazo (mínimo 10 caracteres)"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            disabled={isRejecting}
                            rows={4}
                            required
                            minLength={10}
                            maxLength={500}
                            className="block w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                            {rejectReason.length}/500 caracteres (mínimo 10)
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowRejectModal(false);
                                setRejectReason('');
                            }}
                            disabled={isRejecting}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleReject}
                            loading={isRejecting}
                            disabled={isRejecting || rejectReason.trim().length < 10}
                            leftIcon={<XCircle className="w-4 h-4" />}
                            className="flex-1"
                        >
                            {isRejecting ? 'Rechazando...' : 'Rechazar'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Filtros */}
            <Modal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Filtros de Búsqueda"
                size="md"
            >
                <div className="space-y-4">
                    <Select
                        label="Estado"
                        name="estado"
                        value={tempFilters.estado}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'Todos los estados' },
                            { value: RETURN_STATUS.PENDING, label: 'Pendiente' },
                            { value: RETURN_STATUS.APPROVED, label: 'Aprobada' },
                            { value: RETURN_STATUS.REJECTED, label: 'Rechazada' },
                            { value: RETURN_STATUS.COMPLETED, label: 'Completada' },
                        ]}
                        fullWidth
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Fecha Inicio"
                            type="date"
                            name="fechaInicio"
                            value={tempFilters.fechaInicio}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                        <Input
                            label="Fecha Fin"
                            type="date"
                            name="fechaFin"
                            value={tempFilters.fechaFin}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={handleClearFilters}
                            className="flex-1"
                        >
                            Limpiar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleApplyFilters}
                            className="flex-1"
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReturnList;
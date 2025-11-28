// src/pages/seller/MySales.jsx
import { useState, useEffect } from 'react';
import {
    FileText,
    Eye,
    Printer,
    XCircle,
    Search,
    Filter,
    Calendar,
    DollarSign,
    User,
    CreditCard,
    Download,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Modal from '@components/ui/Modal';
import Badge from '@components/ui/Badge';
import BaseTable from '@components/tables/BaseTable';
import { useAuth } from '@context/AuthContext';
import VentaService from '@services/VentaService';
import { formatCurrency, formatDateTime, formatDate } from '@utils/formatters';
import { SALE_STATUS, PAYMENT_METHODS } from '@utils/constants';

const MySales = () => {
    const { user } = useAuth();

    // Estados de filtros
    const [filters, setFilters] = useState({
        codigoVenta: '',
        estado: '',
        metodoPago: '',
        fechaInicio: '',
        fechaFin: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    // Estados de datos
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    // Estados de estadísticas
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalMonto: 0,
        ventasHoy: 0,
        montoHoy: 0,
    });

    // ==================== EFECTOS ====================

    useEffect(() => {
        loadStatistics();
    }, []);

    // ==================== CARGA DE DATOS ====================

    const fetchSales = async (page = 0, size = 20, sort = 'fechaCreacion,desc', searchQuery = '') => {
        setIsLoading(true);
        try {
            // Construir filtros para el backend
            const searchFilters = {
                idUsuario: user.id, // Solo mis ventas
                codigoVenta: filters.codigoVenta || undefined,
                estado: filters.estado || undefined,
                idMetodoPago: filters.metodoPago || undefined,
                fechaInicio: filters.fechaInicio || undefined,
                fechaFin: filters.fechaFin || undefined,
            };

            const response = await VentaService.buscar(searchFilters, page, size);
            return response;
        } catch (error) {
            console.error('Error cargando ventas:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            const response = await VentaService.getStatistics(
                startOfDay.toISOString(),
                endOfDay.toISOString()
            );

            console.log('Respuesta de estadísticas:', response);

            if (Array.isArray(response)) {
                const myStats = response.filter(stat => stat.idUsuario === user.id)[0] || {
                    totalVentas: 0,
                    totalMonto: 0,
                };
                setStats({
                    ...stats,
                    ventasHoy: myStats.totalVentas,
                    montoHoy: myStats.totalMonto,
                });
            } else if (response && typeof response === 'object') {
                setStats({
                    totalVentas: response.totalVentas || 0,
                    totalMonto: response.totalMonto || 0,
                    ventasHoy: response.ventasHoy || response.totalVentas || 0,
                    montoHoy: response.montoHoy || response.totalMonto || 0,
                });
            } else {
                setStats({
                    totalVentas: 0,
                    totalMonto: 0,
                    ventasHoy: 0,
                    montoHoy: 0,
                });
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setStats({
                totalVentas: 0,
                totalMonto: 0,
                ventasHoy: 0,
                montoHoy: 0,
            });
        }
    };

    // ==================== MANEJO DE FILTROS ====================

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            codigoVenta: '',
            estado: '',
            metodoPago: '',
            fechaInicio: '',
            fechaFin: '',
        });
    };

    const hasActiveFilters = () => {
        return Object.values(filters).some((value) => value !== '');
    };

    // ==================== ACCIONES DE VENTA ====================

    const viewSaleDetail = async (sale) => {
        try {
            const fullSale = await VentaService.getById(sale.id);
            setSelectedSale(fullSale);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error cargando detalle de venta:', error);
            alert('Error al cargar el detalle de la venta');
        }
    };

    const openCancelModal = async (sale) => {
        try {
            const canCancel = await VentaService.puedeAnularse(sale.id);
            if (!canCancel) {
                alert('Esta venta no puede ser anulada (han pasado más de 24 horas)');
                return;
            }
            setSelectedSale(sale);
            setShowCancelModal(true);
        } catch (error) {
            console.error('Error verificando si se puede anular:', error);
            alert('Error al verificar si la venta puede ser anulada');
        }
    };

    const cancelSale = async () => {
        if (!cancelReason.trim()) {
            alert('Debe proporcionar un motivo de anulación');
            return;
        }

        try {
            setIsCancelling(true);
            await VentaService.anular(selectedSale.id, cancelReason);
            alert('Venta anulada exitosamente');
            setShowCancelModal(false);
            setCancelReason('');
            // Recargar datos
            window.location.reload();
        } catch (error) {
            console.error('Error anulando venta:', error);
            alert(error.message || 'Error al anular la venta');
        } finally {
            setIsCancelling(false);
        }
    };

    const printReceipt = (sale) => {
        // Aquí iría la lógica de impresión
        alert(`Imprimir comprobante de venta ${sale.codigoVenta}`);
    };

    const exportSales = async () => {
        try {
            alert('Exportando ventas a Excel...');
            // Aquí iría la lógica de exportación
        } catch (error) {
            console.error('Error exportando ventas:', error);
            alert('Error al exportar ventas');
        }
    };

    // ==================== CONFIGURACIÓN DE TABLA ====================

    const columns = [
        {
            key: 'codigoVenta',
            label: 'Código',
            sortable: true,
            render: (value) => (
                <span className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
                    {value}
                </span>
            ),
        },
        {
            key: 'fechaCreacion',
            label: 'Fecha',
            sortable: true,
            render: (value) => (
                <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-dark-text">
                        {formatDate(value)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        {new Date(value).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            ),
        },
        {
            key: 'cliente',
            label: 'Cliente',
            sortable: false,
            render: (value, row) => (
                <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-dark-text">
                        {row.nombreCliente || 'Cliente General'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        {row.documentoCliente || '-'}
                    </p>
                </div>
            ),
        },
        {
            key: 'nombreMetodoPago',
            label: 'Método Pago',
            sortable: true,
            render: (value) => {
                const methodMap = {
                    'EFECTIVO': { icon: DollarSign, color: 'success' },
                    'TARJETA CREDITO': { icon: CreditCard, color: 'info' },
                    'TARJETA DEBITO': { icon: CreditCard, color: 'primary' },
                    'YAPE': { icon: DollarSign, color: 'warning' },
                    'PLIN': { icon: DollarSign, color: 'warning' },
                    'TRANSFERENCIA': { icon: CreditCard, color: 'info' },
                };
                const method = methodMap[value] || { icon: DollarSign, color: 'default' };
                const Icon = method.icon;

                return (
                    <Badge variant={method.color} size="sm">
                        <Icon className="w-3 h-3 mr-1" />
                        {value}
                    </Badge>
                );
            },
        },
        {
            key: 'total',
            label: 'Total',
            sortable: true,
            render: (value) => (
                <span className="font-semibold text-lg text-gray-900 dark:text-dark-text">
                    {formatCurrency(value)}
                </span>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
            render: (value) => {
                const statusMap = {
                    PAGADO: { icon: CheckCircle, variant: 'success', label: 'Pagado' },
                    ANULADO: { icon: XCircle, variant: 'danger', label: 'Anulado' },
                    PENDIENTE: { icon: AlertCircle, variant: 'warning', label: 'Pendiente' },
                };
                const status = statusMap[value] || statusMap.PENDIENTE;
                const Icon = status.icon;

                return (
                    <Badge variant={status.variant} size="sm">
                        <Icon className="w-3 h-3 mr-1" />
                        {status.label}
                    </Badge>
                );
            },
        },
    ];

    const actions = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: 'Ver Detalle',
            onClick: viewSaleDetail,
        },
        {
            icon: <Printer className="w-4 h-4" />,
            label: 'Imprimir',
            onClick: printReceipt,
        },
        {
            icon: <XCircle className="w-4 h-4" />,
            label: 'Anular',
            onClick: openCancelModal,
            variant: 'danger',
        },
    ];

    // ==================== RENDER ====================

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                Ventas Hoy
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                {stats.ventasHoy}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                Total Hoy
                            </p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(stats.montoHoy)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                Total Ventas
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                {stats.totalVentas}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-dark-muted">
                                Monto Total
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                {formatCurrency(stats.totalMonto)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-dark-text flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtros
                        {hasActiveFilters() && (
                            <Badge variant="primary" size="sm">
                                {Object.values(filters).filter((v) => v).length}
                            </Badge>
                        )}
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        rightIcon={
                            showFilters ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )
                        }
                    >
                        {showFilters ? 'Ocultar' : 'Mostrar'}
                    </Button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <Input
                            placeholder="Código de venta..."
                            value={filters.codigoVenta}
                            onChange={(e) => handleFilterChange('codigoVenta', e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />

                        <Select
                            placeholder="Estado"
                            value={filters.estado}
                            onChange={(value) => handleFilterChange('estado', value)}
                            options={[
                                { value: '', label: 'Todos los estados' },
                                ...Object.entries(SALE_STATUS).map(([, value]) => ({
                                    value,
                                    label: value,
                                })),
                            ]}
                        />

                        <Select
                            placeholder="Método de Pago"
                            value={filters.metodoPago}
                            onChange={(value) => handleFilterChange('metodoPago', value)}
                            options={[
                                { value: '', label: 'Todos los métodos' },
                                ...Object.entries(PAYMENT_METHODS).map(([, value]) => ({
                                    value,
                                    label: value.replace(/_/g, ' '),
                                })),
                            ]}
                        />

                        <Input
                            type="date"
                            placeholder="Fecha Inicio"
                            value={filters.fechaInicio}
                            onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                            leftIcon={<Calendar className="w-4 h-4" />}
                        />

                        <Input
                            type="date"
                            placeholder="Fecha Fin"
                            value={filters.fechaFin}
                            onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                            leftIcon={<Calendar className="w-4 h-4" />}
                        />

                        <div className="md:col-span-3 lg:col-span-5 flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={clearFilters}
                                disabled={!hasActiveFilters()}
                            >
                                Limpiar Filtros
                            </Button>
                            <Button
                                variant="outline"
                                onClick={exportSales}
                                leftIcon={<Download className="w-4 h-4" />}
                            >
                                Exportar
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla de ventas */}
            <BaseTable
                columns={columns}
                fetchData={fetchSales}
                actions={actions}
                searchable={false}
                emptyMessage="No se encontraron ventas"
            />

            {/* MODAL: Detalle de Venta */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Detalle de Venta"
                size="lg"
            >
                {selectedSale && (
                    <div className="space-y-4">
                        {/* Información general */}
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-dark-border">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">
                                    Código de Venta
                                </p>
                                <p className="font-mono font-semibold text-gray-900 dark:text-dark-text">
                                    {selectedSale.codigoVenta}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">Fecha</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {formatDateTime(selectedSale.fechaCreacion)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">Cliente</p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {selectedSale.nombreCliente}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">
                                    {selectedSale.documentoCliente}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">
                                    Método de Pago
                                </p>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {selectedSale.metodoPago?.replace(/_/g, ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Productos */}
                        <div>
                            <h4 className="font-semibold mb-3 text-gray-900 dark:text-dark-text">
                                Productos
                            </h4>
                            <div className="space-y-2">
                                {selectedSale.detalles?.map((detalle, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 dark:bg-dark-hover rounded-lg p-3 flex justify-between items-center"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-dark-text">
                                                {detalle.nombreProducto}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                {detalle.cantidad} x {formatCurrency(detalle.precioUnitario)}
                                                {detalle.descuento > 0 && (
                                                    <span className="text-red-600 dark:text-red-400 ml-2">
                                                        (-{detalle.descuento}%)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-dark-text">
                                            {formatCurrency(detalle.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="border-t border-gray-200 dark:border-dark-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-dark-muted">Subtotal:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-text">
                                    {formatCurrency(selectedSale.subtotal)}
                                </span>
                            </div>
                            {selectedSale.descuentoTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-dark-muted">
                                        Descuento:
                                    </span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        -{formatCurrency(selectedSale.descuentoTotal)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-dark-border">
                                <span className="text-gray-900 dark:text-dark-text">TOTAL:</span>
                                <span className="text-primary-600 dark:text-primary-400">
                                    {formatCurrency(selectedSale.total)}
                                </span>
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center justify-center pt-4">
                            <Badge
                                variant={
                                    selectedSale.estado === 'PAGADO'
                                        ? 'success'
                                        : selectedSale.estado === 'ANULADO'
                                            ? 'danger'
                                            : 'warning'
                                }
                                size="lg"
                            >
                                {selectedSale.estado}
                            </Badge>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => printReceipt(selectedSale)}
                                leftIcon={<Printer className="w-4 h-4" />}
                            >
                                Imprimir
                            </Button>
                            <Button variant="secondary" fullWidth onClick={() => setShowDetailModal(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* MODAL: Anular Venta */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => !isCancelling && setShowCancelModal(false)}
                title="Anular Venta"
                size="md"
            >
                {selectedSale && (
                    <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-900 dark:text-red-200 mb-1">
                                        ¿Estás seguro de anular esta venta?
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        Esta acción no se puede deshacer. El stock de los productos
                                        será restaurado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-3">
                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">
                                Venta a anular
                            </p>
                            <p className="font-mono font-semibold text-gray-900 dark:text-dark-text">
                                {selectedSale.codigoVenta}
                            </p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-2">
                                {formatCurrency(selectedSale.total)}
                            </p>
                        </div>

                        <Input
                            label="Motivo de Anulación"
                            multiline
                            rows={3}
                            placeholder="Describe el motivo de la anulación..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            required
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setShowCancelModal(false)}
                                disabled={isCancelling}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                fullWidth
                                onClick={cancelSale}
                                disabled={!cancelReason.trim() || isCancelling}
                                loading={isCancelling}
                                leftIcon={<XCircle className="w-4 h-4" />}
                            >
                                {isCancelling ? 'Anulando...' : 'Anular Venta'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MySales;
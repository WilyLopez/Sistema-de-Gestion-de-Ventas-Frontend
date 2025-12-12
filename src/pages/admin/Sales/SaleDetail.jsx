import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Hash, CreditCard, ShoppingBag, Box } from 'lucide-react';
import ventaService from '@services/VentaService';
import { formatCurrency, formatDate } from '@utils/formatters';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Spinner from '@components/ui/Spinner';
import Alert from '@components/alerts/Alert';

const SaleDetail = () => {
    const { id } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSale = async () => {
            try {
                setLoading(true);
                const data = await ventaService.getById(id);
                setSale(data);
            } catch (err) {
                setError('No se pudo cargar la información de la venta. Por favor, intente de nuevo.');
                console.error('Error fetching sale details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSale();
        }
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!sale) {
        return <Alert variant="info">No se encontró la venta.</Alert>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Link to="/admin/ventas" className="flex items-center gap-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    Volver al Historial de Ventas
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-2">
                    Detalle de Venta #{sale.codigoVenta}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <Card.Header>
                            <Card.Title>Productos Vendidos</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="divide-y divide-gray-200 dark:divide-dark-border">
                                {sale.detalles.map((item) => (
                                    <div key={item.idDetalleVenta} className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-hover rounded-lg flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-dark-text">{item.nombreProducto}</p>
                                                <p className="text-sm text-gray-600 dark:text-dark-muted">SKU: {item.codigoProducto}</p>
                                                <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                    {item.cantidad} x {formatCurrency(item.precioUnitario)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg text-gray-900 dark:text-dark-text">{formatCurrency(item.subtotal)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card>
                        <Card.Header>
                            <Card.Title>Información de la Venta</Card.Title>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <InfoItem icon={<Hash className="w-5 h-5" />} label="Código de Venta" value={sale.codigoVenta} />
                            <InfoItem icon={<Calendar className="w-5 h-5" />} label="Fecha" value={formatDate(sale.fechaCreacion)} />
                            <InfoItem icon={<CreditCard className="w-5 h-5" />} label="Método de Pago" value={sale.nombreMetodoPago} />
                             <InfoItem icon={<Box className="w-5 h-5" />} label="Estado" value={<Badge variant={sale.estado === 'COMPLETADA' ? 'success' : 'danger'}>{sale.estado}</Badge>} />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title>Cliente</Card.Title>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <InfoItem icon={<User className="w-5 h-5" />} label="Nombre" value={`${sale.cliente.nombre} ${sale.cliente.apellido}`} />
                            <InfoItem icon={<Hash className="w-5 h-5" />} label="Documento" value={sale.cliente.documento} />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title>Resumen Financiero</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SummaryItem label="Subtotal" value={formatCurrency(sale.subtotal)} />
                            <SummaryItem label="Impuestos (IGV)" value={formatCurrency(sale.igv)} />
                            <SummaryItem label="Total" value={formatCurrency(sale.total)} isTotal />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-gray-500 dark:text-dark-muted mt-0.5">{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-dark-muted">{label}</p>
            <p className="font-semibold text-gray-900 dark:text-dark-text">{value}</p>
        </div>
    </div>
);

const SummaryItem = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center py-2 ${isTotal ? 'text-lg font-bold border-t border-gray-200 dark:border-dark-border mt-2 pt-4' : 'text-sm'}`}>
        <p className={isTotal ? 'text-gray-900 dark:text-dark-text' : 'text-gray-600 dark:text-dark-muted'}>{label}</p>
        <p className={isTotal ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-dark-text'}>{value}</p>
    </div>
);

export default SaleDetail;

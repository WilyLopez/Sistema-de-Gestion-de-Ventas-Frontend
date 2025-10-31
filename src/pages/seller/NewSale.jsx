// src/pages/seller/NewSale.jsx
import { useState, useEffect, useRef } from 'react';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    X,
    User,
    CreditCard,
    DollarSign,
    Save,
    Printer,
    AlertCircle,
    CheckCircle,
    Barcode,
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Modal from '@components/ui/Modal';
import Badge from '@components/ui/Badge';
import Spinner from '@components/ui/Spinner';
import { useAuth } from '@context/AuthContext';
import ProductoService from '@services/ProductoService';
import ClienteService from '@services/ClienteService';
import VentaService from '@services/VentaService';
import { useDebounce } from '@hooks/useDebounce';
import { formatCurrency, formatDateTime } from '@utils/formatters';
import { PAYMENT_METHODS, DOCUMENT_TYPES } from '@utils/constants';

const NewSale = () => {
    const { user } = useAuth();
    const searchInputRef = useRef(null);
    const barcodeInputRef = useRef(null);

    // Estados principales
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeInput, setBarcodeInput] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Estados de búsqueda de productos
    const [products, setProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showProductResults, setShowProductResults] = useState(false);

    // Estados de cliente
    const [selectedClient, setSelectedClient] = useState(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [clientSearchResults, setClientSearchResults] = useState([]);
    const [isSearchingClient, setIsSearchingClient] = useState(false);

    // Estados de cliente rápido
    const [quickClient, setQuickClient] = useState({
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        nombre: '',
        apellido: '',
    });

    // Estados de pago
    const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
    const [amountPaid, setAmountPaid] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tipoComprobante, setTipoComprobante] = useState('BOLETA');

    // Estados de procesamiento
    const [isProcessing, setIsProcessing] = useState(false);
    const [saleCompleted, setSaleCompleted] = useState(false);
    const [lastSaleId, setLastSaleId] = useState(null);

    // ==================== EFECTOS ====================

    // Búsqueda de productos
    useEffect(() => {
        if (debouncedSearch.trim().length >= 2) {
            searchProducts(debouncedSearch);
        } else {
            setProducts([]);
            setShowProductResults(false);
        }
    }, [debouncedSearch]);

    // Auto-focus en búsqueda al cargar
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    // Cerrar resultados al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.product-search-container')) {
                setShowProductResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ==================== BÚSQUEDA DE PRODUCTOS ====================

    const searchProducts = async (query) => {
        try {
            setIsSearching(true);
            const response = await ProductoService.search(query, 0, 10);
            setProducts(response.content || []);
            setShowProductResults(true);
        } catch (error) {
            console.error('Error buscando productos:', error);
            setProducts([]);
        } finally {
            setIsSearching(false);
        }
    };

    const searchProductByCode = async (code) => {
        try {
            const product = await ProductoService.getByCode(code);
            if (product) {
                addToCart(product);
                setBarcodeInput('');
            }
        } catch (error) {
            console.error('Error buscando por código:', error);
            alert('Producto no encontrado con ese código');
        }
    };

    // ==================== MANEJO DEL CARRITO ====================

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.idProducto === product.idProducto);

            if (existingItem) {
                if (existingItem.cantidad >= product.stock) {
                    alert(`Stock insuficiente. Disponible: ${product.stock}`);
                    return prevCart;
                }
                return prevCart.map((item) =>
                    item.idProducto === product.idProducto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                if (product.stock < 1) {
                    alert('Producto sin stock');
                    return prevCart;
                }
                return [
                    ...prevCart,
                    {
                        id: product.idProducto,
                        idProducto: product.idProducto,
                        codigo: product.codigo,
                        nombre: product.nombre,
                        precio: product.precioVenta,
                        cantidad: 1,
                        stock: product.stock,
                        descuento: 0,
                    },
                ];
            }
        });

        setSearchQuery('');
        setShowProductResults(false);
        searchInputRef.current?.focus();
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === productId) {
                    if (newQuantity > item.stock) {
                        alert(`Stock insuficiente. Disponible: ${item.stock}`);
                        return item;
                    }
                    return { ...item, cantidad: newQuantity };
                }
                return item;
            })
        );
    };

    const updateDiscount = (productId, discount) => {
        const discountValue = parseFloat(discount) || 0;
        if (discountValue < 0 || discountValue > 50) {
            alert('El descuento debe estar entre 0% y 50%');
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, descuento: discountValue } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        if (cart.length > 0) {
            if (confirm('¿Estás seguro de limpiar todo el carrito?')) {
                setCart([]);
            }
        }
    };

    // ==================== CÁLCULOS ====================

    const calculateItemTotal = (item) => {
        const subtotal = item.precio * item.cantidad;
        const discount = subtotal * (item.descuento / 100);
        return subtotal - discount;
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0
        );
        const totalDiscount = cart.reduce((sum, item) => {
            const itemSubtotal = item.precio * item.cantidad;
            return sum + itemSubtotal * (item.descuento / 100);
        }, 0);
        const total = subtotal - totalDiscount;

        return { subtotal, totalDiscount, total };
    };

    const { subtotal, totalDiscount, total } = calculateTotals();

    const calculateChange = () => {
        const paid = parseFloat(amountPaid) || 0;
        return Math.max(0, paid - total);
    };

    // ==================== BÚSQUEDA DE CLIENTES ====================

    const searchClients = async (query) => {
        try {
            setIsSearchingClient(true);
            const response = await ClienteService.searchByName(query, 0, 10);
            setClientSearchResults(response.content || []);
        } catch (error) {
            console.error('Error buscando clientes:', error);
            setClientSearchResults([]);
        } finally {
            setIsSearchingClient(false);
        }
    };

    const selectClient = (client) => {
        setSelectedClient(client);
        setShowClientModal(false);
        setClientSearchQuery('');
        setClientSearchResults([]);
    };

    const createQuickClient = async () => {
        try {
            if (!quickClient.numeroDocumento || !quickClient.nombre || !quickClient.apellido) {
                alert('Complete todos los campos obligatorios');
                return;
            }

            const newClient = await ClienteService.create({
                tipoDocumento: quickClient.tipoDocumento.toUpperCase(),
                numeroDocumento: quickClient.numeroDocumento,
                nombre: quickClient.nombre.trim(),
                apellido: quickClient.apellido.trim(),
                estado: true,
            });

            console.log('Cliente creado:', newClient);

            if (!newClient.idCliente && !newClient.id) {
                alert('Error: El cliente no tiene ID asignado');
                return;
            }

            setSelectedClient(newClient);
            setShowClientModal(false);
            setQuickClient({
                tipoDocumento: 'DNI',
                numeroDocumento: '',
                nombre: '',
                apellido: '',
            });
        } catch (error) {
            console.error('Error creando cliente:', error);
            alert(error.message || 'Error al crear cliente');
        }
    };

    // ==================== PROCESAR VENTA ====================

    const openPaymentModal = () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        setAmountPaid(total.toFixed(2));
        setShowPaymentModal(true);
    };

    const processSale = async () => {
        try {
            setIsProcessing(true);

            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }

            if (!selectedClient) {
                alert('Seleccione un cliente');
                return;
            }

            const clienteId = selectedClient.idCliente || selectedClient.id;
            if (!clienteId) {
                alert('Error: El cliente seleccionado no tiene ID válido');
                return;
            }

            const paid = parseFloat(amountPaid) || 0;
            if (paid < total) {
                alert('El monto pagado es insuficiente');
                return;
            }

            const metodoPagoMap = {
                'EFECTIVO': 1,
                'TARJETA_CREDITO': 2,
                'TARJETA_DEBITO': 3,
                'YAPE': 4,
                'PLIN': 5,
                'TRANSFERENCIA': 6
            };

            const detalles = cart.map((item) => {
                const productoId = item.idProducto || item.id;
                if (!productoId) {
                    throw new Error(`El producto "${item.nombre}" no tiene ID válido`);
                }

                return {
                    idProducto: productoId,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio,
                    descuento: item.descuento,
                };
            });

            const ventaData = {
                idCliente: clienteId,
                idUsuario: user.id, // ← CAMBIAR idVendedor por idUsuario
                idMetodoPago: metodoPagoMap[paymentMethod],
                tipoComprobante: tipoComprobante,
                subtotal: subtotal,
                descuentoTotal: totalDiscount,
                total: total,
                detalles: detalles,
                // ELIMINAR: idVendedor: user.id, // ← QUITAR ESTA LÍNEA
            };

            console.log('=== DATOS DE VENTA COMPLETOS ===');
            console.log('Venta Data:', JSON.stringify(ventaData, null, 2));

            const response = await VentaService.create(ventaData);

            setLastSaleId(response.id);
            setSaleCompleted(true);
            setShowPaymentModal(false);

            setTimeout(() => {
                resetSale();
            }, 3000);
        } catch (error) {
            console.error('Error completo procesando venta:', error);
            console.error('Response data:', error.response?.data);
            alert(error.response?.data?.mensaje || error.message || 'Error al procesar la venta');
        } finally {
            setIsProcessing(false);
        }
    };
    const resetSale = () => {
        setCart([]);
        setSelectedClient(null);
        setPaymentMethod('EFECTIVO');
        setAmountPaid('');
        setSaleCompleted(false);
        setLastSaleId(null);
        searchInputRef.current?.focus();
    };

    // ==================== RENDER ====================

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* COLUMNA IZQUIERDA: Búsqueda y Productos */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Búsqueda */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Búsqueda por nombre/código */}
                        <div className="product-search-container relative">
                            <Input
                                ref={searchInputRef}
                                placeholder="Buscar producto por nombre o código..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-5 h-5" />}
                                autoComplete="off"
                            />
                            {showProductResults && (
                                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center">
                                            <Spinner size="sm" />
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-dark-muted">
                                            No se encontraron productos
                                        </div>
                                    ) : (
                                        products.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-dark-border last:border-0 transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                                            {product.nombre}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                            Código: {product.codigo} • Stock: {product.stock}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-primary-600 dark:text-primary-400">
                                                        {formatCurrency(product.precioVenta)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Búsqueda por código de barras */}
                        <div className="flex gap-2">
                            <Input
                                ref={barcodeInputRef}
                                placeholder="Escanear código de barras..."
                                value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && barcodeInput) {
                                        searchProductByCode(barcodeInput);
                                    }
                                }}
                                leftIcon={<Barcode className="w-5 h-5" />}
                            />
                            <Button
                                onClick={() => searchProductByCode(barcodeInput)}
                                disabled={!barcodeInput}
                            >
                                Buscar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Lista de productos en el carrito */}
                <div className="flex-1 bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-dark-text flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Carrito de Compras ({cart.length} productos)
                        </h3>
                        {cart.length > 0 && (
                            <Button variant="danger" size="sm" onClick={clearCart}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-dark-muted">
                                <ShoppingCart className="w-16 h-16 mb-4" />
                                <p className="text-lg">El carrito está vacío</p>
                                <p className="text-sm">Busca y agrega productos para comenzar</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 dark:bg-dark-hover rounded-lg p-3 border border-gray-200 dark:border-dark-border"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-dark-text">
                                                {item.nombre}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                {item.codigo} • {formatCurrency(item.precio)} c/u
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Cantidad */}
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-dark-muted mb-1 block">
                                                Cantidad
                                            </label>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.cantidad - 1)
                                                    }
                                                    className="p-1 rounded bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-border"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={item.stock}
                                                    value={item.cantidad}
                                                    onChange={(e) =>
                                                        updateQuantity(
                                                            item.id,
                                                            parseInt(e.target.value) || 1
                                                        )
                                                    }
                                                    className="w-12 text-center border border-gray-300 dark:border-dark-border rounded px-1 py-1 text-sm dark:bg-dark-card dark:text-dark-text"
                                                />
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.cantidad + 1)
                                                    }
                                                    className="p-1 rounded bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-border"
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
                                                onChange={(e) =>
                                                    updateDiscount(item.id, e.target.value)
                                                }
                                                className="w-full border border-gray-300 dark:border-dark-border rounded px-2 py-1 text-sm dark:bg-dark-card dark:text-dark-text"
                                            />
                                        </div>

                                        {/* Total */}
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-dark-muted mb-1 block">
                                                Total
                                            </label>
                                            <p className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
                                                {formatCurrency(calculateItemTotal(item))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: Resumen y Cliente */}
            <div className="w-96 flex flex-col gap-4">
                {/* Cliente */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-dark-text flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Cliente
                    </h3>
                    {selectedClient ? (
                        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 border border-primary-200 dark:border-primary-800">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {selectedClient.nombre}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                                        {selectedClient.tipoDocumento}: {selectedClient.numeroDocumento}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedClient(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-dark-muted dark:hover:text-dark-text"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setShowClientModal(true)}
                            leftIcon={<User className="w-4 h-4" />}
                        >
                            Seleccionar Cliente
                        </Button>
                    )}
                </div>

                {/* Resumen */}
                <div className="flex-1 bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-dark-text">
                        Resumen de Venta
                    </h3>

                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-dark-muted">Subtotal:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-text">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
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
                        <div className="border-t border-gray-200 dark:border-dark-border pt-3 flex justify-between">
                            <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                                TOTAL:
                            </span>
                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={openPaymentModal}
                        disabled={cart.length === 0 || !selectedClient}
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    >
                        Procesar Venta
                    </Button>
                </div>
            </div>

            {/* MODAL: Seleccionar/Crear Cliente */}
            <Modal
                isOpen={showClientModal}
                onClose={() => setShowClientModal(false)}
                title="Seleccionar Cliente"
                size="lg"
            >
                <div className="space-y-4">
                    {/* Búsqueda de cliente existente */}
                    <div>
                        <h4 className="font-medium mb-2 text-gray-900 dark:text-dark-text">
                            Buscar Cliente Existente
                        </h4>
                        <Input
                            placeholder="Buscar por nombre o documento..."
                            value={clientSearchQuery}
                            onChange={(e) => {
                                setClientSearchQuery(e.target.value);
                                if (e.target.value.length >= 3) {
                                    searchClients(e.target.value);
                                }
                            }}
                            leftIcon={<Search className="w-5 h-5" />}
                        />
                        {isSearchingClient && (
                            <div className="mt-2 text-center">
                                <Spinner size="sm" />
                            </div>
                        )}
                        {clientSearchResults.length > 0 && (
                            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-dark-border rounded-lg">
                                {clientSearchResults.map((client) => (
                                    <button
                                        key={client.id}
                                        onClick={() => selectClient(client)}
                                        className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-dark-border last:border-0"
                                    >
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {client.nombre}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            {client.tipoDocumento}: {client.numeroDocumento}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                        <h4 className="font-medium mb-3 text-gray-900 dark:text-dark-text">
                            O Crear Cliente Rápido
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Tipo Documento"
                                value={quickClient.tipoDocumento}
                                onChange={(value) => setQuickClient({ ...quickClient, tipoDocumento: value })}
                                options={Object.values(DOCUMENT_TYPES).map((doc) => ({
                                    value: doc.code,
                                    label: doc.label,
                                }))}
                            />
                            <Input
                                label="Número Documento"
                                value={quickClient.numeroDocumento}
                                onChange={(e) => setQuickClient({ ...quickClient, numeroDocumento: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <Input
                                label="Nombres"
                                value={quickClient.nombre}
                                onChange={(e) => setQuickClient({ ...quickClient, nombre: e.target.value })}
                                placeholder="Ej: Juan Carlos"
                            />
                            <Input
                                label="Apellidos"
                                value={quickClient.apellido}
                                onChange={(e) => setQuickClient({ ...quickClient, apellido: e.target.value })}
                                placeholder="Ej: Pérez García"
                            />
                        </div>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={createQuickClient}
                            className="mt-3"
                        >
                            Crear y Seleccionar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* MODAL: Pago */}
            <Modal
                isOpen={showPaymentModal}
                onClose={() => !isProcessing && setShowPaymentModal(false)}
                title="Procesar Pago"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">
                            Total a Pagar
                        </p>
                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                            {formatCurrency(total)}
                        </p>
                    </div>

                    <Select
                        label="Tipo de Comprobante"
                        value={tipoComprobante}
                        onChange={(value) => setTipoComprobante(value)}
                        options={[
                            { value: 'BOLETA', label: 'BOLETA' },
                            { value: 'FACTURA', label: 'FACTURA' }
                        ]}
                    />

                    <Select
                        label="Método de Pago"
                        value={paymentMethod}
                        onChange={(value) => setPaymentMethod(value)}
                        options={Object.entries(PAYMENT_METHODS).map(([, value]) => ({
                            value,
                            label: value.replace(/_/g, ' '),
                        }))}
                    />

                    <Input
                        label="Monto Recibido"
                        type="number"
                        step="0.01"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        leftIcon={<DollarSign className="w-5 h-5" />}
                    />

                    {parseFloat(amountPaid) >= total && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-dark-muted">
                                    Cambio:
                                </span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(calculateChange())}
                                </span>
                            </div>
                        </div>
                    )}

                    {parseFloat(amountPaid) < total && amountPaid !== '' && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Monto insuficiente. Faltan {formatCurrency(total - parseFloat(amountPaid))}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setShowPaymentModal(false)}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={processSale}
                            disabled={isProcessing || parseFloat(amountPaid) < total}
                            loading={isProcessing}
                            leftIcon={<Save className="w-4 h-4" />}
                        >
                            {isProcessing ? 'Procesando...' : 'Confirmar Venta'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* MODAL: Venta Completada */}
            <Modal
                isOpen={saleCompleted}
                onClose={() => { }}
                title="¡Venta Completada!"
                size="md"
                closeOnOverlayClick={false}
                showCloseButton={false}
            >
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
                        ¡Venta Exitosa!
                    </h3>
                    <p className="text-gray-600 dark:text-dark-muted mb-4">
                        La venta ha sido registrada correctamente
                    </p>
                    <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">
                            Total Vendido
                        </p>
                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                            {formatCurrency(total)}
                        </p>
                        {calculateChange() > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-dark-border">
                                <p className="text-sm text-gray-600 dark:text-dark-muted">
                                    Cambio: <span className="font-semibold text-green-600 dark:text-green-400">
                                        {formatCurrency(calculateChange())}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                // Aquí iría la lógica de imprimir comprobante
                                alert('Función de impresión en desarrollo');
                            }}
                            leftIcon={<Printer className="w-4 h-4" />}
                        >
                            Imprimir
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={resetSale}
                        >
                            Nueva Venta
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-muted mt-4">
                        Esta ventana se cerrará automáticamente en unos segundos...
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default NewSale;
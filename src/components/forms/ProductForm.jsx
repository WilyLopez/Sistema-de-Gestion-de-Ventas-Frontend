//src/components/forms/ProductForm.jsx
import { useState, useEffect } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { PRODUCT_GENDER, SIZES, MATERIALS, VALIDATION_RULES } from '@utils/constants';
import categoryService from '@services/CategoriaService';
import productService from '@services/ProductoService';

/**
 * Formulario de Producto
 * Crear y editar productos con validaciones
 */
const ProductForm = ({ initialData = null, onSubmit, onCancel, isLoading = false }) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        marca: '',
        talla: '',
        color: '',
        material: '',
        genero: '',
        precioCompra: '',
        precioVenta: '',
        stockActual: '',
        stockMinimo: '',
        descripcion: '',
        imagenUrl: '',
        idCategoria: '',
        idProveedor: '', // ✅ Agregar campo proveedor
        ...initialData,
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [providers, setProviders] = useState([]); // ✅ Estado para proveedores
    const [loadingProviders, setLoadingProviders] = useState(true); // ✅ Loading proveedores
    const [loadingCodigo, setLoadingCodigo] = useState(!isEditMode);

    // Cargar categorías
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoryService.getAll();
                console.log('Respuesta de categorías:', response);

                if (Array.isArray(response)) {
                    setCategories(response);
                } else if (response?.content && Array.isArray(response.content)) {
                    setCategories(response.content);
                } else if (response?.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error('Formato de respuesta inesperado:', response);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error al cargar categorías:', error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    // ✅ Cargar proveedores
    useEffect(() => {
        const loadProviders = async () => {
            try {
                // Importar dinámicamente el servicio
                const providerService = (await import('@services/ProveedorService')).default;
                const response = await providerService.getAll();
                console.log('Respuesta de proveedores:', response);

                if (Array.isArray(response)) {
                    setProviders(response);
                } else if (response?.content && Array.isArray(response.content)) {
                    setProviders(response.content);
                } else if (response?.data && Array.isArray(response.data)) {
                    setProviders(response.data);
                } else {
                    console.error('Formato de respuesta inesperado:', response);
                    setProviders([]);
                }
            } catch (error) {
                console.error('Error al cargar proveedores:', error);
                setProviders([]);
            } finally {
                setLoadingProviders(false);
            }
        };

        loadProviders();
    }, []);

    // ✅ Generar código automáticamente solo en creación
    useEffect(() => {
        const generarCodigo = async () => {
            if (isEditMode) return; // No generar en modo edición

            try {
                setLoadingCodigo(true);

                // Opción 1: Si tu backend tiene endpoint para siguiente código
                const siguienteCodigo = await productService.getNextCode();
                setFormData(prev => ({ ...prev, codigo: siguienteCodigo }));

                // Opción 2 (fallback): Generar localmente si no hay endpoint
                // const ultimoCodigo = await productService.getLastCode();
                // const numero = parseInt(ultimoCodigo.replace('PROD', '')) + 1;
                // const nuevoCodigo = `PROD${String(numero).padStart(3, '0')}`;
                // setFormData(prev => ({ ...prev, codigo: nuevoCodigo }));

            } catch (error) {
                console.error('Error al generar código:', error);
                // Fallback: generar código basado en timestamp
                const timestamp = Date.now().toString().slice(-6);
                setFormData(prev => ({
                    ...prev,
                    codigo: `PROD${timestamp}`
                }));
            } finally {
                setLoadingCodigo(false);
            }
        };

        generarCodigo();
    }, [isEditMode]);

    // Manejar cambios en inputs normales
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar errores
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // ✅ Manejar cambios en Select (recibe valor directamente)
    const handleSelectChange = (name, value) => {
        console.log(`Select ${name} cambió a:`, value);
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar errores
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validar formulario
    const validate = async () => {
        const newErrors = {};

        // ✅ Código ya no necesita validación de existencia (se genera automáticamente)
        if (!formData.codigo.trim()) {
            newErrors.codigo = 'El código es requerido';
        } else if (formData.codigo.length > VALIDATION_RULES.CODIGO_MAX_LENGTH) {
            newErrors.codigo = `Máximo ${VALIDATION_RULES.CODIGO_MAX_LENGTH} caracteres`;
        }

        // Nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            newErrors.nombre = `Máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`;
        }

        // Género
        if (!formData.genero) {
            newErrors.genero = 'Selecciona un género';
        }

        // Precios
        const precioCompra = parseFloat(formData.precioCompra);
        const precioVenta = parseFloat(formData.precioVenta);

        if (!formData.precioCompra || isNaN(precioCompra) || precioCompra < 0) {
            newErrors.precioCompra = 'Ingresa un precio de compra válido';
        }

        if (!formData.precioVenta || isNaN(precioVenta) || precioVenta < 0) {
            newErrors.precioVenta = 'Ingresa un precio de venta válido';
        }

        if (precioVenta < precioCompra) {
            newErrors.precioVenta = 'El precio de venta debe ser mayor o igual al de compra';
        }

        // Stock
        const stockActual = parseInt(formData.stockActual);
        const stockMinimo = parseInt(formData.stockMinimo);

        if (!formData.stockActual || isNaN(stockActual) || stockActual < 0) {
            newErrors.stockActual = 'Ingresa un stock válido';
        }

        if (!formData.stockMinimo || isNaN(stockMinimo) || stockMinimo < 0) {
            newErrors.stockMinimo = 'Ingresa un stock mínimo válido';
        }

        // Categoría
        if (!formData.idCategoria) {
            newErrors.idCategoria = 'Selecciona una categoría';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validate();
        if (!isValid) return;

        // ✅ Preparar datos - mapear stockActual a stock para el backend
        const productData = {
            codigo: formData.codigo.trim(),
            nombre: formData.nombre.trim(),
            marca: formData.marca?.trim() || null,
            talla: formData.talla || null,
            color: formData.color?.trim() || null,
            material: formData.material || null,
            genero: formData.genero,
            precioCompra: parseFloat(formData.precioCompra),
            precioVenta: parseFloat(formData.precioVenta),
            stock: parseInt(formData.stockActual),           // ✅ stockActual -> stock
            stockMinimo: parseInt(formData.stockMinimo),
            descripcion: formData.descripcion?.trim() || null,
            imagenUrl: formData.imagenUrl?.trim() || null,
            idCategoria: parseInt(formData.idCategoria),
            idProveedor: formData.idProveedor ? parseInt(formData.idProveedor) : null, // ✅ Opcional
        };

        console.log('Datos preparados para enviar:', productData);
        onSubmit && onSubmit(productData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Código - Generado automáticamente */}
                <div className="relative">
                    <Input
                        label="Código del Producto"
                        type="text"
                        name="codigo"
                        placeholder="Generando código..."
                        value={formData.codigo}
                        onChange={handleChange}
                        error={errors.codigo}
                        required
                        disabled={true}
                        fullWidth
                    />
                    {loadingCodigo && (
                        <div className="absolute right-3 top-9">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        </div>
                    )}
                    {!isEditMode && !loadingCodigo && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                            ✓ Código generado automáticamente
                        </p>
                    )}
                </div>

                {/* Nombre */}
                <Input
                    label="Nombre"
                    type="text"
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                    required
                    disabled={isLoading}
                    fullWidth
                />

                {/* Marca */}
                <Input
                    label="Marca"
                    type="text"
                    name="marca"
                    placeholder="Marca (opcional)"
                    value={formData.marca}
                    onChange={handleChange}
                    disabled={isLoading}
                    fullWidth
                />

                {/* Talla */}
                <Select
                    label="Talla"
                    value={formData.talla}
                    onChange={(value) => handleSelectChange('talla', value)}
                    options={SIZES.map(size => ({ value: size, label: size }))}
                    disabled={isLoading}
                    placeholder="Seleccionar talla (opcional)"
                    fullWidth
                />

                {/* Color */}
                <Input
                    label="Color"
                    type="text"
                    name="color"
                    placeholder="Color (opcional)"
                    value={formData.color}
                    onChange={handleChange}
                    disabled={isLoading}
                    fullWidth
                />

                {/* Material */}
                <Select
                    label="Material"
                    value={formData.material}
                    onChange={(value) => handleSelectChange('material', value)}
                    options={MATERIALS.map(mat => ({ value: mat, label: mat }))}
                    disabled={isLoading}
                    placeholder="Seleccionar material (opcional)"
                    fullWidth
                />

                {/* Género */}
                <Select
                    label="Género"
                    value={formData.genero}
                    onChange={(value) => handleSelectChange('genero', value)}
                    error={errors.genero}
                    options={Object.entries(PRODUCT_GENDER).map(([, value]) => ({
                        value,
                        label: value,
                    }))}
                    required
                    disabled={isLoading}
                    placeholder="Seleccionar género"
                    fullWidth
                />

                {/* Categoría */}
                <Select
                    label="Categoría"
                    value={formData.idCategoria}
                    onChange={(value) => handleSelectChange('idCategoria', value)}
                    error={errors.idCategoria}
                    options={categories.map(cat => ({
                        value: cat.idCategoria || cat.id,
                        label: cat.nombre,
                    }))}
                    required
                    disabled={isLoading || loadingCategories}
                    placeholder={loadingCategories ? 'Cargando...' : 'Seleccionar categoría'}
                    fullWidth
                />

                {/* ✅ Proveedor (Opcional) */}
                <Select
                    label="Proveedor"
                    value={formData.idProveedor}
                    onChange={(value) => handleSelectChange('idProveedor', value)}
                    options={providers.map(prov => ({
                        value: prov.idProveedor || prov.id,
                        label: prov.razonSocial || prov.nombre,
                    }))}
                    disabled={isLoading || loadingProviders}
                    placeholder={loadingProviders ? 'Cargando...' : 'Seleccionar proveedor'}
                    fullWidth
                />

                {/* Precio Compra */}
                <Input
                    label="Precio de Compra"
                    type="number"
                    name="precioCompra"
                    placeholder="0.00"
                    value={formData.precioCompra}
                    onChange={handleChange}
                    error={errors.precioCompra}
                    required
                    disabled={isLoading}
                    fullWidth
                    step="0.01"
                    min="0"
                />

                {/* Precio Venta */}
                <Input
                    label="Precio de Venta"
                    type="number"
                    name="precioVenta"
                    placeholder="0.00"
                    value={formData.precioVenta}
                    onChange={handleChange}
                    error={errors.precioVenta}
                    required
                    disabled={isLoading}
                    fullWidth
                    step="0.01"
                    min="0"
                />

                {/* Stock Actual */}
                <Input
                    label="Stock Actual"
                    type="number"
                    name="stockActual"
                    placeholder="0"
                    value={formData.stockActual}
                    onChange={handleChange}
                    error={errors.stockActual}
                    required
                    disabled={isLoading}
                    fullWidth
                    min="0"
                />

                {/* Stock Mínimo */}
                <Input
                    label="Stock Mínimo"
                    type="number"
                    name="stockMinimo"
                    placeholder="0"
                    value={formData.stockMinimo}
                    onChange={handleChange}
                    error={errors.stockMinimo}
                    required
                    disabled={isLoading}
                    fullWidth
                    min="0"
                />
            </div>

            {/* Descripción - full width */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Descripción
                </label>
                <textarea
                    name="descripcion"
                    placeholder="Descripción del producto (opcional)"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={4}
                    maxLength={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH}
                    className="block w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                    {formData.descripcion?.length || 0}/{VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres
                </p>
            </div>

            {/* URL Imagen */}
            <Input
                label="URL de Imagen"
                type="url"
                name="imagenUrl"
                placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                value={formData.imagenUrl}
                onChange={handleChange}
                disabled={isLoading}
                fullWidth
            />

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading || loadingCategories}
                    className="flex-1"
                >
                    {isLoading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
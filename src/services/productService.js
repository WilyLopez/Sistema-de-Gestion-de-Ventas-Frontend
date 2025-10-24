import {
    get,
    post,
    put,
    del,
    patch,
    paginated,
    search,
} from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

// Servicio de gestión de productos
const productService = {
    /**
     * Crear nuevo producto
     * @param {Object} productData - Datos del producto
     * @param {string} productData.codigo - Código único (max 50)
     * @param {string} productData.nombre - Nombre (max 100)
     * @param {string} [productData.marca] - Marca (max 50)
     * @param {string} [productData.talla] - Talla (max 10)
     * @param {string} [productData.color] - Color (max 30)
     * @param {string} [productData.material] - Material (max 50)
     * @param {string} productData.genero - Género: HOMBRE, MUJER, UNISEX, NINO, NINA
     * @param {number} productData.precioCompra - Precio de compra (min 0)
     * @param {number} productData.precioVenta - Precio de venta (min 0, >= precioCompra)
     * @param {number} productData.stock - Stock inicial (min 0)
     * @param {number} productData.stockMinimo - Stock mínimo (min 0)
     * @param {string} [productData.descripcion] - Descripción
     * @param {string} [productData.imagenUrl] - URL de imagen (max 255)
     * @param {number} productData.idCategoria - ID de categoría
     * @param {number} [productData.idProveedor] - ID de proveedor
     * @returns {Promise<Object>} Producto creado
     */
    create: async (productData) => {
        const response = await post(ENDPOINTS.PRODUCTS.BASE, productData);
        return response;
    },

    /**
     * Actualizar producto existente
     * Permite actualización parcial de campos (no incluye stock directo)
     * @param {number} id - ID del producto
     * @param {Object} productData - Datos a actualizar (todos opcionales)
     * @returns {Promise<Object>} Producto actualizado
     */
    update: async (id, productData) => {
        const response = await put(ENDPOINTS.PRODUCTS.BY_ID(id), productData);
        return response;
    },

    /**
     * Eliminar producto (soft delete) (solo Admin)
     * @param {number} id - ID del producto
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await del(ENDPOINTS.PRODUCTS.BY_ID(id));
    },

    /**
     * Obtener producto por ID
     * @param {number} id - ID del producto
     * @returns {Promise<Object>} Producto encontrado
     */
    getById: async (id) => {
        const response = await get(ENDPOINTS.PRODUCTS.BY_ID(id));
        return response;
    },

    /**
     * Obtener producto por código único
     * @param {string} code - Código del producto (SKU)
     * @returns {Promise<Object>} Producto encontrado
     */
    getByCode: async (code) => {
        const response = await get(ENDPOINTS.PRODUCTS.BY_CODE(code));
        return response;
    },

    /**
     * Listar todos los productos con paginación
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @param {string} [sort] - Campo de ordenamiento (ej: 'nombre,asc')
     * @returns {Promise<Object>} Página de productos
     */
    getAll: async (page = 0, size = 20, sort) => {
        const params = {};
        if (sort) params.sort = sort;

        const response = await paginated(
            ENDPOINTS.PRODUCTS.BASE,
            page,
            size,
            params
        );
        return response;
    },

    /**
     * Buscar productos por texto
     * Busca en nombre, código y descripción
     * @param {string} texto - Texto a buscar
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de productos encontrados
     */
    search: async (texto, page = 0, size = 20) => {
        const response = await search(
            ENDPOINTS.PRODUCTS.SEARCH,
            { texto },
            {
                params: { page, size },
            }
        );
        return response;
    },

    /**
     * Filtrar productos por categoría
     * @param {number} idCategoria - ID de la categoría
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de productos de la categoría
     */
    getByCategory: async (idCategoria, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PRODUCTS.BY_CATEGORY(idCategoria),
            page,
            size
        );
        return response;
    },

    /**
     * Filtrar productos por género
     * @param {string} genero - Género: HOMBRE, MUJER, UNISEX, NINO, NINA
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de productos del género
     */
    getByGender: async (genero, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PRODUCTS.BY_GENDER,
            page,
            size,
            { genero }
        );
        return response;
    },

    /**
     * Filtrar productos por marca
     * @param {string} marca - Marca del producto
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de productos de la marca
     */
    getByBrand: async (marca, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PRODUCTS.BY_BRAND,
            page,
            size,
            { marca }
        );
        return response;
    },

    /**
     * Filtrar productos por rango de precio
     * @param {number} precioMin - Precio mínimo
     * @param {number} precioMax - Precio máximo
     * @param {number} [page=0] - Número de página
     * @param {number} [size=20] - Tamaño de página
     * @returns {Promise<Object>} Página de productos en el rango
     */
    getByPriceRange: async (precioMin, precioMax, page = 0, size = 20) => {
        const response = await search(
            ENDPOINTS.PRODUCTS.BY_PRICE_RANGE,
            { precioMin, precioMax },
            { params: { page, size } }
        );
        return response;
    },

    /**
     * Obtener productos con stock bajo
     * Lista productos con stock <= stock mínimo
     * @returns {Promise<Array>} Lista de productos con stock bajo
     */
    getLowStock: async () => {
        const response = await get(ENDPOINTS.PRODUCTS.STOCK_LOW);
        return response;
    },

    /**
     * Obtener productos agotados
     * Lista productos con stock = 0
     * @returns {Promise<Array>} Lista de productos agotados
     */
    getOutOfStock: async () => {
        const response = await get(ENDPOINTS.PRODUCTS.STOCK_OUT);
        return response;
    },

    /**
     * Actualizar stock de producto manualmente (solo Admin)
     * Registra movimiento de inventario
     * @param {number} id - ID del producto
     * @param {number} cantidad - Cantidad a ajustar
     * @param {string} tipoMovimiento - ENTRADA, SALIDA, AJUSTE, DEVOLUCION
     * @param {string} motivo - Motivo del ajuste (5-200 caracteres)
     * @returns {Promise<Object>} Producto con stock actualizado
     */
    updateStock: async (id, cantidad, tipoMovimiento, motivo) => {
        const response = await patch(ENDPOINTS.PRODUCTS.UPDATE_STOCK(id), {
            cantidad,
            tipoMovimiento,
            motivo,
        });
        return response;
    },

    /**
     * Verificar disponibilidad de stock
     * @param {number} id - ID del producto
     * @param {number} cantidad - Cantidad requerida
     * @returns {Promise<Object>} { disponible: boolean, stockActual: number, cantidadSolicitada: number }
     */
    checkStock: async (id, cantidad) => {
        const response = await get(
            `${ENDPOINTS.PRODUCTS.BY_ID(id)}/verificar-stock`,
            {
                params: { cantidad },
            }
        );
        return response;
    },

    /**
     * Calcular margen de ganancia de producto
     * @param {number} id - ID del producto
     * @returns {Promise<Object>} { idProducto: number, margenGanancia: number, porcentaje: string }
     */
    getMargin: async (id) => {
        const response = await get(ENDPOINTS.PRODUCTS.MARGIN(id));
        return response;
    },

    /**
     * Verificar si existe un código de producto
     * @param {string} code - Código a verificar
     * @returns {Promise<boolean>} true si existe
     */
    existsCode: async (code) => {
        try {
            await get(ENDPOINTS.PRODUCTS.BY_CODE(code));
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    },
};

export default productService;

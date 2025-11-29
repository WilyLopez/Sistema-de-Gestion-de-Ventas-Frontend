//src/services/ProductoService.js
import { get, post, put, del, patch, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const productService = {
    create: async (productData) => {
        const response = await post(ENDPOINTS.PRODUCTOS.BASE, productData);
        return response;
    },

    update: async (id, productData) => {
        const response = await put(ENDPOINTS.PRODUCTOS.BY_ID(id), productData);
        return response;
    },

    delete: async (id) => {
        await del(ENDPOINTS.PRODUCTOS.BY_ID(id));
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.PRODUCTOS.BY_ID(id));
        return response;
    },

    getByCode: async (code) => {
        const response = await get(ENDPOINTS.PRODUCTOS.BY_CODIGO(code));
        return response;
    },

    getAll: async (page = 0, size = 20, sort, search = "") => {
        const params = { page, size };

        if (sort) params.sort = sort;
        if (search.trim()) params.search = search;
        
        const response = await paginated(
            ENDPOINTS.PRODUCTOS.BASE,
            page,
            size,
            params
        );
        return response;
    },

    search: async (filters = {}, page = 0, size = 20) => {
        const params = {
            ...filters,
            page,
            size,
        };
        const response = await get(ENDPOINTS.PRODUCTOS.BUSCAR, { params });
        return response;
    },

    getByCategory: async (idCategoria, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PRODUCTOS.BY_CATEGORIA(idCategoria),
            page,
            size
        );
        return response;
    },

    getByGender: async (genero, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PRODUCTOS.BY_GENERO(genero),
            page,
            size
        );
        return response;
    },

    getByBrand: async (marca, page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.PRODUCTOS.BY_MARCA(marca),
            page,
            size
        );
        return response;
    },

    getByPriceRange: async (precioMin, precioMax, page = 0, size = 20) => {
        const response = await get(ENDPOINTS.PRODUCTOS.BY_RANGO_PRECIO, {
            params: { precioMin, precioMax, page, size },
        });
        return response;
    },

    getLowStock: async () => {
        const response = await get(ENDPOINTS.PRODUCTOS.STOCK_BAJO);
        return response;
    },

    getOutOfStock: async () => {
        const response = await get(ENDPOINTS.PRODUCTOS.AGOTADOS);
        return response;
    },

    updateStock: async (id, cantidad, tipoMovimiento, motivo) => {
        const response = await patch(ENDPOINTS.PRODUCTOS.ACTUALIZAR_STOCK(id), {
            cantidad,
            tipoMovimiento,
            motivo,
        });
        return response;
    },

    checkStock: async (id, cantidad) => {
        const response = await get(ENDPOINTS.PRODUCTOS.VERIFICAR_STOCK(id), {
            params: { cantidad },
        });
        return response;
    },

    getMargin: async (id) => {
        const response = await get(ENDPOINTS.PRODUCTOS.MARGEN_GANANCIA(id));
        return response;
    },

    existsCode: async (code) => {
        try {
            await productService.getByCode(code);
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    },

    /**
     * Obtiene el siguiente código disponible para un producto
     * @returns {Promise<string>} Código generado (ej: "PROD002")
     */
    getNextCode: async () => {
        try {
            // Intenta obtener todos los productos y calcular el siguiente
            const response = await get(ENDPOINTS.PRODUCTOS.BASE, {
                params: { page: 0, size: 1, sort: "codigo,desc" },
            });

            // Si hay productos, extrae el último código
            if (response?.content && response.content.length > 0) {
                const ultimoCodigo = response.content[0].codigo;

                // Extrae el número del código (ej: "PROD001" -> 1)
                const numero = parseInt(ultimoCodigo.replace(/\D/g, ""));

                // Incrementa y formatea
                const nuevoNumero = numero + 1;
                return `PROD${String(nuevoNumero).padStart(3, "0")}`;
            }

            // Si no hay productos, empezar desde PROD001
            return "PROD001";
        } catch (error) {
            console.error("Error al obtener siguiente código:", error);

            // Fallback: Generar código basado en timestamp
            const timestamp = Date.now().toString().slice(-6);
            return `PROD${timestamp}`;
        }
    },

    getGeneroClass: (genero) => {
        const classMap = {
            HOMBRE: "badge-primary",
            MUJER: "badge-pink",
            UNISEX: "badge-purple",
            NINO: "badge-info",
            NINA: "badge-warning",
        };
        return classMap[genero] || "badge-secondary";
    },

    getGeneroIcon: (genero) => {
        const iconMap = {
            HOMBRE: "user",
            MUJER: "user",
            UNISEX: "users",
            NINO: "user",
            NINA: "user",
        };
        return iconMap[genero] || "package";
    },

    formatPrice: (price) => {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
        }).format(price);
    },
};

export default productService;

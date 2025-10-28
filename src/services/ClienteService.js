import { get, post, put, del, paginated } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

const clienteService = {
    create: async (clienteData) => {
        // Procesar los datos antes de enviarlos
        const processedData = {
            ...clienteData,
            tipoDocumento: clienteData.tipoDocumento?.toUpperCase() // Convertir a mayúsculas
        };

        console.log('=== CLIENTE SERVICE CREATE ===');
        console.log('Datos originales:', clienteData);
        console.log('Datos procesados:', processedData);

        const response = await post(ENDPOINTS.CLIENTES.BASE, processedData);
        return response;
    },

    update: async (id, clienteData) => {
        // También procesar datos en update por si acaso
        const processedData = {
            ...clienteData,
            tipoDocumento: clienteData.tipoDocumento?.toUpperCase()
        };

        const response = await put(ENDPOINTS.CLIENTES.BY_ID(id), processedData);
        return response;
    },

    delete: async (id) => {
        await del(ENDPOINTS.CLIENTES.BY_ID(id));
    },

    getById: async (id) => {
        const response = await get(ENDPOINTS.CLIENTES.BY_ID(id));
        return response;
    },

    getByDocumento: async (tipo, numero) => {
        // Procesar tipo para métodos que usan parámetros
        const processedTipo = tipo?.toUpperCase();
        
        const response = await get(ENDPOINTS.CLIENTES.BY_DOCUMENTO, {
            params: { tipo: processedTipo, numero },
        });
        return response;
    },

    getAll: async (page = 0, size = 20) => {
        const response = await paginated(ENDPOINTS.CLIENTES.BASE, page, size);
        return response;
    },

    getActive: async (page = 0, size = 20) => {
        const response = await paginated(
            ENDPOINTS.CLIENTES.ACTIVOS,
            page,
            size
        );
        return response;
    },

    searchByName: async (nombre, page = 0, size = 20) => {
        const response = await get(ENDPOINTS.CLIENTES.BUSCAR, {
            params: { nombre, page, size },
        });
        return response;
    },

    validateDocumento: async (tipo, numero) => {
        // Procesar tipo para validación
        const processedTipo = tipo?.toUpperCase();
        
        const response = await get(ENDPOINTS.CLIENTES.VALIDAR_DOCUMENTO, {
            params: { tipo: processedTipo, numero },
        });
        return response;
    },

    existsDocumento: async (tipo, numero) => {
        try {
            // Procesar tipo para verificación de existencia
            const processedTipo = tipo?.toUpperCase();
            
            const response = await get(ENDPOINTS.CLIENTES.EXISTE_DOCUMENTO, {
                params: { tipo: processedTipo, numero },
            });
            return response.existe;
        } catch (error) {
            console.warn("Error checking document existence:", error);
            return false;
        }
    },

    existsCorreo: async (correo) => {
        try {
            const response = await get(ENDPOINTS.CLIENTES.EXISTE_CORREO, {
                params: { correo },
            });
            return response.existe;
        } catch (error) {
            console.warn("Error checking email existence:", error);
            return false;
        }
    },

    getStatistics: async () => {
        const response = await get(ENDPOINTS.CLIENTES.ESTADISTICAS);
        return response;
    },

    validateDNI: (dni) => {
        if (!dni || typeof dni !== "string") return false;
        return /^\d{8}$/.test(dni);
    },

    validateRUC: (ruc) => {
        if (!ruc || typeof ruc !== "string") return false;
        return /^(10|15|17|20)\d{9}$/.test(ruc);
    },

    validateCE: (ce) => {
        if (!ce || typeof ce !== "string") return false;
        return /^\d{9}$/.test(ce);
    },

    validateDocumentoLocal: (tipo, numero) => {
        // Procesar tipo para validación local
        const processedTipo = tipo?.toUpperCase();
        
        switch (processedTipo) {
            case "DNI":
                return clienteService.validateDNI(numero);
            case "RUC":
                return clienteService.validateRUC(numero);
            case "CE":
                return clienteService.validateCE(numero);
            case "CARNET_EXTRANJERIA":
                return clienteService.validateCE(numero); // Mismo formato que CE
            case "PASAPORTE":
                // Para pasaporte, validación más flexible
                return numero && numero.length >= 6 && numero.length <= 12;
            default:
                return false;
        }
    },

    // Método auxiliar para obtener opciones de tipo de documento
    getDocumentTypes: () => {
        return [
            { value: 'DNI', label: 'DNI' },
            { value: 'RUC', label: 'RUC' },
            { value: 'CARNET_EXTRANJERIA', label: 'Carnet Extranjería' },
            { value: 'PASAPORTE', label: 'Pasaporte' }
        ];
    }
};

export default clienteService;
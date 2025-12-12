// src/services/ConfiguracionService.js
import { get, put } from "@api/axios.config";

const ENDPOINT = "/api/configuracion";

const configuracionService = {
    getAll: async () => {
        const response = await get(ENDPOINT);
        return response;
    },

    update: async (settings) => {
        const response = await put(ENDPOINT, settings);
        return response;
    },
};

export default configuracionService;

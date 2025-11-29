// src/services/MetodoPagoService.js
import { get } from "@api/axios.config";

const MetodoPagoService = {
  getAll: async () => {
    const response = await get("/api/metodos-pago");
    return response;
  },
};

export default MetodoPagoService;

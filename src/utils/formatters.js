import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { DATE_FORMATS } from "./constants";

// Formatear moneda en soles peruanos
export const formatCurrency = (value) => {
    if (value === null || value === undefined) return "S/ 0.00";

    const number = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(number)) return "S/ 0.00";

    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

// Formatear número con separadores de miles
export const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined) return "0";

    const number = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(number)) return "0";

    return new Intl.NumberFormat("es-PE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
};

// Formatear porcentaje
export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined) return "0%";

    const number = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(number)) return "0%";

    return `${formatNumber(number, decimals)}%`;
};

// Formatear fecha en formato corto (dd/MM/yyyy)
export const formatDate = (date) => {
    if (!date) return "";

    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        return format(dateObj, DATE_FORMATS.SHORT, { locale: es });
    } catch (error) {
        console.error("Error formateando fecha:", error);
        return "";
    }
};

// Formatear fecha con hora (dd/MM/yyyy HH:mm:ss)
export const formatDateTime = (date) => {
    if (!date) return "";

    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        return format(dateObj, DATE_FORMATS.LONG, { locale: es });
    } catch (error) {
        console.error("Error formateando fecha y hora:", error);
        return "";
    }
};

// Formatear solo hora (HH:mm)
export const formatTime = (date) => {
    if (!date) return "";

    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        return format(dateObj, DATE_FORMATS.TIME_ONLY, { locale: es });
    } catch (error) {
        console.error("Error formateando hora:", error);
        return "";
    }
};

// Formatear fecha relativa (hace X minutos, hace X horas, etc.)
export const formatRelativeTime = (date) => {
    if (!date) return "";

    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        const now = new Date();
        const diffInSeconds = Math.floor((now - dateObj) / 1000);

        if (diffInSeconds < 60) return "Hace un momento";
        if (diffInSeconds < 3600)
            return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400)
            return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 604800)
            return `Hace ${Math.floor(diffInSeconds / 86400)} días`;

        return formatDate(dateObj);
    } catch (error) {
        console.error("Error formateando fecha relativa:", error);
        return "";
    }
};

// Formatear DNI (1234 5678)
export const formatDNI = (dni) => {
    if (!dni) return "";

    const cleaned = dni.toString().replace(/\D/g, "");

    if (cleaned.length !== 8) return dni;

    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
};

// Formatear RUC (20-12345678-9)
export const formatRUC = (ruc) => {
    if (!ruc) return "";

    const cleaned = ruc.toString().replace(/\D/g, "");

    if (cleaned.length !== 11) return ruc;

    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(
        10
    )}`;
};

// Formatear teléfono (999 999 999)
export const formatPhone = (phone) => {
    if (!phone) return "";

    const cleaned = phone.toString().replace(/\D/g, "");

    if (cleaned.length !== 9) return phone;

    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

// Capitalizar primera letra
export const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalizar cada palabra
export const capitalizeWords = (text) => {
    if (!text) return "";
    return text
        .split(" ")
        .map((word) => capitalize(word))
        .join(" ");
};

// Truncar texto
export const truncate = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Formatear código de venta (V-20251022-00015)
export const formatSaleCode = (code) => {
    if (!code) return "";
    return code.toUpperCase();
};

// Formatear estado con color
export const formatStatus = (status) => {
    const statusMap = {
        PAGADO: { label: "Pagado", color: "success" },
        ANULADO: { label: "Anulado", color: "danger" },
        PENDIENTE: { label: "Pendiente", color: "warning" },
        EN_PROCESO: { label: "En Proceso", color: "info" },
        ENVIADO: { label: "Enviado", color: "info" },
        ENTREGADO: { label: "Entregado", color: "success" },
        CANCELADO: { label: "Cancelado", color: "danger" },
        APROBADA: { label: "Aprobada", color: "success" },
        RECHAZADA: { label: "Rechazada", color: "danger" },
        COMPLETADA: { label: "Completada", color: "success" },
    };

    return statusMap[status] || { label: status, color: "default" };
};

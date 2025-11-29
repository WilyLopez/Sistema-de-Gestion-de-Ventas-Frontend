// src/utils/validators.js

import { DOCUMENT_TYPES, VALIDATION_RULES } from "./constants";

// Validar DNI peruano (8 dígitos)
export const validateDNI = (dni) => {
    if (!dni) return false;

    const cleaned = dni.toString().trim();

    if (cleaned.length !== 8) return false;

    if (!DOCUMENT_TYPES.DNI.pattern.test(cleaned)) return false;

    if (cleaned === "00000000") return false;

    if (cleaned.startsWith("0")) return false;

    return true;
};

// Validar RUC peruano (11 dígitos con dígito verificador)
export const validateRUC = (ruc) => {
    if (!ruc) return false;

    const cleaned = ruc.toString().trim();

    if (cleaned.length !== 11) return false;

    if (!DOCUMENT_TYPES.RUC.pattern.test(cleaned)) return false;

    const prefix = cleaned.substring(0, 2);
    if (!["10", "15", "17", "20"].includes(prefix)) return false;

    // Validar dígito verificador
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * factors[i];
    }

    const remainder = sum % 11;
    let checkDigit = 11 - remainder;

    if (checkDigit === 10) checkDigit = 0;
    if (checkDigit === 11) checkDigit = 1;

    return checkDigit === parseInt(cleaned.charAt(10));
};

// Validar Carnet de Extranjería (9 dígitos)
export const validateCE = (ce) => {
    if (!ce) return false;

    const cleaned = ce.toString().trim();

    if (cleaned.length !== 9) return false;

    if (!DOCUMENT_TYPES.CE.pattern.test(cleaned)) return false;

    return true;
};

// Validar email según RFC 5322
export const validateEmail = (email) => {
    if (!email) return false;

    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email.trim());
};

// Validar teléfono peruano (9 dígitos, empieza con 9)
export const validatePhone = (phone) => {
    if (!phone) return false;

    const cleaned = phone.toString().replace(/\D/g, "");

    if (cleaned.length !== VALIDATION_RULES.PHONE_LENGTH) return false;

    if (!cleaned.startsWith("9")) return false;

    return true;
};

// Validar contraseña (mínimo 6 caracteres)
export const validatePassword = (password) => {
    if (!password) return false;

    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) return false;

    return true;
};

// Validar fortaleza de contraseña
export const validatePasswordStrength = (password) => {
    if (!password)
        return { valid: false, strength: 0, message: "Contraseña requerida" };

    let strength = 0;
    const feedback = [];

    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push("Mínimo 8 caracteres");
    }

    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Incluir minúsculas");
    }

    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Incluir mayúsculas");
    }

    if (/[0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Incluir números");
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Incluir símbolos");
    }

    const strengthLabels = [
        "Muy débil",
        "Débil",
        "Media",
        "Fuerte",
        "Muy fuerte",
    ];

    return {
        valid: strength >= 3,
        strength,
        label: strengthLabels[strength - 1] || "Muy débil",
        feedback: feedback.join(", "),
    };
};

// Validar username (3-50 caracteres, alfanumérico y guiones bajos)
export const validateUsername = (username) => {
    if (!username) return false;

    const cleaned = username.trim();

    if (cleaned.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) return false;
    if (cleaned.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) return false;

    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    return usernameRegex.test(cleaned);
};

// Validar que un número sea positivo
export const validatePositiveNumber = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
};

// Validar que un número sea mayor o igual a cero
export const validateNonNegativeNumber = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0;
};

// Validar rango de fechas
export const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

    return start <= end;
};

// Validar que una fecha no sea futura (para ventas, etc.)
export const validateNotFutureDate = (date) => {
    if (!date) return true;
    
    const inputDate = new Date(date);
    const today = new Date();
    
    return inputDate <= today;
};

// Validar porcentaje de descuento (0-50%)
export const validateDiscount = (discount) => {
    const number = parseFloat(discount);

    if (isNaN(number)) return false;
    if (number < 0) return false;
    if (number > VALIDATION_RULES.MAX_DISCOUNT_PERCENT) return false;

    return true;
};

// Validar stock (entero no negativo)
export const validateStock = (stock) => {
    const number = parseInt(stock, 10);

    if (isNaN(number)) return false;
    if (number < 0) return false;
    if (!Number.isInteger(number)) return false;

    return true;
};

// Validar código de producto (máximo 50 caracteres, alfanumérico y guiones)
export const validateProductCode = (code) => {
    if (!code) return false;

    const cleaned = code.trim();

    if (cleaned.length === 0) return false;
    if (cleaned.length > VALIDATION_RULES.CODIGO_MAX_LENGTH) return false;

    const codeRegex = /^[a-zA-Z0-9-_]+$/;

    return codeRegex.test(cleaned);
};

// Validar URL de imagen
export const validateImageURL = (url) => {
    if (!url) return true; // URL opcional

    try {
        const urlObj = new URL(url);
        const validExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".svg",
        ];
        const hasValidExtension = validExtensions.some((ext) =>
            urlObj.pathname.toLowerCase().endsWith(ext)
        );

        return hasValidExtension;
    } catch {
        return false;
    }
};

// Validar que precio de venta sea mayor o igual a precio de compra
export const validatePriceRange = (precioCompra, precioVenta) => {
    const compra = parseFloat(precioCompra);
    const venta = parseFloat(precioVenta);

    if (isNaN(compra) || isNaN(venta)) return false;

    return venta >= compra;
};

// Validar longitud de texto
export const validateTextLength = (text, maxLength) => {
    if (!text) return true; // Texto opcional

    return text.length <= maxLength;
};

// Validar formato de archivo
export const validateFileType = (file, allowedTypes) => {
    if (!file) return false;

    const fileType = file.type;
    const fileName = file.name;

    const isTypeAllowed = allowedTypes.some((type) => {
        if (type.includes("*")) {
            const baseType = type.split("/")[0];
            return fileType.startsWith(baseType);
        }
        return fileType === type;
    });

    if (isTypeAllowed) return true;

    const extension = fileName.split(".").pop().toLowerCase();
    return allowedTypes.some((type) => type.includes(extension));
};

// Validar tamaño de archivo (en bytes)
export const validateFileSize = (file, maxSizeInMB) => {
    if (!file) return false;

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    return file.size <= maxSizeInBytes;
};

// Validar cantidad en venta (debe ser entero positivo)
export const validateQuantity = (quantity) => {
    const number = parseInt(quantity, 10);

    if (isNaN(number)) return false;
    if (number <= 0) return false;
    if (!Number.isInteger(number)) return false;

    return true;
};

// Validar que haya stock suficiente
export const validateStockAvailability = (requested, available) => {
    const req = parseInt(requested, 10);
    const avail = parseInt(available, 10);

    if (isNaN(req) || isNaN(avail)) return false;

    return req <= avail;
};

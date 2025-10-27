// src/components/forms/ProveedorForm.jsx
import { useState } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Checkbox from '@components/ui/Checkbox';
import { VALIDATION_RULES } from '@utils/constants';
import { validateRUC, validateEmail, validatePhone } from '@utils/validators';
import proveedorService from '@services/ProveedorService';

/**
 * Formulario de Proveedor
 * Crear y editar proveedores con validaciones
 */
const ProveedorForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        ruc: '',
        razonSocial: '',
        nombreComercial: '',
        direccion: '',
        telefono: '',
        correo: '',
        estado: true,
        ...initialData,
    });

    const [errors, setErrors] = useState({});
    const [isValidatingRuc, setIsValidatingRuc] = useState(false);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let finalValue = value;

        // Limpiar RUC - solo números
        if (name === 'ruc') {
            finalValue = value.replace(/\D/g, '').slice(0, 11);
        }

        // Limpiar teléfono - solo números
        if (name === 'telefono') {
            finalValue = value.replace(/\D/g, '').slice(0, 9);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue,
        }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validar RUC en tiempo real (cuando pierde el foco)
    const handleRucBlur = async () => {
        if (!formData.ruc) return;

        // Validar formato
        if (!validateRUC(formData.ruc)) {
            setErrors(prev => ({
                ...prev,
                ruc: 'RUC inválido. Debe tener 11 dígitos y empezar con 10, 15, 17 o 20',
            }));
            return;
        }

        // Verificar si ya existe (solo en modo creación)
        if (!isEditMode) {
            setIsValidatingRuc(true);
            try {
                const exists = await proveedorService.existsRuc(formData.ruc);
                if (exists) {
                    setErrors(prev => ({
                        ...prev,
                        ruc: 'Este RUC ya está registrado',
                    }));
                }
            } catch (error) {
                console.error('Error al validar RUC:', error);
            } finally {
                setIsValidatingRuc(false);
            }
        }
    };

    // Validar formulario completo
    const validate = async () => {
        const newErrors = {};

        // RUC
        if (!formData.ruc) {
            newErrors.ruc = 'El RUC es requerido';
        } else if (!validateRUC(formData.ruc)) {
            newErrors.ruc = 'RUC inválido';
        } else if (!isEditMode) {
            // Verificar existencia
            try {
                const exists = await proveedorService.existsRuc(formData.ruc);
                if (exists) {
                    newErrors.ruc = 'Este RUC ya está registrado';
                }
            } catch (error) {
                console.error('Error al verificar RUC:', error);
            }
        }

        // Razón Social
        if (!formData.razonSocial.trim()) {
            newErrors.razonSocial = 'La razón social es requerida';
        } else if (formData.razonSocial.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            newErrors.razonSocial = `Máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`;
        }

        // Nombre Comercial (opcional)
        if (formData.nombreComercial && formData.nombreComercial.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            newErrors.nombreComercial = `Máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`;
        }

        // Dirección (opcional)
        if (formData.direccion && formData.direccion.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
            newErrors.direccion = `Máximo ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres`;
        }

        // Teléfono (opcional pero debe ser válido si se proporciona)
        if (formData.telefono && !validatePhone(formData.telefono)) {
            newErrors.telefono = 'Teléfono inválido. Debe tener 9 dígitos y empezar con 9';
        }

        // Correo (opcional pero debe ser válido si se proporciona)
        if (formData.correo && !validateEmail(formData.correo)) {
            newErrors.correo = 'Correo electrónico inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validate();
        if (!isValid) return;

        // Preparar datos
        const proveedorData = {
            ruc: formData.ruc,
            razonSocial: formData.razonSocial.trim(),
            nombreComercial: formData.nombreComercial?.trim() || '',
            direccion: formData.direccion?.trim() || '',
            telefono: formData.telefono || '',
            correo: formData.correo?.trim() || '',
            estado: formData.estado,
        };

        onSubmit && onSubmit(proveedorData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RUC */}
                <Input
                    label="RUC"
                    type="text"
                    name="ruc"
                    placeholder="20123456789"
                    value={formData.ruc}
                    onChange={handleChange}
                    onBlur={handleRucBlur}
                    error={errors.ruc}
                    required
                    disabled={isLoading || isEditMode || isValidatingRuc}
                    fullWidth
                    helperText={isValidatingRuc ? 'Validando RUC...' : '11 dígitos'}
                />

                {/* Razón Social */}
                <Input
                    label="Razón Social"
                    type="text"
                    name="razonSocial"
                    placeholder="Empresa S.A.C."
                    value={formData.razonSocial}
                    onChange={handleChange}
                    error={errors.razonSocial}
                    required
                    disabled={isLoading}
                    fullWidth
                />

                {/* Nombre Comercial */}
                <Input
                    label="Nombre Comercial"
                    type="text"
                    name="nombreComercial"
                    placeholder="Nombre comercial (opcional)"
                    value={formData.nombreComercial}
                    onChange={handleChange}
                    error={errors.nombreComercial}
                    disabled={isLoading}
                    fullWidth
                />

                {/* Teléfono */}
                <Input
                    label="Teléfono"
                    type="tel"
                    name="telefono"
                    placeholder="999999999"
                    value={formData.telefono}
                    onChange={handleChange}
                    error={errors.telefono}
                    disabled={isLoading}
                    fullWidth
                    helperText="9 dígitos, empieza con 9"
                />

                {/* Correo */}
                <Input
                    label="Correo Electrónico"
                    type="email"
                    name="correo"
                    placeholder="contacto@empresa.com (opcional)"
                    value={formData.correo}
                    onChange={handleChange}
                    error={errors.correo}
                    disabled={isLoading}
                    fullWidth
                    containerClassName="md:col-span-2"
                />
            </div>

            {/* Dirección - full width */}
            <Input
                label="Dirección"
                type="text"
                name="direccion"
                placeholder="Dirección completa (opcional)"
                value={formData.direccion}
                onChange={handleChange}
                error={errors.direccion}
                disabled={isLoading}
                fullWidth
            />

            {/* Estado */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                <Checkbox
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-dark-text">
                        Proveedor Activo
                    </label>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        Los proveedores inactivos no estarán disponibles para pedidos
                    </p>
                </div>
            </div>

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
                    disabled={isLoading || isValidatingRuc}
                    className="flex-1"
                >
                    {isLoading
                        ? (isEditMode ? 'Actualizando...' : 'Creando...')
                        : (isEditMode ? 'Actualizar Proveedor' : 'Crear Proveedor')
                    }
                </Button>
            </div>
        </form>
    );
};

export default ProveedorForm;
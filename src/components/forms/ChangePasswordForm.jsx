import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { VALIDATION_RULES } from '@utils/constants';

/**
 * Formulario de Cambio de Contraseña
 * Validación robusta con requisitos de seguridad
 */
const ChangePasswordForm = ({ onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // Requisitos de contraseña
    const passwordRequirements = [
        { 
            label: `Mínimo ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`, 
            check: (pwd) => pwd.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH 
        },
        { 
            label: 'Al menos una letra mayúscula', 
            check: (pwd) => /[A-Z]/.test(pwd) 
        },
        { 
            label: 'Al menos una letra minúscula', 
            check: (pwd) => /[a-z]/.test(pwd) 
        },
        { 
            label: 'Al menos un número', 
            check: (pwd) => /\d/.test(pwd) 
        },
    ];

    // Manejar cambios
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

    // Toggle visibilidad
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Validar formulario
    const validate = () => {
        const newErrors = {};

        // Validar contraseña actual
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'La contraseña actual es requerida';
        }

        // Validar nueva contraseña
        if (!formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida';
        } else {
            const failedRequirements = passwordRequirements.filter(
                req => !req.check(formData.newPassword)
            );
            if (failedRequirements.length > 0) {
                newErrors.newPassword = 'La contraseña no cumple todos los requisitos';
            }
        }

        // Validar que nueva sea diferente
        if (formData.newPassword && formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
        }

        // Validar confirmación
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la nueva contraseña';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        onSubmit && onSubmit({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contraseña actual */}
            <div className="relative">
                <Input
                    label="Contraseña Actual"
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    placeholder="Ingresa tu contraseña actual"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={errors.currentPassword}
                    required
                    disabled={isLoading}
                    fullWidth
                    leftIcon={<Lock className="w-5 h-5" />}
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                >
                    {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Nueva contraseña */}
            <div className="relative">
                <Input
                    label="Nueva Contraseña"
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Ingresa tu nueva contraseña"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    required
                    disabled={isLoading}
                    fullWidth
                    leftIcon={<Lock className="w-5 h-5" />}
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                >
                    {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Requisitos de contraseña */}
            {formData.newPassword && (
                <div className="p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                        Requisitos de contraseña:
                    </p>
                    <ul className="space-y-1">
                        {passwordRequirements.map((req, index) => {
                            const isValid = req.check(formData.newPassword);
                            return (
                                <li
                                    key={index}
                                    className={`text-sm flex items-center gap-2 ${
                                        isValid
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-500 dark:text-dark-muted'
                                    }`}
                                >
                                    {isValid ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-current" />
                                    )}
                                    {req.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Confirmar nueva contraseña */}
            <div className="relative">
                <Input
                    label="Confirmar Nueva Contraseña"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirma tu nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                    disabled={isLoading}
                    fullWidth
                    leftIcon={<Lock className="w-5 h-5" />}
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                >
                    {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
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
                    disabled={isLoading}
                    className="flex-1"
                >
                    {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
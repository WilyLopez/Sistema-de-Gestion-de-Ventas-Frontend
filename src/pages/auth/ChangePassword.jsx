import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';

/**
 * Página de Cambio de Contraseña
 * Permite al usuario autenticado cambiar su contraseña
 */
const ChangePassword = () => {
    const navigate = useNavigate();
    const { user, changePassword, logout } = useAuth();

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
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [generalError, setGeneralError] = useState('');

    // Validaciones de contraseña
    const passwordRequirements = [
        { label: 'Mínimo 6 caracteres', check: (pwd) => pwd.length >= 6 },
        { label: 'Al menos una letra mayúscula', check: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'Al menos una letra minúscula', check: (pwd) => /[a-z]/.test(pwd) },
        { label: 'Al menos un número', check: (pwd) => /\d/.test(pwd) },
    ];

    // Manejar cambios en inputs
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
        if (generalError) setGeneralError('');
        if (successMessage) setSuccessMessage('');
    };

    // Toggle visibilidad de contraseña
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

        // Validar que nueva contraseña sea diferente
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setGeneralError('');
        setSuccessMessage('');

        try {
            const result = await changePassword(
                formData.currentPassword,
                formData.newPassword
            );

            if (result.success) {
                setSuccessMessage('Contraseña cambiada exitosamente. Serás redirigido al login...');
                
                // Limpiar formulario
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });

                // Cerrar sesión y redirigir después de 3 segundos
                setTimeout(async () => {
                    await logout();
                    navigate('/login');
                }, 3000);
            } else {
                setGeneralError(result.message || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            setGeneralError('Error de conexión. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 mb-4"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Cambiar Contraseña
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-dark-muted">
                        Usuario: <span className="font-medium">{user?.username}</span>
                    </p>
                </div>

                {/* Card principal */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-6 sm:p-8">
                    {/* Mensaje de éxito */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-fade-in">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-600 dark:text-green-400">
                                {successMessage}
                            </p>
                        </div>
                    )}

                    {/* Error general */}
                    {generalError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {generalError}
                            </p>
                        </div>
                    )}

                    {/* Formulario */}
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
                                disabled={isLoading || !!successMessage}
                                fullWidth
                                leftIcon={<Lock className="w-5 h-5" />}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                                disabled={isLoading || !!successMessage}
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
                                disabled={isLoading || !!successMessage}
                                fullWidth
                                leftIcon={<Lock className="w-5 h-5" />}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                                disabled={isLoading || !!successMessage}
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
                                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                                    isValid ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-dark-border'
                                                }`}>
                                                    {isValid ? '✓' : ''}
                                                </span>
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
                                disabled={isLoading || !!successMessage}
                                fullWidth
                                leftIcon={<Lock className="w-5 h-5" />}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                                disabled={isLoading || !!successMessage}
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
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={() => navigate(-1)}
                                disabled={isLoading || !!successMessage}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading || !!successMessage}
                                className="flex-1"
                            >
                                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </Button>
                        </div>
                    </form>

                    {/* Nota de seguridad */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            <strong>Nota de seguridad:</strong> Después de cambiar tu contraseña, 
                            serás redirigido al inicio de sesión para que ingreses con tus nuevas credenciales.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
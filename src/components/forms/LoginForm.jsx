import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { VALIDATION_RULES } from '@utils/constants';

/**
 * Formulario de Login
 * Reutilizable para modal o página completa
 */
const LoginForm = ({ onSubmit, isLoading = false, error: externalError }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: fieldValue,
        }));

        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validar formulario
    const validate = () => {
        const newErrors = {};

        // Validar username
        if (!formData.username.trim()) {
            newErrors.username = 'El usuario es requerido';
        } else if (formData.username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
            newErrors.username = `Mínimo ${VALIDATION_RULES.USERNAME_MIN_LENGTH} caracteres`;
        } else if (formData.username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
            newErrors.username = `Máximo ${VALIDATION_RULES.USERNAME_MAX_LENGTH} caracteres`;
        }

        // Validar password
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
            newErrors.password = `Mínimo ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        onSubmit && onSubmit({
            username: formData.username.trim(),
            password: formData.password,
            rememberMe: formData.rememberMe,
        });
    };

    // Manejar Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error externo */}
            {externalError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {externalError}
                    </p>
                </div>
            )}

            {/* Campo Usuario */}
            <Input
                label="Usuario"
                type="text"
                name="username"
                placeholder="Ingresa tu usuario"
                value={formData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                error={errors.username}
                required
                disabled={isLoading}
                fullWidth
                leftIcon={<User className="w-5 h-5" />}
                autoComplete="username"
                autoFocus
            />

            {/* Campo Contraseña */}
            <div className="relative">
                <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    error={errors.password}
                    required
                    disabled={isLoading}
                    fullWidth
                    leftIcon={<Lock className="w-5 h-5" />}
                    autoComplete="current-password"
                />
                
                {/* Toggle ver contraseña */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Recordarme */}
            <div className="flex items-center">
                <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-dark-border dark:bg-dark-card"
                />
                <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700 dark:text-dark-text"
                >
                    Recordarme
                </label>
            </div>

            {/* Botón submit */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
            >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
        </form>
    );
};

export default LoginForm;
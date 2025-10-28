// src/pages/auth/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Logo from '@components/layout/common/Logo';

/**
 * Página de Login
 * Formulario de autenticación con validación
 */
const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    // Redirigir según el rol si ya está autenticado
    useEffect(() => {
        if (isAuthenticated && !authLoading && user) {
            console.log('Usuario autenticado, rol:', user.rol);
            
            // Redirigir según el rol del usuario
            switch (user.rol?.toUpperCase()) {
                case 'ADMINISTRADOR':
                    navigate('/admin/dashboard', { replace: true });
                    break;
                case 'VENDEDOR':
                    navigate('/vendedor/dashboard', { replace: true });
                    break;
                case 'EMPLEADO':
                    navigate('/empleado/dashboard', { replace: true });
                    break;
                default:
                    navigate('/unauthorized', { replace: true });
            }
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
        
        // Limpiar error general
        if (generalError) {
            setGeneralError('');
        }
    };

    // Validar formulario
    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El usuario es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'El usuario debe tener al menos 3 caracteres';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit - Versión mejorada
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        setIsLoading(true);
        setGeneralError('');

        try {
            const result = await login(formData.username, formData.password);
            
            if (result.success) {
                console.log('Login exitoso, rol:', result.user?.rol);
                // La redirección se manejará en el useEffect con el user actualizado
            } else {
                setGeneralError(result.message || 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setGeneralError('Error de conexión. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar Enter en campos
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 dark:text-dark-muted">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-dark-bg dark:to-dark-card px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Card principal */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 sm:p-10">
                    {/* Logo y título */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                            Iniciar Sesión
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-dark-muted">
                            Sistema de Gestión de Ventas e Inventario
                        </p>
                    </div>

                    {/* Error general */}
                    {generalError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                {generalError}
                            </p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Link recuperar contraseña */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-dark-border dark:bg-dark-card"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700 dark:text-dark-text"
                                >
                                    Recordarme
                                </label>
                            </div>

                            <Link
                                to="/recuperar-contrasena"
                                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Botón submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                            leftIcon={!isLoading && <LogIn className="w-5 h-5" />}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 dark:text-dark-muted">
                            © 2025 SGVIA. Todos los derechos reservados.
                        </p>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                        ¿Necesitas ayuda?{' '}
                        <Link
                            to="/ayuda"
                            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                        >
                            Contacta a soporte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Logo from '@components/layout/common/Logo';

/**
 * Página de Recuperación de Contraseña
 * Solicita email para enviar instrucciones de recuperación
 */
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Validar email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Manejar submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!email.trim()) {
            setError('El email es requerido');
            return;
        }

        if (!validateEmail(email)) {
            setError('Ingresa un email válido');
            return;
        }

        setIsLoading(true);

        try {
            // Simular llamada API (implementar cuando tengas el endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // TODO: Implementar llamada real al backend
            // await post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });

            setIsSuccess(true);
        } catch (error) {
            setError('Error al enviar instrucciones. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Vista de éxito
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-dark-bg dark:to-dark-card px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 sm:p-10 text-center">
                        {/* Icono de éxito */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        {/* Mensaje */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
                            ¡Correo Enviado!
                        </h2>
                        <p className="text-gray-600 dark:text-dark-muted mb-6">
                            Hemos enviado instrucciones para restablecer tu contraseña a:
                        </p>
                        <p className="text-primary-600 dark:text-primary-400 font-medium mb-8">
                            {email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-dark-muted mb-8">
                            Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                        </p>

                        {/* Botón volver */}
                        <Link to="/login">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                leftIcon={<ArrowLeft className="w-5 h-5" />}
                            >
                                Volver al inicio de sesión
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Vista del formulario
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
                            Recuperar Contraseña
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-dark-muted">
                            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo Email */}
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            placeholder="tu.email@ejemplo.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            error={error}
                            required
                            disabled={isLoading}
                            fullWidth
                            leftIcon={<Mail className="w-5 h-5" />}
                            autoComplete="email"
                            autoFocus
                        />

                        {/* Botón submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                            leftIcon={!isLoading && <Mail className="w-5 h-5" />}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                        </Button>

                        {/* Link volver */}
                        <Link to="/login">
                            <Button
                                type="button"
                                variant="ghost"
                                size="lg"
                                fullWidth
                                leftIcon={<ArrowLeft className="w-5 h-5" />}
                            >
                                Volver al inicio de sesión
                            </Button>
                        </Link>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        © 2025 SGVIA. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
// src/components/fragments/common/ChangePasswordPage.jsx
import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import usuarioService from '@services/UsuarioService';
import { MESSAGES } from '@utils/constants';
import { validatePassword } from '@utils/validators';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Alert from '@components/alerts/Alert';
import Card from '@components/ui/Card';

const ChangePasswordPage = () => {
    const { user } = useAuth();
    const [passwordData, setPasswordData] = useState({
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordData.contrasenaActual) {
            errors.contrasenaActual = 'La contraseña actual es requerida';
        }
        if (!passwordData.contrasenaNueva) {
            errors.contrasenaNueva = 'La nueva contraseña es requerida';
        } else if (!validatePassword(passwordData.contrasenaNueva)) {
            errors.contrasenaNueva = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
            errors.confirmarContrasena = 'Las contraseñas no coinciden';
        }
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setIsChangingPassword(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await usuarioService.cambiarContrasena(
                user.id,
                passwordData.contrasenaActual,
                passwordData.contrasenaNueva
            );
            setPasswordData({
                contrasenaActual: '',
                contrasenaNueva: '',
                confirmarContrasena: '',
            });
            setSuccessMessage('Contraseña cambiada exitosamente');
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Cambiar Contraseña
                </h1>
                <p className="mt-2 text-gray-600 dark:text-dark-muted">
                    Para tu seguridad, te recomendamos que elijas una contraseña fuerte.
                </p>
            </div>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Card>
                <form onSubmit={handleChangePassword} className="space-y-6 p-6">
                    <Input
                        label="Contraseña Actual"
                        type="password"
                        name="contrasenaActual"
                        value={passwordData.contrasenaActual}
                        onChange={handlePasswordChange}
                        error={passwordErrors.contrasenaActual}
                        required
                        disabled={isChangingPassword}
                        fullWidth
                    />
                    <Input
                        label="Nueva Contraseña"
                        type="password"
                        name="contrasenaNueva"
                        value={passwordData.contrasenaNueva}
                        onChange={handlePasswordChange}
                        error={passwordErrors.contrasenaNueva}
                        required
                        disabled={isChangingPassword}
                        fullWidth
                        helperText="Mínimo 6 caracteres"
                    />
                    <Input
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        name="confirmarContrasena"
                        value={passwordData.confirmarContrasena}
                        onChange={handlePasswordChange}
                        error={passwordErrors.confirmarContrasena}
                        required
                        disabled={isChangingPassword}
                        fullWidth
                    />
                    <div className="pt-4">
                        <Button
                            type="submit"
                            loading={isChangingPassword}
                            disabled={isChangingPassword}
                            fullWidth
                            size="lg"
                        >
                            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;
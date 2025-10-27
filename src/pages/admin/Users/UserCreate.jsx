// src/pages/admin/Users/UserCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserForm from '@components/forms/UserForm';
import Button from '@components/ui/Button';
import Alert from '@components/alerts/Alert';
import userService from '@services/UsuarioService';
import { MESSAGES } from '@utils/constants';

const UserCreate = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (userData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            console.log('Datos enviados:', userData);
            await userService.create(userData);
            navigate('/admin/usuarios');
        } catch (error) {
            let errorMessage = MESSAGES.ERROR.GENERIC;
            if (error.response?.status === 400) {
                errorMessage = error.response.data.message || MESSAGES.ERROR.VALIDATION;
                if (error.response.data.errors) {
                    errorMessage = Object.values(error.response.data.errors).join(', ');
                }
            } else if (error.response?.status === 401) {
                errorMessage = MESSAGES.ERROR.SESSION_EXPIRED;
            } else if (error.response?.status === 403) {
                errorMessage = MESSAGES.ERROR.UNAUTHORIZED;
            }
            setError(errorMessage);
            console.error('Error al crear usuario:', error.response?.data || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/usuarios');
    };

    return (
        <div className="space-y-6">
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/usuarios')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="mb-4"
                >
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Crear Usuario
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Completa el formulario para registrar un nuevo usuario
                </p>
            </div>
            {error && (
                <Alert variant="danger" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <UserForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default UserCreate;
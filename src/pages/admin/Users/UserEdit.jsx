//src/pages/admin/Users/UserEdit.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserForm from '@components/forms/UserForm';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import userService from '@services/UsuarioService';

/**
 * Página de Edición de Usuario
 */
const UserEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            const data = await userService.getById(id);
            setUser(data);
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            // TODO: Mostrar toast de error y redirigir
            navigate('/admin/usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (userData) => {
        setIsSubmitting(true);
        try {
            await userService.update(id, userData);
            // TODO: Mostrar toast de éxito
            navigate('/admin/usuarios');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            // TODO: Mostrar toast de error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/usuarios');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando usuario..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    Editar Usuario
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Modifica la información del usuario
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <UserForm
                    initialData={user}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default UserEdit;
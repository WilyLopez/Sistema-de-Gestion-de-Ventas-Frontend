//src/pages/admin/Roles/RoleCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import RoleForm from '@components/forms/RoleForm';
import Button from '@components/ui/Button';
import RolService from '@services/RolService';
import toast from 'react-hot-toast';

/**
 * Página de Creación de Rol
 */
const RoleCreate = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (roleData) => {
        setIsSubmitting(true);
        try {
            await RolService.create(roleData);
            toast.success('Rol creado exitosamente');
            navigate('/admin/roles');
        } catch (error) {
            console.error('Error al crear rol:', error);
            const message = error.parsedError?.message || 'Error al crear el rol';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/roles');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/roles')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="mb-4"
                >
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary-600" />
                    Crear Rol
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Completa el formulario para registrar un nuevo rol
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <RoleForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default RoleCreate;
//src/pages/admin/Roles/RoleEdit.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import RoleForm from '@components/forms/RoleForm';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import RolService from '@services/RolService';
import toast from 'react-hot-toast';

/**
 * Página de Edición de Rol
 */
const RoleEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSystemRole, setIsSystemRole] = useState(false);

    useEffect(() => {
        loadRole();
    }, [id]);

    const loadRole = async () => {
        try {
            const data = await RolService.getById(id);
            setRole(data);
            
            // Verificar si es rol del sistema
            if (RolService.isRolSistema(data.nombre)) {
                setIsSystemRole(true);
            }
        } catch (error) {
            console.error('Error al cargar rol:', error);
            toast.error('Error al cargar el rol');
            navigate('/admin/roles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (roleData) => {
        setIsSubmitting(true);
        try {
            await RolService.update(id, roleData);
            toast.success('Rol actualizado exitosamente');
            navigate('/admin/roles');
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            const message = error.parsedError?.message || 'Error al actualizar el rol';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/roles');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando rol..." />
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
                    onClick={() => navigate('/admin/roles')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="mb-4"
                >
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary-600" />
                    Editar Rol
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Modifica la información del rol
                </p>
            </div>

            {/* Alerta si es rol del sistema */}
            {isSystemRole && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Rol del sistema
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Este es un rol del sistema y tiene restricciones de modificación. 
                                Solo se puede editar la descripción y algunos campos específicos.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                <RoleForm
                    initialData={role}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                    isSystemRole={isSystemRole}
                />
            </div>
        </div>
    );
};

export default RoleEdit;
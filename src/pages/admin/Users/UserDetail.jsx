//src/pages/admin/Users/UserDetail.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, User } from 'lucide-react';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Spinner from '@components/ui/Spinner';
import userService from '@services/UsuarioService';
import { ROLES } from '@utils/constants';

/**
 * Página de Detalle de Usuario
 * Vista de solo lectura con información completa
 */
const UserDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            const data = await userService.getById(id);
            setUser(data);
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            navigate('/admin/usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando usuario..." />
            </div>
        );
    }

    if (!user) return null;

    // Colores de rol
    const roleColors = {
        [ROLES.ADMIN]: 'bg-red-500 text-white',
        [ROLES.SELLER]: 'bg-blue-500 text-white',
        [ROLES.EMPLOYEE]: 'bg-green-500 text-white',
    };

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
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                            Detalle de Usuario
                        </h1>
                        <p className="text-gray-600 dark:text-dark-muted mt-1">
                            Información completa del usuario
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/admin/usuarios/${id}/editar`)}
                        leftIcon={<Edit className="w-4 h-4" />}
                    >
                        Editar
                    </Button>
                </div>
            </div>

            {/* Información del Usuario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda - Info principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card de información básica */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                {user.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                    {user.nombre} {user.apellido}
                                </h2>
                                <p className="text-gray-600 dark:text-dark-muted">
                                    @{user.username}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                        variant="custom"
                                        className={roleColors[user.rol?.nombre || user.rol] || 'bg-gray-500 text-white'}
                                    >
                                        {user.rol?.nombre || user.rol}
                                    </Badge>
                                    <Badge
                                        variant={user.estado ? 'success' : 'danger'}
                                        className={user.estado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                                    >
                                        {user.estado ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            {user.correo && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Email
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {user.correo}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Teléfono */}
                            {user.telefono && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Teléfono
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {user.telefono}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Dirección */}
                            {user.direccion && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Dirección
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {user.direccion}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card de actividad */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Actividad Reciente
                        </h3>
                        <p className="text-gray-500 dark:text-dark-muted text-center py-8">
                            No hay actividad reciente
                        </p>
                    </div>
                </div>

                {/* Columna derecha - Info adicional */}
                <div className="space-y-6">
                    {/* Card de fechas */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
                            Información de Registro
                        </h3>
                        <div className="space-y-4">
                            {user.fechaCreacion && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Fecha de Registro
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {new Date(user.fechaCreacion).toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {user.fechaModificacion && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">
                                            Última Modificación
                                        </p>
                                        <p className="text-gray-900 dark:text-dark-text">
                                            {new Date(user.fechaModificacion).toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card de permisos/rol */}
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Rol y Permisos
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted mb-2">
                                    Rol Asignado
                                </p>
                                <Badge
                                    variant="custom"
                                    className={`${roleColors[user.rol?.nombre || user.rol]} text-base px-4 py-2`}
                                >
                                    {user.rol?.nombre || user.rol}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
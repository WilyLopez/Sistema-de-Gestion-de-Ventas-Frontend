// src/pages/common/UserProfile.jsx
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, Edit, Lock, Save, X } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Badge from '@components/ui/Badge';
import Modal from '@components/ui/Modal';
import Spinner from '@components/ui/Spinner';
import Alert from '@components/alerts/Alert';
import usuarioService from '@services/UsuarioService';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/formatters';
import { validateEmail, validatePhone, validatePassword } from '@utils/validators';
import { MESSAGES, ROLES } from '@utils/constants';

/**
 * Vista de Perfil de Usuario
 * Muestra y permite editar la información personal del usuario autenticado
 */
const UserProfile = () => {
    const { user: authUser, updateUser } = useAuth();

    // Estados de datos
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estados de edición
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
    });
    const [editErrors, setEditErrors] = useState({});

    // Estados de cambio de contraseña
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    // Estados de carga
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Estados de mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    // Cargar perfil
    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const data = await usuarioService.getProfile();
            setProfile(data);
            setEditedData({
                nombre: data.nombre || '',
                apellido: data.apellido || '',
                correo: data.correo || '',
                telefono: data.telefono || '',
                direccion: data.direccion || '',
            });
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            setErrorMessage('Error al cargar la información del perfil');
        } finally {
            setIsLoading(false);
        }
    };

    // ===== EDICIÓN DE PERFIL =====
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo
        if (editErrors[name]) {
            setEditErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateEditForm = () => {
        const errors = {};

        // Nombre
        if (!editedData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }

        // Apellido
        if (!editedData.apellido.trim()) {
            errors.apellido = 'El apellido es requerido';
        }

        // Email
        if (editedData.correo && !validateEmail(editedData.correo)) {
            errors.correo = 'Email inválido';
        }

        // Teléfono
        if (editedData.telefono && !validatePhone(editedData.telefono)) {
            errors.telefono = 'Teléfono inválido (debe tener 9 dígitos y empezar con 9)';
        }

        setEditErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateEditForm()) return;

        setIsSaving(true);
        setErrorMessage('');

        try {
            const updatedProfile = await usuarioService.update(profile.idUsuario, editedData);
            setProfile(updatedProfile);
            setIsEditing(false);
            setSuccessMessage('Perfil actualizado exitosamente');

            // Actualizar contexto de auth si es necesario
            if (updateUser) {
                updateUser(updatedProfile);
            }

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setErrorMessage(errorMsg);
            console.error('Error al actualizar perfil:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedData({
            nombre: profile.nombre || '',
            apellido: profile.apellido || '',
            correo: profile.correo || '',
            telefono: profile.telefono || '',
            direccion: profile.direccion || '',
        });
        setEditErrors({});
        setIsEditing(false);
    };

    // ===== CAMBIO DE CONTRASEÑA =====
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validatePasswordForm = () => {
        const errors = {};

        // Contraseña actual
        if (!passwordData.contrasenaActual) {
            errors.contrasenaActual = 'La contraseña actual es requerida';
        }

        // Nueva contraseña
        if (!passwordData.contrasenaNueva) {
            errors.contrasenaNueva = 'La nueva contraseña es requerida';
        } else if (!validatePassword(passwordData.contrasenaNueva)) {
            errors.contrasenaNueva = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Confirmar contraseña
        if (!passwordData.confirmarContrasena) {
            errors.confirmarContrasena = 'Debes confirmar la contraseña';
        } else if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
            errors.confirmarContrasena = 'Las contraseñas no coinciden';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) return;

        setIsChangingPassword(true);
        setErrorMessage('');

        try {
            await usuarioService.cambiarContrasena(
                profile.idUsuario,
                passwordData.contrasenaActual,
                passwordData.contrasenaNueva,
                passwordData.confirmarContrasena
            );

            setShowPasswordModal(false);
            setPasswordData({
                contrasenaActual: '',
                contrasenaNueva: '',
                confirmarContrasena: '',
            });
            setPasswordErrors({});
            setSuccessMessage('Contraseña cambiada exitosamente');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            let errorMsg = MESSAGES.ERROR.GENERIC;

            if (error.response?.status === 400) {
                errorMsg = error.response.data.message || 'La contraseña actual es incorrecta';
            }

            setErrorMessage(errorMsg);
            console.error('Error al cambiar contraseña:', error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando perfil..." />
            </div>
        );
    }

    if (!profile) return null;

    // Configuración de colores por rol
    const roleColors = {
        [ROLES.ADMIN]: 'bg-red-500 text-white',
        [ROLES.SELLER]: 'bg-blue-500 text-white',
        [ROLES.EMPLOYEE]: 'bg-green-500 text-white',
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Mi Perfil
                </h1>
                <p className="text-gray-600 dark:text-dark-muted mt-1">
                    Administra tu información personal y configuración de cuenta
                </p>
            </div>

            {/* Mensajes */}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {/* Card principal de perfil */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
                {/* Header de la card */}
                <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                                {profile.nombre?.charAt(0).toUpperCase()}
                                {profile.apellido?.charAt(0).toUpperCase()}
                            </div>

                            {/* Info básica */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                                    {profile.nombre} {profile.apellido}
                                </h2>
                                <p className="text-gray-600 dark:text-dark-muted">
                                    @{profile.username}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                        variant="custom"
                                        className={roleColors[profile.rol?.nombre || profile.rol] || 'bg-gray-500 text-white'}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5" />
                                            {profile.rol?.nombre || profile.rol}
                                        </span>
                                    </Badge>
                                    <Badge
                                        variant={profile.estado ? 'success' : 'danger'}
                                        className={profile.estado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                                    >
                                        {profile.estado ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        {!isEditing ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onClick={() => setIsEditing(true)}
                                    leftIcon={<Edit className="w-4 h-4" />}
                                >
                                    Editar Perfil
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => setShowPasswordModal(true)}
                                    leftIcon={<Lock className="w-4 h-4" />}
                                >
                                    Cambiar Contraseña
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    leftIcon={<X className="w-4 h-4" />}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleSaveProfile}
                                    loading={isSaving}
                                    disabled={isSaving}
                                    leftIcon={<Save className="w-4 h-4" />}
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contenido de la card */}
                <div className="p-6">
                    {!isEditing ? (
                        // Vista de solo lectura
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Nombre completo</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {profile.nombre} {profile.apellido}
                                    </p>
                                </div>
                            </div>

                            {profile.correo && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {profile.correo}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {profile.telefono && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Teléfono</p>
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {profile.telefono}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {profile.direccion && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Dirección</p>
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {profile.direccion}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {profile.fechaCreacion && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Miembro desde</p>
                                        <p className="font-medium text-gray-900 dark:text-dark-text">
                                            {formatDate(profile.fechaCreacion)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Vista de edición
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre"
                                    type="text"
                                    name="nombre"
                                    value={editedData.nombre}
                                    onChange={handleEditChange}
                                    error={editErrors.nombre}
                                    required
                                    disabled={isSaving}
                                    fullWidth
                                />
                                <Input
                                    label="Apellido"
                                    type="text"
                                    name="apellido"
                                    value={editedData.apellido}
                                    onChange={handleEditChange}
                                    error={editErrors.apellido}
                                    required
                                    disabled={isSaving}
                                    fullWidth
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    name="correo"
                                    value={editedData.correo}
                                    onChange={handleEditChange}
                                    error={editErrors.correo}
                                    disabled={isSaving}
                                    fullWidth
                                />
                                <Input
                                    label="Teléfono"
                                    type="tel"
                                    name="telefono"
                                    placeholder="999999999"
                                    value={editedData.telefono}
                                    onChange={handleEditChange}
                                    error={editErrors.telefono}
                                    disabled={isSaving}
                                    fullWidth
                                />
                            </div>

                            <Input
                                label="Dirección"
                                type="text"
                                name="direccion"
                                value={editedData.direccion}
                                onChange={handleEditChange}
                                disabled={isSaving}
                                fullWidth
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de cambio de contraseña */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => !isChangingPassword && setShowPasswordModal(false)}
                title="Cambiar Contraseña"
                size="md"
            >
                <div className="space-y-4">
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

                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowPasswordModal(false);
                                setPasswordData({
                                    contrasenaActual: '',
                                    contrasenaNueva: '',
                                    confirmarContrasena: '',
                                });
                                setPasswordErrors({});
                            }}
                            disabled={isChangingPassword}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleChangePassword}
                            loading={isChangingPassword}
                            disabled={isChangingPassword}
                            className="flex-1"
                        >
                            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserProfile;
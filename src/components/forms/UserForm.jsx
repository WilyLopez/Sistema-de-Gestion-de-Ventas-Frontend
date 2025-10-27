// src/components/forms/UserForm.jsx
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Eye, EyeOff } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { VALIDATION_RULES } from '@utils/constants';

const UserForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const roles = [
        { value: 'ADMINISTRADOR', label: 'Administrador', id: 1 },
        { value: 'VENDEDOR', label: 'Vendedor', id: 2 },
        { value: 'EMPLEADO', label: 'Empleado', id: 3 }
    ];

    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        apellido: initialData?.apellido || '',
        username: initialData?.username || '',
        correo: initialData?.correo || '',
        telefono: initialData?.telefono || '',
        direccion: initialData?.direccion || '',
        rol: roles.find(r => r.value === initialData?.nombreRol)?.value || '',
        contrasena: '',
        confirmarContrasena: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        console.log(`Cambio en ${field}:`, value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        else if (formData.nombre.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            newErrors.nombre = `El nombre no puede exceder ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`;
        }

        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
        else if (formData.apellido.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            newErrors.apellido = `El apellido no puede exceder ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`;
        }

        if (!formData.username.trim()) newErrors.username = 'El usuario es requerido';
        else if (formData.username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
            newErrors.username = `El usuario debe tener al menos ${VALIDATION_RULES.USERNAME_MIN_LENGTH} caracteres`;
        }
        else if (formData.username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
            newErrors.username = `El usuario no puede exceder ${VALIDATION_RULES.USERNAME_MAX_LENGTH} caracteres`;
        }

        if (!formData.correo.trim()) newErrors.correo = 'El email es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.correo)) {
            newErrors.correo = 'Email inválido';
        }

        if (formData.telefono && !/^\+?\d{9,12}$/.test(formData.telefono)) {
            newErrors.telefono = 'Teléfono inválido (9-12 dígitos)';
        }

        if (!formData.rol) newErrors.rol = 'El rol es requerido';

        if (!initialData || formData.contrasena) {
            if (!formData.contrasena) newErrors.contrasena = 'La contraseña es requerida';
            else if (formData.contrasena.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
                newErrors.contrasena = `Mínimo ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`;
            }
            if (formData.contrasena !== formData.confirmarContrasena) {
                newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const selectedRol = roles.find(r => r.value === formData.rol);
            console.log('FormData completo:', formData);
            console.log('Rol en formData:', formData.rol);
            console.log('Rol seleccionado para enviar:', selectedRol);
            
            if (!selectedRol) {
                setErrors(prev => ({ ...prev, rol: 'Debe seleccionar un rol válido' }));
                return;
            }

            const submitData = {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                username: formData.username.trim(),
                correo: formData.correo.trim(),
                telefono: formData.telefono.trim() || null,
                direccion: formData.direccion.trim() || null,
                idRol: selectedRol.id,
                estado: true
            };

            // Solo incluir contraseña si existe
            if (formData.contrasena) {
                submitData.contrasena = formData.contrasena;
            }

            console.log('Datos finales a enviar:', submitData);
            onSubmit(submitData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    error={errors.nombre}
                    required
                    leftIcon={<User className="w-5 h-5" />}
                    placeholder="Ingrese el nombre"
                />
                <Input
                    label="Apellido"
                    value={formData.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    error={errors.apellido}
                    required
                    placeholder="Ingrese el apellido"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Usuario"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    error={errors.username}
                    required
                    placeholder="Ingrese el nombre de usuario"
                />
                <Input
                    label="Email"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                    error={errors.correo}
                    required
                    leftIcon={<Mail className="w-5 h-5" />}
                    placeholder="usuario@ejemplo.com"
                />
            </div>
            {(!initialData || formData.contrasena) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.contrasena}
                        onChange={(e) => handleChange('contrasena', e.target.value)}
                        error={errors.contrasena}
                        required={!initialData}
                        placeholder={`Mínimo ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        }
                    />
                    <Input
                        label="Confirmar Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmarContrasena}
                        onChange={(e) => handleChange('confirmarContrasena', e.target.value)}
                        error={errors.confirmarContrasena}
                        required={!initialData}
                        placeholder="Repita la contraseña"
                    />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    error={errors.telefono}
                    placeholder="+51 999 999 999"
                    leftIcon={<Phone className="w-5 h-5" />}
                />
                <Select
                    label="Rol"
                    value={formData.rol}
                    onChange={(value) => {
                        console.log('Valor recibido en onChange del Select:', value);
                        handleChange('rol', value);
                    }}
                    options={roles}
                    error={errors.rol}
                    required
                    leftIcon={<Shield className="w-5 h-5" />}
                    placeholder="Seleccione un rol"
                />
            </div>
            <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                leftIcon={<MapPin className="w-5 h-5" />}
                placeholder="Ingrese la dirección completa"
                multiline
                rows={3}
            />
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-dark-border">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    className="flex-1"
                >
                    {initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;
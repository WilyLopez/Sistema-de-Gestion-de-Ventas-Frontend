import { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import Checkbox from '@components/ui/Checkbox';
import RolService from '@services/RolService';

const RoleForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    isLoading = false,
    isSystemRole = false,
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        nivelAcceso: 5,
        estado: true,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                nivelAcceso: initialData.nivelAcceso || 5,
                estado: initialData.estado ?? true,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formData[name]);
    };

    const validateField = async (fieldName, value) => {
        let error = '';

        switch (fieldName) {
            case 'nombre': {
                if (!value.trim()) {
                    error = 'El nombre del rol es obligatorio';
                } else if (value.trim().length < 3) {
                    error = 'El nombre debe tener al menos 3 caracteres';
                } else if (value.trim().length > 50) {
                    error = 'El nombre no debe exceder 50 caracteres';
                } else if (!isSystemRole && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    error = 'El nombre solo puede contener letras y espacios';
                } else if (!initialData) {
                    try {
                        const exists = await RolService.existeNombre(value.trim());
                        if (exists) {
                            error = 'Ya existe un rol con este nombre';
                        }
                    } catch (err) {
                        console.error('Error validando nombre:', err);
                    }
                }
                break;
            }
            case 'descripcion': {
                if (value && value.length > 500) {
                    error = 'La descripción no debe exceder 500 caracteres';
                }
                break;
            }
            case 'nivelAcceso': {
                const nivel = Number(value);
                if (isNaN(nivel) || nivel < 1 || nivel > 10) {
                    error = 'El nivel de acceso debe estar entre 1 y 10';
                }
                break;
            }
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error === '';
    };

    const validateForm = async () => {
        const fieldsToValidate = ['nombre', 'descripcion', 'nivelAcceso'];
        const validationPromises = fieldsToValidate.map(field =>
            validateField(field, formData[field])
        );

        const results = await Promise.all(validationPromises);
        return results.every(isValid => isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouched({
            nombre: true,
            descripcion: true,
            nivelAcceso: true,
        });

        const isValid = await validateForm();
        if (!isValid) return;

        const dataToSubmit = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            nivelAcceso: Number(formData.nivelAcceso),
            estado: formData.estado,
        };

        onSubmit(dataToSubmit);
    };

    const nivelAccesoOptions = [
        { value: 1, label: 'Nivel 1 - Acceso Mínimo' },
        { value: 2, label: 'Nivel 2' },
        { value: 3, label: 'Nivel 3' },
        { value: 4, label: 'Nivel 4' },
        { value: 5, label: 'Nivel 5 - Acceso Medio' },
        { value: 6, label: 'Nivel 6' },
        { value: 7, label: 'Nivel 7' },
        { value: 8, label: 'Nivel 8' },
        { value: 9, label: 'Nivel 9' },
        { value: 10, label: 'Nivel 10 - Acceso Total' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isSystemRole && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Rol del Sistema
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Este rol tiene restricciones. Solo se puede modificar la descripción.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre del Rol"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.nombre && errors.nombre}
                    disabled={isLoading || isSystemRole}
                    required
                    placeholder="Ej: Supervisor"
                    leftIcon={<Shield className="w-5 h-5" />}
                    fullWidth
                />
                <Select
                    label="Nivel de Acceso"
                    name="nivelAcceso"
                    value={formData.nivelAcceso}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={nivelAccesoOptions}
                    error={touched.nivelAcceso && errors.nivelAcceso}
                    disabled={isLoading || isSystemRole}
                    required
                    fullWidth
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Descripción
                </label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    placeholder="Describe las responsabilidades y permisos de este rol..."
                    rows={4}
                    className={`
                        block w-full rounded-lg border px-4 py-2 
                        transition-colors duration-200 focus:outline-none focus:ring-2 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                            touched.descripcion && errors.descripcion
                                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-text'
                        }
                    `}
                />
                {touched.descripcion && errors.descripcion && (
                    <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                    {formData.descripcion.length}/500 caracteres
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Checkbox
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                    disabled={isLoading || isSystemRole}
                />
                <label className="text-sm text-gray-700 dark:text-dark-text">
                    Rol activo
                    <span className="text-gray-500 dark:text-dark-muted block text-xs mt-0.5">
                        Los roles inactivos no pueden ser asignados a usuarios
                    </span>
                </label>
            </div>

            <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                    Niveles de Acceso
                </h4>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-dark-muted">
                    <li>• <strong>1-3:</strong> Acceso básico - Consulta y operaciones simples</li>
                    <li>• <strong>4-6:</strong> Acceso medio - Gestión de datos y reportes</li>
                    <li>• <strong>7-9:</strong> Acceso avanzado - Configuración y permisos especiales</li>
                    <li>• <strong>10:</strong> Acceso total - Control completo del sistema</li>
                </ul>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-dark-border">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    {initialData ? 'Actualizar Rol' : 'Crear Rol'}
                </Button>
            </div>
        </form>
    );
};

export default RoleForm;
// src/components/forms/CategoryForm.jsx
import { useState } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Checkbox from '@components/ui/Checkbox';
import { VALIDATION_RULES } from '@utils/constants';
import categoriaService from '@services/CategoriaService';

/**
 * Formulario de Categoría
 * Crear y editar categorías con validaciones
 */
const CategoryForm = ({ 
    initialData = null, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estado: true,
        ...initialData,
    });

    const [errors, setErrors] = useState({});

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validar formulario
    const validate = async () => {
        const newErrors = {};

        // Nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
            newErrors.nombre = `Máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`;
        } else if (!isEditMode || (isEditMode && formData.nombre !== initialData?.nombre)) {
            // Verificar si el nombre ya existe (solo si cambió en edición o es nuevo)
            try {
                const exists = await categoriaService.existsName(formData.nombre);
                if (exists) {
                    newErrors.nombre = 'Este nombre de categoría ya existe';
                }
            } catch (error) {
                console.error('Error al verificar nombre:', error);
            }
        }

        // Descripción (opcional pero con límite)
        if (formData.descripcion && formData.descripcion.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
            newErrors.descripcion = `Máximo ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validate();
        if (!isValid) return;

        // Preparar datos
        const categoryData = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion?.trim() || '',
            estado: formData.estado,
        };

        onSubmit && onSubmit(categoryData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <Input
                label="Nombre de Categoría"
                type="text"
                name="nombre"
                placeholder="Ej: Camisetas, Pantalones, Accesorios"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                required
                disabled={isLoading}
                fullWidth
            />

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Descripción
                </label>
                <textarea
                    name="descripcion"
                    placeholder="Descripción breve de la categoría (opcional)"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={4}
                    maxLength={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH}
                    className={`
                        block w-full rounded-lg border px-4 py-2 
                        transition-colors duration-200 
                        focus:outline-none focus:ring-2 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${errors.descripcion 
                            ? 'border-danger bg-red-50 text-danger placeholder-red-300 focus:border-danger focus:ring-danger dark:bg-red-900/10' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:placeholder-dark-muted'
                        }
                    `}
                />
                {errors.descripcion ? (
                    <p className="mt-1 text-sm text-danger">{errors.descripcion}</p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">
                        {formData.descripcion?.length || 0}/{VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres
                    </p>
                )}
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                <Checkbox
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-dark-text">
                        Categoría Activa
                    </label>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                        Las categorías inactivas no estarán disponibles para asignar a productos
                    </p>
                </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                    className="flex-1"
                >
                    {isLoading 
                        ? (isEditMode ? 'Actualizando...' : 'Creando...') 
                        : (isEditMode ? 'Actualizar Categoría' : 'Crear Categoría')
                    }
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;
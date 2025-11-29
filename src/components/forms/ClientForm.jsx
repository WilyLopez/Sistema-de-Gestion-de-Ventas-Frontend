// src/components/forms/ClientForm.jsx
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import clienteService from '@services/ClienteService';
import { useDebounce } from '@hooks/useDebounce';

const ClientForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        apellido: initialData?.apellido || '',
        tipoDocumento: initialData?.tipoDocumento || '',
        numeroDocumento: initialData?.numeroDocumento || '',
        correo: initialData?.correo || '',
        telefono: initialData?.telefono || '',
        direccion: initialData?.direccion || ''
    });

    const [errors, setErrors] = useState({});
    const documentTypes = clienteService.getDocumentTypes();

    const debouncedDocNumber = useDebounce(formData.numeroDocumento, 500);
    const debouncedEmail = useDebounce(formData.correo, 500);

    // Async validation for document number
    useEffect(() => {
        const checkDocument = async () => {
            if (debouncedDocNumber && formData.tipoDocumento) {
                // Don't validate if it's the initial data
                if (initialData && initialData.numeroDocumento === debouncedDocNumber) {
                    return;
                }
                const exists = await clienteService.existsDocumento(formData.tipoDocumento, debouncedDocNumber);
                if (exists) {
                    setErrors(prev => ({ ...prev, numeroDocumento: 'Este número de documento ya está registrado.' }));
                }
            }
        };
        checkDocument();
    }, [debouncedDocNumber, formData.tipoDocumento, initialData]);

    // Async validation for email
    useEffect(() => {
        const checkEmail = async () => {
            if (debouncedEmail) {
                if (initialData && initialData.correo === debouncedEmail) {
                    return;
                }
                const exists = await clienteService.existsCorreo(debouncedEmail);
                if (exists) {
                    setErrors(prev => ({ ...prev, correo: 'Este correo electrónico ya está registrado.' }));
                }
            }
        };
        checkEmail();
    }, [debouncedEmail, initialData]);


    const handleChange = (field, value) => {
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
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
        if (!formData.tipoDocumento) newErrors.tipoDocumento = 'El tipo de documento es requerido';
        
        if (!formData.numeroDocumento.trim()) {
            newErrors.numeroDocumento = 'El número de documento es requerido';
        } else if (!clienteService.validateDocumentoLocal(formData.tipoDocumento, formData.numeroDocumento)) {
            newErrors.numeroDocumento = 'El número de documento no es válido para el tipo seleccionado.';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.correo)) {
            newErrors.correo = 'El formato del correo es inválido';
        }

        if (formData.telefono && !/^\+?\d{9,12}$/.test(formData.telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'El teléfono debe tener entre 9 y 12 dígitos.';
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Check for existing async errors before submitting
            if (errors.numeroDocumento || errors.correo) {
                 // Do not submit if there are async validation errors shown
                return;
            }
            await onSubmit(formData);
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
                <Select
                    label="Tipo de Documento"
                    value={formData.tipoDocumento}
                    onChange={(value) => handleChange('tipoDocumento', value)}
                    options={documentTypes}
                    error={errors.tipoDocumento}
                    required
                    placeholder="Seleccione un tipo"
                />
                <Input
                    label="Número de Documento"
                    value={formData.numeroDocumento}
                    onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                    error={errors.numeroDocumento}
                    required
                    leftIcon={<FileText className="w-5 h-5" />}
                    placeholder="Ingrese el número"
                    disabled={!formData.tipoDocumento}
                />
            </div>
            <Input
                label="Email"
                type="email"
                value={formData.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                error={errors.correo}
                required
                leftIcon={<Mail className="w-5 h-5" />}
                placeholder="cliente@ejemplo.com"
            />
            <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                error={errors.telefono}
                placeholder="+51 999 999 999"
                leftIcon={<Phone className="w-5 h-5" />}
            />
            <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                error={errors.direccion}
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
                    {initialData ? 'Actualizar Cliente' : 'Crear Cliente'}
                </Button>
            </div>
        </form>
    );
};

export default ClientForm;

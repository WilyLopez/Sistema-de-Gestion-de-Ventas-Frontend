// src/pages/admin/Settings/SystemSettings.jsx
import { useState, useEffect } from 'react';
import { Settings, Save, Percent, Hash, Package, Server } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';
import Spinner from '@components/ui/Spinner';
import configuracionService from '@services/ConfiguracionService';
import { useToast } from '@hooks/useToast';

const SystemSettings = () => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const data = await configuracionService.getAll();
            setSettings(data);
        } catch (error) {
            console.error('Error al cargar la configuración:', error);
            showToast('Error al cargar la configuración', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await configuracionService.update(settings);
            showToast('Configuración guardada exitosamente', 'success');
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            showToast('Error al guardar la configuración', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" text="Cargando configuración..." />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Configuración del Sistema
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Ajusta los parámetros y valores por defecto de la aplicación.
                    </p>
                </div>
            </div>

            {/* General Settings */}
            <Card>
                <Card.Header>
                    <Settings className="w-6 h-6 mr-2" />
                    <Card.Title>General</Card.Title>
                </Card.Header>
                <Card.Body className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label="IGV (%)"
                        name="app.igv.porcentaje"
                        value={settings['app.igv.porcentaje'] || ''}
                        onChange={handleInputChange}
                        leftIcon={<Percent className="w-5 h-5" />}
                        type="number"
                    />
                    <Input
                        label="Prefijo de Venta"
                        name="app.codigo.venta.prefijo"
                        value={settings['app.codigo.venta.prefijo'] || ''}
                        onChange={handleInputChange}
                        leftIcon={<Hash className="w-5 h-5" />}
                    />
                    <Input
                        label="Prefijo de Pedido"
                        name="app.codigo.pedido.prefijo"
                        value={settings['app.codigo.pedido.prefijo'] || ''}
                        onChange={handleInputChange}
                        leftIcon={<Hash className="w-5 h-5" />}
                    />
                </Card.Body>
            </Card>

            {/* Stock Settings */}
            <Card>
                <Card.Header>
                    <Package className="w-6 h-6 mr-2" />
                    <Card.Title>Inventario</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Input
                        label="Stock Mínimo por Defecto"
                        name="app.stock.minimo.default"
                        value={settings['app.stock.minimo.default'] || ''}
                        onChange={handleInputChange}
                        leftIcon={<Package className="w-5 h-5" />}
                        type="number"
                        helperText="Valor por defecto para nuevos productos."
                    />
                </Card.Body>
            </Card>

            {/* API Settings */}
            <Card>
                <Card.Header>
                    <Server className="w-6 h-6 mr-2" />
                    <Card.Title>API Externa (Consulta RUC/DNI)</Card.Title>
                </Card.Header>
                <Card.Body className="space-y-6">
                    <Input
                        label="URL de la API"
                        name="peru.api.url"
                        value={settings['peru.api.url'] || ''}
                        onChange={handleInputChange}
                        leftIcon={<Server className="w-5 h-5" />}
                    />
                    <Input
                        label="Token de la API"
                        name="peru.api.token"
                        value={settings['peru.api.token'] || ''}
                        onChange={handleInputChange}
                        type="password"
                        helperText="El token se guarda de forma segura en el servidor."
                    />
                </Card.Body>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSave}
                    loading={isSaving}
                    leftIcon={<Save className="w-5 h-5" />}
                >
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </div>
    );
};

export default SystemSettings;

// src/pages/seller/Clients/ClientList.jsx
import { useState, useRef } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import BaseTable from '@components/tables/BaseTable';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import ConfirmDialog from '@components/alerts/ConfirmDialog';
import ClientForm from '@components/forms/ClientForm';
import clienteService from '@services/ClienteService';
import { useToast } from '@hooks/useToast';
import Badge from '@components/ui/Badge';

const ClientList = () => {
    const tableRef = useRef();
    const { addToast } = useToast();

    // Estados para modales y diálogos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ========= MANEJO DE DATOS =========
    const fetchData = async (page, size, sort, searchQuery) => {
        try {
            if (searchQuery) {
                return await clienteService.searchByName(searchQuery, page, size);
            }
            return await clienteService.getAll(page, size);
        } catch (error) {
            addToast('Error al cargar clientes', 'error');
            console.error("Error fetching clients:", error);
            throw error; // Re-lanzar para que BaseTable lo maneje
        }
    };

    const reloadTable = () => {
        tableRef.current?.refresh();
    };

    // ========= MANEJO DE MODALES Y FORMULARIO =========
    const handleOpenModal = (client = null) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            let response;
            if (selectedClient) {
                response = await clienteService.update(selectedClient.idCliente, formData);
                addToast('Cliente actualizado con éxito', 'success');
            } else {
                response = await clienteService.create(formData);
                addToast('Cliente creado con éxito', 'success');
            }
            handleCloseModal();
            reloadTable();
        } catch (error) {
            console.error("Error submitting form:", error);
            addToast(error.message || 'Error al guardar el cliente', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========= MANEJO DE ELIMINACIÓN =========
    const handleOpenConfirm = (client) => {
        setSelectedClient(client);
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        if (isSubmitting) return;
        setIsConfirmOpen(false);
        setSelectedClient(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedClient) return;
        setIsSubmitting(true);
        try {
            await clienteService.delete(selectedClient.idCliente);
            addToast('Cliente eliminado con éxito', 'success');
            handleCloseConfirm();
            reloadTable();
        } catch (error) {
            console.error("Error deleting client:", error);
            addToast(error.message || 'Error al eliminar el cliente', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========= CONFIGURACIÓN DE LA TABLA =========
    const columns = [
        {
            key: 'nombre',
            label: 'Nombre Completo',
            sortable: true,
            render: (value, row) => `${row.nombre} ${row.apellido}`,
        },
        {
            key: 'tipoDocumento',
            label: 'Documento',
            sortable: true,
            render: (value, row) => (
                <div>
                    <Badge variant="primary" size="sm">{value}</Badge>
                    <p className="font-mono text-sm mt-1">{row.numeroDocumento}</p>
                </div>
            ),
        },
        {
            key: 'correo',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            sortable: false,
        },
        {
            key: 'fechaCreacion',
            label: 'Fecha Registro',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString('es-PE'),
        },
    ];

    const actions = [
        {
            icon: <Edit className="w-4 h-4" />,
            label: 'Editar',
            onClick: handleOpenModal,
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: 'Eliminar',
            onClick: handleOpenConfirm,
            variant: 'danger',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
                <Button
                    onClick={() => handleOpenModal()}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    Crear Cliente
                </Button>
            </div>

            <BaseTable
                ref={tableRef}
                columns={columns}
                fetchData={fetchData}
                actions={actions}
                searchable={true}
                searchPlaceholder="Buscar por nombre de cliente..."
                emptyMessage="No se encontraron clientes."
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
            >
                <ClientForm
                    initialData={selectedClient}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    isLoading={isSubmitting}
                />
            </Modal>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                description={`¿Estás seguro de que deseas eliminar al cliente "${selectedClient?.nombre} ${selectedClient?.apellido}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default ClientList;

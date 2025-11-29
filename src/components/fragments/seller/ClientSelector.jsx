// src/components/fragments/seller/ClientSelector.jsx
import { useState } from 'react';
import { User, Search, X, CheckCircle } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Modal from '@components/ui/Modal';
import Spinner from '@components/ui/Spinner';
import { useSaleContext } from '@context/SaleContext';
import { useClient } from '@hooks/useClient';

const ClientSelector = () => {
    const { selectedClient, selectClient, clearClient } = useSaleContext();
    const { isLoading, searchClientByDocument, createClient, searchClientsByName } = useClient();

    const [showModal, setShowModal] = useState(false);
    const [documentInput, setDocumentInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clientData, setClientData] = useState(null);
    const [step, setStep] = useState('search'); // 'search' | 'confirm' | 'name-search'

    const handleOpenModal = () => {
        setShowModal(true);
        resetModal();
    };

    const resetModal = () => {
        setDocumentInput('');
        setSearchQuery('');
        setSearchResults([]);
        setClientData(null);
        setStep('search');
    };

    const handleSearchDocument = async () => {
        if (!documentInput.trim()) return;

        try {
            const result = await searchClientByDocument(documentInput);

            if (result.exists) {
                // Cliente ya existe
                selectClient(result.client);
                setShowModal(false);
                resetModal();
            } else {
                // Cliente no existe, preparar para crear
                setClientData(result.apiData);
                setStep('confirm');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCreateClient = async () => {
        try {
            const newClient = await createClient(clientData);
            selectClient(newClient);
            setShowModal(false);
            resetModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSearchByName = async () => {
        if (searchQuery.trim().length < 3) {
            alert('Ingrese al menos 3 caracteres para buscar');
            return;
        }

        try {
            const results = await searchClientsByName(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching clients:', error);
        }
    };

    const handleSelectExistingClient = (client) => {
        selectClient(client);
        setShowModal(false);
        resetModal();
    };

    return (
        <>
            {/* Display Selected Client */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-dark-text flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Cliente
                </h3>

                {selectedClient ? (
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 border border-primary-200 dark:border-primary-800">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {selectedClient.nombre} {selectedClient.apellido}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-dark-muted">
                                    {selectedClient.tipoDocumento}: {selectedClient.numeroDocumento}
                                </p>
                            </div>
                            <button
                                onClick={clearClient}
                                className="text-gray-500 hover:text-gray-700 dark:text-dark-muted dark:hover:text-dark-text transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={handleOpenModal}
                        leftIcon={<User className="w-4 h-4" />}
                    >
                        Seleccionar Cliente
                    </Button>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Buscar Cliente"
                size="lg"
            >
                <div className="space-y-4">
                    {step === 'search' && (
                        <>
                            {/* Búsqueda por DNI/RUC */}
                            <div>
                                <h4 className="font-medium mb-2 text-gray-900 dark:text-dark-text">
                                    Buscar por DNI o RUC
                                </h4>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Ingrese DNI (8) o RUC (11)"
                                        value={documentInput}
                                        onChange={(e) => setDocumentInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearchDocument()}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={handleSearchDocument}
                                        disabled={!documentInput || isLoading}
                                        loading={isLoading}
                                    >
                                        Buscar
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-dark-muted mt-1">
                                    Se consultará automáticamente en RENIEC/SUNAT
                                </p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                                <h4 className="font-medium mb-2 text-gray-900 dark:text-dark-text">
                                    Buscar por Nombre
                                </h4>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Buscar cliente existente..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearchByName()}
                                        leftIcon={<Search className="w-5 h-5" />}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={handleSearchByName}
                                        disabled={searchQuery.length < 3 || isLoading}
                                        loading={isLoading}
                                    >
                                        Buscar
                                    </Button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-dark-border rounded-lg">
                                        {searchResults.map((client) => (
                                            <button
                                                key={client.idCliente}
                                                onClick={() => handleSelectExistingClient(client)}
                                                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-dark-border last:border-0"
                                            >
                                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                                    {client.nombre} {client.apellido}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-dark-muted">
                                                    {client.tipoDocumento}: {client.numeroDocumento}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 'confirm' && clientData && (
                        <div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                                            Cliente encontrado en {clientData.tipoDocumento === 'DNI' ? 'RENIEC' : 'SUNAT'}
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-medium">Documento:</span> {clientData.numeroDocumento}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-medium">
                                                    {clientData.tipoDocumento === 'DNI' ? 'Nombres:' : 'Razón Social:'}
                                                </span> {clientData.nombre}
                                            </p>
                                            {clientData.apellido && (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium">Apellidos:</span> {clientData.apellido}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-dark-muted mb-4">
                                Este cliente no existe en el sistema. ¿Desea registrarlo?
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => setStep('search')}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={handleCreateClient}
                                    loading={isLoading}
                                >
                                    Registrar y Continuar
                                </Button>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center py-4">
                            <Spinner size="md" text="Consultando..." />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ClientSelector;
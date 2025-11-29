import { useState } from 'react';
import { get } from '@api/axios.config';
import ClienteService from '@services/ClienteService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const useClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Busca información del cliente en tu backend
     * @param {string} documento - DNI (8) o RUC (11)
     */
    const searchClientByDocument = async (documento) => {
        setIsLoading(true);
        setError(null);

        try {
            const cleanDoc = documento.trim();
            
            if (cleanDoc.length !== 8 && cleanDoc.length !== 11) {
                throw new Error('Ingrese un DNI (8 dígitos) o RUC (11 dígitos) válido');
            }

            const isDNI = cleanDoc.length === 8;
            const isRUC = cleanDoc.length === 11;

            let clientData = null;

            // Consultar tu propio backend (que hace proxy a la API externa)
            if (isDNI) {
                clientData = await fetchDNI(cleanDoc);
            } else if (isRUC) {
                clientData = await fetchRUC(cleanDoc);
            }

            // Verificar si existe en tu BD
            const existingClient = await checkExistingClient(
                isDNI ? 'DNI' : 'RUC',
                cleanDoc
            );

            if (existingClient) {
                return {
                    exists: true,
                    client: existingClient,
                    apiData: clientData
                };
            }

            return {
                exists: false,
                client: null,
                apiData: clientData,
                readyToCreate: true
            };

        } catch (err) {
            const errorMessage = err.message || 'Error al consultar documento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Consulta DNI en tu backend
     */
    const fetchDNI = async (dni) => {
        try {
            // Ahora usa TU endpoint, no la API externa
            const response = await get(`/api/consultas/dni/${dni}`);

            return {
                tipoDocumento: 'DNI',
                numeroDocumento: dni,
                nombre: response.nombres || '',
                apellido: `${response.apellidoPaterno || ''} ${response.apellidoMaterno || ''}`.trim(),
                razonSocial: null
            };

        } catch (error) {
            console.error('Error fetchDNI:', error);
            throw new Error('DNI no encontrado en RENIEC');
        }
    };

    /**
     * Consulta RUC en tu backend
     */
    const fetchRUC = async (ruc) => {
        try {
            // Ahora usa TU endpoint, no la API externa
            const response = await get(`/api/consultas/ruc/${ruc}`);

            return {
                tipoDocumento: 'RUC',
                numeroDocumento: ruc,
                nombre: response.razonSocial || '',
                apellido: '',
                razonSocial: response.razonSocial || '',
                direccion: response.direccion || ''
            };

        } catch (error) {
            console.error('Error fetchRUC:', error);
            throw new Error('RUC no encontrado en SUNAT');
        }
    };

    /**
     * Verifica si el cliente existe en tu BD
     */
    const checkExistingClient = async (tipoDocumento, numeroDocumento) => {
        try {
            const client = await ClienteService.getByDocumento(
                tipoDocumento,
                numeroDocumento
            );
            return client;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error checking existing client:', error);
            return null;
        }
    };

    /**
     * Crea un nuevo cliente
     */
    const createClient = async (clientData) => {
        setIsLoading(true);
        setError(null);

        try {
            const newClient = await ClienteService.create({
                tipoDocumento: clientData.tipoDocumento,
                numeroDocumento: clientData.numeroDocumento,
                nombre: clientData.nombre.trim(),
                apellido: clientData.apellido?.trim() || '',
                estado: true,
            });

            return newClient;

        } catch (err) {
            const errorMessage = err.message || 'Error al crear cliente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Busca clientes por nombre
     */
    const searchClientsByName = async (query) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ClienteService.searchByName(query, 0, 10);
            return response.content || [];
        } catch (err) {
            const errorMessage = err.message || 'Error al buscar clientes';
            setError(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        searchClientByDocument,
        createClient,
        searchClientsByName,
    };
};
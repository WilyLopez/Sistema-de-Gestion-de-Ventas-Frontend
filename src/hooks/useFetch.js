import { useState, useEffect } from "react";
import api from "../services/api";

export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.get(url, options);
                setData(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.mensaje || "Error al cargar datos"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    const refetch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(url, options);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
};

import { useState, useEffect } from "react";

export const useApi = (apiFunc, immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = async (...params) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiFunc(...params);
            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.mensaje || "Error en la petición";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    return { data, loading, error, execute, setData };
};

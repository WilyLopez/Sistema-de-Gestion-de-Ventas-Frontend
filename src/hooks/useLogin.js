import { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(username, password);
            navigate("/dashboard");
            return response;
        } catch (err) {
            const errorMessage =
                err.response?.data?.mensaje || "Error al iniciar sesión";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

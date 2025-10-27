// src/context/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION } from "@utils/constants";
import { post } from "@api/axios.config";
import ENDPOINTS from "@api/endpoints";

// Crear contexto
const AuthContext = createContext(null);

// Provider del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Verificar si hay sesión activa
    const checkAuth = useCallback(() => {
        try {
            const storedToken = localStorage.getItem(SESSION.TOKEN_KEY);
            const storedUser = localStorage.getItem(SESSION.USER_KEY);

            if (storedToken && storedUser) {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Error al verificar autenticación:", error);
            clearAuth();
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar usuario del localStorage al iniciar
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Logout
    const logout = useCallback(async () => {
        try {
            // Llamar al endpoint de logout del backend (opcional)
            // await post(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            clearAuth();
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Limpiar autenticación
    const clearAuth = () => {
        localStorage.removeItem(SESSION.TOKEN_KEY);
        localStorage.removeItem(SESSION.USER_KEY);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Login
    const login = async (username, password) => {
        try {
            setIsLoading(true);

            const response = await post(ENDPOINTS.AUTH.LOGIN, {
                username,
                password,
            });

            console.log("Respuesta del backend:", response); // ⬅️ DEBUG

            // ✅ SOLUCIÓN: Manejar diferentes estructuras de respuesta
            let authToken, userData;

            // Opción 1: { token, user }
            if (response.token && response.user) {
                authToken = response.token;
                userData = response.user;
            }
            // Opción 2: { token, usuario }
            else if (response.token && response.usuario) {
                authToken = response.token;
                userData = response.usuario;
            }
            // Opción 3: { accessToken, user }
            else if (response.accessToken && response.user) {
                authToken = response.accessToken;
                userData = response.user;
            }
            // Opción 4: Todo en la raíz { token, id, username, rol, ... }
            else if (response.token && response.rol) {
                authToken = response.token;
                userData = {
                    id: response.id,
                    username: response.username,
                    rol: response.rol,
                    nombre: response.nombre,
                    email: response.email,
                };
            }
            // ❌ Si ninguna estructura coincide
            else {
                throw new Error("Estructura de respuesta inválida del servidor");
            }

            // ✅ Validar que userData tenga el campo 'rol'
            if (!userData.rol) {
                throw new Error("Los datos del usuario no contienen el rol");
            }

            localStorage.setItem(SESSION.TOKEN_KEY, authToken);
            localStorage.setItem(SESSION.USER_KEY, JSON.stringify(userData));

            setToken(authToken);
            setUser(userData);
            setIsAuthenticated(true);

            redirectByRole(userData.rol);

            return { success: true };
        } catch (error) {
            console.error("Error en login:", error);
            return {
                success: false,
                message: error.message || error.parsedError?.message || "Error al iniciar sesión",
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Redirigir según rol
    const redirectByRole = (role) => {
        switch (role) {
            case "ADMINISTRADOR":
                navigate("/admin/dashboard", { replace: true });
                break;
            case "VENDEDOR":
                navigate("/vendedor/dashboard", { replace: true });
                break;
            case "EMPLEADO":
                navigate("/empleado/dashboard", { replace: true });
                break;
            default:
                navigate("/login", { replace: true });
        }
    };

    // Cambiar contraseña
    const changePassword = async (currentPassword, newPassword) => {
        try {
            await post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
                currentPassword,
                newPassword,
            });

            return {
                success: true,
                message: "Contraseña cambiada exitosamente",
            };
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            return {
                success: false,
                message:
                    error.parsedError?.message || "Error al cambiar contraseña",
            };
        }
    };

    // Actualizar datos del usuario en el contexto
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem(SESSION.USER_KEY, JSON.stringify(updatedUser));
    };

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role) => user?.rol === role;

    // Verificar si el usuario tiene uno de varios roles
    const hasAnyRole = (roles) =>
        Array.isArray(roles) && roles.includes(user?.rol);

    // Session timeout automático
    useEffect(() => {
        if (!isAuthenticated) return;

        let timeoutId;

        const resetTimeout = () => {
            if (timeoutId) clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                logout();
            }, SESSION.TIMEOUT);
        };

        const events = ["mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((event) => document.addEventListener(event, resetTimeout));

        resetTimeout();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach((event) =>
                document.removeEventListener(event, resetTimeout)
            );
        };
    }, [isAuthenticated, logout]);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        changePassword,
        updateUser,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export const useAuth = () => useContext(AuthContext);
import { createContext, useState, useEffect } from "react";
import { SESSION } from "@utils/constants";

// Crear contexto
const ThemeContext = createContext(null);

// Provider del contexto
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    // Cargar tema del localStorage al iniciar
    useEffect(() => {
        const storedTheme = localStorage.getItem(SESSION.THEME_KEY);

        if (storedTheme) {
            setTheme(storedTheme);
            applyTheme(storedTheme);
        } else {
            // Detectar preferencia del sistema
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            const defaultTheme = prefersDark ? "dark" : "light";
            setTheme(defaultTheme);
            applyTheme(defaultTheme);
        }
    }, []);

    // Aplicar tema al documento
    const applyTheme = (newTheme) => {
        const root = window.document.documentElement;

        if (newTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    // Cambiar tema
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem(SESSION.THEME_KEY, newTheme);
    };

    // Establecer tema específico
    const setSpecificTheme = (newTheme) => {
        if (newTheme !== "light" && newTheme !== "dark") {
            console.warn('Tema inválido. Usa "light" o "dark"');
            return;
        }

        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem(SESSION.THEME_KEY, newTheme);
    };

    // Verificar si el tema actual es oscuro
    const isDark = theme === "dark";

    // Verificar si el tema actual es claro
    const isLight = theme === "light";

    // Valor del contexto
    const value = {
        theme,
        toggleTheme,
        setTheme: setSpecificTheme,
        isDark,
        isLight,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@hooks/useTheme';
import Tooltip from '@components/ui/Tooltip';

/**
 * Componente ThemeToggle
 * Botón para cambiar entre tema claro y oscuro
 */
const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Tooltip content={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}>
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-border transition-colors ${className}`}
                aria-label="Cambiar tema"
            >
                {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                ) : (
                    <Sun className="w-5 h-5" />
                )}
            </button>
        </Tooltip>
    );
};

export default ThemeToggle;
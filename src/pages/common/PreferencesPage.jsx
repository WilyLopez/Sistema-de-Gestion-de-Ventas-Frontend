// src/components/fragments/common/PreferencesPage.jsx
import React from 'react';
import { useTheme } from '@hooks/useTheme';
import { Sun, Moon, Laptop } from 'lucide-react';
import Card from '@components/ui/Card';

const PreferencesPage = () => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        {
            name: 'Claro',
            value: 'light',
            icon: Sun,
        },
        {
            name: 'Oscuro',
            value: 'dark',
            icon: Moon,
        },
        {
            name: 'Sistema',
            value: 'system',
            icon: Laptop,
        },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Preferencias
                </h1>
                <p className="mt-2 text-gray-600 dark:text-dark-muted">
                    Personaliza la apariencia y el comportamiento de la aplicación.
                </p>
            </div>

            <Card>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">
                        Tema de la Aplicación
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`
                                    p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all
                                    ${theme === option.value
                                        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 ring-2 ring-primary-500'
                                        : 'bg-white dark:bg-dark-card border-gray-300 dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-600'
                                    }
                                `}
                            >
                                <option.icon className={`w-8 h-8 ${theme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-dark-muted'}`} />
                                <span className={`font-medium ${theme === option.value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-dark-text'}`}>
                                    {option.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PreferencesPage;
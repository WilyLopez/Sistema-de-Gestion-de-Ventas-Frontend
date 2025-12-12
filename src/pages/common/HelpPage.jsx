// src/components/fragments/common/HelpPage.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Card from '@components/ui/Card';

const faqData = [
    {
        question: '¿Cómo puedo cambiar mi contraseña?',
        answer: 'Puedes cambiar tu contraseña desde el menú de usuario (haciendo clic en tu nombre en la esquina superior derecha) y seleccionando la opción "Cambiar Contraseña". También puedes acceder desde tu perfil.'
    },
    {
        question: '¿Dónde puedo ver mi historial de ventas?',
        answer: 'Si tienes el rol de Vendedor, puedes acceder a "Mis Ventas" desde el menú de navegación principal. Los Administradores pueden ver todas las ventas en la sección de "Ventas" del panel de administración.'
    },
    {
        question: '¿Cómo registro un nuevo producto?',
        answer: 'La creación de productos está disponible para Administradores. Ve a la sección de "Productos" y haz clic en el botón "Nuevo Producto". Deberás completar información como nombre, categoría, proveedor, precio y stock inicial.'
    },
    {
        question: '¿Qué hago si el stock de un producto es bajo?',
        answer: 'El sistema genera alertas de stock bajo automáticamente. Puedes ver estas alertas en el Dashboard o en la sección de "Inventario > Alertas". Deberías contactar al proveedor para reponer el stock.'
    }
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-dark-border">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-1"
            >
                <span className="font-semibold text-gray-800 dark:text-dark-text">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 px-1 text-gray-600 dark:text-dark-muted animate-fade-in">
                    <p>{faq.answer}</p>
                </div>
            )}
        </div>
    );
}

const HelpPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    Centro de Ayuda
                </h1>
                <p className="mt-2 text-gray-600 dark:text-dark-muted">
                    Encuentra respuestas a preguntas frecuentes y aprende a usar el sistema.
                </p>
            </div>

            <Card>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-2">
                        Preguntas Frecuentes
                    </h2>
                    <div className="space-y-2">
                        {faqData.map((faq, index) => (
                            <FaqItem key={index} faq={faq} />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default HelpPage;
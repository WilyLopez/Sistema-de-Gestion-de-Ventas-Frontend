//src/components/ui/Modal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Componente Modal reutilizable
 * Se renderiza en un portal fuera del DOM principal
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    closeOnOverlayClick = true,
    showCloseButton = true,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full mx-4",
    };

    const sizeClass = sizes[size] || sizes.md;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            <div
                className={`relative bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full ${sizeClass} animate-scale-in`}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                            {title}
                        </h3>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;

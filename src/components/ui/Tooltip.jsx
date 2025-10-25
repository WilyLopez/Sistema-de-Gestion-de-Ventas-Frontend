import { useState } from "react";

/**
 * Componente Tooltip reutilizable
 * Muestra información al hacer hover
 */
const Tooltip = ({
    children,
    content,
    position = "top",
    disabled = false,
    className = "",
}) => {
    const [isVisible, setIsVisible] = useState(false);

    if (disabled || !content) {
        return children;
    }

    const positions = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowPositions = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-dark-text",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-dark-text",
        left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-dark-text",
        right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-dark-text",
    };

    const positionClass = positions[position] || positions.top;
    const arrowClass = arrowPositions[position] || arrowPositions.top;

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {isVisible && (
                <div
                    className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-dark-text dark:text-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fade-in ${positionClass}`}
                >
                    {content}
                    <div
                        className={`absolute w-0 h-0 border-4 border-transparent ${arrowClass}`}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;

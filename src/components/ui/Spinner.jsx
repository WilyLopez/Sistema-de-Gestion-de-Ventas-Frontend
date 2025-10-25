/**
 * Componente Spinner reutilizable
 * Indicador de carga animado
 */
const Spinner = ({
    size = "md",
    color = "primary",
    centered = false,
    fullScreen = false,
    text,
    className = "",
}) => {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-3",
        xl: "h-16 w-16 border-4",
    };

    const colors = {
        primary: "border-primary-600 border-t-transparent",
        white: "border-white border-t-transparent",
        gray: "border-gray-600 border-t-transparent",
    };

    const sizeClass = sizes[size] || sizes.md;
    const colorClass = colors[color] || colors.primary;

    const spinner = (
        <div
            className={`${
                centered || fullScreen
                    ? "flex flex-col items-center justify-center"
                    : ""
            } ${fullScreen ? "min-h-screen" : ""}`}
        >
            <div
                className={`animate-spin rounded-full ${sizeClass} ${colorClass} ${className}`}
            />
            {text && (
                <p className="mt-4 text-sm text-gray-600 dark:text-dark-muted">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-dark-bg flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    if (centered) {
        return (
            <div className="flex items-center justify-center p-8">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Spinner;

/**
 * Componente Badge reutilizable
 * Etiquetas pequeñas para estados, categorías, contadores
 */
const Badge = ({
    children,
    variant = "default",
    size = "md",
    rounded = false,
    className = "",
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-medium transition-colors";

    const variants = {
        default:
            "bg-gray-100 text-gray-800 dark:bg-dark-hover dark:text-dark-text",
        primary:
            "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
        success:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    const roundedClass = rounded ? "rounded-full" : "rounded";

    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <span
            className={`${baseStyles} ${variantClass} ${sizeClass} ${roundedClass} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;

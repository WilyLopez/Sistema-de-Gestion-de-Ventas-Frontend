//src/components/ui/Card.jsx
const Card = ({
    children,
    title,
    subtitle,
    footer,
    padding = true,
    className = "",
    headerClassName = "",
    bodyClassName = "",
    footerClassName = "",
}) => {
    const baseStyles =
        "bg-white dark:bg-dark-card rounded-lg shadow-md border border-gray-200 dark:border-dark-border";

    const paddingClass = padding ? "p-6" : "";

    return (
        <div className={`${baseStyles} ${className}`}>
            {(title || subtitle) && (
                <div
                    className={`border-b border-gray-200 dark:border-dark-border pb-4 mb-4 ${paddingClass} ${headerClassName}`}
                >
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className={`${paddingClass} ${bodyClassName}`}>{children}</div>

            {footer && (
                <div
                    className={`border-t border-gray-200 dark:border-dark-border pt-4 mt-4 ${paddingClass} ${footerClassName}`}
                >
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;

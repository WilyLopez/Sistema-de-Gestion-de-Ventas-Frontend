import { forwardRef } from "react";

/**
 * Componente Radio reutilizable
 */
const Radio = forwardRef(
    (
        {
            label,
            description,
            disabled = false,
            error,
            className = "",
            ...props
        },
        ref
    ) => {
        const radioStyles =
            "h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-border dark:bg-dark-card";

        return (
            <div className={className}>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            ref={ref}
                            type="radio"
                            disabled={disabled}
                            className={radioStyles}
                            {...props}
                        />
                    </div>

                    {(label || description) && (
                        <div className="ml-3">
                            {label && (
                                <label className="text-sm font-medium text-gray-700 dark:text-dark-text">
                                    {label}
                                </label>
                            )}
                            {description && (
                                <p className="text-sm text-gray-500 dark:text-dark-muted">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {error && <p className="mt-1 text-sm text-danger">{error}</p>}
            </div>
        );
    }
);

Radio.displayName = "Radio";

export default Radio;

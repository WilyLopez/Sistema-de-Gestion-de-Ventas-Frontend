import { forwardRef } from "react";

/**
 * Componente Input reutilizable
 * Soporta labels, errores, iconos y múltiples tipos
 */
const Input = forwardRef(
    (
        {
            label,
            type = "text",
            placeholder,
            error,
            helperText,
            disabled = false,
            required = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            className = "",
            containerClassName = "",
            ...props
        },
        ref
    ) => {
        const baseInputStyles =
            "block w-full rounded-lg border px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const normalStyles =
            "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:placeholder-dark-muted";

        const errorStyles =
            "border-danger bg-red-50 text-danger placeholder-red-300 focus:border-danger focus:ring-danger dark:bg-red-900/10";

        const inputStyles = error ? errorStyles : normalStyles;

        const widthClass = fullWidth ? "w-full" : "";

        const hasLeftIcon = !!leftIcon;
        const hasRightIcon = !!rightIcon;

        return (
            <div className={`${widthClass} ${containerClassName}`}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                        {label}
                        {required && (
                            <span className="text-danger ml-1">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {hasLeftIcon && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-dark-muted">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        className={`${baseInputStyles} ${inputStyles} ${
                            hasLeftIcon ? "pl-10" : ""
                        } ${hasRightIcon ? "pr-10" : ""} ${className}`}
                        {...props}
                    />

                    {hasRightIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-dark-muted">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && <p className="mt-1 text-sm text-danger">{error}</p>}

                {!error && helperText && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;

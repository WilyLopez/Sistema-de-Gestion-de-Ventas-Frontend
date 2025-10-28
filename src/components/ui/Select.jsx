//src/components/ui/Select.jsx
import { forwardRef } from "react";

const Select = forwardRef(
    (
        {
            label,
            options = [],
            placeholder = "Seleccione una opción",
            error,
            helperText,
            disabled = false,
            required = false,
            fullWidth = false,
            leftIcon,
            className = "",
            containerClassName = "",
            value,
            onChange,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "block w-full rounded-lg border px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-10";
        const normalStyles =
            "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-text";
        const errorStyles =
            "border-danger bg-red-50 text-danger focus:border-danger focus:ring-danger dark:bg-red-900/10";
        const selectStyles = error ? errorStyles : normalStyles;
        const widthClass = fullWidth ? "w-full" : "";

        const handleChange = (e) => {
            const selectedValue = e?.target?.value ?? e;
            console.log('Select onChange - valor seleccionado:', selectedValue);
            if (onChange) {
                onChange(selectedValue);
            }
        };

        return (
            <div className={`${widthClass} ${containerClassName}`}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                        {label}
                        {required && <span className="text-danger ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-dark-muted">
                            {leftIcon}
                        </div>
                    )}
                    <select
                        ref={ref}
                        disabled={disabled}
                        required={required}
                        className={`${baseStyles} ${selectStyles} ${leftIcon ? "pl-10" : ""} ${className}`}
                        value={value || ""}
                        onChange={handleChange}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400 dark:text-dark-muted"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
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

Select.displayName = "Select";
export default Select;
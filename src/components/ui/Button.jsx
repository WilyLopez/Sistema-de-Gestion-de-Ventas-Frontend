import { forwardRef } from "react";

const Button = forwardRef(
    (
        {
            children,
            variant = "primary",
            size = "md",
            type = "button",
            disabled = false,
            loading = false,
            fullWidth = false,
            className = "",
            leftIcon,
            rightIcon,
            onClick,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary:
                "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600",
            secondary:
                "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-dark-hover dark:text-dark-text dark:hover:bg-dark-border",
            danger:
                "bg-danger text-white hover:bg-red-600 focus:ring-danger",
            success:
                "bg-success text-white hover:bg-green-600 focus:ring-success",
            warning:
                "bg-warning text-white hover:bg-yellow-600 focus:ring-warning",
            ghost:
                "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-dark-text dark:hover:bg-dark-hover",
            outline:
                "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-500 dark:text-primary-500 dark:hover:bg-dark-hover",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        };

        const widthClass = fullWidth ? "w-full" : "";
        const variantClass = variants[variant] || variants.primary;
        const sizeClass = sizes[size] || sizes.md;

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || loading}
                onClick={onClick}
                className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
                {...props}
            >
                <span className="inline-flex items-center">
                    {loading ? (
                        <svg
                            key="loading-spinner"
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        leftIcon && <span className="mr-2">{leftIcon}</span>
                    )}
                </span>
                <span>{children}</span>
                {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;

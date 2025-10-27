import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Componente Alert reutilizable
 * Alerta persistente que el usuario debe cerrar manualmente
 */
const Alert = ({
  type = 'info',
  title,
  message,
  children,
  dismissible = true,
  onClose,
  icon: CustomIcon,
  className = '',
}) => {
  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-400',
      titleColor: 'text-green-900 dark:text-green-300',
      iconColor: 'text-green-500',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-400',
      titleColor: 'text-red-900 dark:text-red-300',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-400',
      titleColor: 'text-yellow-900 dark:text-yellow-300',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-400',
      titleColor: 'text-blue-900 dark:text-blue-300',
      iconColor: 'text-blue-500',
    },
  };

  const config = types[type] || types.info;
  const Icon = CustomIcon || config.icon;

  return (
    <div
      className={`
        rounded-lg border p-4
        ${config.bgColor} ${config.borderColor}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}

          {message && (
            <div className={`text-sm ${config.textColor}`}>
              {message}
            </div>
          )}

          {children && (
            <div className={`text-sm ${config.textColor} mt-2`}>
              {children}
            </div>
          )}
        </div>

        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
            aria-label="Cerrar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
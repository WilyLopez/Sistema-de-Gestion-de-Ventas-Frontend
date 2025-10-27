import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Componente Toast individual
 * Notificación temporal que desaparece automáticamente
 */
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500',
      textColor: 'text-green-800 dark:text-green-400',
      iconColor: 'text-green-500',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      textColor: 'text-red-800 dark:text-red-400',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800 dark:text-yellow-400',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800 dark:text-blue-400',
      iconColor: 'text-blue-500',
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
        ${config.bgColor} ${config.borderColor}
        animate-slide-in
      `}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold ${config.textColor} mb-1`}>{title}</p>
        )}
        {message && (
          <p className={`text-sm ${config.textColor}`}>{message}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Contenedor de Toasts
 * Maneja múltiples notificaciones toast
 */
export const ToastContainer = ({ toasts = [], onClose, position = 'top-right' }) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const positionClass = positions[position] || positions['top-right'];

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={`fixed ${positionClass} z-50 flex flex-col gap-3`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
};

export default Toast;
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { AlertTriangle, Info, HelpCircle } from 'lucide-react';

/**
 * Componente ConfirmDialog
 * Modal de confirmación para acciones críticas
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Está seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  children,
}) => {
  const types = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-warning',
      confirmVariant: 'warning',
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-danger',
      confirmVariant: 'danger',
    },
    info: {
      icon: Info,
      iconColor: 'text-info',
      confirmVariant: 'primary',
    },
    question: {
      icon: HelpCircle,
      iconColor: 'text-primary-600',
      confirmVariant: 'primary',
    },
  };

  const config = types[type] || types.warning;
  const Icon = config.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!loading}
      showCloseButton={false}
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-dark-hover mb-4">
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
          {title}
        </h3>

        {message && (
          <p className="text-sm text-gray-500 dark:text-dark-muted mb-4">
            {message}
          </p>
        )}

        {children && (
          <div className="text-sm text-gray-500 dark:text-dark-muted mb-4">
            {children}
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
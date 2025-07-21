import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  selectAlerts,
  removeAlert,
  type Alert,
} from '@/redux/slices/alert-slice';
import { cn } from '@/lib/utils';

const alertIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

interface AlertItemProps {
  alert: Alert;
  onRemove: (id: string) => void;
}

function AlertItem({ alert, onRemove }: AlertItemProps) {
  const IconComponent = alertIcons[alert.type];

  useEffect(() => {
    if (alert.duration) {
      const timer = setTimeout(() => {
        onRemove(alert.id);
      }, alert.duration);

      return () => clearTimeout(timer);
    }
  }, [alert.id, alert.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-sm max-w-md',
        alertStyles[alert.type]
      )}
    >
      <IconComponent
        className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[alert.type])}
      />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{alert.title}</div>
        {alert.message && (
          <div className="text-sm opacity-90 mt-1">{alert.message}</div>
        )}
      </div>

      <button
        onClick={() => onRemove(alert.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function AlertContainer() {
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();

  const handleRemoveAlert = (id: string) => {
    dispatch(removeAlert(id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {alerts.map(alert => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onRemove={handleRemoveAlert}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

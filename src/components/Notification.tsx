import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  onClose: () => void;
}

export function Notification({ notification, onClose }: NotificationProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className={`notification ${notification.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={onClose}
        >
          <span className="notification-icon">
            {notification.type === 'success' && '✅'}
            {notification.type === 'error' && '❌'}
            {notification.type === 'info' && 'ℹ️'}
          </span>
          <span className="notification-message">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

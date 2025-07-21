import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export function SuggestionChip({
  text,
  onClick,
  className,
}: SuggestionChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-2 rounded-full text-sm font-medium',
        'bg-gray-100 text-gray-700 border border-gray-200',
        'hover:bg-gray-200 hover:text-gray-900 hover:border-gray-300',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.button>
  );
}

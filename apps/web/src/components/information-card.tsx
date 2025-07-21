import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InformationCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  valueColor?: string;
  subtitle?: string;
  percentageChange?: string;
  children?: ReactNode;
  // Motion props
  variants?: Variants;
  className?: string;
  // Responsive props
  priority?: 'high' | 'medium' | 'low';
}

export function InformationCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-gray-600',
  iconBgColor = 'bg-gray-50',
  valueColor = 'text-gray-900',
  subtitle,
  percentageChange,
  children,
  variants,
  className = '',
  priority = 'medium',
}: InformationCardProps) {
  const getPriorityClasses = () => {
    switch (priority) {
      case 'high':
        return 'ring-2 ring-red-100 bg-red-50/30';
      case 'low':
        return 'bg-gray-50/50';
      default:
        return 'bg-white';
    }
  };

  // Simplified responsive layout - always vertical but with responsive spacing
  const layout = {
    container: 'block',
    header: 'flex items-center justify-between',
    content: 'mt-2 sm:mt-3',
    icon: '',
  };

  return (
    <motion.div
      className={`rounded-lg p-4 sm:p-4 shadow-sm border border-gray-200 ${getPriorityClasses()} ${className}`}
      variants={variants}
      whileHover={{
        scale: 1.02,
        boxShadow:
          '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className={layout.container}>
        <div className={layout.header}>
          <h3 className="font-medium text-gray-500 text-sm sm:text-base truncate">
            {title}
          </h3>
          <div
            className={`h-8 w-8 sm:h-8 sm:w-8 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0 ${layout.icon}`}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        <div className={layout.content}>
          <p className={`text-xl sm:text-2xl font-semibold ${valueColor}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}
          {percentageChange && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {percentageChange}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </motion.div>
  );
}

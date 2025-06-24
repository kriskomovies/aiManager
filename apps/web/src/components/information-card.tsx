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
}: InformationCardProps) {
  return (
    <motion.div 
      className={`rounded-lg bg-white p-4 shadow-sm border border-gray-200 ${className}`}
      variants={variants}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-500">{title}</h3>
        <div className={`h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className={`text-2xl font-semibold mt-2 ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
      {percentageChange && (
        <p className="text-sm text-gray-500">{percentageChange}</p>
      )}
      {children}
    </motion.div>
  );
}

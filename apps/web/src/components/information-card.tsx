import { ReactNode } from 'react';
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
  children
}: InformationCardProps) {
  const hasSubtitle = subtitle || percentageChange;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <div className={hasSubtitle ? "space-y-1" : "space-y-0"}>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        {percentageChange && (
          <p className="text-xs text-gray-500">{percentageChange}</p>
        )}
        {children}
      </div>
    </div>
  );
}

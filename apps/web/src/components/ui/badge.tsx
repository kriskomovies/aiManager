import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'positive' | 'negative' | 'neutral' | 'warning';
  value?: number;
  suffix?: string;
  autoColor?: boolean; // Automatically determine color based on value
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  positive: 'bg-green-100 text-green-800 border-green-200',
  negative: 'bg-red-100 text-red-800 border-red-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  warning: 'bg-red-100 text-red-800 border-red-200',
};

export function Badge({
  className,
  variant = 'default',
  value,
  suffix = '',
  autoColor = false,
  children,
  ...props
}: BadgeProps) {
  // Auto-determine variant based on value if autoColor is true
  let finalVariant = variant;
  if (autoColor && typeof value === 'number') {
    if (value > 0) {
      finalVariant = 'positive';
    } else if (value < 0) {
      finalVariant = 'negative';
    } else {
      finalVariant = 'neutral';
    }
  }

  const displayValue =
    typeof value === 'number' ? `${value.toFixed(2)}${suffix}` : children;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        badgeVariants[finalVariant],
        className
      )}
      {...props}
    >
      {displayValue}
    </span>
  );
}

// Helper components for specific use cases
export function CashBadge({
  value,
  ...props
}: { value: number } & Omit<BadgeProps, 'value' | 'autoColor' | 'suffix'>) {
  return <Badge value={value} suffix=" лв." autoColor {...props} />;
}

export function DebtBadge({
  value,
  ...props
}: { value: number } & Omit<BadgeProps, 'value' | 'variant' | 'suffix'>) {
  return (
    <Badge
      value={value}
      suffix=" лв."
      variant={value > 0 ? 'negative' : 'neutral'}
      {...props}
    />
  );
}

export function IrregularitiesBadge({
  count,
  ...props
}: { count: number } & Omit<BadgeProps, 'value' | 'variant' | 'autoColor'>) {
  return (
    <Badge variant={count > 0 ? 'warning' : 'neutral'} {...props}>
      {count}
    </Badge>
  );
}

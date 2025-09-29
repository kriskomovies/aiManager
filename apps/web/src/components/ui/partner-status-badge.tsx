import { Badge, BadgeProps } from './badge';
import { PartnerStatus } from '@/pages/partners/add-edit-partner.schema';

interface PartnerStatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: PartnerStatus;
  size?: 'sm' | 'md';
}

export function PartnerStatusBadge({ status, size = 'sm', className, ...props }: PartnerStatusBadgeProps) {
  const statusConfig: Record<PartnerStatus, { label: string; variant: 'positive' | 'neutral' | 'warning' | 'negative' }> = {
    [PartnerStatus.ACTIVE]: {
      label: 'Активен',
      variant: 'positive',
    },
    [PartnerStatus.INACTIVE]: {
      label: 'Неактивен',
      variant: 'neutral',
    },
    [PartnerStatus.PENDING]: {
      label: 'Чакащ',
      variant: 'warning',
    },
    [PartnerStatus.SUSPENDED]: {
      label: 'Спрян',
      variant: 'negative',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'md' ? 'text-sm px-3 py-1' : '';

  return (
    <Badge variant={config.variant} className={`${sizeClasses} ${className || ''}`} {...props}>
      {config.label}
    </Badge>
  );
}

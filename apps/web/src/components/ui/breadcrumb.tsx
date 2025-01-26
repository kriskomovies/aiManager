import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbsProps
  extends React.ComponentPropsWithoutRef<'nav'> {
  segments: {
    label: string;
    href?: string;
  }[];
  separator?: React.ComponentType<{ className?: string }>;
}

export function Breadcrumbs({
  segments,
  separator: Separator = ChevronRight,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="breadcrumbs"
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1;

        return (
          <React.Fragment key={segment.label}>
            {segment.href ? (
              <a
                href={segment.href}
                className={cn(
                  'truncate transition-colors hover:text-foreground',
                  isLastSegment && 'text-foreground font-medium'
                )}
              >
                {segment.label}
              </a>
            ) : (
              <span
                className={cn(
                  'truncate',
                  isLastSegment && 'text-foreground font-medium'
                )}
              >
                {segment.label}
              </span>
            )}
            {!isLastSegment && <Separator className="h-4 w-4" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

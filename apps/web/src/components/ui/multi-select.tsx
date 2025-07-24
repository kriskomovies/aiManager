import * as React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    { options, value, onChange, placeholder = 'Изберете опции...', className },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleToggleOption = (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    };

    const handleRemoveOption = (optionValue: string) => {
      onChange(value.filter(v => v !== optionValue));
    };

    const selectedOptions = options.filter(option =>
      value.includes(option.value)
    );

    return (
      <div ref={ref} className={cn('relative', className)}>
        <div
          className="flex min-h-9 w-full items-center justify-between rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs"
                >
                  {option.label}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveOption(option.value);
                    }}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover p-1 shadow-md">
            {options.map(option => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center space-x-2 rounded-full px-2 py-1.5 my-1.5 text-sm cursor-pointer hover:bg-accent',
                  value.includes(option.value) && 'bg-accent'
                )}
                onClick={() => handleToggleOption(option.value)}
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  {value.includes(option.value) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);
MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };

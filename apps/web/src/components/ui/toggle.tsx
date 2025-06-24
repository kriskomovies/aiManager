import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed = false, onPressedChange, disabled = false, label, id, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onPressedChange) {
        onPressedChange(!pressed);
      }
    };

    const toggleElement = (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={pressed}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          pressed ? 'bg-red-500' : 'bg-gray-200',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            pressed ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    );

    if (label) {
      return (
        <div className="flex items-center space-x-3">
          <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
            {label}
          </label>
          {toggleElement}
        </div>
      );
    }

    return toggleElement;
  }
);
Toggle.displayName = 'Toggle';

export { Toggle }; 
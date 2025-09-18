'use client';

import * as React from 'react';
import { cn } from '@eventon/ui';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full border border-input bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          checked ? 'bg-primary' : 'bg-muted',
          className,
        )}
        onClick={(event) => {
          props.onClick?.(event);
          onCheckedChange?.(!checked);
        }}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>
    );
  },
);
Switch.displayName = 'Switch';

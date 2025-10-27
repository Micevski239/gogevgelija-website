import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // Primary button - #B91C1C background
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-xl active:scale-95',
        // Secondary button - outlined
        secondary: 'border-2 border-primary text-primary hover:bg-primary/5 active:scale-95',
        // Outline button - subtle border
        outline: 'border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface',
        // Ghost button - no background
        ghost: 'hover:bg-light-surface dark:hover:bg-dark-surface',
        // Link button - text only
        link: 'text-primary hover:underline',
        // Danger button - error color
        danger: 'bg-error text-white hover:bg-error/90 shadow-lg active:scale-95',
      },
      size: {
        sm: 'text-sm px-3 py-1.5 h-8',
        md: 'text-base px-4 py-2 h-10',
        lg: 'text-lg px-6 py-3 h-12',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  error,
  className = '',
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}, ref) => {
  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground/80 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={`block w-full rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all ${
            startIcon ? 'pl-10' : 'pl-3'
          } ${endIcon ? 'pr-10' : 'pr-3'} py-2.5 text-base ${
            error ? 'border-error' : ''
          }`}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-primary-foreground hover:bg-primary/85',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                outline: 'border-border bg-background text-foreground hover:bg-muted',
                ghost: 'text-foreground hover:bg-muted',
            },
            size: {
                sm: 'h-8 px-3',
                md: 'h-10 px-4',
                lg: 'h-12 px-5 text-base',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

export type ButtonProps = ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
    return <ButtonPrimitive className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

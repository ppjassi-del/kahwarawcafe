import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn-contemporary group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-base font-semibold cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4.5 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30",
        accent:
          "bg-accent text-accent-foreground shadow-md shadow-accent/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/40",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline:
          "border border-border/80 bg-background/80 backdrop-blur-sm shadow-xs hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-md",
        glass: "btn-glass text-primary-foreground backdrop-blur-md hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 hover:shadow-md",
        ghost: "hover:bg-accent/10 hover:text-accent hover:shadow-xs",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent before:hidden",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-base",
        sm: "h-9 rounded-full px-4 text-sm",
        lg: "h-13 rounded-full px-8 text-lg",
        xl: "min-h-14 rounded-full px-9 py-4 text-lg tracking-wide",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

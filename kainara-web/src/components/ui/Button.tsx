"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-emas text-sogan-900 hover:bg-emas-400 active:bg-emas-600 shadow-[var(--shadow-gold)] font-bold tracking-wide",
  secondary:
    "bg-sogan-800 text-ivory hover:bg-sogan-900 active:bg-sogan-700 font-semibold shadow-xs",
  ghost:
    "bg-transparent text-sogan-700 hover:bg-sogan-100 active:bg-sogan-200 font-medium",
  outline:
    "border border-sogan-300 text-sogan-800 hover:bg-sogan-100/70 active:bg-sogan-200 bg-transparent font-semibold",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs min-h-[36px] rounded-full",
  md: "px-6 py-2.5 text-sm min-h-[44px] rounded-full",
  lg: "px-8 py-3.5 text-base min-h-[48px] rounded-full",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      children,
      disabled,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled ?? loading}
        className={[
          "inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emas-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...rest}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="inline-block size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export { Button };

import React from "react";

type Variant = "default" | "secondary" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        {
          default: "bg-blue-500 text-white",
          secondary: "bg-gray-100 text-gray-800",
          outline: "border border-gray-300 bg-white text-gray-800",
          danger: "bg-red-500 text-white",
          success: "bg-green-500 text-white",
        }[variant],
        {
          sm: "px-2 py-0.5 text-xs",
          md: "px-2.5 py-0.5 text-sm",
          lg: "px-3 py-1 text-base",
        }[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;

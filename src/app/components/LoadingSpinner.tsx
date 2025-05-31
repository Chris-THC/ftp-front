"use client";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );
};

// Componente con texto de carga
export const LoadingWithText = ({
  text = "Cargando...",
  size = "md",
}: {
  text?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <LoadingSpinner size={size} />
      <p className="text-sm text-gray-600 animate-pulse">{text}</p>
    </div>
  );
};

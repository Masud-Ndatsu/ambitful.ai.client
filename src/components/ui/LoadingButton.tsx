import { memo, forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  loadingIcon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const LoadingButton = memo(
  forwardRef<HTMLButtonElement, LoadingButtonProps>(
    (
      {
        children,
        loading = false,
        loadingText,
        loadingIcon = <Loader2 className="h-4 w-4 animate-spin" />,
        iconPosition = "left",
        disabled,
        className,
        ...props
      },
      ref
    ) => {
      const isDisabled = loading || disabled;
      const displayText = loading ? loadingText || children : children;

      return (
        <Button
          ref={ref}
          disabled={isDisabled}
          className={cn(className)}
          {...props}
        >
          {loading && iconPosition === "left" && (
            <span className="mr-2">{loadingIcon}</span>
          )}
          {displayText}
          {loading && iconPosition === "right" && (
            <span className="ml-2">{loadingIcon}</span>
          )}
        </Button>
      );
    }
  )
);

LoadingButton.displayName = "LoadingButton";

// Flexible overlay loader for any container
interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
  blur?: boolean;
}

export const LoadingOverlay = memo(
  ({
    loading,
    message = "Loading...",
    className,
    overlayClassName,
    children,
    blur = true,
  }: LoadingOverlayProps) => {
    return (
      <div className={cn("relative", className)}>
        {children}
        {loading && (
          <div
            className={cn(
              "absolute inset-0 z-50 flex items-center justify-center",
              "bg-background/80 backdrop-blur-sm",
              !blur && "backdrop-blur-none",
              overlayClassName
            )}
          >
            <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-6 shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {message}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

LoadingOverlay.displayName = "LoadingOverlay";

// Skeleton loader for content placeholders
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  animated?: boolean;
  width?: string | number;
  height?: string | number;
}

export const LoadingSkeleton = memo(
  ({
    lines = 3,
    className,
    animated = true,
    width = "100%",
    height = "1rem",
  }: LoadingSkeletonProps) => {
    const skeletonClass = cn(
      "bg-muted rounded",
      animated && "animate-pulse",
      className
    );

    if (lines === 1) {
      return <div className={skeletonClass} style={{ width, height }} />;
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={skeletonClass}
            style={{
              width: index === lines - 1 ? "75%" : width,
              height,
            }}
          />
        ))}
      </div>
    );
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

// Spinner component for various sizes
interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LoadingSpinner = memo(
  ({ size = "md", className }: LoadingSpinnerProps) => {
    const sizeClasses = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    };

    return (
      <Loader2
        className={cn(
          sizeClasses[size],
          "animate-spin text-primary",
          className
        )}
      />
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

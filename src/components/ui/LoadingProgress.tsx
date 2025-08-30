import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export type LoadingState = "loading" | "success" | "error" | "idle";

interface LoadingProgressProps {
  state: LoadingState;
  message?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "card";
}

export const LoadingProgress = memo(
  ({
    state,
    message,
    progress = 0,
    showProgress = false,
    className,
    size = "md",
    variant = "default",
  }: LoadingProgressProps) => {
    if (state === "idle") return null;

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    const renderIcon = () => {
      switch (state) {
        case "loading":
          return (
            <Loader2
              className={cn(iconSizes[size], "animate-spin text-blue-500")}
            />
          );
        case "success":
          return (
            <CheckCircle className={cn(iconSizes[size], "text-green-500")} />
          );
        case "error":
          return <XCircle className={cn(iconSizes[size], "text-red-500")} />;
        default:
          return null;
      }
    };

    const renderContent = () => {
      const icon = renderIcon();
      const text = message || getDefaultMessage(state);

      const content = (
        <>
          <div className="flex items-center gap-3">
            {icon}
            <span className={cn(sizeClasses[size], "font-medium")}>{text}</span>
          </div>
          {showProgress && state === "loading" && (
            <div className="mt-3 space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-muted-foreground text-right">
                {Math.round(progress)}%
              </div>
            </div>
          )}
        </>
      );

      switch (variant) {
        case "minimal":
          return (
            <div className={cn("flex items-center gap-2", className)}>
              {icon}
              <span className={cn(sizeClasses[size])}>{text}</span>
            </div>
          );
        case "card":
          return (
            <div
              className={cn(
                "rounded-lg border bg-card p-4 text-card-foreground shadow-sm",
                className
              )}
            >
              {content}
            </div>
          );
        default:
          return (
            <div className={cn("flex flex-col items-center", className)}>
              {content}
            </div>
          );
      }
    };

    return renderContent();
  }
);

LoadingProgress.displayName = "LoadingProgress";

function getDefaultMessage(state: LoadingState): string {
  switch (state) {
    case "loading":
      return "Processing...";
    case "success":
      return "Completed successfully";
    case "error":
      return "An error occurred";
    default:
      return "";
  }
}

// Hook for managing loading states with progress
export function useLoadingProgress(initialState: LoadingState = "idle") {
  const [state, setState] = useState<LoadingState>(initialState);
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const startLoading = useCallback((msg?: string) => {
    setState("loading");
    setMessage(msg || "");
    setProgress(0);
  }, []);

  const updateProgress = useCallback((value: number, msg?: string) => {
    setProgress(Math.min(100, Math.max(0, value)));
    if (msg) setMessage(msg);
  }, []);

  const setSuccess = useCallback((msg?: string) => {
    setState("success");
    setMessage(msg || "");
    setProgress(100);
  }, []);

  const setError = useCallback((msg?: string) => {
    setState("error");
    setMessage(msg || "");
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setMessage("");
    setProgress(0);
  }, []);

  return {
    state,
    message,
    progress,
    startLoading,
    updateProgress,
    setSuccess,
    setError,
    reset,
  };
}

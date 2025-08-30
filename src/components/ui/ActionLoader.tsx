/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LoadingProgress,
  LoadingState,
  useLoadingProgress,
} from "./LoadingProgress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionLoaderProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  state: LoadingState;
  message?: string;
  progress?: number;
  showProgress?: boolean;
  allowCancel?: boolean;
  onCancel?: () => void;
  className?: string;
}

export const ActionLoader = memo(
  ({
    isOpen,
    onClose,
    title = "Processing",
    state,
    message,
    progress = 0,
    showProgress = false,
    allowCancel = false,
    onCancel,
    className,
  }: ActionLoaderProps) => {
    const handleClose = () => {
      if (state === "loading" && !allowCancel) return;
      onClose?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onClose?.();
    };

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className={cn("sm:max-w-md", className)}
          hidden={state === "loading" && !allowCancel}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <LoadingProgress
              state={state}
              message={message}
              progress={progress}
              showProgress={showProgress}
              size="md"
              variant="default"
            />
          </div>
          {(allowCancel && state === "loading") ||
          state === "error" ||
          state === "success" ? (
            <div className="flex justify-end gap-2">
              {allowCancel && state === "loading" && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              {(state === "error" || state === "success") && (
                <Button onClick={onClose}>
                  {state === "error" ? "Close" : "Done"}
                </Button>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }
);

ActionLoader.displayName = "ActionLoader";

// Inline loader for buttons and small spaces
interface InlineActionLoaderProps {
  state: LoadingState;
  message?: string;
  className?: string;
  size?: "sm" | "md";
}

export const InlineActionLoader = memo(
  ({ state, message, className, size = "sm" }: InlineActionLoaderProps) => {
    if (state === "idle") return null;

    return (
      <LoadingProgress
        state={state}
        message={message}
        size={size}
        variant="minimal"
        className={className}
      />
    );
  }
);

InlineActionLoader.displayName = "InlineActionLoader";

// Hook for managing action loader state
export interface UseActionLoaderOptions {
  onSuccess?: (result?: any) => void;
  onError?: (error?: Error) => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function useActionLoader(options: UseActionLoaderOptions = {}) {
  const {
    onSuccess,
    onError,
    autoClose = true,
    autoCloseDelay = 2000,
  } = options;
  const [isOpen, setIsOpen] = useState(false);
  const progressState = useLoadingProgress();

  const executeAction = useCallback(
    async function <T>(
      action: () => Promise<T>,
      actionOptions: {
        loadingMessage?: string;
        successMessage?: string;
        errorMessage?: string;
        showProgress?: boolean;
        allowCancel?: boolean;
        onCancel?: () => void;
      }
    ): Promise<T | null> {
      const {
        loadingMessage,
        successMessage,
        errorMessage,
        showProgress = false,
        allowCancel = false,
        onCancel,
      } = actionOptions;

      try {
        setIsOpen(true);
        progressState.startLoading(loadingMessage);

        const result = await action();

        progressState.setSuccess(successMessage);
        onSuccess?.(result);

        if (autoClose) {
          setTimeout(() => {
            setIsOpen(false);
            progressState.reset();
          }, autoCloseDelay);
        }

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : errorMessage || "An error occurred";
        progressState.setError(errorMsg);
        onError?.(error instanceof Error ? error : new Error(errorMsg));
        return null;
      }
    },
    [progressState, onSuccess, onError, autoClose, autoCloseDelay, setIsOpen]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    progressState.reset();
  }, [progressState]);

  return {
    isOpen,
    state: progressState.state,
    message: progressState.message,
    progress: progressState.progress,
    executeAction,
    updateProgress: progressState.updateProgress,
    close,
    setIsOpen,
  };
}

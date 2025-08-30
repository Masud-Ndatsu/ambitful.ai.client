import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LoadingProgress,
  useLoadingProgress,
  LoadingState,
} from "@/components/ui/LoadingProgress";
import {
  ActionLoader,
  InlineActionLoader,
  useActionLoader,
} from "@/components/ui/ActionLoader";
import {
  LoadingButton,
  LoadingOverlay,
  LoadingSkeleton,
  LoadingSpinner,
} from "@/components/ui/LoadingButton";

export function LoaderExamples() {
  const [basicState, setBasicState] = useState<LoadingState>("idle");
  const progressLoader = useLoadingProgress();
  const actionLoader = useActionLoader();
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Simulate action with progress
  const simulateProgress = async () => {
    progressLoader.startLoading("Initializing...");
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      progressLoader.updateProgress(
        i, 
        i < 100 ? `Processing... ${i}%` : "Finalizing..."
      );
    }
    
    progressLoader.setSuccess("Process completed successfully!");
    
    setTimeout(() => {
      progressLoader.reset();
    }, 2000);
  };

  // Simulate API call
  const simulateApiCall = async () => {
    await actionLoader.executeAction(
      async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { data: "Success!" };
      },
      {
        loadingMessage: "Saving changes...",
        successMessage: "Changes saved successfully!",
        errorMessage: "Failed to save changes",
      }
    );
  };

  // Simulate overlay loading
  const simulateOverlayLoading = async () => {
    setOverlayLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setOverlayLoading(false);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Loader Components Examples</h1>
        <p className="text-muted-foreground">
          Reusable loading components that can be used in buttons, modals, and any container with flexible sizing.
        </p>
      </div>

      {/* Basic Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setBasicState("loading")} variant="outline">
              Loading
            </Button>
            <Button onClick={() => setBasicState("success")} variant="outline">
              Success
            </Button>
            <Button onClick={() => setBasicState("error")} variant="outline">
              Error
            </Button>
            <Button onClick={() => setBasicState("idle")} variant="outline">
              Reset
            </Button>
          </div>
          <LoadingProgress
            state={basicState}
            message="Custom message here"
            size="md"
          />
        </CardContent>
      </Card>

      {/* Progress Loader */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Loader</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={simulateProgress} disabled={progressLoader.state === "loading"}>
            Start Progress Simulation
          </Button>
          <LoadingProgress
            state={progressLoader.state}
            message={progressLoader.message}
            progress={progressLoader.progress}
            showProgress={true}
            size="lg"
            variant="card"
            className="w-full max-w-md"
          />
        </CardContent>
      </Card>

      {/* Action Loader Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Action Loader Modal</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={simulateApiCall}>
            Simulate API Call
          </Button>
          <ActionLoader
            isOpen={actionLoader.isOpen}
            onClose={actionLoader.close}
            title="Processing Request"
            state={actionLoader.state}
            message={actionLoader.message}
            className="sm:max-w-lg" // Custom width
          />
        </CardContent>
      </Card>

      {/* Loading Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <LoadingButton
              loading={basicState === "loading"}
              loadingText="Saving..."
              onClick={() => setBasicState("loading")}
            >
              Save Changes
            </LoadingButton>
            
            <LoadingButton
              loading={basicState === "loading"}
              loadingText="Deleting..."
              variant="destructive"
              iconPosition="right"
              onClick={() => setBasicState("loading")}
            >
              Delete Item
            </LoadingButton>
            
            <LoadingButton
              loading={basicState === "loading"}
              size="sm"
              variant="outline"
              onClick={() => setBasicState("loading")}
            >
              Small Button
            </LoadingButton>
          </div>
        </CardContent>
      </Card>

      {/* Inline Loaders */}
      <Card>
        <CardHeader>
          <CardTitle>Inline Loaders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span>Status:</span>
            <InlineActionLoader
              state={basicState}
              message="Processing your request"
              size="sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <span>Large Status:</span>
            <InlineActionLoader
              state={basicState}
              message="Large inline loader"
              size="md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Overlay</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={simulateOverlayLoading} disabled={overlayLoading}>
            Show Overlay Loader
          </Button>
          <LoadingOverlay
            loading={overlayLoading}
            message="Loading content..."
            className="mt-4 h-64 rounded-lg border"
          >
            <div className="p-8">
              <h3 className="text-lg font-semibold mb-4">Content Area</h3>
              <p className="text-muted-foreground">
                This content will be overlaid with a loading spinner when the overlay is active.
                The overlay can be applied to any container and will cover the entire area.
              </p>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </LoadingOverlay>
        </CardContent>
      </Card>

      {/* Loading Skeletons */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Skeletons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Default Skeleton</h4>
            <LoadingSkeleton lines={3} />
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Custom Sized Skeleton</h4>
            <LoadingSkeleton
              lines={1}
              height="3rem"
              width="200px"
              className="bg-blue-100"
            />
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Static Skeleton</h4>
            <LoadingSkeleton lines={4} animated={false} />
          </div>
        </CardContent>
      </Card>

      {/* Loading Spinners */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Spinners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="xs" />
              <span className="text-xs">Extra Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-xs">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="md" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="lg" />
              <span className="text-xs">Large</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="xl" />
              <span className="text-xs">Extra Large</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive & Custom Sizing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LoadingProgress
              state="loading"
              message="Small Card"
              variant="card"
              className="h-32"
            />
            <LoadingProgress
              state="success"
              message="Medium Card"
              variant="card"
              className="h-40"
            />
            <LoadingProgress
              state="error"
              message="Large Card"
              variant="card"
              className="h-48"
            />
          </div>
          
          <LoadingProgress
            state="loading"
            message="Full width progress bar"
            progress={75}
            showProgress={true}
            variant="card"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
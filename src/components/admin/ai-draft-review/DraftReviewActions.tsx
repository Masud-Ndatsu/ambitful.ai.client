import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, RefreshCw, Edit, Save } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface DraftReviewActionsProps {
  isEditing: boolean;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  approving?: boolean;
  rejecting?: boolean;
  regenerating?: boolean;
  saving?: boolean;
}

export const DraftReviewActions = memo(
  ({
    isEditing,
    feedback,
    onFeedbackChange,
    onApprove,
    onReject,
    onRegenerate,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    approving = false,
    rejecting = false,
    regenerating = false,
    saving = false,
  }: DraftReviewActionsProps) => {
    const isAnyLoading = approving || rejecting || regenerating || saving;
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Feedback</Label>
          <Textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="Add feedback about the AI extraction quality..."
            rows={3}
            className="mt-2"
            disabled={isAnyLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {isEditing ? (
            <>
              <LoadingButton
                onClick={onSaveEdit}
                loading={saving}
                loadingText="Saving..."
                disabled={isAnyLoading && !saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </LoadingButton>
              <Button
                variant="outline"
                onClick={onCancelEdit}
                disabled={isAnyLoading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <LoadingButton
                onClick={onApprove}
                loading={approving}
                loadingText="Approving..."
                disabled={isAnyLoading && !approving}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve & Create Opportunity
              </LoadingButton>
              <Button
                variant="outline"
                onClick={onStartEdit}
                disabled={isAnyLoading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <LoadingButton
                variant="outline"
                onClick={onRegenerate}
                loading={regenerating}
                loadingText="Re-extracting..."
                disabled={isAnyLoading && !regenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-extract
              </LoadingButton>
              <LoadingButton
                variant="destructive"
                onClick={onReject}
                loading={rejecting}
                loadingText="Rejecting..."
                disabled={isAnyLoading && !rejecting}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </LoadingButton>
            </>
          )}
        </div>
      </div>
    );
  }
);

DraftReviewActions.displayName = "DraftReviewActions";

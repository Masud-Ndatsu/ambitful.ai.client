import { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AIDraft } from "@/hooks/use-ai-drafts";
import { DraftHeader } from "./DraftHeader";
import { DraftExtractedData } from "./DraftExtractedData";
import { DraftDetails } from "./DraftDetails";
import { DraftReviewActions } from "./DraftReviewActions";
import { LoadingOverlay } from "@/components/ui/LoadingButton";
import { OpportunityTypeType } from "@/enums";

interface DraftContentReviewProps {
  selectedDraft: AIDraft;
  fullDraft: AIDraft | null;
  isEditing: boolean;
  editedTitle: string;
  editedDescription: string;
  editedType: OpportunityTypeType;
  editedDeadline: string;
  editedLocation: string;
  editedAmount: string;
  editedLink: string;
  feedback: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: OpportunityTypeType) => void;
  onDeadlineChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onLinkChange: (value: string) => void;
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
  loadingDraft?: boolean;
}

export const DraftContentReview = memo(
  ({
    selectedDraft,
    fullDraft,
    isEditing,
    editedTitle,
    editedDescription,
    editedType,
    editedDeadline,
    editedLocation,
    editedAmount,
    editedLink,
    feedback,
    onTitleChange,
    onDescriptionChange,
    onTypeChange,
    onDeadlineChange,
    onLocationChange,
    onAmountChange,
    onLinkChange,
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
    loadingDraft = false,
  }: DraftContentReviewProps) => {
    return (
      <div className="lg:col-span-2">
        <LoadingOverlay
          loading={loadingDraft}
          message="Loading draft details..."
          className="min-h-[500px]"
        >
          <Card>
            <DraftHeader selectedDraft={selectedDraft} fullDraft={fullDraft} />

            <CardContent>
              <Tabs defaultValue="extracted" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="extracted" className="space-y-4">
                  <DraftExtractedData
                    fullDraft={fullDraft}
                    isEditing={isEditing}
                    editedTitle={editedTitle}
                    editedDescription={editedDescription}
                    editedType={editedType}
                    editedDeadline={editedDeadline}
                    editedLocation={editedLocation}
                    editedAmount={editedAmount}
                    editedLink={editedLink}
                    onTitleChange={onTitleChange}
                    onDescriptionChange={onDescriptionChange}
                    onTypeChange={onTypeChange}
                    onDeadlineChange={onDeadlineChange}
                    onLocationChange={onLocationChange}
                    onAmountChange={onAmountChange}
                    onLinkChange={onLinkChange}
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <DraftDetails fullDraft={fullDraft} />
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <DraftReviewActions
                isEditing={isEditing}
                feedback={feedback}
                onFeedbackChange={onFeedbackChange}
                onApprove={onApprove}
                onReject={onReject}
                onRegenerate={onRegenerate}
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                approving={approving}
                rejecting={rejecting}
                regenerating={regenerating}
                saving={saving}
              />
            </CardContent>
          </Card>
        </LoadingOverlay>
      </div>
    );
  }
);

DraftContentReview.displayName = "DraftContentReview";

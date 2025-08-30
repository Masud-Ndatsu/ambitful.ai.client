import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAIDrafts, AIDraft } from "@/hooks/use-ai-drafts";
import { DraftsList } from "./ai-draft-review/DraftsList";
import { DraftContentReview } from "./ai-draft-review/DraftContentReview";
import { useActionLoader } from "@/components/ui/ActionLoader";
import { ActionLoader } from "@/components/ui/ActionLoader";
import { useToast } from "@/hooks/use-toast";

import { OpportunityType, OpportunityTypeType } from "@/enums";

export function AIDraftReview() {
  const {
    drafts,
    total,
    page,
    totalPages,
    loading,
    error,
    refetch,
    reviewDraft,
    deleteDraft,
    regenerateDraft,
    setPage,
  } = useAIDrafts({ status: "pending", page: 1, limit: 4 });

  console.log({ drafts });

  const [selectedDraft, setSelectedDraft] = useState<AIDraft | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedType, setEditedType] = useState<OpportunityTypeType>(
    OpportunityType.SCHOLARSHIP
  );
  const [editedDeadline, setEditedDeadline] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [fullDraft, setFullDraft] = useState<AIDraft | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const { toast } = useToast();

  const { getDraftById } = useAIDrafts();

  // Load full draft details
  const loadFullDraft = useCallback(
    async (draftId: string) => {
      try {
        setLoadingDraft(true);
        const draft = await getDraftById(draftId);
        setFullDraft(draft);
        setEditedTitle(draft.extractedTitle || "");
        setEditedDescription(draft.extractedDescription || "");
        setEditedType(draft.extractedType || OpportunityType.SCHOLARSHIP);
        setEditedDeadline(
          draft.extractedDeadline
            ? new Date(draft.extractedDeadline).toISOString().split("T")[0]
            : ""
        );
        setEditedLocation(draft.extractedLocation || "");
        setEditedAmount(draft.extractedAmount || "");
        setEditedLink(draft.extractedLink || "");
        setFeedback(draft.feedback || "");
      } catch (error) {
        console.error("Failed to load draft details:", error);
        toast({
          title: "Error",
          description: "Failed to load draft details",
          variant: "destructive",
        });
      } finally {
        setLoadingDraft(false);
      }
    },
    [getDraftById, toast]
  );

  // Update selected draft when drafts load
  useEffect(() => {
    if (drafts.length > 0 && !selectedDraft) {
      setSelectedDraft(drafts[0]);
      loadFullDraft(drafts[0].id);
    }
  }, [drafts, selectedDraft]);

  const handleDraftSelect = useCallback(
    (draft: AIDraft) => {
      setSelectedDraft(draft);
      loadFullDraft(draft.id);
      setIsEditing(false);
    },
    [loadFullDraft]
  );

  const handleApprove = useCallback(async () => {
    if (!selectedDraft) return;
    try {
      setApproving(true);
      await reviewDraft(selectedDraft.id, "approve", feedback);
      toast({
        title: "Success",
        description: "Draft approved and opportunity created successfully",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to approve draft:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to approve draft",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  }, [selectedDraft, reviewDraft, feedback, refetch, toast]);

  const handleReject = useCallback(async () => {
    if (!selectedDraft) return;
    try {
      setRejecting(true);
      await reviewDraft(selectedDraft.id, "reject", feedback);
      toast({
        title: "Success",
        description: "Draft rejected successfully",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to reject draft:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reject draft",
        variant: "destructive",
      });
    } finally {
      setRejecting(false);
    }
  }, [selectedDraft, reviewDraft, feedback, refetch, toast]);

  const handleRegenerate = useCallback(async () => {
    if (!selectedDraft) return;
    try {
      setRegenerating(true);
      await regenerateDraft(selectedDraft.id);
      toast({
        title: "Success",
        description: "Draft re-extracted successfully",
        variant: "default",
      });
      refetch();
      // Reload the full draft to get updated data
      loadFullDraft(selectedDraft.id);
    } catch (error) {
      console.error("Failed to regenerate draft:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to re-extract draft",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  }, [selectedDraft, regenerateDraft, refetch, toast, loadFullDraft]);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedDraft) return;
    try {
      setSaving(true);
      const edits = {
        title: editedTitle,
        description: editedDescription,
        type: editedType,
        deadline: editedDeadline ? new Date(editedDeadline) : null,
        location: editedLocation || null,
        amount: editedAmount || null,
        link: editedLink || null,
      };

      await reviewDraft(selectedDraft.id, "edit", feedback, edits);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Draft edits saved successfully",
        variant: "default",
      });
      refetch();
      // Reload the full draft to get updated data
      loadFullDraft(selectedDraft.id);
    } catch (error) {
      console.error("Failed to save edits:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save edits",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [
    selectedDraft,
    reviewDraft,
    editedTitle,
    editedDescription,
    editedType,
    editedDeadline,
    editedLocation,
    editedAmount,
    editedLink,
    feedback,
    refetch,
    toast,
    loadFullDraft,
  ]);

  if (error) {
    return (
      <div className="space-y-6 h-[80vh] grid place-items-center">
        <div>
          <h2 className="text-2xl font-semibold">AI Draft Review</h2>
          <p className="text-red-500">{error.message}</p>
          <Button onClick={refetch} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="space-y-6 h-[80vh] grid place-items-center">
        <div>
          <h2 className="text-2xl font-semibold">AI Draft Review</h2>
          <p className="text-muted-foreground">No pending drafts to review</p>
        </div>
      </div>
    );
  }

  if (!selectedDraft) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">AI Draft Review</h2>
          <p className="text-muted-foreground">Select a draft to review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">AI Draft Review</h2>
        <p className="text-muted-foreground">
          Review and approve AI-extracted opportunity details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DraftsList
          loading={loading}
          drafts={drafts}
          total={total}
          page={page}
          totalPages={totalPages}
          selectedDraftId={selectedDraft?.id}
          onDraftSelect={handleDraftSelect}
          onPageChange={setPage}
        />

        {selectedDraft && (
          <DraftContentReview
            selectedDraft={selectedDraft}
            fullDraft={fullDraft}
            isEditing={isEditing}
            editedTitle={editedTitle}
            editedDescription={editedDescription}
            editedType={editedType}
            editedDeadline={editedDeadline}
            editedLocation={editedLocation}
            editedAmount={editedAmount}
            editedLink={editedLink}
            feedback={feedback}
            onTitleChange={setEditedTitle}
            onDescriptionChange={setEditedDescription}
            onTypeChange={setEditedType}
            onDeadlineChange={setEditedDeadline}
            onLocationChange={setEditedLocation}
            onAmountChange={setEditedAmount}
            onLinkChange={setEditedLink}
            onFeedbackChange={setFeedback}
            onApprove={handleApprove}
            onReject={handleReject}
            onRegenerate={handleRegenerate}
            onStartEdit={() => setIsEditing(true)}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setIsEditing(false)}
            approving={approving}
            rejecting={rejecting}
            regenerating={regenerating}
            saving={saving}
            loadingDraft={loadingDraft}
          />
        )}
      </div>
    </div>
  );
}

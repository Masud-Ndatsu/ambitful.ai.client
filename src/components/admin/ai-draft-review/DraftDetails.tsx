import { memo } from "react";
import { Label } from "@/components/ui/label";
import { AIDraft } from "@/hooks/use-ai-drafts";

interface DraftDetailsProps {
  fullDraft: AIDraft | null;
}

export const DraftDetails = memo(({ fullDraft }: DraftDetailsProps) => {
  return (
    <div className="space-y-4">
      {/* Application Instructions */}
      <div>
        <Label className="text-sm font-medium">Application Instructions</Label>
        <div className="mt-2 space-y-1">
          {fullDraft?.extractedApplicationInstructions?.length > 0 ? (
            fullDraft.extractedApplicationInstructions.map(
              (instruction, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <span>{instruction}</span>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              No instructions available
            </p>
          )}
        </div>
      </div>

      {/* Eligibility */}
      <div>
        <Label className="text-sm font-medium">Eligibility Requirements</Label>
        <div className="mt-2 space-y-1">
          {fullDraft?.extractedEligibility?.length > 0 ? (
            fullDraft.extractedEligibility.map((requirement, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-green-600">•</span>
                <span>{requirement}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No eligibility requirements available
            </p>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <Label className="text-sm font-medium">Benefits</Label>
        <div className="mt-2 space-y-1">
          {fullDraft?.extractedBenefits?.length > 0 ? (
            fullDraft.extractedBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600">•</span>
                <span>{benefit}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No benefits information available
            </p>
          )}
        </div>
      </div>

      {/* Full Description */}
      {fullDraft?.extractedFullDescription && (
        <div>
          <Label className="text-sm font-medium">Full Description</Label>
          <p className="mt-2 text-sm text-muted-foreground">
            {fullDraft.extractedFullDescription}
          </p>
        </div>
      )}
    </div>
  );
});

DraftDetails.displayName = "DraftDetails";

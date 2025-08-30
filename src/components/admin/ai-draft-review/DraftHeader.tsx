/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDraft } from "@/hooks/use-ai-drafts";

type DraftPriority = "high" | "medium" | "low";
type OpportunityType =
  | "scholarship"
  | "grant"
  | "job"
  | "internship"
  | "competition"
  | "training"
  | "fellowship";

interface DraftHeaderProps {
  selectedDraft: AIDraft;
  fullDraft: AIDraft | null;
}

const getPriorityColor = (
  priority: DraftPriority
): "destructive" | "default" | "secondary" => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
  }
};

const getTypeColor = (type: OpportunityType) => {
  const colors = {
    scholarship: "bg-blue-100 text-blue-800",
    grant: "bg-green-100 text-green-800",
    job: "bg-purple-100 text-purple-800",
    internship: "bg-orange-100 text-orange-800",
    competition: "bg-red-100 text-red-800",
    training: "bg-indigo-100 text-indigo-800",
    fellowship: "bg-pink-100 text-pink-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

export const DraftHeader = memo(
  ({ selectedDraft, fullDraft }: DraftHeaderProps) => {
    return (
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {fullDraft?.extractedTitle ||
                selectedDraft?.extractedTitle ||
                "Loading..."}
              {fullDraft?.extractedType && (
                <Badge
                  className={getTypeColor(fullDraft?.extractedType as any)}
                >
                  {fullDraft.extractedType}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span>Source: {selectedDraft?.source}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={getPriorityColor(selectedDraft?.priority)}>
              {selectedDraft?.priority} priority
            </Badge>
          </div>
        </div>
      </CardHeader>
    );
  }
);

DraftHeader.displayName = "DraftHeader";

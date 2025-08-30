import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { AIDraft } from "@/hooks/use-ai-drafts";
import { formatDate } from "@/lib/utils";

type DraftPriority = "high" | "medium" | "low";

interface DraftListItemProps {
  draft: AIDraft;
  isSelected: boolean;
  onSelect: (draft: AIDraft) => void;
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

export const DraftListItem = memo(
  ({ draft, isSelected, onSelect }: DraftListItemProps) => {
    return (
      <div
        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
          isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
        }`}
        onClick={() => onSelect(draft)}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm line-clamp-2">
            {draft.extractedTitle}
          </h4>
          <Badge variant={getPriorityColor(draft.priority)} className="ml-2">
            {draft.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge className="text-xs bg-blue-100 text-blue-800">Draft</Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-2 break-words whitespace-normal">
          {draft.source}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(draft.dateScraped, { relative: true })}
          </span>
          <Badge variant="outline" className="text-xs">
            {draft.status}
          </Badge>
        </div>
      </div>
    );
  }
);

DraftListItem.displayName = "DraftListItem";

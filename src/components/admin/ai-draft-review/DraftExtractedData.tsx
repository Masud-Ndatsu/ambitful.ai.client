import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIDraft } from "@/hooks/use-ai-drafts";
import { formatDate as formatDateUtil } from "@/lib/utils";
import { OpportunityTypeType } from "@/enums";

type OpportunityType =
  | "scholarship"
  | "grant"
  | "job"
  | "internship"
  | "competition"
  | "training"
  | "fellowship";

interface DraftExtractedDataProps {
  fullDraft: AIDraft | null;
  isEditing: boolean;
  editedTitle: string;
  editedDescription: string;
  editedType: OpportunityTypeType;
  editedDeadline: string;
  editedLocation: string;
  editedAmount: string;
  editedLink: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: OpportunityTypeType) => void;
  onDeadlineChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onLinkChange: (value: string) => void;
}

const getTypeColor = (type: OpportunityTypeType) => {
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

const formatDate = (date: Date | null) => {
  if (!date) return "Not specified";
  return formatDateUtil(date, { format: "medium" });
};

export const DraftExtractedData = memo(
  ({
    fullDraft,
    isEditing,
    editedTitle,
    editedDescription,
    editedType,
    editedDeadline,
    editedLocation,
    editedAmount,
    editedLink,
    onTitleChange,
    onDescriptionChange,
    onTypeChange,
    onDeadlineChange,
    onLocationChange,
    onAmountChange,
    onLinkChange,
  }: DraftExtractedDataProps) => {
    return (
      <div className="space-y-4">
        {/* Key Information Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-medium">Title</Label>
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm">
                {fullDraft?.extractedTitle || "Not available"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Type</Label>
            {isEditing ? (
              <Select value={editedType} onValueChange={onTypeChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="fellowship">Fellowship</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                {fullDraft?.extractedType && (
                  <Badge className={getTypeColor(fullDraft.extractedType)}>
                    {fullDraft.extractedType}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Deadline
            </Label>
            {isEditing ? (
              <Input
                type="date"
                value={editedDeadline}
                onChange={(e) => onDeadlineChange(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm">
                {fullDraft?.extractedDeadline
                  ? formatDate(fullDraft.extractedDeadline)
                  : "Not specified"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location
            </Label>
            {isEditing ? (
              <Input
                value={editedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm">
                {fullDraft?.extractedLocation || "Not specified"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Amount/Prize
            </Label>
            {isEditing ? (
              <Input
                value={editedAmount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm">
                {fullDraft?.extractedAmount || "Not specified"}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Link
            </Label>
            {isEditing ? (
              <Input
                value={editedLink}
                onChange={(e) => onLinkChange(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm">
                {fullDraft?.extractedLink ? (
                  <a
                    href={fullDraft.extractedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {fullDraft.extractedLink}
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Description</Label>
          {isEditing ? (
            <Textarea
              value={editedDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={4}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-sm">
              {fullDraft?.extractedDescription || "Not available"}
            </p>
          )}
        </div>
      </div>
    );
  }
);

DraftExtractedData.displayName = "DraftExtractedData";

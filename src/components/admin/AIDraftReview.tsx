import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit,
  Save,
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAIDrafts, AIDraft } from "@/hooks/use-ai-drafts";

// Types matching the interface
type DraftStatus = "pending" | "approved" | "rejected" | "draft";
type DraftPriority = "high" | "medium" | "low";
type OpportunityType =
  | "scholarship"
  | "grant"
  | "job"
  | "internship"
  | "competition"
  | "training"
  | "fellowship";

export function AIDraftReview() {
  const {
    drafts,
    loading,
    error,
    refetch,
    reviewDraft,
    deleteDraft,
    regenerateDraft,
  } = useAIDrafts({ status: "pending", page: 1, limit: 50 });

  console.log({ drafts });

  const [selectedDraft, setSelectedDraft] = useState<AIDraft | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedType, setEditedType] = useState<OpportunityType>("scholarship");
  const [editedDeadline, setEditedDeadline] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [fullDraft, setFullDraft] = useState<AIDraft | null>(null);

  const { getDraftById } = useAIDrafts();

  // Load full draft details
  const loadFullDraft = async (draftId: string) => {
    try {
      const draft = await getDraftById(draftId);
      setFullDraft(draft);
      setEditedTitle(draft.extractedTitle || "");
      setEditedDescription(draft.extractedDescription || "");
      setEditedType(draft.extractedType || "scholarship");
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
    }
  };

  // Update selected draft when drafts load
  useEffect(() => {
    if (drafts.length > 0 && !selectedDraft) {
      setSelectedDraft(drafts[0]);
      loadFullDraft(drafts[0].id);
    }
  }, [drafts, selectedDraft]);

  const handleDraftSelect = (draft: AIDraft) => {
    setSelectedDraft(draft);
    loadFullDraft(draft.id);
    setIsEditing(false);
  };

  const handleApprove = async () => {
    if (!selectedDraft) return;
    try {
      await reviewDraft(selectedDraft.id, "approve", feedback);
      refetch();
    } catch (error) {
      console.error("Failed to approve draft:", error);
    }
  };

  const handleReject = async () => {
    if (!selectedDraft) return;
    try {
      await reviewDraft(selectedDraft.id, "reject", feedback);
      refetch();
    } catch (error) {
      console.error("Failed to reject draft:", error);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedDraft) return;
    try {
      await regenerateDraft(selectedDraft.id);
      // Update the selected draft data after regeneration
      refetch();
    } catch (error) {
      console.error("Failed to regenerate draft:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedDraft) return;
    try {
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
      refetch();
    } catch (error) {
      console.error("Failed to save edits:", error);
    }
  };

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

  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">AI Draft Review</h2>
          <p className="text-muted-foreground">Loading drafts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
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
      <div className="space-y-6">
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
        {/* Draft List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Drafts ({drafts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDraft.id === draft.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleDraftSelect(draft)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {draft.extractedTitle}
                  </h4>
                  <Badge
                    variant={getPriorityColor(draft.priority)}
                    className="ml-2"
                  >
                    {draft.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    Draft
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {draft.source}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(draft.dateScraped).toLocaleDateString()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {draft.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Content Review */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {fullDraft?.extractedTitle ||
                      selectedDraft?.extractedTitle ||
                      "Loading..."}
                    {fullDraft?.extractedType && (
                      <Badge
                        className={`${getTypeColor(fullDraft.extractedType)}`}
                      >
                        {fullDraft.extractedType}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span>Source: {selectedDraft.source}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(selectedDraft.priority)}>
                    {selectedDraft.priority} priority
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="extracted" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="raw">Raw Content</TabsTrigger>
                </TabsList>

                <TabsContent value="extracted" className="space-y-4">
                  {/* Key Information Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Title</Label>
                      {isEditing ? (
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
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
                        <Select
                          value={editedType}
                          onValueChange={(value: OpportunityType) =>
                            setEditedType(value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scholarship">
                              Scholarship
                            </SelectItem>
                            <SelectItem value="grant">Grant</SelectItem>
                            <SelectItem value="job">Job</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                            <SelectItem value="competition">
                              Competition
                            </SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="fellowship">
                              Fellowship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm capitalize">
                          {fullDraft?.extractedType || "Not available"}
                        </p>
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
                          onChange={(e) => setEditedDeadline(e.target.value)}
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
                          onChange={(e) => setEditedLocation(e.target.value)}
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
                          onChange={(e) => setEditedAmount(e.target.value)}
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
                          onChange={(e) => setEditedLink(e.target.value)}
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
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm">
                        {fullDraft?.extractedDescription || "Not available"}
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  {/* Application Instructions */}
                  <div>
                    <Label className="text-sm font-medium">
                      Application Instructions
                    </Label>
                    <div className="mt-2 space-y-1">
                      {fullDraft?.extractedApplicationInstructions?.length >
                      0 ? (
                        fullDraft.extractedApplicationInstructions.map(
                          (instruction, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="text-muted-foreground">
                                {index + 1}.
                              </span>
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
                    <Label className="text-sm font-medium">
                      Eligibility Requirements
                    </Label>
                    <div className="mt-2 space-y-1">
                      {fullDraft?.extractedEligibility?.length > 0 ? (
                        fullDraft.extractedEligibility.map(
                          (requirement, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="text-green-600">•</span>
                              <span>{requirement}</span>
                            </div>
                          )
                        )
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
                          <div
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
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
                      <Label className="text-sm font-medium">
                        Full Description
                      </Label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {fullDraft.extractedFullDescription}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="raw" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Raw Content</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {fullDraft?.rawContent || "Loading raw content..."}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              {/* Review Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Feedback</Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add feedback about the AI extraction quality..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleApprove}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Create Opportunity
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </Button>
                      <Button variant="outline" onClick={handleRegenerate}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-extract
                      </Button>
                      <Button variant="destructive" onClick={handleReject}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

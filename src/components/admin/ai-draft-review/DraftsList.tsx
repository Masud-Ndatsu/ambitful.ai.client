import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/DataPagination";
import { AIDraft } from "@/hooks/use-ai-drafts";
import { DraftListItem } from "./DraftListItem";
import { LoadingSkeleton } from "@/components/ui/LoadingButton";

interface DraftsListProps {
  loading?: boolean;
  drafts: AIDraft[];
  total: number;
  page: number;
  totalPages: number;
  selectedDraftId?: string;
  onDraftSelect: (draft: AIDraft) => void;
  onPageChange: (page: number) => void;
}

export const DraftsList = memo(
  ({
    loading,
    drafts,
    total,
    page,
    totalPages,
    selectedDraftId,
    onDraftSelect,
    onPageChange,
  }: DraftsListProps) => {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Drafts ({loading ? "...." : total})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              // Show loading skeletons while data is being fetched
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <LoadingSkeleton lines={2} height="1rem" className="mb-2" />
                  <LoadingSkeleton lines={1} height="0.75rem" width="60%" />
                </div>
              ))
            ) : drafts.length > 0 ? (
              drafts.map((draft) => (
                <DraftListItem
                  key={draft.id}
                  draft={draft}
                  isSelected={selectedDraftId === draft.id}
                  onSelect={onDraftSelect}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pending drafts found
              </div>
            )}
          </CardContent>
        </Card>

        <DataPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showPageInfo={true}
          totalItems={total}
          itemsPerPage={10}
        />
      </div>
    );
  }
);

DraftsList.displayName = "DraftsList";

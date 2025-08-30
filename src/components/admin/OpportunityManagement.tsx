/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TextEditor from "../RichTextEditor";
import { useAdminOpportunities } from "@/hooks/use-admin-opportunities";
import { useToast } from "@/hooks/use-toast";
import { UI_OPPORTUNITY_TYPES, UI_CATEGORIES } from "@/enums";
import { formatDate } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDebounce } from "@/hooks/use-debounce";
import { DataPagination } from "@/components/ui/DataPagination";

export function OpportunityManagement() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewOpportunity, setViewOpportunity] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loadingOpportunity, setLoadingOpportunity] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);
  // Form state based on createOpportunitySchema
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");

  // Admin hooks
  const {
    opportunities: adminOpportunities,
    loading,
    error,
    creating,
    bulkActioning,
    createOpportunity,
    bulkAction,
    refetch,
    stats,
    total,
    page,
    totalPages,
    setSearch,
    setStatus: setApiStatus,
    setCategory: setApiCategory,
    setPage,
    getOpportunityById,
  } = useAdminOpportunities();
  const { toast } = useToast();

  // Update API filters when debounced search changes
  useEffect(() => {
    setSearch(debouncedSearch === "" ? undefined : debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Handle status filter changes
  useEffect(() => {
    setApiStatus(statusFilter === "all" ? undefined : statusFilter);
  }, [statusFilter, setApiStatus]);

  // Handle category filter changes
  useEffect(() => {
    setApiCategory(categoryFilter === "all" ? undefined : categoryFilter);
  }, [categoryFilter, setApiCategory]);

  // Use only real opportunities data
  const displayOpportunities = adminOpportunities;

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleBulkAction = async (action: "publish" | "archive" | "delete") => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to perform bulk action",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bulkAction(selectedItems, action);
      toast({
        title: "Success",
        description: `${result.affected} item(s) ${action}ed successfully`,
        variant: "default",
      });
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} items: ${error?.message}`,
        variant: "destructive",
      });
    }
  };

  // Reset form state
  const resetForm = () => {
    setTitle("");
    setType("");
    setDescription("");
    setFullDescription("");
    setDeadline("");
    setLocation("");
    setLink("");
    setCategory("");
    setStatus("draft");
  };

  const handleCreateOpportunity = async () => {
    try {
      // Basic form validation
      if (!title.trim()) {
        toast({
          title: "Validation Error",
          description: "Title is required",
          variant: "destructive",
        });
        return;
      }
      if (!type.trim()) {
        toast({
          title: "Validation Error",
          description: "Type is required",
          variant: "destructive",
        });
        return;
      }
      if (!description.trim()) {
        toast({
          title: "Validation Error",
          description: "Description is required",
          variant: "destructive",
        });
        return;
      }

      if (!deadline) {
        toast({
          title: "Validation Error",
          description: "Deadline is required",
          variant: "destructive",
        });
        return;
      }
      if (!location.trim()) {
        toast({
          title: "Validation Error",
          description: "Location is required",
          variant: "destructive",
        });
        return;
      }
      if (!link.trim()) {
        toast({
          title: "Validation Error",
          description: "Application link is required",
          variant: "destructive",
        });
        return;
      }
      if (!category.trim()) {
        toast({
          title: "Validation Error",
          description: "Category is required",
          variant: "destructive",
        });
        return;
      }

      const opportunityData = {
        title: title.trim(),
        type,
        description: description.trim().substring(0, 200),
        fullDescription: description.trim(),
        deadline,
        location: location.trim(),
        link: link.trim(),
        category: category.trim(),
        status,
      };

      await createOpportunity(opportunityData);

      // Success notification
      toast({
        title: "Success",
        description: "Opportunity created successfully!",
        variant: "default",
      });
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "default";
      case "Draft":
        return "secondary";
      case "Archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Use only real API data
  const filteredOpportunities = displayOpportunities;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredOpportunities.map((opp) => String(opp.id)));
    } else {
      setSelectedItems([]);
    }
  };

  const handleViewOpportunity = async (opportunity: any) => {
    try {
      setLoadingOpportunity(true);
      setIsViewDialogOpen(true);
      const fullOpportunity = await getOpportunityById(opportunity.id);
      setViewOpportunity(fullOpportunity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load opportunity details",
        variant: "destructive",
      });
      setIsViewDialogOpen(false);
    } finally {
      setLoadingOpportunity(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Failed to load opportunities: {error?.message || "Unknown error"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Opportunity Management</h2>
          <p className="text-muted-foreground">
            Manage and track all opportunities
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Opportunity</DialogTitle>
              <DialogDescription>
                Add a new opportunity to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter opportunity title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {UI_OPPORTUNITY_TYPES.map((typeOption) => (
                        <SelectItem
                          key={typeOption.value}
                          value={typeOption.value}
                        >
                          {typeOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {UI_CATEGORIES.map((categoryOption) => (
                      <SelectItem
                        key={categoryOption.value}
                        value={categoryOption.value}
                      >
                        {categoryOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <TextEditor
                  id="description"
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter opportunity description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    id="deadline"
                    type="date"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    id="location"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="link">Application Link</Label>
                <Input
                  id="link"
                  placeholder="https://"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <LoadingButton
                  variant="outline"
                  onClick={() => {
                    setStatus("draft");
                    handleCreateOpportunity();
                  }}
                  loading={creating}
                  loadingText="Creating..."
                >
                  Save as Draft
                </LoadingButton>
                <LoadingButton
                  onClick={() => {
                    setStatus("published");
                    handleCreateOpportunity();
                  }}
                  loading={creating}
                  loadingText="Creating..."
                >
                  Publish
                </LoadingButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Opportunity Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>View Opportunity</DialogTitle>
              <DialogDescription>
                Complete opportunity details and information
              </DialogDescription>
            </DialogHeader>
            {loadingOpportunity ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : viewOpportunity ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="text-lg font-medium">{viewOpportunity.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge variant={getStatusColor(viewOpportunity.status)} className="mt-1">
                      {viewOpportunity.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <p>{viewOpportunity.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <p>{viewOpportunity.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                    <p>{viewOpportunity.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Deadline</Label>
                    <p>{formatDate(viewOpportunity.deadline, { format: "medium" })}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                    <p>{formatDate(viewOpportunity.createdAt || viewOpportunity.dateAdded, { format: "medium" })}</p>
                  </div>
                </div>

                {viewOpportunity.amount && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p>{viewOpportunity.amount}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm leading-relaxed">{viewOpportunity.description}</p>
                </div>

                {viewOpportunity.detail?.fullDescription && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Description</Label>
                    <div className="text-sm leading-relaxed p-4 bg-muted rounded-md">
                      {viewOpportunity.detail.fullDescription}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Application Link</Label>
                  <a 
                    href={viewOpportunity.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {viewOpportunity.link}
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Label className="text-sm font-medium text-muted-foreground">Views</Label>
                    <p className="text-2xl font-bold">{viewOpportunity.detail?.views || viewOpportunity.views || 0}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-sm font-medium text-muted-foreground">Applications</Label>
                    <p className="text-2xl font-bold">{viewOpportunity.detail?.applications || viewOpportunity.applications || 0}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-sm font-medium text-muted-foreground">Saves</Label>
                    <p className="text-2xl font-bold">{viewOpportunity.detail?.saves || viewOpportunity.saves || 0}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Opportunities</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, category, or author..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
                {loading && searchInput && (
                  <div className="absolute right-3 top-3">
                    <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} item(s) selected
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={bulkActioning}
                onClick={() => handleBulkAction("publish")}
              >
                Bulk Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={bulkActioning}
                onClick={() => handleBulkAction("archive")}
              >
                Bulk Archive
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={bulkActioning}
                  >
                    Bulk Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedItems.length}{" "}
                      selected opportunity(ies)? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleBulkAction("delete")}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Opportunities (
            {loading
              ? "..."
              : adminOpportunities.length > 0
              ? total
              : filteredOpportunities.length}
            )
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded"
                >
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedItems.length === filteredOpportunities.length &&
                        filteredOpportunities.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      disabled={loading}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Applications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No opportunities found</p>
                        <p className="text-sm">
                          Try adjusting your filters or create a new opportunity
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOpportunities.map((opportunity: any) => (
                    <TableRow key={opportunity.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(
                            String(opportunity.id)
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectItem(String(opportunity.id), !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {opportunity.title.substring(0, 20)}
                      </TableCell>
                      <TableCell>{opportunity.category}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(
                          opportunity?.createdAt || opportunity?.dateAdded,
                          { format: "short" }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {opportunity.views || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {opportunity.applications || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewOpportunity(opportunity)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {adminOpportunities.length > 0 && (
        <DataPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          showPageInfo={true}
          totalItems={total}
          itemsPerPage={10}
          className="mt-6"
        />
      )}
    </div>
  );
}

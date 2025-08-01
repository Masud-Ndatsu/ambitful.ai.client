import { useState } from "react";
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
import { Plus, Edit, Trash2, Eye, Filter, Download } from "lucide-react";
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
import { useAdminOpportunities } from "@/hooks/useAdminOpportunities";
import { useToast } from "@/hooks/use-toast";

const opportunities = [
  {
    id: 1,
    title: "Google Summer of Code 2024",
    category: "Technology",
    status: "Published",
    dateAdded: "2024-01-15",
    author: "Admin User",
    views: 1200,
    applications: 45,
  },
  {
    id: 2,
    title: "UN Youth Climate Summit",
    category: "Environment",
    status: "Draft",
    dateAdded: "2024-01-20",
    author: "Content Manager",
    views: 0,
    applications: 0,
  },
  {
    id: 3,
    title: "Microsoft LEAP Program",
    category: "Technology",
    status: "Published",
    dateAdded: "2024-01-18",
    author: "Admin User",
    views: 890,
    applications: 32,
  },
  {
    id: 4,
    title: "World Bank Youth Summit",
    category: "Finance",
    status: "Archived",
    dateAdded: "2024-01-10",
    author: "Editor",
    views: 2100,
    applications: 78,
  },
  {
    id: 5,
    title: "Mastercard Foundation Scholarship",
    category: "Education",
    status: "Published",
    dateAdded: "2024-01-22",
    author: "Admin User",
    views: 1500,
    applications: 120,
  },
];

export function OpportunityManagement() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Form state based on createOpportunitySchema
  const [title, setTitle] = useState("");
  const [type, setType] = useState<
    "scholarship" | "internship" | "fellowship" | "grant"
  >("scholarship");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  // const [amount, setAmount] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  // const [applicationInstructions, setApplicationInstructions] = useState("");

  // Array fields state
  // const [eligibility, setEligibility] = useState<string[]>([]);
  // const [eligibilityInput, setEligibilityInput] = useState("");
  // const [benefits, setBenefits] = useState<string[]>([]);
  // const [benefitInput, setBenefitInput] = useState("");

  // Admin hooks
  const {
    createOpportunity,
    opportunities: _opp,
    bulkAction,
    bulkActioning,
  } = useAdminOpportunities();
  const { toast } = useToast();

  console.log({ _opp });

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

  // // Helper functions for array fields
  // const addEligibility = () => {
  //   if (
  //     eligibilityInput.trim() &&
  //     !eligibility.includes(eligibilityInput.trim())
  //   ) {
  //     setEligibility([...eligibility, eligibilityInput.trim()]);
  //     setEligibilityInput("");
  //   }
  // };

  // const removeEligibility = (itemToRemove: string) => {
  //   setEligibility(eligibility.filter((item) => item !== itemToRemove));
  // };

  // const addBenefit = () => {
  //   if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
  //     setBenefits([...benefits, benefitInput.trim()]);
  //     setBenefitInput("");
  //   }
  // };

  // const removeBenefit = (benefitToRemove: string) => {
  //   setBenefits(benefits.filter((benefit) => benefit !== benefitToRemove));
  // };

  // _.map(o => o.)

  // Reset form state
  const resetForm = () => {
    setTitle("");
    setType("scholarship");
    setDescription("");
    setFullDescription("");
    setDeadline("");
    setLocation("");
    // setAmount("");
    setLink("");
    setCategory("");
    setStatus("draft");
    // setApplicationInstructions("");
    // setEligibility([]);
    // setEligibilityInput("");
    // setBenefits([]);
    // setBenefitInput("");
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

  const filteredOpportunities = _opp.filter((opp) => {
    const matchesStatus =
      statusFilter === "all" || opp.status.toLowerCase() === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || opp.category.toLowerCase() === categoryFilter;
    const matchesSearch = opp.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredOpportunities.map((opp) => opp.id));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Opportunity Management</h2>
          <p className="text-muted-foreground">
            Manage and track all opportunities
          </p>
        </div>
        <Dialog>
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
                  <Select
                    value={type}
                    onValueChange={(
                      value:
                        | "scholarship"
                        | "internship"
                        | "fellowship"
                        | "grant"
                    ) => setType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="fellowship">Fellowship</SelectItem>
                      <SelectItem value="grant">Grant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("draft");
                    handleCreateOpportunity();
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => {
                    setStatus("published");
                    handleCreateOpportunity();
                  }}
                >
                  Publish
                </Button>
              </div>
            </div>
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
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
          <CardTitle>Opportunities ({filteredOpportunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Applications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(opportunity.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(opportunity.id, !!checked)
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
                  <TableCell>{opportunity.createdAt}</TableCell>
                  <TableCell>{opportunity.createdAt}</TableCell>
                  <TableCell className="text-right">
                    {opportunity.views}
                  </TableCell>
                  <TableCell className="text-right">
                    {opportunity.applications}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

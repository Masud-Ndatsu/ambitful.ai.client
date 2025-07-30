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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TextEditor from "../RichTextEditor";

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Form state based on createOpportunitySchema
  const [title, setTitle] = useState("");
  const [type, setType] = useState<
    "scholarship" | "internship" | "fellowship" | "grant"
  >("scholarship");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState(
    description.substring(0, 200)
  );
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [applicationInstructions, setApplicationInstructions] = useState("");

  // Array fields state
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [eligibilityInput, setEligibilityInput] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(opportunities.map((opp) => opp.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  // Helper functions for array fields
  const addEligibility = () => {
    if (
      eligibilityInput.trim() &&
      !eligibility.includes(eligibilityInput.trim())
    ) {
      setEligibility([...eligibility, eligibilityInput.trim()]);
      setEligibilityInput("");
    }
  };

  const removeEligibility = (itemToRemove: string) => {
    setEligibility(eligibility.filter((item) => item !== itemToRemove));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter((benefit) => benefit !== benefitToRemove));
  };

  // Reset form state
  const resetForm = () => {
    setTitle("");
    setType("scholarship");
    setDescription("");
    setFullDescription("");
    setDeadline("");
    setLocation("");
    setAmount("");
    setLink("");
    setCategory("");
    setStatus("draft");
    setApplicationInstructions("");
    setEligibility([]);
    setEligibilityInput("");
    setBenefits([]);
    setBenefitInput("");
  };

  const handleCreateOpportunity = () => {
    // Form validation and submission logic here
    const opportunityData = {
      title,
      type,
      description,
      fullDescription,
      deadline,
      location,
      amount: amount || undefined,
      link,
      category,
      status,
      applicationInstructions: applicationInstructions || undefined,
      eligibility: eligibility.length > 0 ? eligibility : undefined,
      benefits: benefits.length > 0 ? benefits : undefined,
    };

    console.log("Opportunity data:", opportunityData);
    resetForm();
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

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesStatus =
      statusFilter === "all" || opp.status.toLowerCase() === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || opp.category.toLowerCase() === categoryFilter;
    const matchesSearch = opp.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

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
                  <Input id="title" placeholder="Enter opportunity title" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <Input id="link" placeholder="https://" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Publish</Button>
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
              <Button variant="outline" size="sm">
                Bulk Publish
              </Button>
              <Button variant="outline" size="sm">
                Bulk Archive
              </Button>
              <Button variant="destructive" size="sm">
                Bulk Delete
              </Button>
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
                    checked={selectedItems.length === opportunities.length}
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
                    {opportunity.title}
                  </TableCell>
                  <TableCell>{opportunity.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(opportunity.status)}>
                      {opportunity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{opportunity.dateAdded}</TableCell>
                  <TableCell>{opportunity.author}</TableCell>
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

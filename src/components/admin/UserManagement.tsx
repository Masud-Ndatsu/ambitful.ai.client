import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  UserX,
  Mail,
  MessageSquare,
  BookmarkPlus,
} from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const users = [
  {
    id: 1,
    name: "Amara Okafor",
    email: "amara.okafor@email.com",
    country: "Nigeria",
    status: "active",
    verified: true,
    signupDate: "2024-01-15",
    lastActive: "2024-01-25",
    interests: ["Technology", "Education"],
    savedOpportunities: 12,
    appliedOpportunities: 5,
    chatbotInteractions: 23,
  },
  {
    id: 2,
    name: "James Kimani",
    email: "james.kimani@email.com",
    country: "Kenya",
    status: "active",
    verified: true,
    signupDate: "2024-01-18",
    lastActive: "2024-01-26",
    interests: ["Environment", "Finance"],
    savedOpportunities: 8,
    appliedOpportunities: 3,
    chatbotInteractions: 15,
  },
  {
    id: 3,
    name: "Sarah Mensah",
    email: "sarah.mensah@email.com",
    country: "Ghana",
    status: "inactive",
    verified: false,
    signupDate: "2024-01-20",
    lastActive: "2024-01-22",
    interests: ["Health", "Education"],
    savedOpportunities: 3,
    appliedOpportunities: 0,
    chatbotInteractions: 5,
  },
  {
    id: 4,
    name: "David Mthembu",
    email: "david.mthembu@email.com",
    country: "South Africa",
    status: "active",
    verified: true,
    signupDate: "2024-01-12",
    lastActive: "2024-01-26",
    interests: ["Technology", "Finance"],
    savedOpportunities: 15,
    appliedOpportunities: 8,
    chatbotInteractions: 31,
  },
  {
    id: 5,
    name: "Grace Nakato",
    email: "grace.nakato@email.com",
    country: "Uganda",
    status: "active",
    verified: true,
    signupDate: "2024-01-22",
    lastActive: "2024-01-25",
    interests: ["Environment", "Health"],
    savedOpportunities: 6,
    appliedOpportunities: 2,
    chatbotInteractions: 11,
  },
];

const interactionHistory = [
  {
    date: "2024-01-26",
    type: "chatbot",
    action: "Asked about tech internships",
    details: "Query: 'Best tech internships for students?'",
  },
  {
    date: "2024-01-25",
    type: "save",
    action: "Saved opportunity",
    details: "Google Summer of Code 2024",
  },
  {
    date: "2024-01-24",
    type: "apply",
    action: "Applied to opportunity",
    details: "Microsoft LEAP Program",
  },
  {
    date: "2024-01-23",
    type: "chatbot",
    action: "Career guidance session",
    details: "15-minute conversation about career paths",
  },
  {
    date: "2024-01-22",
    type: "save",
    action: "Saved opportunity",
    details: "AWS Cloud Training Program",
  },
];

export function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const { data, loading, error, refetch } = useDashboardData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  console.log("USER DATA:", data);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesCountry =
      countryFilter === "all" || user.country === countryFilter;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts and track engagement
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics?.users?.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics?.users?.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">80% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics?.users?.verifiedUsers}
            </div>
            <p className="text-xs text-muted-foreground">80% verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics?.users?.verifiedUsers}
            </div>
            <p className="text-xs text-muted-foreground">per user</p>
          </CardContent>
        </Card>
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
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Country</Label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Interactions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?text=${getInitials(
                            user.name
                          )}`}
                        />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status) as any}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.verified ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Unverified</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.signupDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {user.chatbotInteractions}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              User Details: {selectedUser.name}
                            </DialogTitle>
                            <DialogDescription>
                              View user profile and activity
                            </DialogDescription>
                          </DialogHeader>
                          <UserDetailModal user={selectedUser} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <UserX className="h-4 w-4" />
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

function UserDetailModal({ user }: { user: (typeof users)[0] }) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                >
                  {user.status}
                </Badge>
                {user.verified && <Badge>Verified</Badge>}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="font-medium">Country:</span>
              <span>{user.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Signup Date:</span>
              <span>{user.signupDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Active:</span>
              <span>{user.lastActive}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Interests:</span>
              <div className="flex gap-1">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Chatbot Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.chatbotInteractions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Saved Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.savedOpportunities}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.appliedOpportunities}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interactionHistory.map((interaction, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {interaction.type === "chatbot" && (
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    )}
                    {interaction.type === "save" && (
                      <BookmarkPlus className="h-4 w-4 text-green-500" />
                    )}
                    {interaction.type === "apply" && (
                      <Edit className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{interaction.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {interaction.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {interaction.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="opportunities" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saved Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded">
                  Google Summer of Code 2024
                </div>
                <div className="p-2 border rounded">
                  AWS Cloud Training Program
                </div>
                <div className="p-2 border rounded">Microsoft LEAP Program</div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All ({user.savedOpportunities})
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Applied Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded">Microsoft LEAP Program</div>
                <div className="p-2 border rounded">
                  UN Youth Climate Summit
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All ({user.appliedOpportunities})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Users,
  Globe,
  Bell,
  Database,
  Shield,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Play,
  Pause,
  Square,
  BarChart3,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCrawler } from "@/hooks/use-crawler";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const adminUsers = [
  {
    id: 1,
    name: "John Admin",
    email: "john@admin.com",
    role: "Administrator",
    status: "active",
    lastLogin: "2024-01-26",
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "sarah@admin.com",
    role: "Content Manager",
    status: "active",
    lastLogin: "2024-01-25",
  },
  {
    id: 3,
    name: "Mike Editor",
    email: "mike@admin.com",
    role: "Editor",
    status: "inactive",
    lastLogin: "2024-01-20",
  },
  {
    id: 4,
    name: "Lisa Reviewer",
    email: "lisa@admin.com",
    role: "Reviewer",
    status: "active",
    lastLogin: "2024-01-26",
  },
];

// Remove static data - will be loaded from API

const roles = [
  { name: "Administrator", permissions: ["All permissions"] },
  {
    name: "Content Manager",
    permissions: ["Manage opportunities", "Review AI drafts", "View analytics"],
  },
  { name: "Editor", permissions: ["Edit opportunities", "Review AI drafts"] },
  { name: "Reviewer", permissions: ["Review AI drafts", "View analytics"] },
];

export function SystemSettings() {
  const [notificationSettings, setNotificationSettings] = useState({
    dailyReports: true,
    draftAlerts: true,
    errorAlerts: true,
    weeklyDigest: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: "365",
    cookieConsent: true,
    analyticsTracking: true,
    userDataExport: true,
  });

  // Crawler hook
  const {
    sources: crawlSources,
    stats: crawlStats,
    loading,
    creating,
    deleting,
    pausing,
    resuming,
    disabling,
    crawling,
    createSource,
    deleteSource,
    pauseSource,
    resumeSource,
    disableSource,
    startCrawl,
  } = useCrawler();

  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    frequency: "daily" as "hourly" | "daily" | "weekly" | "monthly",
    maxResults: 50,
  });

  console.log({ crawlSources });

  const handleCreateSource = async () => {
    try {
      await createSource({
        name: newSource.name,
        url: newSource.url,
        frequency: newSource.frequency,
        maxResults: newSource.maxResults,
        status: "active",
      });
      setNewSource({ name: "", url: "", frequency: "daily", maxResults: 50 });
      setShowAddSource(false);
      toast.success("Crawl source created successfully");
    } catch (error) {
      console.error("Failed to create source:", error);
      toast.error(error.message || "Failed to create source");
    }
  };

  const handleSourceAction = async (
    id: string,
    action: "pause" | "resume" | "disable" | "crawl"
  ) => {
    try {
      let response: { message: string; jobId?: string };
      switch (action) {
        case "pause":
          response = await pauseSource(id);
          break;
        case "resume":
          response = await resumeSource(id);
          break;
        case "disable":
          response = await disableSource(id);
          break;
        case "crawl":
          response = await startCrawl(id);
          break;
      }
      toast.success(response.message);
    } catch (error) {
      console.error(`Failed to ${action} source:`, error);
      toast.error(`Failed to ${action} source`);
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await deleteSource(id);
      toast.success("Source deleted successfully");
    } catch (error) {
      console.error("Failed to delete source:", error);
      toast.error(error.message || "Failed to delete source");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default" as const,
      paused: "secondary" as const,
      disabled: "outline" as const,
    };
    return variants[status as keyof typeof variants] || "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">System Settings</h2>
        <p className="text-muted-foreground">
          Configure platform settings and manage access control
        </p>
      </div>

      <Tabs defaultValue="rbac" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rbac">Access Control</TabsTrigger>
          <TabsTrigger value="crawling">Content Crawling</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
        </TabsList>

        <TabsContent value="rbac" className="space-y-6">
          {/* Admin Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>
                  Manage administrator accounts and permissions
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Admin User</DialogTitle>
                    <DialogDescription>
                      Create a new administrator account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administrator">
                            Administrator
                          </SelectItem>
                          <SelectItem value="content-manager">
                            Content Manager
                          </SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create Account</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
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

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure permissions for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {role.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="outline">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawling" className="space-y-6">
          {/* Crawler Statistics */}
          {crawlStats && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sources
                  </CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {crawlStats.totalSources}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {crawlStats.activeSources} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Crawls
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {crawlStats.totalCrawls}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {crawlStats.successfulCrawls} successful
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {crawlStats.totalCrawls > 0
                      ? Math.round(
                          (crawlStats.successfulCrawls /
                            crawlStats.totalCrawls) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {crawlStats.failedCrawls} failed
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Crawling Sources */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Sources</CardTitle>
                <CardDescription>
                  Manage websites for automatic content crawling
                </CardDescription>
              </div>
              <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Source
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Crawling Source</DialogTitle>
                    <DialogDescription>
                      Add a new website to crawl for opportunities
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input
                        id="source-name"
                        placeholder="e.g., Microsoft Careers"
                        value={newSource.name}
                        onChange={(e) =>
                          setNewSource((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="source-url">Website URL</Label>
                      <Input
                        id="source-url"
                        placeholder="https://example.com"
                        value={newSource.url}
                        onChange={(e) =>
                          setNewSource((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="crawl-frequency">Crawl Frequency</Label>
                        <Select
                          value={newSource.frequency}
                          onValueChange={(
                            value: "hourly" | "daily" | "weekly" | "monthly"
                          ) =>
                            setNewSource((prev) => ({
                              ...prev,
                              frequency: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="max-results">Max Results</Label>
                        <Input
                          id="max-results"
                          type="number"
                          min="1"
                          max="1000"
                          value={newSource.maxResults}
                          onChange={(e) =>
                            setNewSource((prev) => ({
                              ...prev,
                              maxResults: parseInt(e.target.value) || 50,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddSource(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateSource}
                        disabled={!newSource.name || !newSource.url || creating}
                      >
                        Add Source
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Last Crawl</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading crawler sources...
                      </TableCell>
                    </TableRow>
                  ) : crawlSources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No crawl sources configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    crawlSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">
                          {source.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {source.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(source.status)}>
                            {source.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {source.frequency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {source.lastCrawl
                            ? formatDate(source.lastCrawl, { relative: true })
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              source.lastSuccess ? "default" : "destructive"
                            }
                          >
                            {source.lastSuccess ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {source.status === "active" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSourceAction(source.id, "crawl")
                                }
                                disabled={crawling}
                                title="Start crawl"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {source.status === "active" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSourceAction(source.id, "pause")
                                }
                                disabled={pausing}
                                title="Pause source"
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : source.status === "paused" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSourceAction(source.id, "resume")
                                }
                                disabled={resuming}
                                title="Resume source"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleSourceAction(source.id, "disable")
                              }
                              disabled={disabling}
                              title="Disable source"
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteSource(source.id)}
                              disabled={deleting}
                              title="Delete source"
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
            </CardContent>
          </Card>

          {/* Crawling Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Crawling Configuration</CardTitle>
              <CardDescription>
                Configure automatic content crawling settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-crawl">Automatic Crawling</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic content discovery
                  </p>
                </div>
                <Switch id="auto-crawl" defaultChecked />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crawl-interval">Default Crawl Interval</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max-results">Max Results per Source</Label>
                  <Input id="max-results" type="number" defaultValue="50" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reports">Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily summary reports
                    </p>
                  </div>
                  <Switch
                    id="daily-reports"
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        dailyReports: checked,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="draft-alerts">New Draft Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new AI drafts need review
                    </p>
                  </div>
                  <Switch
                    id="draft-alerts"
                    checked={notificationSettings.draftAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        draftAlerts: checked,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="error-alerts">Error Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about system errors and failed crawls
                    </p>
                  </div>
                  <Switch
                    id="error-alerts"
                    checked={notificationSettings.errorAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        errorAlerts: checked,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly performance summary
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        weeklyDigest: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-notifications">Email Address</Label>
                    <Input
                      id="email-notifications"
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      placeholder="https://hooks.slack.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Management</CardTitle>
              <CardDescription>
                Configure data retention and privacy compliance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="data-retention">
                    Data Retention Period (days)
                  </Label>
                  <Input
                    id="data-retention"
                    type="number"
                    value={privacySettings.dataRetention}
                    onChange={(e) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        dataRetention: e.target.value,
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    How long to keep user data before automatic deletion
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cookie-consent">
                      Cookie Consent Banner
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show cookie consent banner to users
                    </p>
                  </div>
                  <Switch
                    id="cookie-consent"
                    checked={privacySettings.cookieConsent}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        cookieConsent: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics-tracking">
                      Analytics Tracking
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable user behavior analytics
                    </p>
                  </div>
                  <Switch
                    id="analytics-tracking"
                    checked={privacySettings.analyticsTracking}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        analyticsTracking: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-export">User Data Export</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to export their data
                    </p>
                  </div>
                  <Switch
                    id="data-export"
                    checked={privacySettings.userDataExport}
                    onCheckedChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        userDataExport: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">GDPR Compliance</h4>
                <div>
                  <Label htmlFor="privacy-policy">Privacy Policy Text</Label>
                  <Textarea
                    id="privacy-policy"
                    placeholder="Enter your privacy policy content..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="terms-service">Terms of Service</Label>
                  <Textarea
                    id="terms-service"
                    placeholder="Enter your terms of service content..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Export User Data</Button>
                <Button>Save Privacy Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

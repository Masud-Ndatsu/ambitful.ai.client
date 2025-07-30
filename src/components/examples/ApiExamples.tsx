import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApi, useMutation } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { opportunityService, OpportunityFilters } from '@/services/opportunityService';
import { adminService } from '@/services/adminService';
import { Loader2, Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export function ApiExamples() {
  const { toast } = useToast();
  const { user, isAdmin, login, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // API Examples - Opportunities
  const [opportunityFilters, setOpportunityFilters] = useState<OpportunityFilters>({
    search: '',
    category: '',
    type: '',
    page: 1,
    limit: 10
  });

  // Fetch opportunities with filters
  const {
    data: opportunitiesData,
    loading: opportunitiesLoading,
    error: opportunitiesError,
    refetch: refetchOpportunities
  } = useApi(
    () => opportunityService.getOpportunities(opportunityFilters),
    { deps: [opportunityFilters] }
  );

  // Fetch featured opportunities
  const {
    data: featuredOpportunities,
    loading: featuredLoading
  } = useApi(() => opportunityService.getFeaturedOpportunities(6));

  // Admin Examples (only show if user is admin)
  const {
    data: adminNotifications,
    loading: notificationsLoading,
    refetch: refetchNotifications
  } = useApi(
    () => adminService.getAdminNotifications(),
    { immediate: isAdmin }
  );

  const {
    data: systemSettings,
    loading: settingsLoading
  } = useApi(
    () => adminService.getSystemSettings(),
    { immediate: isAdmin }
  );

  // Mutations
  const applyMutation = useMutation(opportunityService.applyToOpportunity);
  const saveMutation = useMutation(opportunityService.saveOpportunity);
  const markReadMutation = useMutation(adminService.markNotificationAsRead);

  // Handlers
  const handleSearch = () => {
    setOpportunityFilters(prev => ({
      ...prev,
      search: searchQuery,
      page: 1
    }));
  };

  const handleLogin = async () => {
    try {
      await login(loginForm);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleApply = async (opportunityId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for opportunities",
        variant: "destructive",
      });
      return;
    }

    try {
      await applyMutation.mutate([opportunityId, {
        coverLetter: "I am very interested in this opportunity...",
        additionalInfo: "Additional information about my qualifications"
      }]);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveOpportunity = async (opportunityId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save opportunities",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveMutation.mutate(opportunityId);
      toast({
        title: "Opportunity Saved",
        description: "Opportunity has been saved to your favorites",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save opportunity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      await markReadMutation.mutate(notificationId);
      await refetchNotifications();
      toast({
        title: "Notification Updated",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update notification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">API Integration Examples</h1>
        <p className="text-muted-foreground">
          Interactive examples of client-side API interactions
        </p>
      </div>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="admin" disabled={!isAdmin}>Admin</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
        </TabsList>

        {/* Authentication Tab */}
        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm">Welcome, <strong>{user.name}</strong>!</p>
                  <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                  <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                  <Button onClick={logout} variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleLogin} className="w-full">
                    Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={opportunitiesLoading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={opportunityFilters.category || ''}
                  onChange={(e) => setOpportunityFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                </select>
                
                <select
                  value={opportunityFilters.type || ''}
                  onChange={(e) => setOpportunityFilters(prev => ({ ...prev, type: e.target.value || undefined }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
                
                <Button 
                  variant="outline" 
                  onClick={() => setOpportunityFilters({
                    search: '',
                    category: '',
                    type: '',
                    page: 1,
                    limit: 10
                  })}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Results */}
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunitiesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : opportunitiesError ? (
                <div className="text-center p-8 text-red-500">
                  Error: {opportunitiesError.message}
                </div>
              ) : opportunitiesData ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Found {opportunitiesData.total} opportunities (Page {opportunitiesData.page} of {opportunitiesData.totalPages})
                  </p>
                  
                  <div className="grid gap-4">
                    {opportunitiesData.opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{opportunity.title}</h3>
                            <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                            <p className="text-sm">{opportunity.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{opportunity.type}</Badge>
                            <Badge variant="outline">{opportunity.category}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleApply(opportunity.id)}
                            disabled={applyMutation.loading}
                          >
                            {applyMutation.loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>Apply</>
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveOpportunity(opportunity.id)}
                            disabled={saveMutation.loading}
                          >
                            Save
                          </Button>
                          
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Featured Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              {featuredLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : featuredOpportunities ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-3 space-y-2">
                      <h4 className="font-medium text-sm">{opportunity.title}</h4>
                      <p className="text-xs text-muted-foreground">{opportunity.company}</p>
                      <Badge variant="secondary" className="text-xs">{opportunity.category}</Badge>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-4">
          {isAdmin ? (
            <>
              {/* Admin Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {notificationsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : adminNotifications ? (
                    <div className="space-y-2">
                      {adminNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-3 space-y-2 ${
                            notification.isRead ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <p className="text-xs text-muted-foreground">{notification.message}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge 
                                variant={notification.type === 'error' ? 'destructive' : 'secondary'}
                              >
                                {notification.type}
                              </Badge>
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMarkNotificationRead(notification.id)}
                                  disabled={markReadMutation.loading}
                                >
                                  Mark Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* System Settings Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  {settingsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : systemSettings ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Admin Users: {systemSettings.accessControl.adminUsers.length}</p>
                        <p className="font-medium">Crawl Sources: {systemSettings.contentCrawling.sources.length}</p>
                      </div>
                      <div>
                        <p className="font-medium">Daily Reports: {systemSettings.notifications.dailyReports ? 'Enabled' : 'Disabled'}</p>
                        <p className="font-medium">Email Notifications: {systemSettings.notifications.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <p className="text-muted-foreground">Admin access required to view this section.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Code Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Service Usage Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Basic API Call with useApi Hook:</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-auto">
{`const { data, loading, error } = useApi(
  () => opportunityService.getOpportunities({
    search: 'developer',
    category: 'technology'
  })
);`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Mutation with useMutation Hook:</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-auto">
{`const applyMutation = useMutation(
  opportunityService.applyToOpportunity
);

const handleApply = async () => {
  try {
    await applyMutation.mutate([opportunityId, applicationData]);
    toast({ title: "Success!" });
  } catch (error) {
    toast({ title: "Error", variant: "destructive" });
  }
};`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Authentication Context:</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-auto">
{`const { user, login, logout, isAuthenticated } = useAuth();

// Login
await login({ email: 'user@example.com', password: 'password' });

// Check auth status
if (isAuthenticated) {
  // User is logged in
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Direct API Service Call:</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-auto">
{`// Direct service usage
const opportunities = await opportunityService.getOpportunities({
  search: 'react developer',
  type: 'full-time',
  remote: true
});

// Admin operations
const notifications = await adminService.getAdminNotifications();
await adminService.markNotificationAsRead(notificationId);`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
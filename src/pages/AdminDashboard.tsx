/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Users,
  FileText,
  Brain,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { OpportunityManagement } from "@/components/admin/OpportunityManagement";
import { AIDraftReview } from "@/components/admin/AIDraftReview";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { useAuth } from "@/hooks/use-auth";

const sidebarItems = [
  { title: "Dashboard", icon: BarChart3, key: "dashboard" },
  { title: "Opportunities", icon: FileText, key: "opportunities" },
  { title: "AI Drafts", icon: Brain, key: "ai-drafts" },
  { title: "Users", icon: Users, key: "users" },
  { title: "Analytics", icon: TrendingUp, key: "analytics" },
  { title: "Settings", icon: Settings, key: "settings" },
];

function AdminSidebar({
  activeTab,
  onNavigateToTab,
  onLogout,
}: {
  activeTab: string;
  onNavigateToTab: (tab: string) => void;
  onLogout: () => void;
}) {
  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl my-4">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onNavigateToTab(item.key)}
                    className={
                      activeTab === item.key
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AdminHeader({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky bg-white top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="7days">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          <Badge variant="destructive" className="ml-1">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.profile?.avatar}
                  alt={user?.name || "Admin"}
                />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === "admin" ? "Administrator" : "User"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function AdminDashboard() {
  const { tab } = useParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab || "dashboard");
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Update activeTab when URL parameter changes
  useEffect(() => {
    if (tab && tab !== activeTab) {
      // Validate that the tab exists in our sidebar items
      const validTabs = sidebarItems.map((item) => item.key);
      if (validTabs.includes(tab)) {
        setActiveTab(tab);
      } else {
        // If invalid tab, redirect to dashboard
        navigate("/admin/dashboard", { replace: true });
      }
    } else if (!tab) {
      // If no tab in URL, set dashboard as active and redirect to it
      setActiveTab("dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [tab, activeTab, navigate]);

  // Navigate to a specific tab
  const handleNavigateToTab = (tabKey: string) => {
    if (tabKey === "dashboard") {
      navigate("/admin/dashboard");
    } else {
      navigate(`/admin/${tabKey}`);
    }
  };

  // Custom logout function that navigates to home
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Show loading or nothing while checking authentication
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "opportunities":
        return <OpportunityManagement />;
      case "ai-drafts":
        return <AIDraftReview />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar
          activeTab={activeTab}
          onNavigateToTab={handleNavigateToTab}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col">
          <AdminHeader user={user} onLogout={handleLogout} />
          <main className="flex-1 p-6 overflow-auto">{renderActiveTab()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

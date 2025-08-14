import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  FileText,
  Eye,
  Download,
  MapPin,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DashboardOverview() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load dashboard data: {error}</span>
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

  console.log({ data });

  if (!data) return null;

  const stats = [
    {
      title: "Total Users",
      value: data.summary.userGrowth.totalUsers?.toLocaleString(),
      change: `+${data.summary.userGrowth.growthRate}%`,
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Opportunities",
      value: data.summary.overview.activeOpportunities?.toLocaleString(),
      change: "+3",
      icon: FileText,
      trend: "up",
    },
    {
      title: "Pending Drafts",
      value: data.draftStats.pending.toString(),
      change: `+${data.draftStats.pending - data.draftStats.approved}`,
      icon: Clock,
      trend: "up",
    },
    {
      title: "Avg. CTR",
      value: `${(data.summary.overview.avgCTR * 100).toFixed(1)}%`,
      change: "+1.2%",
      icon: Eye,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site Visits Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Site Visits</CardTitle>
              <CardDescription>Daily visits over the past week</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.summary.overview.visitTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Regions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Regions</CardTitle>
            <CardDescription>User visits by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.summary.overview.topRegions?.map((region) => (
                <div
                  key={region.country}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{region.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {region.visits.toLocaleString()}
                    </span>
                    <Badge variant="secondary">{region.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Opportunity Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Opportunity Performance</CardTitle>
              <CardDescription>Top performing opportunities</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.summary.topPerformingOpportunities
                  .slice(0, 4)
                  .map((opp) => (
                    <TableRow key={opp.opportunityId}>
                      <TableCell className="font-medium">{opp.title}</TableCell>
                      <TableCell className="text-right">
                        {opp.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {opp.ctr.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Draft Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending AI Drafts</CardTitle>
              <CardDescription>Drafts awaiting review</CardDescription>
            </div>
            <Badge variant="destructive">{data.draftStats.pending}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.pendingDrafts.slice(0, 4).map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{draft.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {draft.source}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        draft.priority === "high"
                          ? "destructive"
                          : draft.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {draft.priority}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              {data.pendingDrafts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No pending drafts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

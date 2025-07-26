import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, FileText, Eye, Download, MapPin, Clock } from "lucide-react";

const visitData = [
  { name: "Mon", visits: 400 },
  { name: "Tue", visits: 300 },
  { name: "Wed", visits: 500 },
  { name: "Thu", visits: 280 },
  { name: "Fri", visits: 590 },
  { name: "Sat", visits: 320 },
  { name: "Sun", visits: 450 },
];

const topRegions = [
  { country: "Nigeria", visits: 1250, percentage: 35 },
  { country: "Kenya", visits: 890, percentage: 25 },
  { country: "Ghana", visits: 670, percentage: 19 },
  { country: "South Africa", visits: 450, percentage: 13 },
  { country: "Uganda", visits: 290, percentage: 8 },
];

const opportunityPerformance = [
  { title: "Google Summer of Code 2024", views: 1200, ctr: 8.5, timeOnPage: "3:45" },
  { title: "Facebook Fellowship Program", views: 980, ctr: 12.3, timeOnPage: "4:20" },
  { title: "Microsoft Internship", views: 750, ctr: 6.8, timeOnPage: "2:30" },
  { title: "UN Youth Leadership Program", views: 650, ctr: 15.2, timeOnPage: "5:10" },
  { title: "Mastercard Scholarship", views: 520, ctr: 9.7, timeOnPage: "3:15" },
];

const pendingDrafts = [
  { title: "AWS Cloud Training Program", source: "aws.amazon.com", status: "pending", priority: "high" },
  { title: "IBM Developer Challenge", source: "developer.ibm.com", status: "pending", priority: "medium" },
  { title: "Tesla Internship Program", source: "tesla.com", status: "pending", priority: "high" },
  { title: "Netflix Production Fellowship", source: "jobs.netflix.com", status: "pending", priority: "low" },
];

const stats = [
  { title: "Total Visits", value: "12,345", change: "+15%", icon: Users, trend: "up" },
  { title: "Active Opportunities", value: "89", change: "+3", icon: FileText, trend: "up" },
  { title: "Pending Drafts", value: "24", change: "+8", icon: Clock, trend: "up" },
  { title: "Avg. CTR", value: "9.2%", change: "+1.2%", icon: Eye, trend: "up" },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
          <CardHeader>
            <CardTitle>Site Visits</CardTitle>
            <CardDescription>Daily visits over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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
              {topRegions.map((region) => (
                <div key={region.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{region.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{region.visits}</span>
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
                {opportunityPerformance.slice(0, 4).map((opp) => (
                  <TableRow key={opp.title}>
                    <TableCell className="font-medium">{opp.title}</TableCell>
                    <TableCell className="text-right">{opp.views}</TableCell>
                    <TableCell className="text-right">{opp.ctr}%</TableCell>
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
            <Badge variant="destructive">{pendingDrafts.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDrafts.map((draft) => (
                <div key={draft.title} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{draft.title}</p>
                    <p className="text-xs text-muted-foreground">{draft.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={draft.priority === "high" ? "destructive" : draft.priority === "medium" ? "default" : "secondary"}
                    >
                      {draft.priority}
                    </Badge>
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
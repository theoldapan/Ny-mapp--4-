import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dashboardService } from "@/services/dashboardService";
import { DashboardStats } from "@/types";
import {
  Users,
  CreditCard,
  Building2,
  FileText,
  ArrowRight,
  UserPlus,
  CalendarPlus,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Dashboard" description="Översikt över systemstatus">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Antal Kunder"
          value={stats?.totalMembers || 0}
          subtitle={`${stats?.activeMembers || 0} active`}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Prenumerationsplaner"
          value={stats?.totalSubscriptions || 0}
          subtitle={`${stats?.activeSubscriptions || 0} active`}
          icon={CreditCard}
          variant="success"
        />
        <StatsCard
          title="Anläggningar"
          value={stats?.totalFacilities || 0}
          subtitle={`${stats?.availableFacilities || 0} available`}
          icon={Building2}
          variant="info"
        />
        <StatsCard
          title="Antal Nyheter"
          value={stats?.totalBlogPosts || 0}
          subtitle={`${stats?.publishedPosts || 0} published`}
          icon={FileText}
          variant="warning"
        />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Snabba åtgärder</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/members")} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Lägg till medlem
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/blog")}
              className="gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Skapa Nyhetsinlägg
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/subscriptions")}
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Hantera prenumerationer
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Senaste</CardTitle>
              <CardDescription>Senaste kundregistr</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/members")}
              className="gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : stats?.recentMembers?.length ? (
                stats.recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {member.firstName.charAt(0)}
                        {member.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <StatusBadge status={member.membershipStatus} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent members
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Blog Posts</CardTitle>
              <CardDescription>Latest content updates</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/blog")}
              className="gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : stats?.recentPosts?.length ? (
                stats.recentPosts.map((post) => (
                  <div key={post.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {post.title}
                      </p>
                      <StatusBadge status={post.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      By {post.author} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent posts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

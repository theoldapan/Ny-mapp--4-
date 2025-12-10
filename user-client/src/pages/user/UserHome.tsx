import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserLayout } from "@/components/user/UserLayout";
import { useMemberAuth } from "@/contexts/MemberAuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { blogService } from "@/services/blogService";
import { facilityService } from "@/services/facilityService";
import { BlogPost, Facility } from "../../types";
import {
  ArrowRight,
  Newspaper,
  MapPin,
  Calendar,
  CreditCard,
  Dumbbell,
  Flame,
  Zap,
  Trophy,
  Target,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export default function UserHome() {
  const { member, isAuthenticated } = useMemberAuth();
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [posts, facs] = await Promise.all([
          blogService.getAll(),
          facilityService.getAll(),
        ]);
        setRecentPosts(
          posts.filter((p) => p.status === "Published").slice(0, 3)
        );
        setFacilities(facs.filter((f) => f.status === "Open").slice(0, 4));
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <UserLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gym-gradient opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="absolute top-20 right-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

        <div className="container relative py-24 lg:py-36">
          <div className="max-w-3xl">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="h-6 w-6 text-primary-foreground animate-pulse" />
                  <Badge
                    variant="secondary"
                    className="bg-primary-foreground/20 text-primary-foreground border-0 uppercase tracking-wider font-bold text-xs"
                  >
                    Välkommen tillbaka, Mästare
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-primary-foreground mb-6 leading-none">
                  Hej,
                  <br />
                  <span className="gym-gradient-text bg-gradient-to-r from-primary-foreground to-primary-foreground/70 bg-clip-text">
                    {member?.firstName}!
                  </span>
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl">
                  Redo att krossa dina mål idag? Ditt nästa träningspass väntar.
                  Låt oss göra det räknas.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-bold uppercase tracking-wide text-sm h-14 px-8"
                    asChild
                  >
                    <Link to="/app/classes">
                      <Calendar className="mr-2 h-5 w-5" />
                      Boka Pass
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-bold uppercase tracking-wide text-sm h-14 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link to="/app/profile">
                      Min Profil
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-primary-foreground animate-pulse" />
                  <Badge
                    variant="secondary"
                    className="bg-primary-foreground/20 text-primary-foreground border-0 uppercase tracking-wider font-bold text-xs"
                  >
                    Starta Din Förvandling
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-primary-foreground mb-6 leading-none">
                  Frigör
                  <br />
                  Din Potential
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl">
                  Gå med i vår gemenskap av vinnare. Toppmoderna anläggningar,
                  expertinstruktörer och ett brett utbud av pass för alla
                  nivåer.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-bold uppercase tracking-wide text-sm h-14 px-8"
                    asChild
                  >
                    <Link to="/app/register">
                      Börja Din Resa
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-bold uppercase tracking-wide text-sm h-14 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link to="/app/subscriptions">Se Medlemskap</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {isAuthenticated && (
        <section className="py-16 -mt-8 relative z-10">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  to: "/app/classes",
                  icon: Calendar,
                  label: "Boka Pass",
                  color: "from-primary to-primary/80",
                },
                {
                  to: "/app/subscriptions",
                  icon: CreditCard,
                  label: "Mitt Medlemskap",
                  color: "from-accent to-accent/80",
                },
                {
                  to: "/app/profile",
                  icon: Target,
                  label: "Min Profil",
                  color: "from-warning to-warning/80",
                },
                {
                  to: "/app/blog",
                  icon: Newspaper,
                  label: "Läs Bloggen",
                  color: "from-info to-info/80",
                },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <Card className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50 group">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div
                        className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <item.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <p className="font-bold uppercase tracking-wide text-sm">
                        {item.label}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "8+", label: "Anläggningar", icon: MapPin },
              { value: "20+", label: "Pass i Veckan", icon: Calendar },
              { value: "2000+", label: "Medlemmar", icon: Trophy },
              { value: "05.00-23-00 året om", label: "Tillgång", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="h-16 w-16 rounded-2xl gym-gradient flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-4xl font-black tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-muted-foreground uppercase tracking-wide text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="uppercase tracking-wide font-bold text-xs mb-4"
            >
              <Dumbbell className="h-3 w-3 mr-1" />
              Våra Gym
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              Toppmoderna Anläggningar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Förstklassig utrustning och premium-faciliteter över hela Sverige
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((facility) => (
                <Card
                  key={facility.id}
                  className="overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-2 border-0 shadow-lg"
                >
                  <div className="h-36 gym-gradient flex items-center justify-center relative overflow-hidden">
                    <Dumbbell className="h-16 w-16 text-primary-foreground/20 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs font-bold uppercase"
                      >
                        Öppet
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold uppercase tracking-tight text-lg mb-2">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4" />
                      {facility.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {facility.openingHours}
                      </p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <Badge
                variant="secondary"
                className="uppercase tracking-wide font-bold text-xs mb-4"
              >
                <Flame className="h-3 w-3 mr-1" />
                Nytt Innehåll
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
                Senaste Artiklarna
              </h2>
              <p className="text-muted-foreground text-lg">
                Tips, nyheter och träningsinspiration
              </p>
            </div>
            <Button
              variant="outline"
              className="font-bold uppercase tracking-wide text-sm"
              asChild
            >
              <Link to="/app/blog">
                Visa Alla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 group border-0 shadow-lg"
                >
                  <div className="h-44 gym-gradient flex items-center justify-center relative overflow-hidden">
                    <Newspaper className="h-16 w-16 text-primary-foreground/20 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardHeader className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="uppercase text-xs font-bold">
                        {post.category}
                      </Badge>
                      {post.publishedAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.publishedAt), "d MMM yyyy", {
                            locale: sv,
                          })}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gym-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          <div className="container relative text-center">
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0 uppercase tracking-wider font-bold text-xs mb-6"
            >
              <Trophy className="h-3 w-3 mr-1" />
              Gå Med i Rörelsen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-primary-foreground mb-6">
              Redo att Förändras?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Din resa mot ett starkare, friskare du börjar nu. Gå med tusentals
              medlemmar som redan tagit steget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="font-bold uppercase tracking-wide text-sm h-14 px-10"
                asChild
              >
                <Link to="/app/subscriptions">Se Medlemskap</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold uppercase tracking-wide text-sm h-14 px-10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/app/register">
                  Registrera Dig Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </UserLayout>
  );
}

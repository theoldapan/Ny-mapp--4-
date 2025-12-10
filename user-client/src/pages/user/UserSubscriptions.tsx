import { useEffect, useState } from "react";
import { UserLayout } from "@/components/user/UserLayout";
import { LoginPrompt } from "@/components/user/LoginPrompt";
import { useMemberAuth } from "@/contexts/MemberAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { subscriptionService } from "@/services/subscriptionService";
import { SubscriptionPlan } from "../../types";
import { Check, CreditCard, Zap, Crown, Dumbbell, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, member } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadPlans = async () => {
      try {
        const data = await subscriptionService.getAll();
        setPlans(data.filter((p) => p.isActive));
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, [isAuthenticated]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    toast({
      title: "Kommer snart!",
      description: `Betalning för ${plan.name} kommer snart att vara tillgänglig.`,
    });
  };

  const formatDuration = (days: number) => {
    if (days === 30) return "månad";
    if (days === 90) return "3 månader";
    if (days === 180) return "6 månader";
    if (days === 365) return "år";
    return `${days} dagar`;
  };

  const getPricePerMonth = (plan: SubscriptionPlan) => {
    if (plan.duration === 30) return plan.price;
    return Math.round(plan.price / (plan.duration / 30));
  };

  const getPlanIcon = (index: number) => {
    const icons = [Dumbbell, Zap, Crown, Trophy];
    const Icon = icons[index % icons.length];
    return <Icon className="h-6 w-6" />;
  };

  if (!isAuthenticated) {
    return (
      <UserLayout>
        <LoginPrompt
          title="Se Medlemskap"
          description="Logga in för att utforska våra medlemskap och hitta den perfekta planen för dina träningsmål."
        />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="gym-gradient text-primary-foreground">
        <div className="container py-16">
          <div className="text-center max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0 uppercase tracking-wide font-bold mb-4"
            >
              <Trophy className="h-3 w-3 mr-1" />
              Medlemskap
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Ta Din Träning Till Nästa Nivå
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Välj ditt medlemskap. Starta din förvandling. Inga ursäkter.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {member?.subscriptionId && (
          <Card className="mb-8 border-2 border-accent">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gym-gradient flex items-center justify-center">
                    <Crown className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-tight">
                      Aktiv Medlem
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ditt medlemskap är aktivt
                    </p>
                  </div>
                </div>
                <Badge className="bg-accent text-accent-foreground uppercase font-bold">
                  Aktiv
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-bold uppercase">
                Inga Planer Tillgängliga
              </p>
              <p className="text-muted-foreground">
                Kom tillbaka senare för medlemskapsalternativ.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isPopular = index === 1;
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-transform hover:scale-105 ${
                    isPopular ? "border-2 border-primary shadow-xl" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 gym-gradient text-primary-foreground text-center py-2 text-xs font-black uppercase tracking-wide">
                      Mest Populär
                    </div>
                  )}
                  <CardHeader
                    className={`text-center pb-2 ${isPopular ? "pt-12" : ""}`}
                  >
                    <div className="h-14 w-14 rounded-full gym-gradient flex items-center justify-center mx-auto mb-3">
                      {getPlanIcon(index)}
                      <span className="text-primary-foreground">
                        {getPlanIcon(index)}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-5xl font-black">{plan.price}</span>
                      <span className="text-xl font-bold text-muted-foreground">
                        {" "}
                        kr
                      </span>
                      <p className="text-muted-foreground">
                        /{formatDuration(plan.duration)}
                      </p>
                      {plan.duration !== 30 && (
                        <p className="text-sm text-accent font-semibold mt-1">
                          ~{getPricePerMonth(plan)} kr/månad
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 text-left mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="h-3 w-3 text-accent" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full font-bold uppercase tracking-wide ${
                        isPopular ? "gym-gradient" : ""
                      }`}
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      Kom Igång
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-black uppercase tracking-tight text-center mb-8">
            Alla Medlemskap Inkluderar
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Dumbbell,
                title: "All Utrustning",
                description: "Full tillgång till premium gymutrustning",
              },
              {
                icon: Zap,
                title: "Grupppass",
                description: "Obegränsat deltagande i grupppass",
              },
              {
                icon: Trophy,
                title: "Personlig Intro",
                description: "Gratis introduktion med tränare",
              },
              {
                icon: Crown,
                title: "24/7 Tillgång",
                description: "Träna när det passar dig",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full gym-gradient flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold uppercase tracking-tight mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

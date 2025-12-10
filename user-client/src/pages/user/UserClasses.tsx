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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { classService } from "@/services/classService";
import { GymClass } from "../../types";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Flame,
  Dumbbell,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];
const DAYS_SHORT = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

export default function UserClasses() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadClasses = async () => {
      try {
        const data = await classService.getAll();
        setClasses(data.filter((c) => c.isActive));
      } catch (error) {
        console.error("Failed to load classes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadClasses();
  }, [isAuthenticated]);

  const handleBookClass = (gymClass: GymClass) => {
    if (gymClass.enrolled >= gymClass.capacity) {
      toast({
        title: "Passet är fullt",
        description: "Detta pass har nått maxkapacitet.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bokning kommer snart!",
      description: `Bokning för ${gymClass.name} kommer snart att vara tillgänglig.`,
    });
  };

  const getClassesByDay = (dayIndex: number) => {
    return classes
      .filter((c) => c.dayOfWeek === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-accent/10 text-accent border-accent/20";
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case "Beginner":
        return "Nybörjare";
      case "Intermediate":
        return "Medel";
      case "Advanced":
        return "Avancerad";
      default:
        return level;
    }
  };

  const today = new Date().getDay();

  if (!isAuthenticated) {
    return (
      <UserLayout>
        <LoginPrompt
          title="Se Våra Pass"
          description="Logga in för att se hela schemat och boka din plats på våra expertledda träningspass."
        />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="gym-gradient text-primary-foreground">
        <div className="container py-16">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="h-8 w-8" />
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0 uppercase tracking-wide font-bold"
            >
              Gruppträning
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Passschema
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-xl">
            Pressa dina gränser med våra energifyllda grupppass. Från
            styrketräning till cardio.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue={today.toString()} className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1">
              {DAYS.map((day, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="min-w-[100px] font-bold uppercase text-xs tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {DAYS_SHORT[index]}
                  {index === today && <Flame className="ml-1 h-3 w-3" />}
                </TabsTrigger>
              ))}
            </TabsList>

            {DAYS.map((day, dayIndex) => {
              const dayClasses = getClassesByDay(dayIndex);
              return (
                <TabsContent
                  key={dayIndex}
                  value={dayIndex.toString()}
                  className="space-y-4"
                >
                  {dayClasses.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-bold uppercase">Vilodag</p>
                        <p className="text-muted-foreground">
                          Inga pass schemalagda. Återhämtning är en del av
                          resan!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    dayClasses.map((gymClass) => {
                      const isFull = gymClass.enrolled >= gymClass.capacity;
                      const spotsLeft = gymClass.capacity - gymClass.enrolled;

                      return (
                        <Card
                          key={gymClass.id}
                          className="overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-28 gym-gradient text-primary-foreground flex items-center justify-center p-4 md:p-6">
                              <div className="text-center">
                                <p className="text-2xl font-black">
                                  {gymClass.startTime}
                                </p>
                                <p className="text-xs opacity-80">
                                  {gymClass.endTime}
                                </p>
                              </div>
                            </div>
                            <div className="flex-1 p-4 md:p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold uppercase tracking-tight">
                                      {gymClass.name}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className={getLevelColor(gymClass.level)}
                                    >
                                      {getLevelName(gymClass.level)}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="uppercase text-xs font-bold"
                                    >
                                      {gymClass.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {gymClass.description}
                                  </p>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <User className="h-4 w-4" />
                                      {gymClass.instructorName}
                                    </span>
                                    {gymClass.facilityName && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {gymClass.facilityName}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span
                                        className={
                                          spotsLeft < 5
                                            ? "text-destructive font-semibold"
                                            : ""
                                        }
                                      >
                                        {spotsLeft} platser kvar
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {isFull ? (
                                    <Badge
                                      variant="destructive"
                                      className="uppercase font-bold"
                                    >
                                      Fullt
                                    </Badge>
                                  ) : (
                                    <Button
                                      onClick={() => handleBookClass(gymClass)}
                                      className="font-bold uppercase tracking-wide"
                                    >
                                      Boka Nu
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        <Card className="mt-12 border-2">
          <CardHeader>
            <CardTitle className="uppercase tracking-tight font-black">
              Träningstips
            </CardTitle>
            <CardDescription>Få ut det mesta av din träning</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full gym-gradient flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="font-bold uppercase mb-2">Kom i Tid</h4>
              <p className="text-sm text-muted-foreground">
                Kom 10 minuter innan för att värma upp och göra dig redo.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full gym-gradient flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="font-bold uppercase mb-2">Utmana Dig Själv</h4>
              <p className="text-sm text-muted-foreground">
                Pressa dina gränser men lyssna på din kropp.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full gym-gradient flex items-center justify-center mx-auto mb-3">
                <Flame className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="font-bold uppercase mb-2">Var Konsekvent</h4>
              <p className="text-sm text-muted-foreground">
                Regelbunden träning ger bestående resultat.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}

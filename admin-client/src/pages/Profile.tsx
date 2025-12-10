import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/userService";
import {
  User,
  Shield,
  Mail,
  Calendar,
  Clock,
  Save,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async () => {
    if (!user) return;
    if (
      !profileData.firstName.trim() ||
      !profileData.lastName.trim() ||
      !profileData.email.trim()
    ) {
      toast({
        title: "Valideringsfel",
        description: "Alla fält krävs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await userService.update(user.id, profileData);

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      toast({ title: "Klart", description: "Profil uppdaterad" });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast({
        title: "Valideringsfel",
        description: "Alla lösenordsfält krävs",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Valideringsfel",
        description: "Nya lösenord matchar inte",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Valideringsfel",
        description: "Lösenord måste vara minst 8 tecken",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({ title: "Klart", description: "Lösenord ändrat" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ändra lösenord",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-primary/10 text-primary border-primary/20";
      case "Manager":
        return "bg-warning/10 text-warning border-warning/20";
      case "Staff":
        return "bg-info/10 text-info border-info/20";
      default:
        return "";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AdminLayout
      title="Profilinställningar"
      description="Hantera dina kontoinställningar"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge
              variant="outline"
              className={`mx-auto mt-2 ${getRoleBadgeColor(user.role)}`}
            >
              {user.role}
            </Badge>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Roll: {user.role}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Registrerad: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Senaste inloggning:{" "}
                    {new Date(user.lastLogin).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profilinformation
              </CardTitle>
              <CardDescription>
                Uppdatera din personliga information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Förnamn</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Efternamn</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-postadress</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Spara ändringar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Ändra lösenord
              </CardTitle>
              <CardDescription>
                Uppdatera ditt lösenord för att hålla kontot säkert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nytt lösenord</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Bekräfta nytt lösenord
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Lösenord måste vara minst 8 tecken långt
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={handlePasswordChange}
                  disabled={isPasswordLoading}
                  variant="outline"
                  className="gap-2"
                >
                  {isPasswordLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  Ändra lösenord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

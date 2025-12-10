import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserLayout } from "@/components/user/UserLayout";
import { useMemberAuth } from "@/contexts/MemberAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Calendar,
  Settings,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function UserProfile() {
  const { member, isAuthenticated, isLoading } = useMemberAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }

  const getInitials = () => {
    if (!member) return "U";
    return `${member.firstName?.[0] || ""}${
      member.lastName?.[0] || ""
    }`.toUpperCase();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
    setIsSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-gray-500";
      case "Suspended":
        return "bg-red-500";
      case "Expired":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <UserLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member?.profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold">
                    {member?.firstName} {member?.lastName}
                  </h1>
                  <p className="text-muted-foreground">{member?.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          member?.membershipStatus || "Inactive"
                        )}`}
                      />
                      {member?.membershipStatus || "No membership"}
                    </Badge>
                    {member?.joinDate && (
                      <Badge variant="secondary">
                        Member since{" "}
                        {format(new Date(member.joinDate), "MMM yyyy")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <p className="font-medium">{member?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <p className="font-medium">
                        {member?.phone || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <p className="font-medium">
                        {member?.dateOfBirth
                          ? format(new Date(member.dateOfBirth), "MMMM d, yyyy")
                          : "Not set"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Gender
                      </Label>
                      <p className="font-medium">
                        {member?.gender || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <p className="font-medium">
                      {member?.address ? (
                        <>
                          {member.address}
                          <br />
                          {member.postalCode} {member.city}
                        </>
                      ) : (
                        "Not set"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>
                    Your current membership plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {member?.subscriptionId ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <p className="font-medium">Active Subscription</p>
                        <p className="text-sm text-muted-foreground">
                          You have an active membership
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="font-medium mb-2">No active subscription</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get a membership to access all our facilities and
                        classes
                      </p>
                      <Button>View Plans</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Class Bookings</CardTitle>
                  <CardDescription>
                    Your upcoming and past class registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-2">No bookings yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Browse our classes and book your first session
                    </p>
                    <Button>Browse Classes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={member?.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={member?.lastName} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={member?.phone} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue={member?.address} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue={member?.city} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        defaultValue={member?.postalCode}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>In case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        defaultValue={member?.emergencyContact}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        defaultValue={member?.emergencyPhone}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    Update Emergency Contact
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UserLayout>
  );
}

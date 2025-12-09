import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memberService } from "@/services/memberService";
import { subscriptionService } from "@/services/subscriptionService";
import { memberSubscriptionService } from "@/services/memberSubscriptionService";
import { Member, SubscriptionPlan, MemberSubscription } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const MemberFormFields = ({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) => (
  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email *</Label>
      <Input
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) =>
            setFormData({ ...formData, gender: value as Member["gender"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Membership Status</Label>
        <Select
          value={formData.membershipStatus}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              membershipStatus: value as Member["membershipStatus"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          value={formData.postalCode}
          onChange={(e) =>
            setFormData({ ...formData, postalCode: e.target.value })
          }
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          value={formData.emergencyContact}
          onChange={(e) =>
            setFormData({ ...formData, emergencyContact: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
        <Input
          id="emergencyPhone"
          value={formData.emergencyPhone}
          onChange={(e) =>
            setFormData({ ...formData, emergencyPhone: e.target.value })
          }
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={3}
      />
    </div>
  </div>
);

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [memberSubscriptions, setMemberSubscriptions] = useState<
    MemberSubscription[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const getMemberSubscription = (
    memberId: string
  ): MemberSubscription | undefined => {
    return memberSubscriptions.find((s) => s.memberId === memberId);
  };

  const getSubscriptionPlan = (
    planId: string
  ): SubscriptionPlan | undefined => {
    return subscriptionPlans.find((p) => p.id === planId);
  };

  const emptyFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male" as Member["gender"],
    address: "",
    city: "",
    postalCode: "",
    membershipStatus: "Active" as Member["membershipStatus"],
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  };

  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    loadMembers();
    loadSubscriptionPlans();
    loadMemberSubscriptions();
  }, []);

  const loadSubscriptionPlans = async () => {
    try {
      const plans = await subscriptionService.getAll();
      setSubscriptionPlans(plans);
    } catch (error) {
      console.error("Failed to load subscription plans:", error);
    }
  };

  const loadMemberSubscriptions = async () => {
    try {
      const subscriptions = await memberSubscriptionService.getAll();
      setMemberSubscriptions(subscriptions);
    } catch (error) {
      console.error("Failed to load member subscriptions:", error);
    }
  };

  useEffect(() => {
    const filtered = members.filter((member) => {
      const searchLower = search.toLowerCase();
      return (
        member.firstName.toLowerCase().includes(searchLower) ||
        member.lastName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower)
      );
    });
    setFilteredMembers(filtered);
  }, [members, search]);

  const loadMembers = async () => {
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "First name, last name, and email are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dateOfBirth) {
      toast({
        title: "Validation Error",
        description: "Date of birth is required",
        variant: "destructive",
      });
      return;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    if (birthDate >= today) {
      toast({
        title: "Validation Error",
        description: "Date of birth must be in the past",
        variant: "destructive",
      });
      return;
    }

    try {
      const newMember = await memberService.create({
        ...formData,
        joinDate: new Date().toISOString(),
      });
      setMembers([...members, newMember]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Member added successfully" });
    } catch (error) {
      console.error("Error creating member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = async () => {
    if (!editingMember) return;
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "First name, last name, and email are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const updated = await memberService.update(editingMember.id, formData);
      setMembers(members.map((m) => (m.id === editingMember.id ? updated : m)));
      setIsEditDialogOpen(false);
      setEditingMember(null);
      resetForm();
      toast({ title: "Success", description: "Member updated successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await memberService.delete(id);
      setMembers(members.filter((m) => m.id !== id));
      toast({ title: "Success", description: "Member deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      address: member.address,
      city: member.city,
      postalCode: member.postalCode,
      membershipStatus: member.membershipStatus,
      emergencyContact: member.emergencyContact || "",
      emergencyPhone: member.emergencyPhone || "",
      notes: member.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingMember(null);
  };

  const columns = [
    {
      key: "name",
      header: "Medlem",
      render: (member: Member) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {member.firstName.charAt(0)}
              {member.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.email}</p>
          </div>
        </div>
      ),
    },
    { key: "firstName", header: "Förnamn" },
    { key: "lastName", header: "Efternamn" },
    { key: "email", header: "Mail" },
    { key: "phone", header: "Telefon" },
    {
      key: "Adress",
      header: "Adress",
      render: (member: Member) => member.address,
    },
    { key: "city", header: "Stad", render: (member: Member) => member.city },
    { key: "postalCode", header: "Postnummer" },
    {
      key: "dateOfBirth",
      header: "Födelsedatum",
      render: (member: Member) => member.dateOfBirth,
    },
    {
      key: "joinDate",
      header: "Medlemsdatum",
      render: (member: Member) =>
        new Date(member.joinDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (member: Member) => (
        <StatusBadge status={member.membershipStatus} />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (member: Member) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem
              onClick={() => {
                setSelectedMember(member);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(member)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteMember(member.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout title="Members" description="Manage your gym members">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search members..."
          className="w-full sm:w-80"
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Lägg Medlem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Lägg till Medlem</DialogTitle>
              <DialogDescription>
                Ange medlemmens information nedan.
              </DialogDescription>
            </DialogHeader>
            <MemberFormFields formData={formData} setFormData={setFormData} />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Avbryt
              </Button>
              <Button onClick={handleAddMember}>Lägg Medlem</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={filteredMembers}
        isLoading={isLoading}
        emptyMessage="Inga medlemmar hittas"
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Redigera Medlem</DialogTitle>
            <DialogDescription>
              Uppdatera medlemmens information.
            </DialogDescription>
          </DialogHeader>
          <MemberFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Avbryt
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="subscription">Medlemskap</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {selectedMember.firstName.charAt(0)}
                      {selectedMember.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </h3>
                    <StatusBadge status={selectedMember.membershipStatus} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mail:</span>
                    <p>{selectedMember.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefon:</span>
                    <p>{selectedMember.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stad:</span>
                    <p>{selectedMember.city}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Medlemsdatum:</span>
                    <p>
                      {new Date(selectedMember.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kön:</span>
                    <p>{selectedMember.gender}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Adress:</span>
                    <p>{selectedMember.address || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Födelsedatum:</span>
                    <p>
                      {selectedMember.dateOfBirth
                        ? new Date(
                            selectedMember.dateOfBirth
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Postnummer:</span>
                    <p>{selectedMember.postalCode || "N/A"}</p>
                  </div>
                </div>
                {(selectedMember.emergencyContact ||
                  selectedMember.emergencyPhone) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 text-sm">
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Namn:</span>
                        <p>{selectedMember.emergencyContact || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Telefonnummer:
                        </span>
                        <p>{selectedMember.emergencyPhone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedMember.notes && (
                  <div className="border-t pt-4 text-sm">
                    <span className="text-muted-foreground">Noteringar:</span>
                    <p className="mt-1">{selectedMember.notes}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="subscription" className="space-y-4 mt-4">
                {(() => {
                  const memberSub = getMemberSubscription(selectedMember.id);
                  const plan = memberSub
                    ? getSubscriptionPlan(memberSub.planId)
                    : null;

                  if (!memberSub || !plan) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Ingen aktiv medlemskap</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{plan.name}</h4>
                          <Badge
                            variant={
                              memberSub.status === "Active"
                                ? "default"
                                : memberSub.status === "Expired"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {memberSub.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {plan.description}
                        </p>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-bold">
                            {plan.price} kr
                          </span>
                          <span className="text-muted-foreground">
                            /{plan.duration} days
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Start Date:
                            </span>
                            <p className="font-medium">
                              {new Date(
                                memberSub.startDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              End Date:
                            </span>
                            <p className="font-medium">
                              {new Date(memberSub.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Payment Status:
                            </span>
                            <p>
                              <Badge
                                variant={
                                  memberSub.paymentStatus === "Paid"
                                    ? "outline"
                                    : memberSub.paymentStatus === "Pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="mt-1"
                              >
                                {memberSub.paymentStatus}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2 text-sm">
                          Plan Features
                        </h5>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService } from "@/services/userService";
import { User } from "@/types";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Shield,
  Plus,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const isAdmin = currentUser?.role === "Admin";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Staff" as User["role"],
  });

  const [addFormData, setAddFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Staff" as User["role"],
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda användare",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast({
        title: "Valideringsfel",
        description: "Alla fält krävs",
        variant: "destructive",
      });
      return;
    }
    try {
      const updated = await userService.update(editingUser.id, formData);
      setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)));
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "Klart",
        description: "Användare uppdaterad.",
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera användare",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    if (
      !addFormData.firstName.trim() ||
      !addFormData.lastName.trim() ||
      !addFormData.email.trim() ||
      !addFormData.password.trim()
    ) {
      toast({
        title: "Valideringsfel",
        description: "Alla fält krävs",
        variant: "destructive",
      });
      return;
    }
    if (addFormData.password.length < 6) {
      toast({
        title: "Valideringsfel",
        description: "Lösenord måste vara minst 6 tecken",
        variant: "destructive",
      });
      return;
    }
    try {
      const newUser = await userService.create(addFormData);
      setUsers([...users, newUser]);
      setIsAddDialogOpen(false);
      resetAddForm();
      toast({ title: "Klart", description: "Användare skapad" });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte skapa användare",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      toast({
        title: "Fel",
        description: "Du kan inte ta bort ditt eget konto",
        variant: "destructive",
      });
      return;
    }
    try {
      await userService.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      toast({ title: "Klart", description: "Användare borttagen" });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort användare",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "Staff",
    });
    setEditingUser(null);
  };

  const resetAddForm = () => {
    setAddFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "Staff",
    });
  };

  const getRoleBadgeColor = (role: User["role"]) => {
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

  const getRoleDescription = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "Full systemåtkomst - kan hantera alla användare, inställningar och data";
      case "Manager":
        return "Kan hantera medlemmar, prenumerationer, anläggningar och blogginnehåll";
      case "Staff":
        return "Begränsad åtkomst - kan visa och uppdatera medlemsinformation";
      default:
        return "";
    }
  };

  const columns = [
    {
      key: "user",
      header: "Användare",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Roll",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
            {user.role}
          </Badge>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Registrerad",
      render: (user: User) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: "lastLogin",
      header: "Senaste inloggning",
      render: (user: User) =>
        user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString()
          : "Aldrig",
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Visa profil
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem onClick={() => openEditDialog(user)}>
                  <Pencil className="mr-2 h-4 w-4" /> Redigera användare
                </DropdownMenuItem>
                {user.id !== currentUser?.id && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Ta bort
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Användare"
      description="Hantera adminanvändare och roller"
    >
      <div className="mb-6 rounded-lg border border-warning/20 bg-warning/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">
              Säkerhet för rollhantering
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              I produktion valideras rolländringar på serversidan och kräver
              korrekt auktorisering. Roller bör lagras i en separat tabell med
              lämpliga RLS-policyer.
            </p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetAddForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Lägg till användare
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Lägg till ny användare</DialogTitle>
                <DialogDescription>
                  Skapa en ny adminanvändare och tilldela roll.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-firstName">Förnamn *</Label>
                    <Input
                      id="add-firstName"
                      value={addFormData.firstName}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-lastName">Efternamn *</Label>
                    <Input
                      id="add-lastName"
                      value={addFormData.lastName}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-email">E-post *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={addFormData.email}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-password">Lösenord *</Label>
                  <Input
                    id="add-password"
                    type="password"
                    value={addFormData.password}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Minst 6 tecken"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-role">Roll</Label>
                  <Select
                    value={addFormData.role}
                    onValueChange={(value) =>
                      setAddFormData({
                        ...addFormData,
                        role: value as User["role"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor("Admin")}
                          >
                            Admin
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="Manager">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor("Manager")}
                          >
                            Manager
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="Staff">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor("Staff")}
                          >
                            Staff
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRoleDescription(addFormData.role)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetAddForm();
                  }}
                >
                  Avbryt
                </Button>
                <Button onClick={handleAddUser}>Skapa användare</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="Inga användare hittades"
      />

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Redigera användare</DialogTitle>
            <DialogDescription>
              Uppdatera användarinformation och rolltilldelning.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Förnamn</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Efternamn</Label>
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
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Roll</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as User["role"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor("Admin")}
                      >
                        Admin
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Manager">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor("Manager")}
                      >
                        Manager
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Staff">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor("Staff")}
                      >
                        Staff
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {getRoleDescription(formData.role)}
              </p>
            </div>
          </div>
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
            <Button onClick={handleEditUser}>Spara ändringar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Användarprofil</DialogTitle>
            <DialogDescription>Adminanvändardetaljer</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {selectedUser.firstName.charAt(0)}
                    {selectedUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <Badge
                    variant="outline"
                    className={getRoleBadgeColor(selectedUser.role)}
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="text-sm font-medium mb-2">Role Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(selectedUser.role)}
                </p>
              </div>
              <div className="grid gap-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {selectedUser.lastLogin
                        ? new Date(selectedUser.lastLogin).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { subscriptionService } from "@/services/subscriptionService";
import { SubscriptionPlan } from "@/types";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Subscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "30",
    features: "",
    isActive: true,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await subscriptionService.getAll();
      setPlans(data);
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda abonnemang",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const planData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        features: formData.features.split("\n").filter((f) => f.trim()),
        isActive: formData.isActive,
      };

      if (editingPlan) {
        const updated = await subscriptionService.update(
          editingPlan.id,
          planData
        );
        setPlans(plans.map((p) => (p.id === editingPlan.id ? updated : p)));
        toast({ title: "Klart", description: "Abonnemang uppdaterat" });
      } else {
        const newPlan = await subscriptionService.create(planData);
        setPlans([...plans, newPlan]);
        toast({ title: "Klart", description: "Abonnemang skapat" });
      }
      closeDialog();
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara abonnemang",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await subscriptionService.delete(id);
      setPlans(plans.filter((p) => p.id !== id));
      toast({ title: "Klart", description: "Abonnemang borttaget" });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort abonnemang",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: plan.features.join("\n"),
      isActive: plan.isActive,
    });
    setIsAddDialogOpen(true);
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingPlan(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "30",
      features: "",
      isActive: true,
    });
  };

  return (
    <AdminLayout title="Abonnemang" description="Hantera abonnemangsplaner">
      <div className="mb-6 flex justify-end">
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
            else setIsAddDialogOpen(true);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Lägg till Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Redigera Plan" : "Lägg till Ny Plan"}
              </DialogTitle>
              <DialogDescription>
                Konfigurera din abonnemangsplan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plannamn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="t.ex. Premium Månad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Kort beskrivning av planen"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Pris (SEK)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="299"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Varaktighet (dagar)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Funktioner (en per rad)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="Gymtillgång&#10;Grupppass&#10;Bastu"
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Aktiv</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>
                Avbryt
              </Button>
              <Button onClick={handleSubmit}>
                {editingPlan ? "Uppdatera" : "Skapa"} Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : plans.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Inga abonnemang ännu. Skapa din första plan för att komma igång.
            </CardContent>
          </Card>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden">
              <div className="absolute right-3 top-3 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(plan)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <StatusBadge status={plan.isActive ? "Active" : "Inactive"} />
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    SEK / {plan.duration} dagar
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

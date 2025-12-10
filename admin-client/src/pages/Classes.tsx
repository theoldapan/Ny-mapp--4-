import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { classService } from "@/services/classService";
import { GymClass } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS_OF_WEEK = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];
const CATEGORIES = [
  "Yoga",
  "Kondition",
  "Styrka",
  "Flexibilitet",
  "Kampsport",
  "Dans",
  "Vatten",
  "Övrigt",
];
const LEVELS = ["Nybörjare", "Medel", "Avancerad", "Alla nivåer"];

export default function Classes() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<GymClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructorName: "",
    instructorId: "",
    facilityName: "",
    facilityId: "",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    capacity: 20,
    level: "All Levels" as GymClass["level"],
    category: "Other",
    isActive: true,
  });

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    let filtered = classes.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedDay !== "all") {
      filtered = filtered.filter((c) => c.dayOfWeek === parseInt(selectedDay));
    }
    setFilteredClasses(filtered);
  }, [classes, search, selectedDay]);

  const loadClasses = async () => {
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda klasser",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.instructorName.trim()) {
      toast({
        title: "Valideringsfel",
        description: "Namn och instruktör krävs",
        variant: "destructive",
      });
      return;
    }
    try {
      if (editingClass) {
        const updated = await classService.update(editingClass.id, formData);
        setClasses(
          classes.map((c) => (c.id === editingClass.id ? updated : c))
        );
        toast({ title: "Klart", description: "Klass uppdaterad" });
      } else {
        const newClass = await classService.create(formData);
        setClasses([...classes, newClass]);
        toast({ title: "Klart", description: "Klass skapad" });
      }
      closeDialog();
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara klass",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await classService.delete(id);
      setClasses(classes.filter((c) => c.id !== id));
      toast({ title: "Klart", description: "Klass borttagen" });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort klass",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (gymClass: GymClass) => {
    setEditingClass(gymClass);
    setFormData({
      name: gymClass.name,
      description: gymClass.description,
      instructorName: gymClass.instructorName,
      instructorId: gymClass.instructorId,
      facilityName: gymClass.facilityName || "",
      facilityId: gymClass.facilityId || "",
      dayOfWeek: gymClass.dayOfWeek,
      startTime: gymClass.startTime,
      endTime: gymClass.endTime,
      capacity: gymClass.capacity,
      level: gymClass.level,
      category: gymClass.category,
      isActive: gymClass.isActive,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClass(null);
    setFormData({
      name: "",
      description: "",
      instructorName: "",
      instructorId: "",
      facilityName: "",
      facilityId: "",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:00",
      capacity: 20,
      level: "All Levels",
      category: "Other",
      isActive: true,
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getClassesByDay = (day: number) =>
    filteredClasses.filter((c) => c.dayOfWeek === day);

  return (
    <AdminLayout title="Klassschema" description="Hantera gruppträningsklasser">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Sök klasser..."
            className="w-full sm:w-64"
          />
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filtrera efter dag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla dagar</SelectItem>
              {DAYS_OF_WEEK.map((day, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
            else setIsDialogOpen(true);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Lägg till klass
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Redigera klass" : "Lägg till ny klass"}
              </DialogTitle>
              <DialogDescription>Konfigurera klassdetaljer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Klassnamn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="t.ex. Morgonyoga"
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
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instruktör *</Label>
                  <Input
                    id="instructor"
                    value={formData.instructorName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instructorName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility">Lokal/Rum</Label>
                  <Input
                    id="facility"
                    value={formData.facilityName}
                    onChange={(e) =>
                      setFormData({ ...formData, facilityName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Dag</Label>
                  <Select
                    value={formData.dayOfWeek.toString()}
                    onValueChange={(v) =>
                      setFormData({ ...formData, dayOfWeek: parseInt(v) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Starttid</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Sluttid</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Kapacitet</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nivå</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        level: v as GymClass["level"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>
                Avbryt
              </Button>
              <Button onClick={handleSubmit}>
                {editingClass ? "Uppdatera" : "Lägg till"} klass
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Rutnätsvy</TabsTrigger>
          <TabsTrigger value="weekly">Veckoschema</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Inga klasser hittades.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((gymClass) => (
                <Card key={gymClass.id} className="relative overflow-hidden">
                  <div className="absolute right-2 top-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(gymClass)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Redigera
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(gymClass.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Ta bort
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between pr-8">
                      <div>
                        <CardTitle className="text-lg">
                          {gymClass.name}
                        </CardTitle>
                        <CardDescription>
                          {gymClass.instructorName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{gymClass.category}</Badge>
                      <Badge
                        variant="outline"
                        className={getLevelColor(gymClass.level)}
                      >
                        {gymClass.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{DAYS_OF_WEEK[gymClass.dayOfWeek]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {gymClass.startTime} - {gymClass.endTime}
                      </span>
                    </div>
                    {gymClass.facilityName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{gymClass.facilityName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={
                          gymClass.enrolled >= gymClass.capacity
                            ? "text-destructive font-medium"
                            : ""
                        }
                      >
                        {gymClass.enrolled} / {gymClass.capacity} anmälda
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="weekly">
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day, i) => (
              <div key={day} className="space-y-2">
                <h4 className="font-semibold text-center text-sm py-2 bg-muted rounded-lg">
                  {day.slice(0, 3)}
                </h4>
                <div className="space-y-2 min-h-[200px]">
                  {isLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    getClassesByDay(i)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((c) => (
                        <Card
                          key={c.id}
                          className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => openEditDialog(c)}
                        >
                          <p className="text-xs font-medium truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.startTime}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] mt-1"
                          >
                            {c.category}
                          </Badge>
                        </Card>
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

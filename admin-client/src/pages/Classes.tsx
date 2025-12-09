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
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const CATEGORIES = [
  "Yoga",
  "Cardio",
  "Strength",
  "Flexibility",
  "Combat",
  "Dance",
  "Aqua",
  "Other",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

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
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.instructorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and instructor are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const classData: any = {
        name: formData.name,
        description: formData.description,
        instructorName: formData.instructorName,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: formData.capacity,
        level: formData.level,
        category: formData.category,
        isActive: formData.isActive,
      };

      if (formData.instructorId && formData.instructorId.trim() !== "") {
        classData.instructorId = formData.instructorId;
      }

      if (formData.facilityId && formData.facilityId.trim() !== "") {
        classData.facilityId = formData.facilityId;
      }

      if (formData.facilityName && formData.facilityName.trim() !== "") {
        classData.facilityName = formData.facilityName;
      }

      if (editingClass) {
        const updated = await classService.update(editingClass.id, classData);
        setClasses(
          classes.map((c) => (c.id === editingClass.id ? updated : c))
        );
        toast({ title: "Success", description: "Class updated successfully" });
      } else {
        const newClass = await classService.create(classData);
        setClasses([...classes, newClass]);
        toast({ title: "Success", description: "Class created successfully" });
      }
      closeDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save class",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await classService.delete(id);
      setClasses(classes.filter((c) => c.id !== id));
      toast({ title: "Success", description: "Class deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete class",
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
    <AdminLayout
      title="Class Schedule"
      description="Manage group fitness classes"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search classes..."
            className="w-full sm:w-64"
          />
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
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
              <Plus className="h-4 w-4" /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Edit Class" : "Add New Class"}
              </DialogTitle>
              <DialogDescription>
                Configure class schedule details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Morning Yoga"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="instructor">Instructor *</Label>
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
                  <Label htmlFor="facility">Facility/Room</Label>
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
                  <Label>Day</Label>
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
                  <Label htmlFor="startTime">Start Time</Label>
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
                  <Label htmlFor="endTime">End Time</Label>
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
                  <Label htmlFor="capacity">Capacity</Label>
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
                  <Label>Level</Label>
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
                  <Label>Category</Label>
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
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingClass ? "Update" : "Add"} Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
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
                No classes found.
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
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(gymClass.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                        {gymClass.enrolled} / {gymClass.capacity} enrolled
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

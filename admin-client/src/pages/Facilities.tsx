import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { facilityService } from '@/services/facilityService';
import { Facility } from '@/types';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, MapPin, Phone, Mail, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    email: '',
    status: 'Open' as Facility['status'],
    openingHours: '',
    memberCount: '',
    managerName: '',
  });

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    const filtered = facilities.filter((facility) =>
      facility.name.toLowerCase().includes(search.toLowerCase()) ||
      facility.city.toLowerCase().includes(search.toLowerCase()) ||
      facility.address.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFacilities(filtered);
  }, [facilities, search]);

  const loadFacilities = async () => {
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load facilities', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const facilityData = {
        name: formData.name,
        description: formData.description,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        openingHours: formData.openingHours,
        memberCount: formData.memberCount ? parseInt(formData.memberCount) : undefined,
        managerName: formData.managerName || undefined,
      };

      if (editingFacility) {
        const updated = await facilityService.update(editingFacility.id, facilityData);
        setFacilities(facilities.map(f => f.id === editingFacility.id ? updated : f));
        toast({ title: 'Success', description: 'Location updated successfully' });
      } else {
        const newFacility = await facilityService.create(facilityData);
        setFacilities([...facilities, newFacility]);
        toast({ title: 'Success', description: 'Location added successfully' });
      }
      closeDialog();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save location', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await facilityService.delete(id);
      setFacilities(facilities.filter(f => f.id !== id));
      toast({ title: 'Success', description: 'Location deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete location', variant: 'destructive' });
    }
  };

  const openEditDialog = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      description: facility.description,
      city: facility.city,
      address: facility.address,
      postalCode: facility.postalCode,
      phone: facility.phone,
      email: facility.email,
      status: facility.status,
      openingHours: facility.openingHours,
      memberCount: facility.memberCount?.toString() || '',
      managerName: facility.managerName || '',
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFacility(null);
    setFormData({
      name: '',
      description: '',
      city: '',
      address: '',
      postalCode: '',
      phone: '',
      email: '',
      status: 'Open',
      openingHours: '',
      memberCount: '',
      managerName: '',
    });
  };

  const statusColors: Record<Facility['status'], string> = {
    Open: 'bg-success/10 text-success',
    Closed: 'bg-destructive/10 text-destructive',
    ComingSoon: 'bg-info/10 text-info',
    Renovating: 'bg-warning/10 text-warning',
  };

  const statusLabels: Record<Facility['status'], string> = {
    Open: 'Open',
    Closed: 'Closed',
    ComingSoon: 'Coming Soon',
    Renovating: 'Renovating',
  };

  const columns = [
    {
      key: 'name',
      header: 'Location',
      render: (facility: Facility) => (
        <div>
          <p className="font-medium">{facility.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {facility.city}
          </p>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Address',
      render: (facility: Facility) => (
        <div className="text-sm">
          <p>{facility.address}</p>
          <p className="text-muted-foreground">{facility.postalCode} {facility.city}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (facility: Facility) => (
        <div className="text-sm space-y-1">
          <p className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {facility.phone}
          </p>
          <p className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-3 w-3" />
            {facility.email}
          </p>
        </div>
      ),
    },
    {
      key: 'members',
      header: 'Members',
      render: (facility: Facility) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{facility.memberCount?.toLocaleString() || '-'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (facility: Facility) => (
        <Badge variant="secondary" className={statusColors[facility.status]}>
          {statusLabels[facility.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      render: (facility: Facility) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => { setSelectedFacility(facility); setIsViewDialogOpen(true); }}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(facility)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(facility.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout title="Locations" description="Manage gym locations and branches across cities">
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search locations..." className="w-full sm:w-80" />
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFacility ? 'Edit Location' : 'Add New Location'}</DialogTitle>
              <DialogDescription>Configure gym location details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Hälsoprofilen Stockholm City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe this location..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="e.g., Stockholm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="e.g., Sveavägen 45" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} placeholder="e.g., 11134" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+46 8 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="stockholm@halsoprofilen.se" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Facility['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="ComingSoon">Coming Soon</SelectItem>
                      <SelectItem value="Renovating">Renovating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberCount">Member Count</Label>
                  <Input id="memberCount" type="number" value={formData.memberCount} onChange={(e) => setFormData({ ...formData, memberCount: e.target.value })} placeholder="e.g., 500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <Input id="openingHours" value={formData.openingHours} onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })} placeholder="Mon-Fri 06:00-22:00, Sat-Sun 08:00-20:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager Name</Label>
                  <Input id="managerName" value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} placeholder="Optional" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingFacility ? 'Update' : 'Add'} Location</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={filteredFacilities} isLoading={isLoading} emptyMessage="No locations found" />

      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedFacility.name}</h3>
                <Badge variant="secondary" className={statusColors[selectedFacility.status]}>
                  {statusLabels[selectedFacility.status]}
                </Badge>
              </div>
              <p className="text-muted-foreground">{selectedFacility.description}</p>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFacility.address}<br />
                      {selectedFacility.postalCode} {selectedFacility.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{selectedFacility.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{selectedFacility.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Members</p>
                    <p className="text-sm text-muted-foreground">{selectedFacility.memberCount?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Opening Hours</span>
                  <p className="font-medium">{selectedFacility.openingHours}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Manager</span>
                  <p className="font-medium">{selectedFacility.managerName || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

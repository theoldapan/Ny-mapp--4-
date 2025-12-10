import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useMemberAuth } from '@/contexts/MemberAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserRegister() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', dateOfBirth: '', gender: '' as 'Male' | 'Female' | 'Other' | '',
    address: '', city: '', postalCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useMemberAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) return <Navigate to="/app" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Lösenorden matchar inte', variant: 'destructive' });
      return;
    }
    if (!formData.gender) {
      toast({ title: 'Välj kön', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
        password: formData.password, phone: formData.phone, dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as 'Male' | 'Female' | 'Other', address: formData.address,
        city: formData.city, postalCode: formData.postalCode,
      });
      toast({ title: 'Välkommen till Hälsoprofilen!', description: 'Ditt konto har skapats.' });
      navigate('/app');
    } catch (error) {
      toast({ title: 'Registrering misslyckades', description: error instanceof Error ? error.message : 'Kunde inte skapa konto', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4 py-12">
      <Card className="w-full max-w-lg animate-fade-in border-0 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <Link to="/app" className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gym-gradient">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </Link>
          <div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Skapa Konto</CardTitle>
            <CardDescription className="mt-2">Gå med i Hälsoprofilen och börja din träningsresa</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="firstName">Förnamn</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="lastName">Efternamn</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isLoading} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="email">E-post</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isLoading} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="password">Lösenord</Label><Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="confirmPassword">Bekräfta Lösenord</Label><Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required disabled={isLoading} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="phone">Telefon</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="dateOfBirth">Födelsedatum</Label><Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required disabled={isLoading} /></div>
            </div>
            <div className="space-y-2">
              <Label>Kön</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as 'Male' | 'Female' | 'Other' }))} disabled={isLoading}>
                <SelectTrigger><SelectValue placeholder="Välj kön" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Man</SelectItem>
                  <SelectItem value="Female">Kvinna</SelectItem>
                  <SelectItem value="Other">Annat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="address">Adress</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} required disabled={isLoading} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="city">Stad</Label><Input id="city" name="city" value={formData.city} onChange={handleChange} required disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="postalCode">Postnummer</Label><Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required disabled={isLoading} /></div>
            </div>
            <Button type="submit" className="w-full font-bold uppercase tracking-wide" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Skapar konto...</>) : 'Skapa Konto'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Har du redan ett konto?{' '}<Link to="/app/login" className="text-primary hover:underline font-bold">Logga in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useMemberAuth } from '@/contexts/MemberAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useMemberAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Välkommen tillbaka!', description: 'Du har loggat in.' });
      navigate('/app');
    } catch (error) {
      toast({
        title: 'Inloggning misslyckades',
        description: error instanceof Error ? error.message : 'Fel e-post eller lösenord',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md animate-fade-in border-0 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <Link to="/app" className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gym-gradient">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </Link>
          <div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Välkommen Tillbaka</CardTitle>
            <CardDescription className="mt-2">Logga in på ditt Hälsoprofilen-konto</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" type="email" placeholder="din@email.se" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full font-bold uppercase tracking-wide" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loggar in...</>) : 'Logga In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Har du inget konto?{' '}
            <Link to="/app/register" className="text-primary hover:underline font-bold">Registrera dig</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Dumbbell, Zap } from "lucide-react";

interface LoginPromptProps {
  title: string;
  description: string;
}

export function LoginPrompt({ title, description }: LoginPromptProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Lock className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-8 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
            <Dumbbell className="h-6 w-6 text-accent" />
          </div>
          <div className="absolute -bottom-2 -left-8 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse delay-150">
            <Zap className="h-5 w-5 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/app/login")}
            className="font-bold uppercase tracking-wide"
          >
            Logga In
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/app/register")}
            className="font-bold uppercase tracking-wide"
          >
            Skapa Konto
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Gå med i{" "}
          <span className="font-semibold text-foreground">Hälsoprofilen</span>{" "}
          för att låsa upp alla funktioner
        </p>
      </div>
    </div>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MemberAuthProvider } from "@/contexts/MemberAuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

import UserHome from "./pages/user/UserHome";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserBlog from "./pages/user/UserBlog";
import UserSubscriptions from "./pages/user/UserSubscriptions";
import UserClasses from "./pages/user/UserClasses";
import UserProfile from "./pages/user/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MemberAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/app" replace />} />

              <Route path="/app" element={<UserHome />} />
              <Route path="/app/login" element={<UserLogin />} />
              <Route path="/app/register" element={<UserRegister />} />
              <Route path="/app/blog" element={<UserBlog />} />
              <Route
                path="/app/subscriptions"
                element={<UserSubscriptions />}
              />
              <Route path="/app/classes" element={<UserClasses />} />
              <Route path="/app/profile" element={<UserProfile />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MemberAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

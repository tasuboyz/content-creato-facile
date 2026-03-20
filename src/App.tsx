import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import PostDetailPage from "@/pages/PostDetailPage";
import UploadPage from "@/pages/UploadPage";
import GeneraPage from "@/pages/GeneraPage";
import CalendarioPage from "@/pages/CalendarioPage";
import ImpostazioniPage from "@/pages/ImpostazioniPage";
import NotFound from "@/pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/genera" element={<GeneraPage />} />
      <Route path="/calendario" element={<CalendarioPage />} />
      <Route path="/impostazioni" element={<ImpostazioniPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

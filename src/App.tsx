
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import PropertyPage from "./pages/PropertyPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AiAssistant from "./pages/AiAssistant";
import Investments from "./pages/Investments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/manage" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/investments" element={<Investments />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

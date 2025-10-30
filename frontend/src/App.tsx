import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Setup from "./pages/Setup";
import EmployeeRegistration from "./pages/EmployeeRegistration";
import UserRegistration from "./pages/UserRegistration";
import Employees from "./pages/Employees";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import PendingIssues from "./pages/PendingIssues";
import NotFound from "./pages/NotFound";

const client = new QueryClient();

const App = () => (
  <QueryClientProvider client = {queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter />
        <AuthProvider />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />



          </Routes>
        </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
// import Auth from "./pages/Auth";
// import Setup from "./pages/Setup";
// import EmployeeRegistration from "./pages/EmployeeRegistration";
// import UserRegistration from "./pages/UserRegistration";
// import Employees from "./pages/Employees";
// import Users from "./pages/Users";
// // import Settings from "./pages/Settings";
// // import Reports from "./pages/Reports";
// import PendingIssues from "./pages/PendingIssues";
// import NotFound from "./pages/NotFound";

const App = () => (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* <AuthProvider> */}
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/auth" element={<Auth />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/employee-registration" element={<EmployeeRegistration />} />
            <Route path="/user-registration" element={<UserRegistration />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/users" element={<Users />} /> */}
            {/* <Route path="/settings" element={<Settings />} /> */}
            {/* <Route path="/reports" element={<Reports />} /> */}
            {/* <Route path="/pending-issues" element={<PendingIssues />} />
            <Route path="*" element={<NotFound />} /> */}
          </Routes>
        {/* </AuthProvider> */}
      </BrowserRouter>
    </TooltipProvider>
);

export default App;

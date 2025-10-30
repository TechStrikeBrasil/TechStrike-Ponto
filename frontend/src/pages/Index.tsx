import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";

const Index = () => {
    const { user, userRole, loading } = useAuth();
    const navigate = useNavigate();
    const [checkingSetup, setCheckingSetup] = useState(true);

    useEffect(() => {
        checkingSetup();
}, []);

    useEffect(() => {
        if(!loading && !user && !checkingSetup) {
            navigate("/auth");
        }
}, [user,loading, navigate, checkingSetup]);

    const checkingSetup = async () => {
        const { data } = await supabase
            .from("organizations")
            .select("id")
            .limit(1)
            .maybeSingle();

        if (!data) {
            navigate("/setup");
        }
        setCheckingSetup(false);
};

    if (loading || checkingSetup) {
        return (
            <div className=" flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
);
}

if(!user) {
    return null;
}

    return userRole === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Index;
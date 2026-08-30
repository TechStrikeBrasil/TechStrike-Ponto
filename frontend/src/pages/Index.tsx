// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/components/AuthProvider";
// import { supabase } from "@/integrations/supabase/client";
// import EmployeeDashboard from "./EmployeeDashboard";
// import AdminDashboard from "./AdminDashboard";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">
          TechStrike Ponto
        </h1>

        <p className="mt-2 text-muted-foreground">
          Frontend funcionando.
        </p>
      </div>
    </div>
  );
};

export default Index;
  // const { user, userRole, loading } = useAuth();
  // const navigate = useNavigate();
  // const [checkingSetup, setCheckingSetup] = useState(true);

  // useEffect(() => {
  //   checkSetup();
  // }, []);

  // useEffect(() => {
  //   if (!loading && !user && !checkingSetup) {
  //     navigate("/auth");
  //   }
  // }, [user, loading, navigate, checkingSetup]);

  // const checkSetup = async () => {
  //   const { data } = await supabase
  //     .from("organizations")
  //     .select("id")
  //     .limit(1)
  //     .maybeSingle();

  //   if (!data) {
  //     navigate("/setup");
  //   }
  //   setCheckingSetup(false);
  // };

//   if (loading || checkingSetup) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
//           <p className="text-muted-foreground">Carregando...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return userRole === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
// };
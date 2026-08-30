import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AdminSidebar from "@/components/AdminSidebar";
import { UserPlus } from "lucide-react";

export default function Employees() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex gap-6">
        <AdminSidebar />
        
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Funcionários</h1>
              <p className="text-muted-foreground">Gerencie os funcionários da organização</p>
            </div>
            <Button onClick={() => navigate("/employee-registration")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Cadastrar Funcionário
            </Button>
          </div>

          <Card className="p-6">
            <p className="text-muted-foreground">Lista de funcionários será implementada aqui.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, UserCog, Settings, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <Card className="w-64 h-fit p-4 space-y-2 shadow-lg">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => navigate("/employees")}
      >
        <UserCog className="mr-2 h-4 w-4" />
        Funcionários
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => navigate("/users")}
      >
        <Users className="mr-2 h-4 w-4" />
        Usuários
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => navigate("/reports")}
      >
        <FileText className="mr-2 h-4 w-4" />
        Relatórios
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => navigate("/pending-issues")}
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        Pendências
      </Button>
      <div className="pt-4 mt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </div>
    </Card>
  );
}

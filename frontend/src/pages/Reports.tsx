import { Card } from "@/components/ui/card";
import AdminSidebar from "@/components/AdminSidebar";

export default function Reports() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex gap-6">
        <AdminSidebar />
        
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Visualize relatórios e análises do sistema</p>
          </div>

          <Card className="p-6">
            <p className="text-muted-foreground">Conteúdo de relatórios será implementado aqui.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

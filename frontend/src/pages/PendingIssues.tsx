import { Card } from "@/components/ui/card";
import AdminSidebar from "@/components/AdminSidebar";

export default function PendingIssues() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex gap-6">
        <AdminSidebar />
        
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Pendências</h1>
            <p className="text-muted-foreground">Gerencie pendências e questões em aberto</p>
          </div>

          <Card className="p-6">
            <p className="text-muted-foreground">Conteúdo de pendências será implementado aqui.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

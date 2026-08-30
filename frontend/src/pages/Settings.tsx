import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface Organization {
  id: string;
  razao_social: string;
  cnpj: string;
  email_rh: string;
  whatsapp_rh: string;
}

export default function Settings() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [emailRh, setEmailRh] = useState("");
  const [whatsappRh, setWhatsappRh] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    const { data } = await supabase
      .from("organizations")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setOrganization(data);
      setRazaoSocial(data.razao_social);
      setCnpj(data.cnpj);
      setEmailRh(data.email_rh);
      setWhatsappRh(data.whatsapp_rh);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          razao_social: razaoSocial,
          cnpj: cnpj,
          email_rh: emailRh,
          whatsapp_rh: whatsappRh,
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast({
        title: "Configurações atualizadas!",
        description: "Os dados da empresa foram atualizados com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Configurações da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  type="text"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailRh">Email do RH</Label>
                <Input
                  id="emailRh"
                  type="email"
                  value={emailRh}
                  onChange={(e) => setEmailRh(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappRh">WhatsApp do RH</Label>
                <Input
                  id="whatsappRh"
                  type="tel"
                  value={whatsappRh}
                  onChange={(e) => setWhatsappRh(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

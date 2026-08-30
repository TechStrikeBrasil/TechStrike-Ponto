import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";

export default function Setup() {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [emailRh, setEmailRh] = useState("");
  const [whatsappRh, setWhatsappRh] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert({
          razao_social: razaoSocial,
          cnpj: cnpj,
          email_rh: emailRh,
          whatsapp_rh: whatsappRh,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: adminName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with organization
        await supabase
          .from("profiles")
          .update({ organization_id: orgData.id })
          .eq("id", authData.user.id);

        // Assign admin role
        await supabase
          .from("user_roles")
          .update({ role: "admin" })
          .eq("user_id", authData.user.id);
      }

      toast({
        title: "Organização configurada!",
        description: "Faça login com as credenciais de administrador.",
      });

      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erro ao configurar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Configurar Organização</CardTitle>
          <CardDescription className="text-base">
            Configure sua empresa e crie o primeiro administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados da Empresa</h3>
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  type="text"
                  placeholder="Empresa LTDA"
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
                  placeholder="00.000.000/0000-00"
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
                  placeholder="rh@empresa.com"
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
                  placeholder="+55 11 99999-9999"
                  value={whatsappRh}
                  onChange={(e) => setWhatsappRh(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Primeiro Administrador</h3>
              <div className="space-y-2">
                <Label htmlFor="adminName">Nome Completo</Label>
                <Input
                  id="adminName"
                  type="text"
                  placeholder="João Silva"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@empresa.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Senha</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Configurando..." : "Concluir Configuração"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

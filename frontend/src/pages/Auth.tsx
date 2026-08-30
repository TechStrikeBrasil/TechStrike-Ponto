// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { Clock, Mail, Phone } from "lucide-react";

// interface Organization {
//   email_rh: string;
//   whatsapp_rh: string;
// }

// export default function Auth() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [organization, setOrganization] = useState<Organization | null>(null);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     // Check if user is already logged in
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         navigate("/");
//       }
//     });

//     // Fetch organization info for RH contact
//     fetchOrganization();
//   }, [navigate]);

//   const fetchOrganization = async () => {
//     const { data } = await supabase
//       .from("organizations")
//       .select("email_rh, whatsapp_rh")
//       .limit(1)
//       .single();

//     if (data) {
//       setOrganization(data);
//     }
//   };

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       toast({
//         title: "Login realizado com sucesso!",
//         description: "Redirecionando...",
//       });
//       navigate("/");
//     } catch (error: any) {
//       toast({
//         title: "Erro",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="text-center space-y-2">
//           <div className="flex justify-center mb-4">
//             <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//               <Clock className="h-8 w-8 text-primary-foreground" />
//             </div>
//           </div>
//           <CardTitle className="text-3xl font-bold">Sistema de Ponto</CardTitle>
//           <CardDescription className="text-base">
//             Entre com sua conta
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleAuth} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="seu@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Senha</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 minLength={6}
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Processando..." : "Entrar"}
//             </Button>
//           </form>
          
//           {organization && (
//             <div className="mt-6 pt-6 border-t text-center space-y-3">
//               <p className="text-sm text-muted-foreground">
//                 Não tem conta? Procure o RH
//               </p>
//               <div className="flex justify-center gap-4">
//                 <a
//                   href={`mailto:${organization.email_rh}`}
//                   className="flex items-center gap-2 text-sm text-primary hover:underline"
//                 >
//                   <Mail className="h-4 w-4" />
//                   Email
//                 </a>
//                 <a
//                   href={`https://wa.me/${organization.whatsapp_rh.replace(/\D/g, '')}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 text-sm text-primary hover:underline"
//                 >
//                   <Phone className="h-4 w-4" />
//                   WhatsApp
//                 </a>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

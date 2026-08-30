import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeEntry {
  id: string;
  entry_type: string;
  timestamp: string;
}

export default function EmployeeDashboard() {
  const { user, signOut } = useAuth();
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchTodayEntries();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [user]);

  const fetchTodayEntries = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", today.toISOString())
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setTodayEntries(data || []);
      if (data && data.length > 0) {
        setLastEntry(data[0]);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("time_entries").insert({
        user_id: user.id,
        entry_type: "clock_in",
      });

      if (error) throw error;

      toast({
        title: "Entrada registrada!",
        description: `Marcado às ${format(new Date(), "HH:mm:ss")}`,
      });

      fetchTodayEntries();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar entrada",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("time_entries").insert({
        user_id: user.id,
        entry_type: "clock_out",
      });

      if (error) throw error;

      toast({
        title: "Saída registrada!",
        description: `Marcado às ${format(new Date(), "HH:mm:ss")}`,
      });

      fetchTodayEntries();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar saída",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canClockIn = !lastEntry || lastEntry.entry_type === "clock_out";
  const canClockOut = lastEntry && lastEntry.entry_type === "clock_in";
  const isOnShift = canClockOut;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Marcação de Ponto</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              <div className={`h-3 w-3 rounded-full ${isOnShift ? 'bg-success animate-pulse' : 'bg-muted-foreground/30'}`} />
              <span className="text-sm font-medium">
                {isOnShift ? 'Em Jornada' : 'Fora de Jornada'}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Clock className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-5xl font-bold tabular-nums">
              {format(currentTime, "HH:mm:ss")}
            </CardTitle>
            <CardDescription className="text-lg">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                onClick={handleClockIn}
                disabled={!canClockIn || loading}
                className="h-24 text-lg bg-success hover:bg-success/90"
              >
                <LogIn className="mr-2 h-6 w-6" />
                Registrar Entrada
              </Button>
              <Button
                size="lg"
                onClick={handleClockOut}
                disabled={!canClockOut || loading}
                className="h-24 text-lg bg-destructive hover:bg-destructive/90"
              >
                <LogOut className="mr-2 h-6 w-6" />
                Registrar Saída
              </Button>
            </div>

            {lastEntry && (
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Último registro:</span>
                    <span className="font-semibold">
                      {lastEntry.entry_type === "clock_in" ? "Entrada" : "Saída"} às{" "}
                      {format(new Date(lastEntry.timestamp), "HH:mm:ss")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Registros de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum registro hoje
              </p>
            ) : (
              <div className="space-y-2">
                {todayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      {entry.entry_type === "clock_in" ? (
                        <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                          <LogIn className="h-5 w-5 text-success" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                          <LogOut className="h-5 w-5 text-destructive" />
                        </div>
                      )}
                      <span className="font-medium">
                        {entry.entry_type === "clock_in" ? "Entrada" : "Saída"}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {format(new Date(entry.timestamp), "HH:mm:ss")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, AlertCircle, CalendarCheck } from "lucide-react";
import { format, differenceInHours, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import AdminSidebar from "@/components/AdminSidebar";

interface Employee {
  id: string;
  full_name: string;
}

interface TimeEntry {
  id: string;
  user_id: string;
  entry_type: string;
  timestamp: string;
  profiles: {
    full_name: string;
  };
}

interface EmployeeStats {
  id: string;
  name: string;
  hoursToday: number;
  lastEntry: string;
  status: "in" | "out";
}

interface PendingIssue {
  id: string;
  user_id: string;
  issue_type: string;
  issue_date: string;
  description: string;
  profiles: {
    full_name: string;
  };
}

interface MonthSummary {
  user_id: string;
  full_name: string;
  absences: number;
  lateArrivals: number;
  total: number;
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<EmployeeStats[]>([]);
  const [pendingIssues, setPendingIssues] = useState<PendingIssue[]>([]);
  const [monthSummary, setMonthSummary] = useState<MonthSummary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState("2025");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (employeesError) throw employeesError;

      // Fetch today's time entries
      const today = new Date();
      const { data: entriesData, error: entriesError } = await supabase
        .from("time_entries")
        .select(`
          id,
          user_id,
          entry_type,
          timestamp,
          profiles (
            full_name
          )
        `)
        .gte("timestamp", startOfDay(today).toISOString())
        .lte("timestamp", endOfDay(today).toISOString())
        .order("timestamp", { ascending: false });

      if (entriesError) throw entriesError;

      // Fetch pending issues with profiles join
      const { data: issuesData, error: issuesError } = await supabase
        .from("pending_issues")
        .select("*")
        .eq("resolved", false)
        .order("issue_date", { ascending: false });

      if (issuesError) throw issuesError;

      // Fetch profiles to join with issues
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name");

      // Map issues with profile names
      const issuesWithProfiles = (issuesData || []).map((issue) => {
        const profile = (profilesData || []).find((p) => p.id === issue.user_id);
        return {
          ...issue,
          profiles: {
            full_name: profile?.full_name || "Usuário desconhecido",
          },
        };
      });

      setEmployees(employeesData || []);
      setTimeEntries(entriesData || []);
      setPendingIssues(issuesWithProfiles);

      // Calculate stats
      calculateStats(employeesData || [], entriesData || []);
      
      // Calculate month summary
      await calculateMonthSummary();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateStats = (employees: Employee[], entries: TimeEntry[]) => {
    const employeeStats: EmployeeStats[] = employees.map((employee) => {
      const employeeEntries = entries
        .filter((entry) => entry.user_id === employee.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      let hoursToday = 0;
      let lastEntry = "Sem registro";
      let status: "in" | "out" = "out";

      if (employeeEntries.length > 0) {
        const lastEntryData = employeeEntries[employeeEntries.length - 1];
        lastEntry = format(new Date(lastEntryData.timestamp), "HH:mm");
        status = lastEntryData.entry_type === "clock_in" ? "in" : "out";

        // Calculate total hours worked
        for (let i = 0; i < employeeEntries.length - 1; i += 2) {
          if (
            employeeEntries[i].entry_type === "clock_in" &&
            employeeEntries[i + 1]?.entry_type === "clock_out"
          ) {
            const clockIn = new Date(employeeEntries[i].timestamp);
            const clockOut = new Date(employeeEntries[i + 1].timestamp);
            hoursToday += differenceInHours(clockOut, clockIn, { roundingMethod: 'floor' });
          }
        }

        // If currently clocked in, add time until now
        if (status === "in") {
          const lastClockIn = new Date(lastEntryData.timestamp);
          hoursToday += differenceInHours(new Date(), lastClockIn, { roundingMethod: 'floor' });
        }
      }

      return {
        id: employee.id,
        name: employee.full_name,
        hoursToday,
        lastEntry,
        status,
      };
    });

    setStats(employeeStats);
  };

  const totalEmployees = employees.length;
  const employeesIn = stats.filter((s) => s.status === "in").length;
  const pendingCount = pendingIssues.length;

  const handleCloseMonth = () => {
    // TODO: Implement month closing logic
    console.log(`Fechando mês ${selectedMonth}/${selectedYear}`);
  };

  const calculateMonthSummary = async () => {
    try {
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data: issuesData } = await supabase
        .from("pending_issues")
        .select("user_id, issue_type")
        .gte("issue_date", firstDay.toISOString().split('T')[0])
        .lte("issue_date", lastDay.toISOString().split('T')[0]);

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name");

      // Aggregate issues by user
      const summaryMap = new Map<string, { absences: number; lateArrivals: number; full_name: string }>();

      issuesData?.forEach((issue) => {
        const current = summaryMap.get(issue.user_id) || { absences: 0, lateArrivals: 0, full_name: "" };
        if (issue.issue_type === "absence") {
          current.absences++;
        } else if (issue.issue_type === "late_arrival") {
          current.lateArrivals++;
        }
        summaryMap.set(issue.user_id, current);
      });

      // Map to array with profile names
      const summary: MonthSummary[] = Array.from(summaryMap.entries())
        .map(([user_id, data]) => {
          const profile = profilesData?.find((p) => p.id === user_id);
          return {
            user_id,
            full_name: profile?.full_name || "Usuário desconhecido",
            absences: data.absences,
            lateArrivals: data.lateArrivals,
            total: data.absences + data.lateArrivals,
          };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      setMonthSummary(summary);
    } catch (error) {
      console.error("Error calculating month summary:", error);
    }
  };

  const handleResolveIssue = async (issueId: string) => {
    try {
      const { error } = await supabase
        .from("pending_issues")
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq("id", issueId);

      if (error) throw error;
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error resolving issue:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Fechar Mês
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fechar Mês</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mês</label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {format(new Date(2024, i, 1), "MMMM", { locale: ptBR })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ano</label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2024, 2025, 2026].map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCloseMonth} className="w-full">
                    Confirmar Fechamento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <AdminSidebar />
          
          <div className="flex-1 space-y-6">

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEmployees}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Presentes Agora</CardTitle>
                  <AlertCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employeesIn}</div>
                  <p className="text-xs text-muted-foreground">
                    de {totalEmployees} funcionários
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendências Abertas</CardTitle>
                  <Clock className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <p className="text-xs text-muted-foreground">necessitam atenção</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Pendências Recentes</CardTitle>
                <CardDescription>Questões que necessitam atenção</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingIssues.slice(0, 10).map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">
                          {issue.profiles?.full_name}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">
                            {issue.issue_type === "missing_checkout" && "Saída não registrada"}
                            {issue.issue_type === "late_arrival" && "Atraso"}
                            {issue.issue_type === "absence" && "Falta"}
                          </span>
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {format(new Date(issue.issue_date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveIssue(issue.id)}
                          >
                            Resolver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Registros Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeEntries.slice(0, 10).map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {entry.profiles?.full_name}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.entry_type === "clock_in"
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {entry.entry_type === "clock_in" ? "Entrada" : "Saída"}
                          </span>
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm:ss", {
                            locale: ptBR,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Resumo do Mês</CardTitle>
                <CardDescription>Funcionários com mais faltas e atrasos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead className="text-center">Faltas</TableHead>
                      <TableHead className="text-center">Atrasos</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthSummary.length > 0 ? (
                      monthSummary.map((summary) => (
                        <TableRow key={summary.user_id}>
                          <TableCell className="font-medium">
                            {summary.full_name}
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20 text-destructive font-semibold">
                              {summary.absences}
                            </span>
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-warning/20 text-warning font-semibold">
                              {summary.lateArrivals}
                            </span>
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground font-bold">
                              {summary.total}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Nenhum registro encontrado para este mês
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

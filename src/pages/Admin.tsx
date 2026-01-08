import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut,
  Users,
  FileText,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  Car,
} from "lucide-react";
import logo from "@/assets/logo.webp";

interface Simulation {
  id: string;
  created_at: string;
  nome: string;
  contato: string;
  ano: string;
  marca: string;
  modelo: string;
  placa: string;
  plano_selecionado: string;
  parceiras_selecionadas: string[] | null;
}

interface Stats {
  total: number;
  planosMaisEscolhidos: { plano: string; count: number }[];
  parceirasMaisEscolhidas: { parceira: string; count: number }[];
  marcasMaisComuns: { marca: string; count: number }[];
}

export default function Admin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [filteredSimulations, setFilteredSimulations] = useState<Simulation[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    planosMaisEscolhidos: [],
    parceirasMaisEscolhidas: [],
    marcasMaisComuns: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlano, setFilterPlano] = useState("");
  const [filterMarca, setFilterMarca] = useState("");

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [simulations, searchTerm, filterPlano, filterMarca]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const isAdmin = roles?.some((r) => r.role === "admin");
    
    if (!isAdmin) {
      toast.error("Acesso negado");
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("insurance_simulations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSimulations(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: Simulation[]) => {
    // Total
    const total = data.length;

    // Planos mais escolhidos
    const planosCount: Record<string, number> = {};
    data.forEach((s) => {
      const plano = s.plano_selecionado;
      planosCount[plano] = (planosCount[plano] || 0) + 1;
    });
    const planosMaisEscolhidos = Object.entries(planosCount)
      .map(([plano, count]) => ({ plano, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Parceiras mais escolhidas
    const parceirasCount: Record<string, number> = {};
    data.forEach((s) => {
      s.parceiras_selecionadas?.forEach((p) => {
        parceirasCount[p] = (parceirasCount[p] || 0) + 1;
      });
    });
    const parceirasMaisEscolhidas = Object.entries(parceirasCount)
      .map(([parceira, count]) => ({ parceira, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Marcas mais comuns
    const marcasCount: Record<string, number> = {};
    data.forEach((s) => {
      const marca = s.marca.toLowerCase();
      marcasCount[marca] = (marcasCount[marca] || 0) + 1;
    });
    const marcasMaisComuns = Object.entries(marcasCount)
      .map(([marca, count]) => ({ marca, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      total,
      planosMaisEscolhidos,
      parceirasMaisEscolhidas,
      marcasMaisComuns,
    });
  };

  const applyFilters = () => {
    let filtered = [...simulations];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.nome.toLowerCase().includes(term) ||
          s.contato.includes(term) ||
          s.placa.toLowerCase().includes(term)
      );
    }

    if (filterPlano) {
      filtered = filtered.filter((s) =>
        s.plano_selecionado.toLowerCase().includes(filterPlano.toLowerCase())
      );
    }

    if (filterMarca) {
      filtered = filtered.filter((s) =>
        s.marca.toLowerCase().includes(filterMarca.toLowerCase())
      );
    }

    setFilteredSimulations(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlanoLabel = (plano: string) => {
    const labels: Record<string, string> = {
      hbs_select: "HBS Select",
      hbs_economic: "HBS Economic",
      hbs_majorado: "HBS Majorado",
      safeclub_bradesco: "SAFECLUB [Bradesco]",
      hbs_com_seguro: "HBS com Seguro",
    };
    return labels[plano] || plano;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logo} alt="SafeClub" className="h-10 object-contain" />
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground text-sm hidden sm:block">
              Painel Administrativo
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Simulações</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plano Mais Popular</p>
                <p className="text-lg font-bold text-foreground truncate">
                  {stats.planosMaisEscolhidos[0]
                    ? getPlanoLabel(stats.planosMaisEscolhidos[0].plano)
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parceira Top</p>
                <p className="text-lg font-bold text-foreground">
                  {stats.parceirasMaisEscolhidas[0]?.parceira || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marca Popular</p>
                <p className="text-lg font-bold text-foreground capitalize">
                  {stats.marcasMaisComuns[0]?.marca || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts / Stats Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Planos Mais Selecionados
            </h3>
            <div className="space-y-3">
              {stats.planosMaisEscolhidos.map((item, index) => (
                <div key={item.plano} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{getPlanoLabel(item.plano)}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(item.count / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {stats.planosMaisEscolhidos.length === 0 && (
                <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Parceiras Mais Selecionadas
            </h3>
            <div className="space-y-3">
              {stats.parceirasMaisEscolhidas.map((item, index) => (
                <div key={item.parceira} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.parceira}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{
                          width: `${(item.count / Math.max(...stats.parceirasMaisEscolhidas.map(p => p.count), 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {stats.parceirasMaisEscolhidas.length === 0 && (
                <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-border mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, contato ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Input
                placeholder="Filtrar por plano..."
                value={filterPlano}
                onChange={(e) => setFilterPlano(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Filtrar por marca..."
                value={filterMarca}
                onChange={(e) => setFilterMarca(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Simulações Recentes
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredSimulations.length} resultados)
              </span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contato</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Veículo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Placa</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plano</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Parceira</th>
                </tr>
              </thead>
              <tbody>
                {filteredSimulations.map((simulation) => (
                  <tr key={simulation.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm">{formatDate(simulation.created_at)}</td>
                    <td className="p-4 text-sm font-medium">{simulation.nome}</td>
                    <td className="p-4 text-sm">{simulation.contato}</td>
                    <td className="p-4 text-sm">
                      {simulation.marca} {simulation.modelo} ({simulation.ano})
                    </td>
                    <td className="p-4 text-sm font-mono uppercase">{simulation.placa}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {getPlanoLabel(simulation.plano_selecionado)}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {simulation.parceiras_selecionadas?.join(", ") || "—"}
                    </td>
                  </tr>
                ))}
                {filteredSimulations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Nenhuma simulação encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

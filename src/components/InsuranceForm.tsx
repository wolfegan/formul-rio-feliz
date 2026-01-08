import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Car, User, Phone, Calendar, Tag, CreditCard } from "lucide-react";
import logo from "@/assets/logo.webp";

const PARCEIRAS = [
  "Abrantes", "Baypro", "Protecar", "Fipe Brasil", "FCK", "Apvs", "Protege",
  "Gol plus", "Cooperfacil", "Lifekar", "Progresso", "Martolli", "Cooperbras",
  "Apotericorn", "AGV", "Federal car", "Aprovat", "Qualyclub", "Marcla",
  "Defender", "Antena", "Moove", "Proter bem"
];

const PLANOS = [
  {
    id: "hbs_select",
    nome: "HBS Select",
    taxa: "R$ 650,00",
    mensalidade: "R$ 236,00",
    descricao: "Peças novas, indenização com 30 dias",
    showParceiras: true
  },
  {
    id: "hbs_economic",
    nome: "HBS Economic",
    taxa: "R$ 250,00",
    mensalidade: "R$ 165,20",
    descricao: "Peças usadas e paralelas, indenização conforme contrato escolhido (varia de 3 a 10 meses)",
    showParceiras: true
  },
  {
    id: "hbs_majorado",
    nome: "HBS Majorado",
    taxa: "R$ 650,00",
    mensalidade: "R$ 212,40",
    descricao: "Peças novas, indenização em 30 dias",
    obs: "Este produto para pessoas que tem seu carro de garagem"
  },
  {
    id: "safeclub_bradesco",
    nome: "SAFECLUB [Bradesco]",
    taxa: "Valor total: R$ 3.654,76",
    mensalidade: "",
    descricao: "Peças novas indenização de 7 a 30 dias"
  },
  {
    id: "hbs_com_seguro",
    nome: "HBS com Seguro",
    taxa: "",
    mensalidade: "",
    descricao: "Apólice de seguro para cobertura de roubo e furto com cortesia de 50% de guincho, vidros, terceiro e colisão"
  }
];

export default function InsuranceForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    ano: "",
    marca: "",
    modelo: "",
    placa: "",
  });
  const [selectedPlanos, setSelectedPlanos] = useState<string[]>([]);
  const [selectedParceiras, setSelectedParceiras] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanoToggle = (planoId: string) => {
    const newSelected = selectedPlanos.includes(planoId)
      ? selectedPlanos.filter(p => p !== planoId)
      : [...selectedPlanos, planoId];
    
    setSelectedPlanos(newSelected);
    
    // Limpar parceiras se nenhum plano com parceiras estiver selecionado
    const hasPlanoWithParceiras = newSelected.some(
      id => id === "hbs_select" || id === "hbs_economic"
    );
    if (!hasPlanoWithParceiras) {
      setSelectedParceiras([]);
    }
  };

  const handleParceiraToggle = (parceira: string) => {
    setSelectedParceiras(prev =>
      prev.includes(parceira)
        ? prev.filter(p => p !== parceira)
        : [...prev, parceira]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlanos.length === 0) {
      toast.error("Por favor, selecione pelo menos um plano");
      return;
    }

    if (!formData.nome.trim() || !formData.contato.trim() || !formData.ano.trim() || 
        !formData.marca.trim() || !formData.modelo.trim() || !formData.placa.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("insurance_simulations").insert({
        nome: formData.nome.trim(),
        contato: formData.contato.trim(),
        ano: formData.ano.trim(),
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        placa: formData.placa.trim().toUpperCase(),
        plano_selecionado: selectedPlanos.join(", "),
        parceiras_selecionadas: selectedParceiras,
      });

      if (error) throw error;

      navigate("/obrigado");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao enviar formulário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const showParceiras = selectedPlanos.some(
    id => id === "hbs_select" || id === "hbs_economic"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary to-secondary/90 py-4 px-6">
        <div className="max-w-2xl mx-auto flex justify-end">
          <img src={logo} alt="SafeClub" className="h-12 object-contain" />
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 animate-fade-up">
          {/* Intro Text */}
          <p className="text-foreground/80 text-sm md:text-base mb-8 leading-relaxed">
            Uma forma clara e prática para você decidir o seu seguro observando uma simulação 
            com as <strong>5 opções que temos</strong>. Preencha o formulário e em seguida escolha o plano que 
            mais se adeque ao seu perfil:
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  NOME:
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contato" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  CONTATO:
                </Label>
                <Input
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            {/* Vehicle Info Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ano" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Ano:
                </Label>
                <Input
                  id="ano"
                  name="ano"
                  value={formData.ano}
                  onChange={handleInputChange}
                  placeholder="2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marca" className="text-sm font-medium flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  Marca:
                </Label>
                <Input
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  placeholder="Volkswagen"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Modelo:
                </Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  placeholder="Gol"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placa" className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Placa:
                </Label>
                <Input
                  id="placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  placeholder="ABC-1234"
                  className="uppercase"
                  required
                />
              </div>
            </div>

            {/* Plans Section */}
            <div className="pt-4">
              <h3 className="text-base font-semibold mb-4 text-foreground">
                Com base nas opções da simulação à seguir
              </h3>

              {/* Client Info Box */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border/50">
                <p className="text-sm">
                  <span className="font-medium">Cliente:</span> {formData.nome || "—"}<br />
                  <span className="font-medium">Veículo:</span> {formData.marca || "—"} {formData.modelo || "—"}<br />
                  <span className="font-medium">Valor FIPE:</span> R$ 40.000,00
                </p>
              </div>

              {/* Plan Options */}
              <div className="space-y-4">
                {PLANOS.map((plano, index) => (
                  <div key={plano.id} className="space-y-3">
                    <div 
                      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedPlanos.includes(plano.id) 
                          ? "border-primary bg-primary/5 shadow-glow" 
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                      onClick={() => handlePlanoToggle(plano.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={plano.id}
                          checked={selectedPlanos.includes(plano.id)}
                          onCheckedChange={() => handlePlanoToggle(plano.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {index + 1}. {plano.nome}
                          </h4>
                          {plano.taxa && (
                            <p className="text-sm text-muted-foreground">
                              Taxa de ativação: {plano.taxa}
                            </p>
                          )}
                          {plano.mensalidade && (
                            <p className="text-sm text-muted-foreground">
                              Mensalidade: {plano.mensalidade}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {plano.descricao}
                          </p>
                          {plano.obs && (
                            <p className="text-xs text-primary font-medium mt-1">
                              OBS: {plano.obs}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Parceiras Selection for HBS Select and Economic */}
                    {selectedPlanos.includes(plano.id) && plano.showParceiras && (
                      <div className="ml-6 p-4 bg-muted/30 rounded-lg border border-border/30 animate-scale-in">
                        <p className="text-xs text-muted-foreground mb-3">
                          Selecione as parceiras desejadas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {PARCEIRAS.map(parceira => (
                            <label
                              key={parceira}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs cursor-pointer transition-all ${
                                selectedParceiras.includes(parceira)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card border border-border hover:border-primary/50"
                              }`}
                            >
                              <Checkbox
                                checked={selectedParceiras.includes(parceira)}
                                onCheckedChange={() => handleParceiraToggle(parceira)}
                                className="h-3 w-3"
                              />
                              {parceira}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold text-primary">
                OBS: cobrimos qualquer orçamento!
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                INDIQUE E GANHE R$ 180,00 | R$ 90,00 economic | R$ 50,00 em Moto
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="gradient" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "ENVIAR"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

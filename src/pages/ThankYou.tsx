import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, User, Car, DollarSign } from "lucide-react";
import logo from "@/assets/logo.webp";

export default function ThankYou() {
  const location = useLocation();
  const formData = location.state || {};

  // Exemplo de dados se não houver dados reais
  const exampleData = {
    nome: "Arlene Alves",
    marca: "Volkswagen",
    modelo: "Gol",
    valorFipe: "R$ 40.000,00"
  };

  const displayData = formData.nome ? formData : exampleData;
  const isExample = !formData.nome;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary to-secondary/90 py-4 px-6">
        <div className="max-w-2xl mx-auto flex justify-end">
          <img src={logo} alt="SafeClub" className="h-12 object-contain" />
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="bg-card rounded-2xl shadow-card p-8 md:p-12 max-w-lg w-full text-center animate-scale-in">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Obrigado!
          </h1>

          {/* Message */}
          <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
            Sua simulação foi enviada com sucesso! Nossa equipe entrará em contato 
            em breve para apresentar as melhores opções para você.
          </p>

          {/* Simulation Summary Card */}
          <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left border border-border">
            <h2 className="text-sm font-semibold text-center text-muted-foreground mb-4">
              {isExample ? "Exemplo de simulação" : "Com base nas opções da simulação a seguir"}
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Cliente:</span>
                <span className="text-sm font-medium text-foreground">{displayData.nome}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Veículo:</span>
                <span className="text-sm font-medium text-foreground">
                  {displayData.marca} {displayData.modelo}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Valor FIPE:</span>
                <span className="text-sm font-medium text-foreground">
                  {displayData.valorFipe || "R$ 40.000,00"}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link to="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Button>
          </Link>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Dúvidas? Entre em contato conosco
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

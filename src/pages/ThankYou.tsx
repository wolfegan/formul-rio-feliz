import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.webp";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary to-secondary/90 py-4 px-6">
        <div className="max-w-2xl mx-auto flex justify-end">
          <img src={logo} alt="SafeClub" className="h-12 object-contain" />
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
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
          <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
            Sua simulação foi enviada com sucesso! Nossa equipe entrará em contato 
            em breve para apresentar as melhores opções para você.
          </p>

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

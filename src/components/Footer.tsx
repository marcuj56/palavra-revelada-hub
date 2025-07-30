import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-foreground to-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Palavra Revelada</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Dedicados ao estudo profundo da Palavra de Deus, oferecendo recursos 
              para crescimento espiritual e edificação da Igreja.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#temas" className="hover:text-golden-light transition-colors">Temas de Estudo</a></li>
              <li><a href="#esbocos" className="hover:text-golden-light transition-colors">Esboços</a></li>
              <li><a href="#biblia" className="hover:text-golden-light transition-colors">Texto Bíblico</a></li>
              <li><a href="#audio" className="hover:text-golden-light transition-colors">Bíblia em Áudio</a></li>
              <li><a href="#radio" className="hover:text-golden-light transition-colors">Rádio Gospel</a></li>
            </ul>
          </div>

          {/* Recursos */}
          <div className="space-y-4">
            <h4 className="font-semibold">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-golden-light transition-colors">Planos de Leitura</a></li>
              <li><a href="#" className="hover:text-golden-light transition-colors">Comentários</a></li>
              <li><a href="#" className="hover:text-golden-light transition-colors">Concordância</a></li>
              <li><a href="#" className="hover:text-golden-light transition-colors">Dicionário Bíblico</a></li>
              <li><a href="#" className="hover:text-golden-light transition-colors">Mapas Bíblicos</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contato</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contato@palavrarevelada.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-90 flex items-center justify-center gap-2">
            © 2025 Palavra Revelada • Feito com 
            <Heart className="w-4 h-4 fill-current text-red-400" />
            para a glória de Deus
          </p>
          <p className="text-xs opacity-75 mt-2">
            "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho." - Salmos 119:105
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
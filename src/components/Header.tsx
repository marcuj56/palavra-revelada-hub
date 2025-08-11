import { Button } from "@/components/ui/button";
import { BookOpen, Cross, Heart, Radio } from "lucide-react";
const Header = () => {
  return <header className="bg-gradient-to-r from-heaven-blue to-golden-light text-pure-white shadow-lg">
      <div className="container mx-auto px-4 py-8 text-center bg-indigo-50">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Cross className="w-8 h-8" />
          <h1 className="text-4xl font-bold">Vivendo na Fé</h1>
          <Cross className="w-8 h-8" />
        </div>
        <p className="text-xl opacity-90">
          Estudos Profundos • Bíblia em Áudio • Louvores 24h
        </p>
        <p className="text-sm mt-2 opacity-80">
          "Toda palavra de Deus é pura; escudo é para os que confiam nele." - Provérbios 30:5
        </p>
      </div>
    </header>;
};
export default Header;
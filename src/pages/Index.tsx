import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import TemasEstudo from "@/components/TemasEstudo";
import EsbocosPregacao from "@/components/EsbocosPregacao";
import TextoBiblico from "@/components/TextoBiblico";
import BibliaAudio from "@/components/BibliaAudio";
import RadioGospel from "@/components/RadioGospel";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState("temas");
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case "temas":
        return <TemasEstudo />;
      case "esbocos":
        return <EsbocosPregacao />;
      case "biblia":
        return <TextoBiblico />;
      case "audio":
        return <BibliaAudio />;
      case "radio":
        return <RadioGospel />;
      default:
        return <TemasEstudo />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        {user ? (
          <>
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
            >
              Sair
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </Button>
        )}
      </div>
      
      <Header />
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderSection()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;

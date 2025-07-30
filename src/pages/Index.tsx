import { useState } from "react";
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

import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Volume2, Radio, ScrollText } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const sections = [
    { id: "temas", label: "Temas", icon: BookOpen },
    { id: "esbocos", label: "Esboços", icon: FileText },
    { id: "biblia", label: "Texto Bíblico", icon: ScrollText },
    { id: "audio", label: "Bíblia em Áudio", icon: Volume2 },
    { id: "radio", label: "Rádio Gospel", icon: Radio },
  ];

  return (
    <nav className="bg-pure-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeSection === id ? "divine" : "sacred"}
              size="sm"
              onClick={() => onSectionChange(id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
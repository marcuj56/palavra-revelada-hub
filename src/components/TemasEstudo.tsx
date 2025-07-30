import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";

const TemasEstudo = () => {
  const temas = [
    {
      titulo: "Pré-Tribulacionismo",
      descricao: "A vinda de Cristo antes da grande tribulação",
      versiculo: "1 Tessalonicenses 4:16-17",
      nivel: "Intermediário",
      tempo: "45 min",
      categoria: "Escatologia"
    },
    {
      titulo: "Pós-Tribulacionismo", 
      descricao: "O retorno de Cristo após o período de sofrimento",
      versiculo: "Mateus 24:29-31",
      nivel: "Avançado",
      tempo: "50 min",
      categoria: "Escatologia"
    },
    {
      titulo: "Angeologia",
      descricao: "Estudo dos anjos e sua atuação bíblica",
      versiculo: "Hebreus 1:14",
      nivel: "Básico",
      tempo: "35 min",
      categoria: "Teologia Sistemática"
    },
    {
      titulo: "Pneumatologia",
      descricao: "A doutrina do Espírito Santo",
      versiculo: "João 16:13",
      nivel: "Intermediário",
      tempo: "40 min",
      categoria: "Teologia Sistemática"
    },
    {
      titulo: "Soteriologia",
      descricao: "A doutrina da salvação",
      versiculo: "Efésios 2:8-9",
      nivel: "Básico",
      tempo: "30 min",
      categoria: "Teologia Sistemática"
    },
    {
      titulo: "Cristologia",
      descricao: "O estudo sobre a pessoa de Cristo",
      versiculo: "João 1:1,14",
      nivel: "Intermediário",
      tempo: "55 min",
      categoria: "Teologia Sistemática"
    }
  ];

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Básico": return "bg-green-100 text-green-800";
      case "Intermediário": return "bg-yellow-100 text-yellow-800";
      case "Avançado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Temas de Estudo</h2>
        <p className="text-muted-foreground">
          Explore estudos profundos da Palavra de Deus organizados por temas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {temas.map((tema, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">
                  {tema.categoria}
                </Badge>
                <Badge className={getNivelColor(tema.nivel)}>
                  {tema.nivel}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {tema.titulo}
              </CardTitle>
              <CardDescription className="text-sm">
                {tema.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{tema.tempo}</span>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Versículo base:</p>
                  <p className="text-sm italic text-primary">{tema.versiculo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TemasEstudo;
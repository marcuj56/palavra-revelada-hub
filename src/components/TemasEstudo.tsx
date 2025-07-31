import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";

const TemasEstudo = () => {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    const loadThemes = async () => {
      const { data, error } = await supabase
        .from('study_themes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        setTemas(data);
      }
    };

    loadThemes();
  }, []);

  const temasDefault = [
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
        {(temas.length > 0 ? temas : temasDefault).map((tema, index) => (
          <Card key={tema.id || index} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">
                  Teologia
                </Badge>
                <Badge className={getNivelColor(tema.difficulty_level || tema.nivel)}>
                  {tema.difficulty_level || tema.nivel}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {tema.title || tema.titulo}
              </CardTitle>
              <CardDescription className="text-sm">
                {tema.description || tema.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Referências bíblicas:</p>
                  <p className="text-sm italic text-primary">{tema.bible_references || tema.versiculo}</p>
                </div>
                {tema.content && (
                  <div className="text-xs text-muted-foreground">
                    <p className="line-clamp-2">{tema.content.substring(0, 100)}...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TemasEstudo;
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, Clock, Users } from "lucide-react";

const EsbocosPregacao = () => {
  const [esbocos, setEsbocos] = useState([]);
  const [selectedEsboco, setSelectedEsboco] = useState(null);

  useEffect(() => {
    const loadSermons = async () => {
      const { data, error } = await supabase
        .from('sermon_outlines')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        setEsbocos(data);
      }
    };

    loadSermons();
  }, []);

  const esbocosDefault = [
    {
      titulo: "O Poder do Sangue de Jesus",
      tema: "Salvação",
      versiculo: "1 Pedro 1:18-19",
      duracao: "35-40 min",
      publico: "Adultos",
      pontos: [
        "I. O sangue que nos redime",
        "II. O sangue que nos purifica", 
        "III. O sangue que nos justifica"
      ]
    },
    {
      titulo: "Arrependimento Genuíno",
      tema: "Conversão",
      versiculo: "2 Coríntios 7:10",
      duracao: "30-35 min",
      publico: "Evangelístico",
      pontos: [
        "I. O que é arrependimento",
        "II. Frutos do arrependimento",
        "III. O perdão de Deus"
      ]
    },
    {
      titulo: "O Espírito Santo e a Igreja",
      tema: "Pneumatologia",
      versiculo: "Atos 2:1-4",
      duracao: "40-45 min",
      publico: "Membros",
      pontos: [
        "I. A promessa do Espírito",
        "II. O derramamento em Pentecostes",
        "III. Os dons espirituais hoje"
      ]
    },
    {
      titulo: "A Volta de Cristo",
      tema: "Escatologia",
      versiculo: "1 Tessalonicenses 4:16-17",
      duracao: "45-50 min",
      publico: "Adultos",
      pontos: [
        "I. A certeza da volta",
        "II. Os sinais dos tempos",
        "III. Nossa preparação"
      ]
    },
    {
      titulo: "A Família Cristã",
      tema: "Relacionamentos",
      versiculo: "Efésios 5:22-33",
      duracao: "35-40 min",
      publico: "Famílias",
      pontos: [
        "I. O papel do marido",
        "II. O papel da esposa",
        "III. Filhos obedientes"
      ]
    },
    {
      titulo: "Fé que Vence o Mundo",
      tema: "Vida Cristã",
      versiculo: "1 João 5:4",
      duracao: "30-35 min",
      publico: "Jovens",
      pontos: [
        "I. O que é fé verdadeira",
        "II. Os obstáculos da fé",
        "III. A vitória pela fé"
      ]
    }
  ];

  const getPublicoColor = (publico: string) => {
    switch (publico) {
      case "Evangelístico": return "bg-green-100 text-green-800";
      case "Membros": return "bg-blue-100 text-blue-800";
      case "Jovens": return "bg-purple-100 text-purple-800";
      case "Famílias": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Esboços de Pregação</h2>
        <p className="text-muted-foreground">
          Esboços prontos para suas ministração, organizados por temas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(esbocos.length > 0 ? esbocos : esbocosDefault).map((esboço, index) => (
          <Card key={esboço.id || index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{esboço.theme || esboço.tema}</Badge>
                <Badge variant="secondary">
                  {esboço.author || "Autor"}
                </Badge>
              </div>
              <CardTitle className="text-xl">{esboço.title || esboço.titulo}</CardTitle>
              <CardDescription className="italic">
                "{esboço.main_verse || esboço.versiculo}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{esboço.author || esboço.publico}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Conteúdo:</h4>
                <div className="text-sm text-muted-foreground">
                  {esboço.content ? (
                    <p className="line-clamp-3">{esboço.content}</p>
                  ) : (
                    <ul className="space-y-1">
                      {esboço.pontos?.map((ponto, idx) => (
                        <li key={idx} className="ml-2">
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1" onClick={() => setSelectedEsboco(esboço)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Completo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedEsboco?.title || selectedEsboco?.titulo}</DialogTitle>
                      <DialogDescription>
                        Tema: {selectedEsboco?.theme || selectedEsboco?.tema} | 
                        Versículo: {selectedEsboco?.main_verse || selectedEsboco?.versiculo}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {selectedEsboco?.content ? (
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap">{selectedEsboco.content}</div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedEsboco?.pontos?.map((ponto, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-lg">
                              <p className="font-medium">{ponto}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://faculdadeteologica.com.br" target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-1" />
                    Teologia BR
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sistema de Estudo Teológico Brasileiro */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recursos de Estudo Teológico</CardTitle>
          <CardDescription>
            Links para instituições brasileiras de teologia e materiais de estudo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="https://faculdadeteologica.com.br" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="font-semibold">Faculdade Teológica</div>
                  <div className="text-sm text-muted-foreground">Cursos de teologia online</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="https://seminary.org.br" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="font-semibold">Seminário Brasileiro</div>
                  <div className="text-sm text-muted-foreground">Formação pastoral</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="https://teologiabiblica.com" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="font-semibold">Teologia Bíblica</div>
                  <div className="text-sm text-muted-foreground">Estudos exegéticos</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="https://pregacaoexpositiva.com.br" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="font-semibold">Pregação Expositiva</div>
                  <div className="text-sm text-muted-foreground">Técnicas de homilética</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="https://bibliologia.org" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="font-semibold">Bibliologia</div>
                  <div className="text-sm text-muted-foreground">Estudo das Escrituras</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="https://hermeneutica.net" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="font-semibold">Hermenêutica</div>
                  <div className="text-sm text-muted-foreground">Interpretação bíblica</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EsbocosPregacao;
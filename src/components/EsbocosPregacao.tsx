import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Clock, Users } from "lucide-react";

const EsbocosPregacao = () => {
  const esbocos = [
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
        {esbocos.map((esboço, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{esboço.tema}</Badge>
                <Badge className={getPublicoColor(esboço.publico)}>
                  {esboço.publico}
                </Badge>
              </div>
              <CardTitle className="text-xl">{esboço.titulo}</CardTitle>
              <CardDescription className="italic">
                "{esboço.versiculo}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{esboço.duracao}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{esboço.publico}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Estrutura:</h4>
                <ul className="space-y-1">
                  {esboço.pontos.map((ponto, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground ml-2">
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="divine" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver Completo
                </Button>
                <Button size="sm" variant="sacred">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default EsbocosPregacao;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, BookOpen, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const TextoBiblico = () => {
  const [versiculo, setVersiculo] = useState("Gênesis 1:1");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [textoAtual, setTextoAtual] = useState({
    referencia: "Gênesis 1:1",
    texto: "No princípio criou Deus os céus e a terra.",
    comentario: "Este versículo estabelece Deus como o Criador supremo de todas as coisas, apontando para sua soberania absoluta e poder criativo. A palavra 'princípio' (bereshit em hebraico) indica o início do tempo e do espaço físico.",
    palavrasChave: ["princípio", "criou", "Deus", "céus", "terra"],
    versiculosParalelos: [
      { ref: "João 1:1", texto: "No princípio era o Verbo..." },
      { ref: "Colossenses 1:16", texto: "Porque nele foram criadas todas as coisas..." },
      { ref: "Hebreus 11:3", texto: "Pela fé entendemos que os mundos foram criados..." }
    ]
  });

  const buscarVersiculo = async () => {
    if (!versiculo.trim()) {
      toast({ title: "Digite uma referência bíblica", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Simular busca real - aqui você pode integrar com uma API bíblica real
      const response = await fetch(`https://www.abibliadigital.com.br/api/verses/acf/${encodeURIComponent(versiculo)}`);
      
      if (response.ok) {
        const data = await response.json();
        setTextoAtual({
          referencia: `${data.book.name} ${data.chapter}:${data.number}`,
          texto: data.text,
          comentario: "Este versículo contém importantes ensinamentos para nossa vida cristã. Medite profundamente em suas palavras.",
          palavrasChave: [],
          versiculosParalelos: []
        });
        toast({ title: "Versículo encontrado!", description: data.book.name });
      } else {
        throw new Error("Versículo não encontrado");
      }
    } catch (error) {
      toast({ 
        title: "Erro ao buscar versículo", 
        description: "Verifique a referência e tente novamente",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Texto Bíblico com Comentários</h2>
        <p className="text-muted-foreground">
          Estude a Palavra com comentários e versículos paralelos
        </p>
      </div>

      {/* Busca de versículos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Versículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Ex: João 3:16, Salmos 23:1..."
              value={versiculo}
              onChange={(e) => setVersiculo(e.target.value)}
              className="flex-1"
            />
            <Button onClick={buscarVersiculo} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Texto atual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {textoAtual.referencia}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg leading-relaxed italic border-l-4 border-primary pl-4 mb-4">
                "{textoAtual.texto}"
              </blockquote>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Comentário
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {textoAtual.comentario}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Palavras-chave</h4>
                  <div className="flex flex-wrap gap-2">
                    {textoAtual.palavrasChave.map((palavra, idx) => (
                      <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {palavra}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Versículos Paralelos
              </CardTitle>
              <CardDescription>
                Textos relacionados que complementam o estudo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {textoAtual.versiculosParalelos.map((paralelo, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="font-semibold text-primary text-sm mb-1">
                      {paralelo.ref}
                    </div>
                    <div className="text-sm italic">
                      "{paralelo.texto}"
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links úteis */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recursos Externos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.bibliaonline.com.br" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bíblia Online
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.biblestudytools.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bible Study Tools
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://biblehub.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bible Hub
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.strongsnumbers.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Strong's Concordance
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TextoBiblico;
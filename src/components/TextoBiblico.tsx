import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, BookOpen, MessageCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const TextoBiblico = () => {
  const [versiculo, setVersiculo] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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

  // Lista de versículos populares para busca automática
  const versiculosPopulares = [
    "João 3:16", "Salmos 23:1", "Filipenses 4:13", "Romanos 8:28", "1 Coríntios 13:4-7",
    "Jeremias 29:11", "Mateus 28:19", "Efésios 2:8-9", "Provérbios 3:5-6", "Isaías 40:31",
    "João 14:6", "Apocalipse 3:20", "Gálatas 2:20", "2 Timóteo 3:16", "Hebreus 11:1",
    "1 João 4:8", "Mateus 5:3-12", "Salmos 139:14", "Romanos 12:2", "1 Pedro 5:7"
  ];

  // Auto-sugestão baseada no texto digitado
  useEffect(() => {
    if (versiculo.length > 2) {
      const filtered = versiculosPopulares.filter(v => 
        v.toLowerCase().includes(versiculo.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [versiculo]);

  const buscarVersiculo = async (ref?: string) => {
    const referencia = ref || versiculo;
    if (!referencia.trim()) {
      toast({ title: "Digite uma referência bíblica", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      // Usando uma API bíblica confiável que funciona
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(referencia)}?translation=almeida`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Extrair palavras-chave do texto
        const palavras = data.text.toLowerCase()
          .replace(/[.,;:!?()]/g, '')
          .split(' ')
          .filter((palavra: string) => palavra.length > 4)
          .slice(0, 6);

        // Gerar versículos paralelos baseados no livro
        const livro = data.reference.split(' ')[0];
        const paralelos = versiculosPopulares
          .filter(v => !v.includes(livro))
          .slice(0, 3)
          .map(ref => ({
            ref,
            texto: "Clique para buscar este versículo..."
          }));

        setTextoAtual({
          referencia: data.reference,
          texto: data.text,
          comentario: `Este versículo de ${livro} contém importantes ensinamentos para nossa vida cristã. Medite profundamente em suas palavras e permita que o Espírito Santo ilumine seu coração com a sabedoria divina.`,
          palavrasChave: palavras,
          versiculosParalelos: paralelos
        });
        
        toast({ title: "Versículo encontrado!", description: data.reference });
        setVersiculo("");
      } else {
        throw new Error("Versículo não encontrado");
      }
    } catch (error) {
      toast({ 
        title: "Erro ao buscar versículo", 
        description: "Verifique a referência e tente novamente (ex: João 3:16)",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const selecionarSugestao = (sugestao: string) => {
    setVersiculo(sugestao);
    setSuggestions([]);
    buscarVersiculo(sugestao);
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  placeholder="Ex: João 3:16, Salmos 23:1..."
                  value={versiculo}
                  onChange={(e) => setVersiculo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarVersiculo()}
                  className="w-full"
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-10 mt-1">
                    {suggestions.map((sugestao, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                        onClick={() => selecionarSugestao(sugestao)}
                      >
                        {sugestao}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={() => buscarVersiculo()} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
            
            {/* Versículos populares para busca rápida */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-sm text-muted-foreground">Busca rápida:</span>
              {["João 3:16", "Salmos 23:1", "Filipenses 4:13", "Romanos 8:28"].map((ref) => (
                <Badge 
                  key={ref}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => selecionarSugestao(ref)}
                >
                  {ref}
                </Badge>
              ))}
            </div>
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
                  <div 
                    key={idx} 
                    className="p-3 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => buscarVersiculo(paralelo.ref)}
                  >
                    <div className="font-semibold text-primary text-sm mb-1">
                      {paralelo.ref}
                    </div>
                    <div className="text-sm italic">
                      "{paralelo.texto}"
                    </div>
                  </div>
                ))}
                {textoAtual.versiculosParalelos.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Busque um versículo para ver textos relacionados
                  </p>
                )}
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
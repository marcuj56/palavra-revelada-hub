import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Download, Globe, Clock } from "lucide-react";
import { useState } from "react";

const BibliaAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [idiomaAtual, setIdiomaAtual] = useState("português");
  
  const idiomas = [
    { 
      codigo: "português", 
      nome: "Português", 
      flag: "🇧🇷", 
      versao: "Nova Almeida Atualizada",
      narrador: "João Silva"
    },
    { 
      codigo: "english", 
      nome: "English", 
      flag: "🇺🇸", 
      versao: "NIV",
      narrador: "David Johnson"
    },
    { 
      codigo: "español", 
      nome: "Español", 
      flag: "🇪🇸", 
      versao: "Reina Valera 1960",
      narrador: "Carlos García"
    },
    { 
      codigo: "français", 
      nome: "Français", 
      flag: "🇫🇷", 
      versao: "Louis Segond",
      narrador: "Marie Dubois"
    },
    { 
      codigo: "deutsch", 
      nome: "Deutsch", 
      flag: "🇩🇪", 
      versao: "Luther Bibel",
      narrador: "Hans Weber"
    }
  ];

  const livrosPopulares = [
    { nome: "Gênesis", capitulos: 50, duracao: "3h 20min" },
    { nome: "Salmos", capitulos: 150, duracao: "4h 15min" },
    { nome: "Provérbios", capitulos: 31, duracao: "1h 45min" },
    { nome: "Mateus", capitulos: 28, duracao: "2h 30min" },
    { nome: "João", capitulos: 21, duracao: "2h 10min" },
    { nome: "Romanos", capitulos: 16, duracao: "1h 20min" },
    { nome: "1 Coríntios", capitulos: 16, duracao: "1h 25min" },
    { nome: "Apocalipse", capitulos: 22, duracao: "1h 50min" }
  ];

  const idiomaAtualInfo = idiomas.find(i => i.codigo === idiomaAtual);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Bíblia em Áudio</h2>
        <p className="text-muted-foreground">
          Ouça a Palavra de Deus em diversos idiomas enquanto estuda
        </p>
      </div>

      {/* Player de Áudio */}
      <Card className="bg-gradient-to-r from-heaven-light to-golden-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Player de Áudio
          </CardTitle>
          <CardDescription>
            Reproduzindo: João 3:16 em {idiomaAtualInfo?.nome}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                variant={isPlaying ? "secondary" : "divine"}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <div>
                <div className="font-semibold">João 3:16</div>
                <div className="text-sm text-muted-foreground">
                  {idiomaAtualInfo?.flag} {idiomaAtualInfo?.versao}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Narrador</div>
              <div className="text-sm text-muted-foreground">
                {idiomaAtualInfo?.narrador}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-background rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-1/3"></div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1:23</span>
            <span>3:45</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Idioma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Selecionar Idioma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={idiomaAtual} onValueChange={setIdiomaAtual}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {idiomas.map((idioma) => (
                  <SelectItem key={idioma.codigo} value={idioma.codigo}>
                    <div className="flex items-center gap-2">
                      <span>{idioma.flag}</span>
                      <span>{idioma.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {idiomaAtualInfo && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Versão: {idiomaAtualInfo.versao}</div>
                <div className="text-sm text-muted-foreground">
                  Narrado por: {idiomaAtualInfo.narrador}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Livros Populares */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Livros Populares</CardTitle>
            <CardDescription>
              Comece sua jornada de escuta pelos livros mais ouvidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {livrosPopulares.map((livro, idx) => (
                <div 
                  key={idx} 
                  className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {livro.nome}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {livro.capitulos} cap.
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{livro.duracao}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links Externos */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos Externos de Áudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.faithcomesbyhearing.com/audio-bible" target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Faith Comes By Hearing
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.bible.is" target="_blank" rel="noopener noreferrer">
                <Volume2 className="w-4 h-4 mr-2" />
                Bible.is
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.youversion.com/bible" target="_blank" rel="noopener noreferrer">
                <Play className="w-4 h-4 mr-2" />
                YouVersion
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BibliaAudio;
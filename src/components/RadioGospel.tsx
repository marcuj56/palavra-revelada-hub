import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Play, Pause, Volume2, Heart, Music, Users, Globe } from "lucide-react";
import { useState, useRef } from "react";

const RadioGospel = () => {
  const [currentStation, setCurrentStation] = useState("Rádio Vivendo Na Fé");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const estacoes = [
    {
      nome: "Rádio Vivendo Na Fé",
      descricao: "Música gospel e pregações 24h",
      genero: "Gospel",
      ouvintes: "15.2k",
      pais: "🇧🇷",
      url: "https://stream.zeno.fm/ug07t11zn0hvv"
    },
    {
      nome: "Rádio Louvor",
      descricao: "Música gospel contemporânea 24h",
      genero: "Contemporâneo",
      ouvintes: "12.5k",
      pais: "🇧🇷",
      url: "https://radiolouvor.com/stream"
    },
    {
      nome: "Adoração FM",
      descricao: "Hinos e louvores tradicionais",
      genero: "Tradicional",
      ouvintes: "8.2k",
      pais: "🇧🇷",
      url: "https://adoracaofm.com/stream"
    },
    {
      nome: "Gospel Mix",
      descricao: "O melhor do gospel nacional e internacional",
      genero: "Misto",
      ouvintes: "15.3k",
      pais: "🇧🇷",
      url: "https://gospelmix.com/stream"
    },
    {
      nome: "Praise Radio",
      descricao: "Contemporary Christian music",
      genero: "Contemporary",
      ouvintes: "22.1k",
      pais: "🇺🇸",
      url: "https://praiseradio.com/stream"
    },
    {
      nome: "Adoración 24/7",
      descricao: "Música cristiana en español",
      genero: "Latina",
      ouvintes: "9.7k",
      pais: "🇪🇸",
      url: "https://adoracion247.com/stream"
    },
    {
      nome: "Worship FM",
      descricao: "Hillsong, Bethel e mais",
      genero: "Worship",
      ouvintes: "18.9k",
      pais: "🇬🇧",
      url: "https://worshipfm.com/stream"
    }
  ];

  const programacao = [
    { horario: "06:00", programa: "Café com Deus", apresentador: "Pastor João" },
    { horario: "09:00", programa: "Louvores da Manhã", apresentador: "Maria Santos" },
    { horario: "12:00", programa: "Palavra do Meio-Dia", apresentador: "Pr. Carlos" },
    { horario: "15:00", programa: "Tarde Abençoada", apresentador: "Ana Paula" },
    { horario: "18:00", programa: "Hora da Família", apresentador: "Família Lima" },
    { horario: "21:00", programa: "Adoração Noturna", apresentador: "Ministério Koinonia" }
  ];

  const handlePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentStationInfo?.url);
      audioRef.current.crossOrigin = "anonymous";
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleStationChange = (stationName: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStation(stationName);
  };

  const getGeneroColor = (genero: string) => {
    switch (genero) {
      case "Contemporâneo": case "Contemporary": return "bg-blue-100 text-blue-800";
      case "Tradicional": return "bg-amber-100 text-amber-800";
      case "Misto": return "bg-purple-100 text-purple-800";
      case "Latina": return "bg-green-100 text-green-800";
      case "Worship": return "bg-pink-100 text-pink-800";
      case "Gospel": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const currentStationInfo = estacoes.find(e => e.nome === currentStation);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Rádio Gospel 24h</h2>
        <p className="text-muted-foreground">
          Ouça músicas cristãs de todo o mundo enquanto estuda a Palavra
        </p>
      </div>

      {/* Player Principal */}
      <Card className="bg-gradient-to-r from-heaven-blue to-golden-light text-pure-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pure-white">
            <Radio className="w-6 h-6" />
            Agora Tocando
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                variant={isPlaying ? "secondary" : "outline"}
                onClick={handlePlayPause}
                className="bg-pure-white text-heaven-blue hover:bg-gray-100"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <div>
                <div className="text-lg font-bold">{currentStation}</div>
                <div className="text-sm opacity-90">
                  {currentStationInfo?.descricao}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>{currentStationInfo?.ouvintes} ouvindo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                <span>{currentStationInfo?.pais}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span className="text-sm">Tocando agora: "Quão Grande é o Meu Deus" - Hillsong</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Estações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Estações Disponíveis
            </CardTitle>
            <CardDescription>
              Escolha entre várias rádios gospel ao redor do mundo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estacoes.map((estacao, idx) => (
                <div 
                  key={idx}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    currentStation === estacao.nome 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleStationChange(estacao.nome)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{estacao.pais}</span>
                      <h4 className="font-semibold">{estacao.nome}</h4>
                      {currentStation === estacao.nome && isPlaying && (
                        <Badge variant="default" className="text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                          AO VIVO
                        </Badge>
                      )}
                    </div>
                    <Badge className={getGeneroColor(estacao.genero)}>
                      {estacao.genero}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {estacao.descricao}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{estacao.ouvintes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      <span>128 kbps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Programação */}
        <Card>
          <CardHeader>
            <CardTitle>Programação do Dia</CardTitle>
            <CardDescription>
              {currentStation} - Hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {programacao.map((programa, idx) => (
                <div key={idx} className="flex gap-3 p-2 rounded hover:bg-accent transition-colors">
                  <div className="text-sm font-mono bg-muted px-2 py-1 rounded text-center min-w-[50px]">
                    {programa.horario}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{programa.programa}</div>
                    <div className="text-xs text-muted-foreground">
                      {programa.apresentador}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radio Embed */}
      <Card>
        <CardHeader>
          <CardTitle>Player Integrado</CardTitle>
          <CardDescription>
            Player direto da estação selecionada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <Radio className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Player de rádio estaria incorporado aqui
              </p>
              <p className="text-xs text-muted-foreground">
                Estação: {currentStation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RadioGospel;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Play, Pause, Volume2, Heart, Music, Users, Globe, Crown, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LiveComments from "./LiveComments";
import LivePolls from "./LivePolls";
import PrayerRequests from "./PrayerRequests";
import SongRequests from "./SongRequests";
const RadioGospel = () => {
  const [currentStation, setCurrentStation] = useState("Rádio Vivendo Na Fé");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("Águas Profundas - Ministério Vem com Josué");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const estacoes = [{
    nome: "Rádio Vivendo Na Fé",
    descricao: "Rádio cristã de Portugal - Música gospel e pregações 24h",
    genero: "Gospel",
    ouvintes: "25.8k",
    pais: "🇵🇹",
    url: "https://stream.zeno.fm/ug07t11zn0hvv",
    fundador: "Mário Bernardo"
  }, {
    nome: "Rádio Louvor",
    descricao: "Música gospel contemporânea 24h",
    genero: "Contemporâneo",
    ouvintes: "12.5k",
    pais: "🇧🇷",
    url: "https://radiolouvor.com/stream"
  }, {
    nome: "Adoração FM",
    descricao: "Hinos e louvores tradicionais",
    genero: "Tradicional",
    ouvintes: "8.2k",
    pais: "🇧🇷",
    url: "https://adoracaofm.com/stream"
  }, {
    nome: "Gospel Mix",
    descricao: "O melhor do gospel nacional e internacional",
    genero: "Misto",
    ouvintes: "15.3k",
    pais: "🇧🇷",
    url: "https://gospelmix.com/stream"
  }, {
    nome: "Praise Radio",
    descricao: "Contemporary Christian music",
    genero: "Contemporary",
    ouvintes: "22.1k",
    pais: "🇺🇸",
    url: "https://praiseradio.com/stream"
  }, {
    nome: "Adoración 24/7",
    descricao: "Música cristiana en español",
    genero: "Latina",
    ouvintes: "9.7k",
    pais: "🇪🇸",
    url: "https://adoracion247.com/stream"
  }, {
    nome: "Worship FM",
    descricao: "Hillsong, Bethel e mais",
    genero: "Worship",
    ouvintes: "18.9k",
    pais: "🇬🇧",
    url: "https://worshipfm.com/stream"
  }];
  const programacao = [{
    horario: "06:00",
    programa: "Café com Deus",
    apresentador: "Pastor João"
  }, {
    horario: "09:00",
    programa: "Louvores da Manhã",
    apresentador: "Maria Santos"
  }, {
    horario: "12:00",
    programa: "Palavra do Meio-Dia",
    apresentador: "Pr. Carlos"
  }, {
    horario: "15:00",
    programa: "Debate",
    apresentador: "Mário Bernardo"
  }, {
    horario: "18:00",
    programa: "Crescendo na Fé",
    apresentador: "Família Lima"
  }, {
    horario: "21:00",
    programa: "Adoração Noturna",
    apresentador: "Ministério Koinonia"
  }];

  // Simulação de mudança de música
  useEffect(() => {
    const songs = ["Águas Profundas - Ministério Vem com Josué", "Quão Grande é o Meu Deus - Hillsong United", "Reckless Love - Cory Asbury", "Tu És Santo - Ministério Vem com Josué", "Oceans - Hillsong United", "Great Are You Lord - All Sons & Daughters"];
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentSong(songs[Math.floor(Math.random() * songs.length)]);
      }
    }, 15000); // Muda a cada 15 segundos

    return () => clearInterval(interval);
  }, [isPlaying]);
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
      case "Contemporâneo":
      case "Contemporary":
        return "bg-blue-100 text-blue-800";
      case "Tradicional":
        return "bg-amber-100 text-amber-800";
      case "Misto":
        return "bg-purple-100 text-purple-800";
      case "Latina":
        return "bg-green-100 text-green-800";
      case "Worship":
        return "bg-pink-100 text-pink-800";
      case "Gospel":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const currentStationInfo = estacoes.find(e => e.nome === currentStation);
  return <section className="space-y-8">
      {/* Cabeçalho da Rádio */}
      <div className="text-center space-y-4 bg-zinc-100">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-radio-primary to-radio-accent rounded-full text-white">
          <Crown className="w-6 h-6 bg-amber-500" />
          <h2 className="text-3xl font-bold text-gray-700">Rádio Vivendo Na Fé</h2>
          <Crown className="w-6 h-6 bg-amber-500" />
        </div>
        <p className="text-muted-foreground text-lg">
          Rádio Cristã de Portugal - Fundada por Mário Bernardo
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Portugal • Ouvintes de todo o mundo</span>
        </div>
      </div>

      {/* Player Principal */}
      <Card className="bg-gradient-to-br from-radio-primary via-radio-accent to-radio-secondary text-white shadow-2xl bg-indigo-50">
        <CardHeader className="bg-gray-700">
          <CardTitle className="flex items-center gap-2 text-2xl text-zinc-50">
            <Radio className="w-8 h-8" />
            AO VIVO - Rádio Vivendo Na Fé
            {isPlaying && <Badge className="bg-live-green text-white animate-pulse bg-red-600">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                LIVE
              </Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-green-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button size="lg" variant="outline" onClick={handlePlayPause} className="text-radio-primary border-white h-16 w-16 rounded-full shadow-lg text-red-900 bg-amber-400 hover:bg-amber-300">
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{currentStation}</div>
                <div className="text-lg opacity-90">
                  {currentStationInfo?.descricao}
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                <span className="font-bold">{currentStationInfo?.ouvintes}</span>
                <span>ouvindo agora</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{currentStationInfo?.pais} Portugal</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5" />
              <span className="font-semibold">Tocando Agora:</span>
            </div>
            <div className="text-xl font-bold animate-pulse">
              "{currentSong}"
            </div>
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
              {estacoes.map((estacao, idx) => <div key={idx} className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${currentStation === estacao.nome ? 'border-primary bg-primary/10' : 'hover:bg-accent'}`} onClick={() => handleStationChange(estacao.nome)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{estacao.pais}</span>
                      <h4 className="font-semibold">{estacao.nome}</h4>
                      {currentStation === estacao.nome && isPlaying && <Badge variant="default" className="text-xs bg-red-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                          AO VIVO
                        </Badge>}
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
                </div>)}
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
              {programacao.map((programa, idx) => <div key={idx} className="flex gap-3 p-2 rounded hover:bg-accent transition-colors">
                  <div className="text-sm font-mono bg-muted px-2 py-1 rounded text-center min-w-[50px]">
                    {programa.horario}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{programa.programa}</div>
                    <div className="text-xs text-muted-foreground">
                      {programa.apresentador}
                    </div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistemas Interativos em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LivePolls />
        <LiveComments />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrayerRequests />
        <SongRequests />
      </div>

      {/* Player Integrado */}
      <Card className="bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <CardHeader className="bg-green-600">
          <CardTitle className="text-zinc-100">Player Integrado - Rádio Vivendo Na Fé</CardTitle>
          <CardDescription className="text-zinc-50">
            Stream direto de Portugal • Fundada por Mário Bernardo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-gradient-to-br from-radio-primary/10 to-radio-accent/10 rounded-lg flex items-center justify-center border-2 border-radio-primary/20">
            <div className="text-center space-y-4 bg-transparent">
              <Radio className="w-16 h-16 mx-auto text-radio-primary animate-pulse" />
              <div>
                <p className="text-lg font-semibold text-radio-primary">
                  {isPlaying ? "Transmitindo ao Vivo" : "Player Integrado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Rádio Vivendo Na Fé • Portugal
                </p>
              </div>
              {isPlaying && <Badge className="bg-live-green text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  AO VIVO
                </Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>;
};
export default RadioGospel;
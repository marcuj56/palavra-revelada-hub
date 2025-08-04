import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Download, Globe, Clock, SkipForward, SkipBack } from "lucide-react";
import { useState, useRef, useEffect } from "react";
const BibliaAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [idiomaAtual, setIdiomaAtual] = useState("português");
  const [currentBook, setCurrentBook] = useState("João");
  const [currentChapter, setCurrentChapter] = useState(3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idiomas = [{
    codigo: "português",
    nome: "Português",
    flag: "🇧🇷",
    versao: "Nova Almeida Atualizada",
    narrador: "João Silva"
  }, {
    codigo: "english",
    nome: "English",
    flag: "🇺🇸",
    versao: "NIV",
    narrador: "David Johnson"
  }, {
    codigo: "español",
    nome: "Español",
    flag: "🇪🇸",
    versao: "Reina Valera 1960",
    narrador: "Carlos García"
  }, {
    codigo: "français",
    nome: "Français",
    flag: "🇫🇷",
    versao: "Louis Segond",
    narrador: "Marie Dubois"
  }, {
    codigo: "deutsch",
    nome: "Deutsch",
    flag: "🇩🇪",
    versao: "Luther Bibel",
    narrador: "Hans Weber"
  }];
  const livrosPopulares = [{
    nome: "Gênesis",
    capitulos: 50,
    duracao: "3h 20min"
  }, {
    nome: "Salmos",
    capitulos: 150,
    duracao: "4h 15min"
  }, {
    nome: "Provérbios",
    capitulos: 31,
    duracao: "1h 45min"
  }, {
    nome: "Mateus",
    capitulos: 28,
    duracao: "2h 30min"
  }, {
    nome: "João",
    capitulos: 21,
    duracao: "2h 10min"
  }, {
    nome: "Romanos",
    capitulos: 16,
    duracao: "1h 20min"
  }, {
    nome: "1 Coríntios",
    capitulos: 16,
    duracao: "1h 25min"
  }, {
    nome: "Apocalipse",
    capitulos: 22,
    duracao: "1h 50min"
  }];

  // URLs de áudio da Bíblia baseadas na API do Bible.is
  const getAudioUrl = (book: string, chapter: number, language: string) => {
    const languageMap: {
      [key: string]: string;
    } = {
      português: "PORNTB",
      english: "ENGESV",
      español: "SPNBLV",
      français: "FRNSBL",
      deutsch: "DEULUT"
    };
    const langCode = languageMap[language] || "PORNTB";
    // Simulando URLs de áudio (na implementação real, use APIs como Bible.is)
    return `https://audio.bible.is/${langCode}/${book}/${chapter}.mp3`;
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        // Parar reprodução
        speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentTime(0);
      } else {
        // Iniciar reprodução
        const chapterText = await getChapterText(currentBook, currentChapter, idiomaAtual);
        if (chapterText) {
          await generateAudio(chapterText, idiomaAtual);
          // Simular duração baseada no texto
          setDuration(Math.ceil(chapterText.length / 10)); // ~10 caracteres por segundo
          
          // Simular progresso
          const progressInterval = setInterval(() => {
            setCurrentTime(prev => {
              const next = prev + 1;
              if (next >= Math.ceil(chapterText.length / 10)) {
                clearInterval(progressInterval);
                setIsPlaying(false);
                setCurrentTime(0);
                return 0;
              }
              return next;
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Erro no player de áudio:", error);
      setIsPlaying(false);
    }
  };

  const getChapterText = async (book: string, chapter: number, language: string) => {
    try {
      // Usar API da Bíblia em Português
      const response = await fetch(`https://bible-api.com/${book}%20${chapter}?translation=almeida`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar capítulo');
      }
      
      const data = await response.json();
      if (data.verses && data.verses.length > 0) {
        return data.verses.map((verse: any) => `${verse.verse}. ${verse.text}`).join(' ');
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar texto bíblico:", error);
      // Texto de exemplo baseado no livro e capítulo
      const exemploTextos = {
        'João 3': 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
        'Salmos 23': 'O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.',
        'Gênesis 1': 'No princípio criou Deus os céus e a terra. E a terra era sem forma e vazia; e havia trevas sobre a face do abismo.',
      };
      return exemploTextos[`${book} ${chapter}`] || `Capítulo ${chapter} do livro de ${book}. Aqui estaria o texto bíblico completo sendo narrado em áudio.`;
    }
  };

      const generateAudio = async (text: string, language: string) => {
    try {
      if ('speechSynthesis' in window) {
        return new Promise((resolve) => {
          // Dividir texto por versículos para adicionar efeitos sonoros
          const verses = text.split(/\d+\./);
          let currentIndex = 0;
          
          const playNextVerse = () => {
            if (currentIndex >= verses.length) {
              setIsPlaying(false);
              setCurrentTime(0);
              resolve("audio-complete");
              return;
            }
            
            const verseText = verses[currentIndex].trim();
            if (verseText) {
              // Efeito sonoro suave antes de cada versículo
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
              gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
              
              oscillator.start();
              oscillator.stop(audioContext.currentTime + 0.3);
              
              // Aguardar efeito sonoro antes de falar
              setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(verseText);
                utterance.lang = language === 'português' ? 'pt-BR' : language === 'english' ? 'en-US' : 'pt-BR';
                utterance.rate = 1.2; // Velocidade mais rápida
                utterance.pitch = 1.1;
                utterance.volume = 1;
                
                utterance.onend = () => {
                  currentIndex++;
                  setTimeout(playNextVerse, 500); // Pausa entre versículos
                };
                
                speechSynthesis.speak(utterance);
              }, 400);
            } else {
              currentIndex++;
              playNextVerse();
            }
          };
          
          // Efeito sonoro de início
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.5);
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
          
           setTimeout(() => {
             const utterance = new SpeechSynthesisUtterance(text);
             utterance.lang = language === 'português' ? 'pt-BR' : language === 'english' ? 'en-US' : 'pt-BR';
             utterance.rate = 1.0; // Velocidade normal
             utterance.pitch = 1.0; // Tom normal
             utterance.volume = 0.9;
           
             // Configurar eventos
             utterance.onstart = () => {
               setIsPlaying(true);
             };
             
             utterance.onend = () => {
               setIsPlaying(false);
               setCurrentTime(0);
             };
             
             utterance.onerror = () => {
               setIsPlaying(false);
               console.error("Erro na síntese de voz");
             };
             
             // Iniciar reprodução
             speechSynthesis.speak(utterance);
             
             // Para simular controle de áudio, criar um mock URL
             resolve("mock-audio-url");
           }, 600);
         });
      }
      
      return "mock-audio-url";
    } catch (error) {
      console.error("Erro ao gerar áudio:", error);
      return "mock-audio-url";
    }
  };
  const handleBookChange = (bookName: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBook(bookName);
    setCurrentChapter(1);
    setCurrentTime(0);
  };
  const handleNextChapter = () => {
    const book = livrosPopulares.find(l => l.nome === currentBook);
    if (book && currentChapter < book.capitulos) {
      setCurrentChapter(currentChapter + 1);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };
  const idiomaAtualInfo = idiomas.find(i => i.codigo === idiomaAtual);
  return <section className="space-y-6">
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
            Bíblia Fiel
          </CardTitle>
          <CardDescription>
            Reproduzindo: {currentBook} {currentChapter} em {idiomaAtualInfo?.nome}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={handlePrevChapter} disabled={currentChapter <= 1} className="text-gray-900 bg-gray-50">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="lg" variant={isPlaying ? "secondary" : "divine"} onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button size="sm" variant="outline" onClick={handleNextChapter} disabled={currentChapter >= (livrosPopulares.find(l => l.nome === currentBook)?.capitulos || 1)} className="text-zinc-700 bg-gray-200 hover:bg-gray-100">
                <SkipForward className="w-4 h-4" />
              </Button>
              <div>
                <div className="font-semibold">{currentBook} {currentChapter}</div>
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
            <div style={{
            width: duration ? `${currentTime / duration * 100}%` : '0%'
          }} className="h-2 rounded-full transition-all duration-300 bg-zinc-200"></div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
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
                {idiomas.map(idioma => <SelectItem key={idioma.codigo} value={idioma.codigo}>
                    <div className="flex items-center gap-2">
                      <span>{idioma.flag}</span>
                      <span>{idioma.nome}</span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            
            {idiomaAtualInfo && <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Versão: {idiomaAtualInfo.versao}</div>
                <div className="text-sm text-muted-foreground">
                  Narrado por: {idiomaAtualInfo.narrador}
                </div>
              </div>}
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
              {livrosPopulares.map((livro, idx) => <div key={idx} className={`p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer group ${currentBook === livro.nome ? 'border-primary bg-primary/10' : ''}`} onClick={() => handleBookChange(livro.nome)}>
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
                </div>)}
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
    </section>;
};
export default BibliaAudio;
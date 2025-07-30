import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Music, Send, Clock, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SongRequest {
  id: string;
  user_name: string;
  song_title: string;
  artist: string | null;
  message: string | null;
  created_at: string;
}

const SongRequests = () => {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    
    const channel = supabase
      .channel('song-requests')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'song_requests' },
        (payload) => {
          setRequests(prev => [payload.new as SongRequest, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('song_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(15);

    if (data && !error) {
      setRequests(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!songTitle.trim() || !userName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor preencha o nome da música e o seu nome",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('song_requests')
      .insert({
        user_name: userName,
        song_title: songTitle,
        artist: artist.trim() || null,
        message: message.trim() || null
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar pedido de música",
        variant: "destructive"
      });
    } else {
      setSongTitle("");
      setArtist("");
      setUserName("");
      setMessage("");
      toast({
        title: "Pedido enviado!",
        description: "O seu pedido de música foi enviado para a rádio",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  return (
    <Card className="bg-gradient-to-br from-white via-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <Music className="w-5 h-5" />
          Pedidos de Louvores
        </CardTitle>
        <CardDescription>
          Solicite o seu louvor favorito para tocar na rádio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário de pedido */}
        <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Seu nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border-green-200"
            />
            <Input
              placeholder="Nome da música"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="border-green-200"
            />
          </div>
          
          <Input
            placeholder="Artista/Cantor (opcional)"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border-green-200"
          />
          
          <Textarea
            placeholder="Mensagem especial (opcional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-green-200"
            rows={2}
          />
          
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Enviar Pedido de Música
          </Button>
        </form>

        {/* Lista de pedidos */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <h4 className="font-semibold text-green-600 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Pedidos Recentes
          </h4>
          
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">{request.user_name}</span>
                  <Badge variant="outline" className="text-xs bg-green-50">
                    Pedido
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(request.created_at)}
                </div>
              </div>
              
              <div className="mb-2">
                <p className="font-medium text-sm">{request.song_title}</p>
                {request.artist && (
                  <p className="text-xs text-muted-foreground">por {request.artist}</p>
                )}
              </div>
              
              {request.message && (
                <p className="text-xs text-muted-foreground italic">
                  "{request.message}"
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SongRequests;
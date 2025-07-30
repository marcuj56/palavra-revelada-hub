import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Clock, Hand } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PrayerRequest {
  id: string;
  user_name: string;
  prayer_request: string;
  is_anonymous: boolean;
  created_at: string;
}

const PrayerRequests = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [newRequest, setNewRequest] = useState("");
  const [userName, setUserName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    
    const channel = supabase
      .channel('prayer-requests')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'prayer_requests' },
        (payload) => {
          setRequests(prev => [payload.new as PrayerRequest, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data && !error) {
      setRequests(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.trim() || (!isAnonymous && !userName.trim())) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos necessários",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('prayer_requests')
      .insert({
        user_name: isAnonymous ? "Anônimo" : userName,
        prayer_request: newRequest,
        is_anonymous: isAnonymous
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar pedido de oração",
        variant: "destructive"
      });
    } else {
      setNewRequest("");
      setUserName("");
      setIsAnonymous(false);
      toast({
        title: "Pedido enviado!",
        description: "O seu pedido de oração foi partilhado com a comunidade",
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
    <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-prayer-blue">
          <Hand className="w-5 h-5" />
          Pedidos de Oração
        </CardTitle>
        <CardDescription>
          Partilhe os seus pedidos de oração com a comunidade cristã
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário de pedido */}
        <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-lg border">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="anonymous" 
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <label 
                htmlFor="anonymous" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pedido anônimo
              </label>
            </div>
            
            {!isAnonymous && (
              <Input
                placeholder="O seu nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border-prayer-blue/20"
              />
            )}
            
            <Textarea
              placeholder="Escreva o seu pedido de oração..."
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              className="border-prayer-blue/20"
              rows={4}
            />
            
            <Button type="submit" className="w-full bg-prayer-blue hover:bg-prayer-blue/90">
              <Send className="w-4 h-4 mr-2" />
              Enviar Pedido de Oração
            </Button>
          </div>
        </form>

        {/* Lista de pedidos */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <h4 className="font-semibold text-prayer-blue flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Pedidos da Comunidade
          </h4>
          
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-prayer-blue">
                    {request.is_anonymous ? "Anônimo" : request.user_name}
                  </span>
                  {request.is_anonymous && (
                    <Badge variant="outline" className="text-xs">
                      Anônimo
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(request.created_at)}
                </div>
              </div>
              
              <p className="text-sm text-foreground mb-3 leading-relaxed">
                {request.prayer_request}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="w-3 h-3 text-red-500" />
                <span>Orando por este pedido</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerRequests;
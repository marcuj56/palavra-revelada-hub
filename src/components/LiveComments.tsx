import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Heart, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  user_name: string;
  comment: string;
  comment_type: string;
  created_at: string;
}

const LiveComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [commentType, setCommentType] = useState<string>("geral");
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    
    const channel = supabase
      .channel('radio-comments')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'radio_comments' },
        (payload) => {
          setComments(prev => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('radio_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data && !error) {
      setComments(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !userName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('radio_comments')
      .insert({
        user_name: userName,
        comment: newComment,
        comment_type: commentType
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar comentário",
        variant: "destructive"
      });
    } else {
      setNewComment("");
      toast({
        title: "Sucesso",
        description: "Comentário enviado!",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'programa': return 'bg-blue-100 text-blue-800';
      case 'louvor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <Card className="bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <MessageCircle className="w-5 h-5" />
          Comentários ao Vivo
        </CardTitle>
        <CardDescription>
          Partilhe a sua opinião sobre os programas e louvores em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário de comentário */}
        <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="O seu nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border-primary/20"
            />
            <Select value={commentType} onValueChange={setCommentType}>
              <SelectTrigger className="border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Comentário Geral</SelectItem>
                <SelectItem value="programa">Sobre o Programa</SelectItem>
                <SelectItem value="louvor">Sobre o Louvor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Escreva o seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border-primary/20"
            rows={3}
          />
          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Enviar Comentário
          </Button>
        </form>

        {/* Lista de comentários */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{comment.user_name}</span>
                  <Badge className={getTypeColor(comment.comment_type)}>
                    {comment.comment_type === 'programa' ? 'Programa' : 
                     comment.comment_type === 'louvor' ? 'Louvor' : 'Geral'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(comment.created_at)}
                </div>
              </div>
              <p className="text-sm text-foreground">{comment.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveComments;
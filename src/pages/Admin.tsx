import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Save, Plus, Eye, EyeOff, Music, CheckCircle, Clock, X } from "lucide-react";

interface RadioSchedule {
  id: string;
  time_slot: string;
  program_name: string;
  presenter: string;
  description: string;
  is_active: boolean;
}

interface SermonOutline {
  id: string;
  title: string;
  theme: string;
  main_verse: string;
  content: string;
  author: string;
  is_published: boolean;
  created_at: string;
}

interface StudyTheme {
  id: string;
  title: string;
  description: string;
  bible_references: string;
  content: string;
  difficulty_level: string;
  is_published: boolean;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  
  // Estados para programação da rádio
  const [schedules, setSchedules] = useState<RadioSchedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    time_slot: "",
    program_name: "",
    presenter: "",
    description: ""
  });

  // Estados para esboços de pregação
  const [sermons, setSermons] = useState<SermonOutline[]>([]);
  const [newSermon, setNewSermon] = useState({
    title: "",
    theme: "",
    main_verse: "",
    content: "",
    author: ""
  });

  // Estados para temas de estudo
  const [themes, setThemes] = useState<StudyTheme[]>([]);
  const [newTheme, setNewTheme] = useState({
    title: "",
    description: "",
    bible_references: "",
    content: "",
    difficulty_level: "Iniciante"
  });

  // Estados para comentários e pedidos
  const [comments, setComments] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [songRequests, setSongRequests] = useState([]);
  
  // Estados para sondagens
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
    is_active: false
  });
  const [editingPoll, setEditingPoll] = useState<any>(null);
  
  // Estados de loading
  const [loadingStates, setLoadingStates] = useState({
    schedule: false,
    sermon: false,
    theme: false,
    poll: false
  });

  useEffect(() => {
    loadAllData();
    
    // Set up comprehensive real-time subscriptions
    const songRequestsChannel = supabase
      .channel('song-requests-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'song_requests' }, (payload) => {
        setSongRequests(prev => [payload.new as any, ...prev]);
        toast({ title: "Novo pedido de louvor recebido!" });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'song_requests' }, () => {
        loadSongRequests();
      })
      .subscribe();

    const prayerChannel = supabase
      .channel('prayer-requests-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prayer_requests' }, (payload) => {
        setPrayers(prev => [payload.new as any, ...prev]);
        toast({ title: "Novo pedido de oração recebido!" });
      })
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'radio_comments' }, (payload) => {
        setComments(prev => [payload.new as any, ...prev]);
        toast({ title: "Novo comentário recebido!" });
      })
      .subscribe();

    const pollsChannel = supabase
      .channel('polls-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        loadPolls();
      })
      .subscribe();

    const schedulesChannel = supabase
      .channel('schedules-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'radio_schedule' }, () => {
        loadSchedules();
      })
      .subscribe();

    const sermonsChannel = supabase
      .channel('sermons-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sermon_outlines' }, () => {
        loadSermons();
      })
      .subscribe();

    const themesChannel = supabase
      .channel('themes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_themes' }, () => {
        loadThemes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(songRequestsChannel);
      supabase.removeChannel(prayerChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(pollsChannel);
      supabase.removeChannel(schedulesChannel);
      supabase.removeChannel(sermonsChannel);
      supabase.removeChannel(themesChannel);
    };
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadSchedules(),
      loadSermons(),
      loadThemes(),
      loadComments(),
      loadPrayers(),
      loadPolls(),
      loadSongRequests()
    ]);
  };

  const loadSchedules = async () => {
    const { data, error } = await supabase
      .from('radio_schedule')
      .select('*')
      .order('time_slot');
    
    if (error) {
      toast({ title: "Erro ao carregar programação", variant: "destructive" });
    } else {
      setSchedules(data || []);
    }
  };

  const loadSermons = async () => {
    const { data, error } = await supabase
      .from('sermon_outlines')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Erro ao carregar esboços", variant: "destructive" });
    } else {
      setSermons(data || []);
    }
  };

  const loadThemes = async () => {
    const { data, error } = await supabase
      .from('study_themes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Erro ao carregar temas", variant: "destructive" });
    } else {
      setThemes(data || []);
    }
  };

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('radio_comments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Erro ao carregar comentários", variant: "destructive" });
    } else {
      setComments(data || []);
    }
  };

  const loadPrayers = async () => {
    const { data, error } = await supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Erro ao carregar pedidos de oração", variant: "destructive" });
    } else {
      setPrayers(data || []);
    }
  };

  const loadPolls = async () => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Erro ao carregar sondagens", variant: "destructive" });
    } else {
      setPolls(data || []);
    }
  };

  const loadSongRequests = async () => {
    const { data, error } = await supabase
      .from('song_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Erro ao carregar pedidos de louvor", variant: "destructive" });
    } else {
      setSongRequests(data || []);
    }
  };

  // Funções para programação da rádio
  const saveSchedule = async () => {
    if (!newSchedule.time_slot || !newSchedule.program_name || !newSchedule.presenter) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    setLoadingStates(prev => ({ ...prev, schedule: true }));
    
    const { error } = await supabase
      .from('radio_schedule')
      .insert([newSchedule]);

    setLoadingStates(prev => ({ ...prev, schedule: false }));

    if (error) {
      console.error("Erro ao salvar programação:", error);
      toast({ title: "Erro ao salvar programação", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Programação salva com sucesso!", description: "A programação aparecerá na página da rádio em tempo real" });
      setNewSchedule({ time_slot: "", program_name: "", presenter: "", description: "" });
    }
  };

  const deleteSchedule = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, schedule: true }));
    
    const { error } = await supabase
      .from('radio_schedule')
      .delete()
      .eq('id', id);

    setLoadingStates(prev => ({ ...prev, schedule: false }));

    if (error) {
      console.error("Erro ao excluir programação:", error);
      toast({ title: "Erro ao excluir programação", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Programação excluída com sucesso!" });
      // A lista será atualizada automaticamente pelo real-time subscription
    }
  };

  const updateSchedule = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('radio_schedule')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({ title: "Erro ao atualizar programação", variant: "destructive" });
    } else {
      toast({ title: "Programação atualizada com sucesso!" });
      loadSchedules();
    }
  };

  // Funções para esboços de pregação
  const saveSermon = async () => {
    if (!newSermon.title || !newSermon.theme || !newSermon.main_verse) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    setLoadingStates(prev => ({ ...prev, sermon: true }));

    const { error } = await supabase
      .from('sermon_outlines')
      .insert([{ ...newSermon, author: "Mário Bernardo" }]);

    setLoadingStates(prev => ({ ...prev, sermon: false }));

    if (error) {
      console.error("Erro ao salvar esboço:", error);
      toast({ title: "Erro ao salvar esboço", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Esboço salvo com sucesso!", description: "Publique para aparecer na página principal" });
      setNewSermon({ title: "", theme: "", main_verse: "", content: "", author: "" });
    }
  };

  const publishSermon = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('sermon_outlines')
      .update({ is_published: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao atualizar esboço", variant: "destructive" });
    } else {
      toast({ title: `Esboço ${!currentStatus ? 'publicado' : 'despublicado'} com sucesso!` });
      loadSermons();
    }
  };

  const deleteSermon = async (id: string) => {
    const { error } = await supabase
      .from('sermon_outlines')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao excluir esboço", variant: "destructive" });
    } else {
      toast({ title: "Esboço excluído com sucesso!" });
      loadSermons();
    }
  };

  // Funções para temas de estudo
  const saveTheme = async () => {
    if (!newTheme.title || !newTheme.description || !newTheme.bible_references) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    setLoadingStates(prev => ({ ...prev, theme: true }));

    const { error } = await supabase
      .from('study_themes')
      .insert([newTheme]);

    setLoadingStates(prev => ({ ...prev, theme: false }));

    if (error) {
      console.error("Erro ao salvar tema:", error);
      toast({ title: "Erro ao salvar tema", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Tema salvo com sucesso!", description: "Publique para aparecer na página principal" });
      setNewTheme({ title: "", description: "", bible_references: "", content: "", difficulty_level: "Iniciante" });
    }
  };

  const publishTheme = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('study_themes')
      .update({ is_published: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao atualizar tema", variant: "destructive" });
    } else {
      toast({ title: `Tema ${!currentStatus ? 'publicado' : 'despublicado'} com sucesso!` });
      loadThemes();
    }
  };

  const deleteTheme = async (id: string) => {
    const { error } = await supabase
      .from('study_themes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao excluir tema", variant: "destructive" });
    } else {
      toast({ title: "Tema excluído com sucesso!" });
      loadThemes();
    }
  };

  // Funções para pedidos de louvor
  const updateSongRequestStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('song_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      toast({ title: "Erro ao atualizar status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `✅ Pedido ${status === 'completed' ? 'tocado' : status === 'rejected' ? 'rejeitado' : 'aceito'}!` });
    }
  };

  // Funções para sondagens
  const savePoll = async () => {
    if (!newPoll.question || newPoll.options.some(opt => !opt.trim())) {
      toast({ title: "Preencha a pergunta e todas as opções", variant: "destructive" });
      return;
    }

    setLoadingStates(prev => ({ ...prev, poll: true }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "Erro de autenticação", description: "Faça login para continuar", variant: "destructive" });
        setLoadingStates(prev => ({ ...prev, poll: false }));
        return;
      }

      const { error } = await supabase
        .from('polls')
        .insert([{
          question: newPoll.question,
          options: newPoll.options.filter(opt => opt.trim()),
          is_active: newPoll.is_active
        }]);

      if (error) {
        console.error("Erro ao criar sondagem:", error);
        toast({ 
          title: "Erro ao criar sondagem", 
          description: error.message,
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "✅ Sondagem criada com sucesso!", 
          description: newPoll.is_active ? "Publicada imediatamente na rádio" : "Salva como rascunho" 
        });
        setNewPoll({ question: "", options: ["", ""], is_active: false });
        loadPolls(); // Recarregar lista de sondagens
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({ 
        title: "Erro inesperado", 
        description: "Tente novamente em alguns segundos",
        variant: "destructive" 
      });
    }

    setLoadingStates(prev => ({ ...prev, poll: false }));
  };

  const updatePoll = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('polls')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Erro ao atualizar sondagem:", error);
      toast({ title: "Erro ao atualizar sondagem", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Sondagem atualizada!" });
      setEditingPoll(null);
    }
  };

  const deletePoll = async (id: string) => {
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erro ao excluir sondagem:", error);
      toast({ title: "Erro ao excluir sondagem", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Sondagem excluída!" });
    }
  };

  const addPollOption = () => {
    if (newPoll.options.length < 6) {
      setNewPoll(prev => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removePollOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({ 
        ...prev, 
        options: prev.options.filter((_, i) => i !== index) 
      }));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Rádio Vivendo Na Fé - Gestão de Conteúdo</p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="schedule">Programação</TabsTrigger>
            <TabsTrigger value="sermons">Esboços</TabsTrigger>
            <TabsTrigger value="themes">Temas</TabsTrigger>
            <TabsTrigger value="songs">Pedidos</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
            <TabsTrigger value="prayers">Orações</TabsTrigger>
            <TabsTrigger value="polls">Sondagens</TabsTrigger>
          </TabsList>

          {/* Programação da Rádio */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Programação</CardTitle>
                <CardDescription>Adicione novos programas à grade da rádio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time_slot">Horário *</Label>
                    <Input
                      id="time_slot"
                      placeholder="Ex: 14:00 - 16:00"
                      value={newSchedule.time_slot}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time_slot: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="program_name">Nome do Programa *</Label>
                    <Input
                      id="program_name"
                      placeholder="Ex: Crescendo na Fé"
                      value={newSchedule.program_name}
                      onChange={(e) => setNewSchedule({ ...newSchedule, program_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="presenter">Apresentador *</Label>
                    <Input
                      id="presenter"
                      placeholder="Ex: Mário Bernardo"
                      value={newSchedule.presenter}
                      onChange={(e) => setNewSchedule({ ...newSchedule, presenter: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      placeholder="Descrição do programa"
                      value={newSchedule.description}
                      onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={saveSchedule} className="w-full" disabled={loadingStates.schedule}>
                  <Save className="mr-2 h-4 w-4" />
                  {loadingStates.schedule ? "Salvando..." : "Salvar Programação"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programação Atual - Edição em Tempo Real</CardTitle>
                <CardDescription>Edite diretamente na página da rádio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Horário</label>
                          <Input 
                            value={schedule.time_slot} 
                            onChange={(e) => updateSchedule(schedule.id, { time_slot: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Programa</label>
                          <Input 
                            value={schedule.program_name} 
                            onChange={(e) => updateSchedule(schedule.id, { program_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Apresentador</label>
                          <Input 
                            value={schedule.presenter} 
                            onChange={(e) => updateSchedule(schedule.id, { presenter: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <Textarea 
                          value={schedule.description || ''} 
                          onChange={(e) => updateSchedule(schedule.id, { description: e.target.value })}
                        />
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`active-${schedule.id}`}
                            checked={schedule.is_active}
                            onChange={(e) => updateSchedule(schedule.id, { is_active: e.target.checked })}
                          />
                          <label htmlFor={`active-${schedule.id}`} className="text-sm">
                            Ativo
                          </label>
                        </div>
                        <div className="flex gap-2 ml-auto">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {schedules.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma programação cadastrada ainda.</p>
                      <p className="text-sm">Use o formulário acima para adicionar programas.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Esboços de Pregação */}
          <TabsContent value="sermons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Novo Esboço de Pregação</CardTitle>
                <CardDescription>Crie esboços para as pregações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sermon_title">Título *</Label>
                    <Input
                      id="sermon_title"
                      placeholder="Título da pregação"
                      value={newSermon.title}
                      onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sermon_theme">Tema *</Label>
                    <Input
                      id="sermon_theme"
                      placeholder="Tema principal"
                      value={newSermon.theme}
                      onChange={(e) => setNewSermon({ ...newSermon, theme: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="main_verse">Versículo Principal *</Label>
                    <Input
                      id="main_verse"
                      placeholder="Ex: João 3:16"
                      value={newSermon.main_verse}
                      onChange={(e) => setNewSermon({ ...newSermon, main_verse: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="sermon_content">Conteúdo</Label>
                    <Textarea
                      id="sermon_content"
                      placeholder="Conteúdo completo do esboço"
                      rows={6}
                      value={newSermon.content}
                      onChange={(e) => setNewSermon({ ...newSermon, content: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={saveSermon} className="w-full" disabled={loadingStates.sermon}>
                  <Save className="mr-2 h-4 w-4" />
                  {loadingStates.sermon ? "Salvando..." : "Salvar Esboço"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Esboços Salvos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sermons.map((sermon) => (
                    <div key={sermon.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{sermon.title}</h4>
                            <Badge variant={sermon.is_published ? "default" : "secondary"}>
                              {sermon.is_published ? "Publicado" : "Rascunho"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Tema: {sermon.theme}</p>
                          <p className="text-sm text-muted-foreground">Versículo: {sermon.main_verse}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => publishSermon(sermon.id, sermon.is_published)}
                          >
                            {sermon.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSermon(sermon.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Temas de Estudo */}
          <TabsContent value="themes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Novo Tema de Estudo</CardTitle>
                <CardDescription>Crie novos temas para estudo bíblico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme_title">Título *</Label>
                    <Input
                      id="theme_title"
                      placeholder="Título do tema"
                      value={newTheme.title}
                      onChange={(e) => setNewTheme({ ...newTheme, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Nível de Dificuldade</Label>
                    <Select value={newTheme.difficulty_level} onValueChange={(value) => setNewTheme({ ...newTheme, difficulty_level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bible_refs">Referências Bíblicas *</Label>
                    <Input
                      id="bible_refs"
                      placeholder="Ex: Gênesis 1:1-31, Salmos 23, João 3:16"
                      value={newTheme.bible_references}
                      onChange={(e) => setNewTheme({ ...newTheme, bible_references: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="theme_description">Descrição *</Label>
                    <Textarea
                      id="theme_description"
                      placeholder="Breve descrição do tema"
                      rows={3}
                      value={newTheme.description}
                      onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="theme_content">Conteúdo Completo</Label>
                    <Textarea
                      id="theme_content"
                      placeholder="Conteúdo detalhado do estudo"
                      rows={6}
                      value={newTheme.content}
                      onChange={(e) => setNewTheme({ ...newTheme, content: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={saveTheme} className="w-full" disabled={loadingStates.theme}>
                  <Save className="mr-2 h-4 w-4" />
                  {loadingStates.theme ? "Salvando..." : "Salvar Tema"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temas Salvos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {themes.map((theme) => (
                    <div key={theme.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{theme.title}</h4>
                            <Badge variant={theme.is_published ? "default" : "secondary"}>
                              {theme.is_published ? "Publicado" : "Rascunho"}
                            </Badge>
                            <Badge variant="outline">{theme.difficulty_level}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{theme.description}</p>
                          <p className="text-sm text-muted-foreground">Refs: {theme.bible_references}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => publishTheme(theme.id, theme.is_published)}
                          >
                            {theme.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTheme(theme.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pedidos de Louvor */}
          <TabsContent value="songs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Pedidos de Louvor
                </CardTitle>
                <CardDescription>Gerencie os pedidos de música dos ouvintes em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {songRequests.map((request: any) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{request.user_name}</h4>
                            <Badge 
                              variant={
                                request.status === 'completed' ? 'default' : 
                                request.status === 'approved' ? 'secondary' : 
                                request.status === 'rejected' ? 'destructive' : 
                                'outline'
                              }
                            >
                              {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {request.status === 'completed' && <Music className="h-3 w-3 mr-1" />}
                              {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                              {request.status === 'pending' ? 'Pendente' : 
                               request.status === 'approved' ? 'Aprovado' :
                               request.status === 'completed' ? 'Tocado' : 'Rejeitado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {new Date(request.created_at).toLocaleString()}
                          </p>
                          <div className="mb-2">
                            <p className="font-medium">{request.song_title}</p>
                            {request.artist && <p className="text-sm text-muted-foreground">por {request.artist}</p>}
                          </div>
                          {request.message && (
                            <p className="text-sm bg-muted p-2 rounded mt-2">{request.message}</p>
                          )}
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSongRequestStatus(request.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSongRequestStatus(request.id, 'rejected')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => updateSongRequestStatus(request.id, 'completed')}
                          >
                            <Music className="h-4 w-4 mr-1" />
                            Marcar como Tocado
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {songRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum pedido de louvor ainda.</p>
                      <p className="text-sm">Os pedidos aparecerão aqui em tempo real.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comentários */}
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Comentários da Rádio</CardTitle>
                <CardDescription>Gerencie os comentários dos ouvintes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{comment.user_name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                          <p>{comment.comment}</p>
                          <Badge variant="outline" className="mt-2">{comment.comment_type}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pedidos de Oração */}
          <TabsContent value="prayers">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos de Oração</CardTitle>
                <CardDescription>Gerencie os pedidos de oração</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prayers.map((prayer: any) => (
                    <div key={prayer.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {prayer.is_anonymous ? "Anônimo" : prayer.user_name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(prayer.created_at).toLocaleString()}
                          </p>
                          <p>{prayer.prayer_request}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sondagens */}
          <TabsContent value="polls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Sondagem</CardTitle>
                <CardDescription>Crie novas sondagens para interagir com os ouvintes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="poll_question">Pergunta da Sondagem *</Label>
                  <Input
                    id="poll_question"
                    placeholder="Ex: Qual seu louvor favorito?"
                    value={newPoll.question}
                    onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Opções de Resposta *</Label>
                  <div className="space-y-2">
                    {newPoll.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Opção ${index + 1}`}
                          value={option}
                          onChange={(e) => updatePollOption(index, e.target.value)}
                        />
                        {newPoll.options.length > 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePollOption(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {newPoll.options.length < 6 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPollOption}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="poll_active"
                    checked={newPoll.is_active}
                    onChange={(e) => setNewPoll({ ...newPoll, is_active: e.target.checked })}
                  />
                  <Label htmlFor="poll_active">Publicar imediatamente</Label>
                </div>

                <Button onClick={savePoll} className="w-full" disabled={loadingStates.poll}>
                  <Save className="mr-2 h-4 w-4" />
                  {loadingStates.poll ? "Criando..." : "Criar Sondagem"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sondagens Existentes</CardTitle>
                <CardDescription>Gerencie e edite suas sondagens em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {polls.map((poll: any) => (
                    <div key={poll.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {editingPoll?.id === poll.id ? (
                            <div className="space-y-3">
                              <Input
                                value={editingPoll.question}
                                onChange={(e) => setEditingPoll({ ...editingPoll, question: e.target.value })}
                                placeholder="Pergunta da sondagem"
                              />
                              <div className="space-y-2">
                                {editingPoll.options.map((option: string, index: number) => (
                                  <Input
                                    key={index}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...editingPoll.options];
                                      newOptions[index] = e.target.value;
                                      setEditingPoll({ ...editingPoll, options: newOptions });
                                    }}
                                    placeholder={`Opção ${index + 1}`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`edit-active-${poll.id}`}
                                  checked={editingPoll.is_active}
                                  onChange={(e) => setEditingPoll({ ...editingPoll, is_active: e.target.checked })}
                                />
                                <Label htmlFor={`edit-active-${poll.id}`}>Ativa</Label>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updatePoll(poll.id, {
                                    question: editingPoll.question,
                                    options: editingPoll.options,
                                    is_active: editingPoll.is_active
                                  })}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Salvar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingPoll(null)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{poll.question}</h4>
                                <Badge variant={poll.is_active ? "default" : "secondary"}>
                                  {poll.is_active ? "Ativa" : "Inativa"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Criada em: {new Date(poll.created_at).toLocaleString()}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {poll.options?.map((option: string, index: number) => (
                                  <Badge key={index} variant="outline">{option}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {editingPoll?.id !== poll.id && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPoll(poll)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updatePoll(poll.id, { is_active: !poll.is_active })}
                            >
                              {poll.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletePoll(poll.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {polls.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma sondagem criada ainda.</p>
                      <p className="text-sm">Use o formulário acima para criar sua primeira sondagem.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
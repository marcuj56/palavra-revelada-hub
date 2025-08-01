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

  useEffect(() => {
    loadAllData();
    
    // Set up real-time subscriptions
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

    return () => {
      supabase.removeChannel(songRequestsChannel);
      supabase.removeChannel(prayerChannel);
      supabase.removeChannel(commentsChannel);
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

    const { error } = await supabase
      .from('radio_schedule')
      .insert([newSchedule]);

    if (error) {
      toast({ title: "Erro ao salvar programação", variant: "destructive" });
    } else {
      toast({ title: "Programação salva com sucesso!" });
      setNewSchedule({ time_slot: "", program_name: "", presenter: "", description: "" });
      loadSchedules();
    }
  };

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('radio_schedule')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao excluir programação", variant: "destructive" });
    } else {
      toast({ title: "Programação excluída com sucesso!" });
      loadSchedules();
    }
  };

  // Funções para esboços de pregação
  const saveSermon = async () => {
    if (!newSermon.title || !newSermon.theme || !newSermon.main_verse) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('sermon_outlines')
      .insert([{ ...newSermon, author: "Mário Bernardo" }]);

    if (error) {
      toast({ title: "Erro ao salvar esboço", variant: "destructive" });
    } else {
      toast({ title: "Esboço salvo com sucesso!" });
      setNewSermon({ title: "", theme: "", main_verse: "", content: "", author: "" });
      loadSermons();
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

    const { error } = await supabase
      .from('study_themes')
      .insert([newTheme]);

    if (error) {
      toast({ title: "Erro ao salvar tema", variant: "destructive" });
    } else {
      toast({ title: "Tema salvo com sucesso!" });
      setNewTheme({ title: "", description: "", bible_references: "", content: "", difficulty_level: "Iniciante" });
      loadThemes();
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
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } else {
      toast({ title: `Pedido ${status === 'completed' ? 'tocado' : status === 'rejected' ? 'rejeitado' : 'aceito'}!` });
      loadSongRequests();
    }
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
                <Button onClick={saveSchedule} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Programação
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programação Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{schedule.program_name}</h4>
                        <p className="text-sm text-muted-foreground">{schedule.time_slot} - {schedule.presenter}</p>
                        {schedule.description && <p className="text-sm">{schedule.description}</p>}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
                <Button onClick={saveSermon} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Esboço
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
                <Button onClick={saveTheme} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Tema
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
          <TabsContent value="polls">
            <Card>
              <CardHeader>
                <CardTitle>Sondagens Ativas</CardTitle>
                <CardDescription>Gerencie as sondagens do programa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {polls.map((poll: any) => (
                    <div key={poll.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{poll.question}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(poll.created_at).toLocaleString()}
                          </p>
                          <div className="flex gap-2">
                            {poll.options?.map((option: string, index: number) => (
                              <Badge key={index} variant="outline">{option}</Badge>
                            ))}
                          </div>
                          <Badge variant={poll.is_active ? "default" : "secondary"} className="mt-2">
                            {poll.is_active ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
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
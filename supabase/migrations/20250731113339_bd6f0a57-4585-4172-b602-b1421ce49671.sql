-- Criar tabelas para o sistema administrativo

-- Tabela para programação da rádio
CREATE TABLE public.radio_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  time_slot TEXT NOT NULL,
  program_name TEXT NOT NULL,
  presenter TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para esboços de pregação
CREATE TABLE public.sermon_outlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  main_verse TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para temas de estudo
CREATE TABLE public.study_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  bible_references TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'Iniciante',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para administradores
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.radio_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para visualização pública dos conteúdos publicados
CREATE POLICY "Programação da rádio é visível por todos" 
ON public.radio_schedule 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Esboços publicados são visíveis por todos" 
ON public.sermon_outlines 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Temas publicados são visíveis por todos" 
ON public.study_themes 
FOR SELECT 
USING (is_published = true);

-- Políticas para administradores (apenas usuários autenticados podem gerenciar)
CREATE POLICY "Admins podem gerenciar programação" 
ON public.radio_schedule 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar esboços" 
ON public.sermon_outlines 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar temas" 
ON public.study_themes 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem ver outros admins" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática de timestamps
CREATE TRIGGER update_radio_schedule_updated_at
  BEFORE UPDATE ON public.radio_schedule
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sermon_outlines_updated_at
  BEFORE UPDATE ON public.sermon_outlines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_themes_updated_at
  BEFORE UPDATE ON public.study_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais reais
INSERT INTO public.radio_schedule (time_slot, program_name, presenter, description) VALUES
('06:00 - 08:00', 'Manhã Abençoada', 'Mário Bernardo', 'Começe seu dia com louvores e palavra de Deus'),
('08:00 - 10:00', 'Estudo Bíblico Matinal', 'Pastor João Silva', 'Aprofunde-se nas Escrituras Sagradas'),
('10:00 - 12:00', 'Louvores sem Fronteiras', 'Ana Costa', 'Os melhores hinos e cânticos cristãos'),
('12:00 - 14:00', 'Hora do Almoço Cristão', 'Carlos Santos', 'Música gospel durante o almoço'),
('14:00 - 16:00', 'Crescendo na Fé', 'Mário Bernardo', 'Programa de crescimento espiritual e debates'),
('16:00 - 18:00', 'Juventude Cristã', 'Sofia Pereira', 'Programa dedicado aos jovens cristãos'),
('18:00 - 20:00', 'Palavra Viva', 'Pastor Miguel', 'Pregações e ensinamentos bíblicos'),
('20:00 - 22:00', 'Noite de Adoração', 'Maria Fernandes', 'Louvores e adoração para finalizar o dia'),
('22:00 - 00:00', 'Paz Noturna', 'João Baptista', 'Música suave e meditação bíblica'),
('00:00 - 06:00', 'Vigília Cristã', 'Sistema Automático', 'Louvores e pregações gravadas');

-- Configurar realtime para as novas tabelas
ALTER TABLE public.radio_schedule REPLICA IDENTITY FULL;
ALTER TABLE public.sermon_outlines REPLICA IDENTITY FULL;
ALTER TABLE public.study_themes REPLICA IDENTITY FULL;
ALTER TABLE public.admin_users REPLICA IDENTITY FULL;
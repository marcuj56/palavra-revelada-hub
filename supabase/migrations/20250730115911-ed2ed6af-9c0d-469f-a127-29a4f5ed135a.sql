-- Criar tabela para comentários da rádio
CREATE TABLE public.radio_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  comment_type TEXT NOT NULL CHECK (comment_type IN ('programa', 'louvor', 'geral')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para pedidos de oração
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  prayer_request TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para sondagens/enquetes
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para votos das sondagens
CREATE TABLE public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id),
  user_ip TEXT NOT NULL,
  selected_option TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_ip)
);

-- Criar tabela para pedidos de louvores
CREATE TABLE public.song_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  song_title TEXT NOT NULL,
  artist TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.radio_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público para leitura
CREATE POLICY "Comentários são visíveis por todos" ON public.radio_comments FOR SELECT USING (true);
CREATE POLICY "Pedidos de oração são visíveis por todos" ON public.prayer_requests FOR SELECT USING (true);
CREATE POLICY "Sondagens são visíveis por todos" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Votos são visíveis por todos" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "Pedidos de música são visíveis por todos" ON public.song_requests FOR SELECT USING (true);

-- Criar políticas de inserção para todos
CREATE POLICY "Qualquer um pode comentar" ON public.radio_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Qualquer um pode pedir oração" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Qualquer um pode votar" ON public.poll_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Qualquer um pode pedir música" ON public.song_requests FOR INSERT WITH CHECK (true);

-- Inserir uma sondagem de exemplo para o debate
INSERT INTO public.polls (question, options, is_active) VALUES 
('Qual tema você gostaria de ver no próximo debate "Crescendo na Fé"?', 
 ARRAY['Vida de Oração', 'Família Cristã', 'Evangelização', 'Dons Espirituais'], 
 true);
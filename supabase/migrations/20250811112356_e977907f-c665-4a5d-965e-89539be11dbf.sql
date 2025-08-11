-- Add missing RLS policies for polls management
CREATE POLICY "Admins podem gerenciar sondagens" 
ON public.polls 
FOR ALL 
USING (is_admin());

-- Add missing RLS policies for admin operations on song_requests
CREATE POLICY "Admins podem atualizar pedidos de música" 
ON public.song_requests 
FOR UPDATE 
USING (is_admin());

-- Add missing RLS policies for admin operations on prayer_requests  
CREATE POLICY "Admins podem gerenciar pedidos de oração" 
ON public.prayer_requests 
FOR ALL 
USING (is_admin());

-- Add missing RLS policies for admin operations on radio_comments
CREATE POLICY "Admins podem gerenciar comentários" 
ON public.radio_comments 
FOR ALL 
USING (is_admin());
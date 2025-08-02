-- Fix RLS policies to use is_admin function instead of auth.uid()
DROP POLICY IF EXISTS "Admins podem gerenciar programação" ON public.radio_schedule;
DROP POLICY IF EXISTS "Admins podem gerenciar esboços" ON public.sermon_outlines;
DROP POLICY IF EXISTS "Admins podem gerenciar temas" ON public.study_themes;

-- Create better RLS policies using is_admin function
CREATE POLICY "Admins podem gerenciar programação" 
ON public.radio_schedule 
FOR ALL 
TO public 
USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar esboços" 
ON public.sermon_outlines 
FOR ALL 
TO public 
USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar temas" 
ON public.study_themes 
FOR ALL 
TO public 
USING (public.is_admin());

-- Create song requests table for real-time song requests
ALTER TABLE public.song_requests ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Enable realtime for relevant tables
ALTER TABLE public.song_requests REPLICA IDENTITY FULL;
ALTER TABLE public.prayer_requests REPLICA IDENTITY FULL;
ALTER TABLE public.radio_comments REPLICA IDENTITY FULL;
ALTER TABLE public.polls REPLICA IDENTITY FULL;
ALTER TABLE public.poll_votes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.song_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.radio_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;
-- Inserir um usuário admin inicial
INSERT INTO admin_users (user_id, name, role, is_active) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Administrador', 'admin', true)
ON CONFLICT (user_id) DO NOTHING;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = $1 
    AND is_active = true
  );
$$;

-- Atualizar RLS policies para usar a função
DROP POLICY IF EXISTS "Admins podem gerenciar programação" ON radio_schedule;
DROP POLICY IF EXISTS "Admins podem gerenciar esboços" ON sermon_outlines;
DROP POLICY IF EXISTS "Admins podem gerenciar temas" ON study_themes;

CREATE POLICY "Admins podem gerenciar programação" 
ON radio_schedule FOR ALL 
USING (is_admin());

CREATE POLICY "Admins podem gerenciar esboços" 
ON sermon_outlines FOR ALL 
USING (is_admin());

CREATE POLICY "Admins podem gerenciar temas" 
ON study_themes FOR ALL 
USING (is_admin());
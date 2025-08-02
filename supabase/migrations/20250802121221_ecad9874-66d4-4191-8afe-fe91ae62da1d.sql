-- Verificar se constraint já existe antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'admin_users_user_id_unique' 
        AND table_name = 'admin_users'
    ) THEN
        ALTER TABLE admin_users ADD CONSTRAINT admin_users_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- Inserir um usuário admin de teste com UUID válido
INSERT INTO admin_users (user_id, name, role, is_active) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Administrador', 'admin', true)
ON CONFLICT (user_id) DO NOTHING;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = check_user_id 
    AND is_active = true
  );
$$;
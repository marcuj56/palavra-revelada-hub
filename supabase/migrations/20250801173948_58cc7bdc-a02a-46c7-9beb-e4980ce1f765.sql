-- Adicionar constraint único para user_id
ALTER TABLE admin_users ADD CONSTRAINT admin_users_user_id_unique UNIQUE (user_id);

-- Inserir um usuário admin de teste
INSERT INTO admin_users (user_id, name, role, is_active) 
VALUES ('admin-test-user', 'Administrador', 'admin', true);

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
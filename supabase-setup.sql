-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  price TEXT NOT NULL,
  mileage TEXT NOT NULL,
  fuel TEXT,
  transmission TEXT,
  engine TEXT,
  color TEXT,
  doors TEXT,
  description TEXT,
  features TEXT[],
  specifications JSONB,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública dos veículos
CREATE POLICY "Veículos são visíveis publicamente" ON vehicles
  FOR SELECT USING (true);

-- Política para permitir inserção apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir veículos" ON vehicles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar veículos" ON vehicles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem excluir veículos" ON vehicles
  FOR DELETE USING (auth.role() = 'authenticated');

-- Criar bucket para armazenamento de imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de imagens para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload de imagens" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Política para permitir leitura pública das imagens
CREATE POLICY "Imagens são visíveis publicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-images');

-- Política para permitir atualização de imagens para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar imagens" ON storage.objects
  FOR UPDATE USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Política para permitir exclusão de imagens para usuários autenticados
CREATE POLICY "Usuários autenticados podem excluir imagens" ON storage.objects
  FOR DELETE USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Criar tabela para armazenar as simulações de seguro
CREATE TABLE public.insurance_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  contato TEXT NOT NULL,
  ano TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  placa TEXT NOT NULL,
  plano_selecionado TEXT NOT NULL,
  parceiras_selecionadas TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS mas permitir inserções públicas (sem autenticação necessária)
ALTER TABLE public.insurance_simulations ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserções de qualquer um
CREATE POLICY "Permitir inserções públicas" 
ON public.insurance_simulations 
FOR INSERT 
WITH CHECK (true);

-- Política para leitura apenas de usuários autenticados (admin)
CREATE POLICY "Permitir leitura para autenticados" 
ON public.insurance_simulations 
FOR SELECT 
USING (auth.role() = 'authenticated');
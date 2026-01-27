-- ========================================
-- ADICIONAR POLÍTICAS RLS (Row Level Security)
-- ========================================
-- Execute este arquivo DEPOIS de criar as tabelas com sucesso
-- usando o arquivo MINIMAL
-- ========================================

-- 1. Ativar RLS nas tabelas
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_metrics ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Pacientes podem ver check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem inserir check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem ver métricas" ON public.patient_metrics;

-- 3. Criar políticas novas
-- Usando UUID puro (sem conversões, pois tudo é UUID)
CREATE POLICY "Pacientes podem ver check-ins"
  ON public.daily_checkins
  FOR SELECT
  USING (
    paciente_id IN (
      SELECT id
      FROM patients 
      WHERE user_auth = auth.uid()
    )
  );

CREATE POLICY "Pacientes podem inserir check-ins"
  ON public.daily_checkins
  FOR INSERT
  WITH CHECK (
    paciente_id IN (
      SELECT id
      FROM patients 
      WHERE user_auth = auth.uid()
    )
  );

CREATE POLICY "Pacientes podem ver métricas"
  ON public.patient_metrics
  FOR SELECT
  USING (
    paciente_id IN (
      SELECT id
      FROM patients 
      WHERE user_auth = auth.uid()
    )
  );

-- ========================================
-- CONCLUÍDO!
-- ========================================
-- As políticas de segurança foram ativadas
-- Agora apenas o próprio paciente pode ver seus dados


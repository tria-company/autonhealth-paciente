-- ========================================
-- CORRIGIR PERMISSÕES RLS
-- ========================================
-- Execute este arquivo para adicionar permissões de INSERT e UPDATE
-- ========================================

-- 1. Remover políticas antigas
DROP POLICY IF EXISTS "Pacientes podem ver check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem inserir check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem ver métricas" ON public.patient_metrics;
DROP POLICY IF EXISTS "Pacientes podem atualizar métricas" ON public.patient_metrics;
DROP POLICY IF EXISTS "Pacientes podem inserir métricas" ON public.patient_metrics;

-- 2. Criar políticas para daily_checkins
CREATE POLICY "Pacientes podem ver check-ins"
  ON public.daily_checkins
  FOR SELECT
  USING (
    paciente_id IN (
      SELECT id FROM patients WHERE user_auth = auth.uid()
    )
  );

CREATE POLICY "Pacientes podem inserir check-ins"
  ON public.daily_checkins
  FOR INSERT
  WITH CHECK (
    paciente_id IN (
      SELECT id FROM patients WHERE user_auth = auth.uid()
    )
  );

-- 3. Criar políticas para patient_metrics
CREATE POLICY "Pacientes podem ver métricas"
  ON public.patient_metrics
  FOR SELECT
  USING (
    paciente_id IN (
      SELECT id FROM patients WHERE user_auth = auth.uid()
    )
  );

-- ⚠️ IMPORTANTE: Permitir INSERT e UPDATE para que o TRIGGER funcione
-- O trigger roda com os privilégios do usuário que inseriu o check-in
CREATE POLICY "Pacientes podem inserir métricas"
  ON public.patient_metrics
  FOR INSERT
  WITH CHECK (
    paciente_id IN (
      SELECT id FROM patients WHERE user_auth = auth.uid()
    )
  );

CREATE POLICY "Pacientes podem atualizar métricas"
  ON public.patient_metrics
  FOR UPDATE
  USING (
    paciente_id IN (
      SELECT id FROM patients WHERE user_auth = auth.uid()
    )
  )
  WITH CHECK (
    paciente_id IN (
      SELECT id FROM patients WHERE user_auth = auth.uid()
    )
  );

-- ========================================
-- CONCLUÍDO!
-- ========================================
-- Agora os pacientes podem:
-- ✅ Ver seus check-ins
-- ✅ Inserir novos check-ins
-- ✅ Ver suas métricas
-- ✅ Trigger pode atualizar/inserir métricas automaticamente








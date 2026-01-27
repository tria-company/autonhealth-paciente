-- ========================================
-- POLÍTICAS RLS TEMPORÁRIAS (PERMISSIVAS)
-- ========================================
-- ⚠️ ATENÇÃO: Estas políticas permitem acesso TOTAL
-- Use apenas para TESTE e DESENVOLVIMENTO
-- Substitua por políticas seguras em PRODUÇÃO
-- ========================================

-- 1. Ativar RLS nas tabelas
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_metrics ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas
DROP POLICY IF EXISTS "Pacientes podem ver check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem inserir check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem ver métricas" ON public.patient_metrics;
DROP POLICY IF EXISTS "temp_allow_all_select" ON public.daily_checkins;
DROP POLICY IF EXISTS "temp_allow_all_insert" ON public.daily_checkins;
DROP POLICY IF EXISTS "temp_allow_all_metrics" ON public.patient_metrics;

-- 3. Criar políticas TEMPORÁRIAS que permitem tudo
-- (apenas usuários autenticados)
CREATE POLICY "temp_allow_all_select"
  ON public.daily_checkins
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "temp_allow_all_insert"
  ON public.daily_checkins
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "temp_allow_all_metrics"
  ON public.patient_metrics
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ========================================
-- CONCLUÍDO!
-- ========================================
-- RLS está ativo mas permite acesso total para usuários autenticados
-- Isto é apenas para TESTE
-- 
-- Para adicionar segurança real depois, execute:
-- DROP das políticas "temp_*" e crie políticas que verificam paciente_id








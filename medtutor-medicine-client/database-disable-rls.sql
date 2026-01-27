-- ========================================
-- DESABILITAR RLS COMPLETAMENTE
-- ========================================
-- Use apenas para desenvolvimento/teste local
-- NUNCA use em produção!
-- ========================================

-- Remover todas as políticas
DROP POLICY IF EXISTS "Pacientes podem ver check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem inserir check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem ver métricas" ON public.patient_metrics;
DROP POLICY IF EXISTS "temp_allow_all_select" ON public.daily_checkins;
DROP POLICY IF EXISTS "temp_allow_all_insert" ON public.daily_checkins;
DROP POLICY IF EXISTS "temp_allow_all_metrics" ON public.patient_metrics;

-- Desabilitar RLS completamente
ALTER TABLE public.daily_checkins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_metrics DISABLE ROW LEVEL SECURITY;

-- ========================================
-- CONCLUÍDO!
-- ========================================
-- RLS está DESABILITADO
-- Qualquer usuário pode acessar todos os dados
-- Use apenas para DESENVOLVIMENTO LOCAL








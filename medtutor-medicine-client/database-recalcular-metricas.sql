-- Script para recalcular todas as métricas dos pacientes
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos ver quais pacientes têm check-ins
SELECT DISTINCT paciente_id 
FROM daily_checkins 
ORDER BY paciente_id;

-- 2. Recalcular métricas para todos os pacientes que fizeram check-ins
DO $$
DECLARE
  paciente_record RECORD;
BEGIN
  FOR paciente_record IN 
    SELECT DISTINCT paciente_id FROM daily_checkins
  LOOP
    RAISE NOTICE 'Recalculando métricas para paciente: %', paciente_record.paciente_id;
    PERFORM calculate_patient_metrics(paciente_record.paciente_id);
  END LOOP;
END$$;

-- 3. Verificar as métricas calculadas
SELECT 
  pm.paciente_id,
  pm.equilibrio_geral,
  pm.equilibrio_sono,
  pm.equilibrio_ambiente,
  pm.equilibrio_atividade_fisica,
  pm.equilibrio_sistema_nervoso,
  pm.equilibrio_alimentacao,
  pm.equilibrio_relacionamento,
  pm.updated_at,
  (SELECT COUNT(*) FROM daily_checkins WHERE paciente_id = pm.paciente_id) as total_checkins
FROM patient_metrics pm
ORDER BY pm.updated_at DESC;

-- 4. Ver os dados dos check-ins para debug
SELECT 
  paciente_id,
  data_checkin,
  sono_qualidade,
  sono_tempo_horas,
  ambiente_sol_minutos,
  ambiente_natureza_minutos,
  atividade_tempo_horas,
  atividade_intensidade,
  sistema_nervoso_estresse,
  sistema_nervoso_mindfulness_minutos,
  alimentacao_refeicoes,
  alimentacao_agua_litros,
  relacionamento_qualidade,
  relacionamento_satisfacao
FROM daily_checkins
ORDER BY data_checkin DESC
LIMIT 10;







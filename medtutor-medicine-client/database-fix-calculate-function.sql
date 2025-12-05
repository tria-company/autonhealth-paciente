-- FIX: Função corrigida para calcular e salvar as métricas individuais
-- Execute este script no Supabase SQL Editor

CREATE OR REPLACE FUNCTION calculate_patient_metrics(p_paciente_id UUID)
RETURNS VOID AS $$
DECLARE
  v_periodo_dias INTEGER := 7;
  v_data_inicio DATE;
  v_equilibrio_geral DECIMAL(4,2);
  v_equilibrio_sono DECIMAL(4,2);
  v_equilibrio_ambiente DECIMAL(4,2);
  v_equilibrio_atividade DECIMAL(4,2);
  v_equilibrio_nervoso DECIMAL(4,2);
  v_equilibrio_alimentacao DECIMAL(4,2);
  v_equilibrio_relacionamento DECIMAL(4,2);
  v_sono_horas DECIMAL(4,2);
  v_hidratacao DECIMAL(4,2);
  v_mental_energia DECIMAL(4,2);
  v_aderencia DECIMAL(5,2);
  v_total_checkins INTEGER;
BEGIN
  v_data_inicio := CURRENT_DATE - v_periodo_dias;
  
  -- Calcular métricas individuais
  SELECT 
    COALESCE(AVG(sono_qualidade * 0.7 + (sono_tempo_horas / 8 * 10) * 0.3), 0),
    COALESCE(AVG((ambiente_sol_minutos / 30.0 * 10 * 0.5) + (ambiente_natureza_minutos / 60.0 * 10 * 0.5)), 0),
    COALESCE(AVG((atividade_tempo_horas / 1.5 * 10 * 0.5) + (atividade_intensidade / 10.0 * 0.5)), 0),
    COALESCE(AVG(((100 - sistema_nervoso_estresse) / 10.0 * 0.6) + (sistema_nervoso_mindfulness_minutos / 20.0 * 10 * 0.4)), 0),
    COALESCE(AVG((alimentacao_refeicoes / 4.0 * 10 * 0.5) + (alimentacao_agua_litros / 2.5 * 10 * 0.5)), 0),
    COALESCE(AVG((relacionamento_qualidade / 10.0 * 0.5) + (relacionamento_satisfacao / 10.0 * 0.5)), 0),
    COALESCE(AVG(sono_tempo_horas), 0),
    COALESCE(AVG(alimentacao_agua_litros), 0),
    COUNT(*)
  INTO 
    v_equilibrio_sono, v_equilibrio_ambiente, v_equilibrio_atividade,
    v_equilibrio_nervoso, v_equilibrio_alimentacao, v_equilibrio_relacionamento,
    v_sono_horas, v_hidratacao, v_total_checkins
  FROM daily_checkins
  WHERE paciente_id = p_paciente_id
    AND data_checkin >= v_data_inicio;
  
  -- Calcular equilíbrio geral
  v_equilibrio_geral := (
    v_equilibrio_sono + v_equilibrio_ambiente + v_equilibrio_atividade +
    v_equilibrio_nervoso + v_equilibrio_alimentacao + v_equilibrio_relacionamento
  ) / 6.0;
  
  -- Mental & Energia
  v_mental_energia := (v_equilibrio_sono * 0.4 + v_equilibrio_nervoso * 0.4 + v_equilibrio_atividade * 0.2);
  
  -- Aderência
  v_aderencia := (v_total_checkins::DECIMAL / v_periodo_dias::DECIMAL) * 100;
  IF v_aderencia > 100 THEN
    v_aderencia := 100;
  END IF;
  
  -- LOG para debug
  RAISE NOTICE 'Valores calculados - Sono: %, Ambiente: %, Atividade: %, Nervoso: %, Alimentação: %, Relacionamento: %, Geral: %',
    v_equilibrio_sono, v_equilibrio_ambiente, v_equilibrio_atividade, 
    v_equilibrio_nervoso, v_equilibrio_alimentacao, v_equilibrio_relacionamento, v_equilibrio_geral;
  
  -- Inserir ou atualizar métricas
  INSERT INTO patient_metrics (
    paciente_id, 
    updated_at,
    equilibrio_geral, 
    equilibrio_geral_variacao,
    qualidade_sono_horas, 
    qualidade_sono_variacao_minutos,
    hidratacao_atual_litros, 
    hidratacao_meta_litros,
    mental_energia, 
    mental_energia_variacao,
    equilibrio_sono, 
    equilibrio_ambiente, 
    equilibrio_atividade_fisica,
    equilibrio_sistema_nervoso, 
    equilibrio_alimentacao, 
    equilibrio_relacionamento,
    aderencia_protocolo
  )
  VALUES (
    p_paciente_id, 
    NOW(),
    v_equilibrio_geral, 
    0,
    v_sono_horas, 
    0,
    v_hidratacao, 
    2.4,
    v_mental_energia, 
    0,
    v_equilibrio_sono, 
    v_equilibrio_ambiente, 
    v_equilibrio_atividade,
    v_equilibrio_nervoso, 
    v_equilibrio_alimentacao, 
    v_equilibrio_relacionamento,
    v_aderencia
  )
  ON CONFLICT (paciente_id) DO UPDATE SET
    updated_at = NOW(),
    equilibrio_geral_variacao = CASE 
      WHEN patient_metrics.equilibrio_geral IS NOT NULL AND patient_metrics.equilibrio_geral != 0
      THEN ((v_equilibrio_geral - patient_metrics.equilibrio_geral) / patient_metrics.equilibrio_geral * 100)
      ELSE 0
    END,
    equilibrio_geral = v_equilibrio_geral,
    qualidade_sono_variacao_minutos = CASE
      WHEN patient_metrics.qualidade_sono_horas IS NOT NULL
      THEN ROUND((v_sono_horas - patient_metrics.qualidade_sono_horas) * 60)
      ELSE 0
    END,
    qualidade_sono_horas = v_sono_horas,
    hidratacao_atual_litros = v_hidratacao,
    mental_energia_variacao = CASE 
      WHEN patient_metrics.mental_energia IS NOT NULL AND patient_metrics.mental_energia != 0
      THEN ((v_mental_energia - patient_metrics.mental_energia) / patient_metrics.mental_energia * 100)
      ELSE 0
    END,
    mental_energia = v_mental_energia,
    equilibrio_sono = v_equilibrio_sono,
    equilibrio_ambiente = v_equilibrio_ambiente,
    equilibrio_atividade_fisica = v_equilibrio_atividade,
    equilibrio_sistema_nervoso = v_equilibrio_nervoso,
    equilibrio_alimentacao = v_equilibrio_alimentacao,
    equilibrio_relacionamento = v_equilibrio_relacionamento,
    aderencia_protocolo = v_aderencia;
    
  RAISE NOTICE 'Métricas atualizadas com sucesso para paciente: %', p_paciente_id;
END;
$$ LANGUAGE plpgsql;

-- Agora recalcular as métricas do seu paciente
SELECT calculate_patient_metrics('750c9511-d75c-49dd-badf-3125f44a2d64'::uuid);

-- Verificar os valores salvos
SELECT 
  equilibrio_geral,
  equilibrio_sono,
  equilibrio_ambiente,
  equilibrio_atividade_fisica,
  equilibrio_sistema_nervoso,
  equilibrio_alimentacao,
  equilibrio_relacionamento,
  updated_at
FROM patient_metrics
WHERE paciente_id = '750c9511-d75c-49dd-badf-3125f44a2d64';


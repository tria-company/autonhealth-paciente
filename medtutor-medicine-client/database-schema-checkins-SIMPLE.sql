-- ========================================
-- VERSÃO SIMPLIFICADA - APENAS CRIAÇÃO
-- ========================================
-- Use este arquivo se o -CLEAN.sql der erro
-- Você precisará remover manualmente as tabelas antigas pelo Supabase UI
-- ========================================

-- Remover funções antigas (se existirem)
DROP FUNCTION IF EXISTS trigger_calculate_metrics() CASCADE;
DROP FUNCTION IF EXISTS calculate_patient_metrics(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_patient_metrics(TEXT) CASCADE;

-- Criar tabela daily_checkins
CREATE TABLE public.daily_checkins (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paciente_id UUID NOT NULL,
  data_checkin DATE NOT NULL DEFAULT CURRENT_DATE,
  
  sono_qualidade INTEGER CHECK (sono_qualidade >= 0 AND sono_qualidade <= 10),
  sono_tempo_horas DECIMAL(4,2) CHECK (sono_tempo_horas >= 0 AND sono_tempo_horas <= 12),
  
  ambiente_sol_minutos INTEGER CHECK (ambiente_sol_minutos >= 0 AND ambiente_sol_minutos <= 120),
  ambiente_natureza_minutos INTEGER CHECK (ambiente_natureza_minutos >= 0 AND ambiente_natureza_minutos <= 120),
  
  atividade_tempo_horas DECIMAL(4,2) CHECK (atividade_tempo_horas >= 0 AND atividade_tempo_horas <= 3),
  atividade_intensidade INTEGER CHECK (atividade_intensidade >= 0 AND atividade_intensidade <= 100),
  
  sistema_nervoso_estresse INTEGER CHECK (sistema_nervoso_estresse >= 0 AND sistema_nervoso_estresse <= 100),
  sistema_nervoso_mindfulness_minutos INTEGER CHECK (sistema_nervoso_mindfulness_minutos >= 0 AND sistema_nervoso_mindfulness_minutos <= 60),
  
  alimentacao_refeicoes INTEGER CHECK (alimentacao_refeicoes >= 0 AND alimentacao_refeicoes <= 6),
  alimentacao_agua_litros DECIMAL(4,2) CHECK (alimentacao_agua_litros >= 0 AND alimentacao_agua_litros <= 4),
  
  relacionamento_qualidade INTEGER CHECK (relacionamento_qualidade >= 0 AND relacionamento_qualidade <= 100),
  relacionamento_satisfacao INTEGER CHECK (relacionamento_satisfacao >= 0 AND relacionamento_satisfacao <= 100),
  
  CONSTRAINT unique_checkin_per_day UNIQUE (paciente_id, data_checkin)
);

CREATE INDEX idx_daily_checkins_paciente ON public.daily_checkins(paciente_id);
CREATE INDEX idx_daily_checkins_data ON public.daily_checkins(data_checkin DESC);

-- Criar tabela patient_metrics
CREATE TABLE public.patient_metrics (
  id BIGSERIAL PRIMARY KEY,
  paciente_id UUID NOT NULL UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  equilibrio_geral DECIMAL(4,2),
  equilibrio_geral_variacao DECIMAL(5,2),
  qualidade_sono_horas DECIMAL(4,2),
  qualidade_sono_variacao_minutos INTEGER,
  hidratacao_atual_litros DECIMAL(4,2),
  hidratacao_meta_litros DECIMAL(4,2) DEFAULT 2.4,
  mental_energia DECIMAL(4,2),
  mental_energia_variacao DECIMAL(5,2),
  
  equilibrio_sono DECIMAL(4,2),
  equilibrio_ambiente DECIMAL(4,2),
  equilibrio_atividade_fisica DECIMAL(4,2),
  equilibrio_sistema_nervoso DECIMAL(4,2),
  equilibrio_alimentacao DECIMAL(4,2),
  equilibrio_relacionamento DECIMAL(4,2),
  
  idade_biologica INTEGER,
  aderencia_protocolo DECIMAL(5,2)
);

CREATE INDEX idx_patient_metrics_paciente ON public.patient_metrics(paciente_id);

-- Criar função de cálculo
CREATE FUNCTION calculate_patient_metrics(p_paciente_id UUID)
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
  WHERE paciente_id = p_paciente_id AND data_checkin >= v_data_inicio;
  
  v_equilibrio_geral := (v_equilibrio_sono + v_equilibrio_ambiente + v_equilibrio_atividade + v_equilibrio_nervoso + v_equilibrio_alimentacao + v_equilibrio_relacionamento) / 6.0;
  v_mental_energia := (v_equilibrio_sono * 0.4 + v_equilibrio_nervoso * 0.4 + v_equilibrio_atividade * 0.2);
  v_aderencia := LEAST((v_total_checkins::DECIMAL / v_periodo_dias::DECIMAL) * 100, 100);
  
  INSERT INTO patient_metrics (
    paciente_id, equilibrio_geral, qualidade_sono_horas, hidratacao_atual_litros,
    mental_energia, equilibrio_sono, equilibrio_ambiente, equilibrio_atividade_fisica,
    equilibrio_sistema_nervoso, equilibrio_alimentacao, equilibrio_relacionamento, aderencia_protocolo
  ) VALUES (
    p_paciente_id, v_equilibrio_geral, v_sono_horas, v_hidratacao, v_mental_energia,
    v_equilibrio_sono, v_equilibrio_ambiente, v_equilibrio_atividade,
    v_equilibrio_nervoso, v_equilibrio_alimentacao, v_equilibrio_relacionamento, v_aderencia
  )
  ON CONFLICT (paciente_id) DO UPDATE SET
    updated_at = NOW(),
    equilibrio_geral_variacao = ((v_equilibrio_geral - patient_metrics.equilibrio_geral) / NULLIF(patient_metrics.equilibrio_geral, 0) * 100),
    equilibrio_geral = v_equilibrio_geral,
    qualidade_sono_variacao_minutos = ROUND((v_sono_horas - patient_metrics.qualidade_sono_horas) * 60),
    qualidade_sono_horas = v_sono_horas,
    hidratacao_atual_litros = v_hidratacao,
    mental_energia_variacao = ((v_mental_energia - patient_metrics.mental_energia) / NULLIF(patient_metrics.mental_energia, 0) * 100),
    mental_energia = v_mental_energia,
    equilibrio_sono = v_equilibrio_sono,
    equilibrio_ambiente = v_equilibrio_ambiente,
    equilibrio_atividade_fisica = v_equilibrio_atividade,
    equilibrio_sistema_nervoso = v_equilibrio_nervoso,
    equilibrio_alimentacao = v_equilibrio_alimentacao,
    equilibrio_relacionamento = v_equilibrio_relacionamento,
    aderencia_protocolo = v_aderencia;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
CREATE FUNCTION trigger_calculate_metrics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_patient_metrics(NEW.paciente_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_checkin_insert
  AFTER INSERT ON public.daily_checkins
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_metrics();

-- Ativar RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_metrics ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Pacientes podem ver check-ins"
  ON public.daily_checkins FOR SELECT
  USING (paciente_id IN (SELECT id FROM patients WHERE user_auth = auth.uid()::text));

CREATE POLICY "Pacientes podem inserir check-ins"
  ON public.daily_checkins FOR INSERT
  WITH CHECK (paciente_id IN (SELECT id FROM patients WHERE user_auth = auth.uid()::text));

CREATE POLICY "Pacientes podem ver métricas"
  ON public.patient_metrics FOR SELECT
  USING (paciente_id IN (SELECT id FROM patients WHERE user_auth = auth.uid()::text));








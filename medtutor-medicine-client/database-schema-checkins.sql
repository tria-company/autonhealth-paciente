-- ========================================
-- TABELAS PARA CHECK-INS DIÁRIOS E DASHBOARD
-- ========================================

-- Remover tabelas antigas se existirem (CUIDADO: isso apaga todos os dados!)
-- Descomente as linhas abaixo apenas se quiser recomeçar do zero
-- DROP TABLE IF EXISTS public.daily_checkins CASCADE;
-- DROP TABLE IF EXISTS public.patient_metrics CASCADE;

-- 1. TABELA: daily_checkins
-- Armazena os check-ins diários dos pacientes
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paciente_id UUID NOT NULL,
  data_checkin DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Sono
  sono_qualidade INTEGER CHECK (sono_qualidade >= 0 AND sono_qualidade <= 10),
  sono_tempo_horas DECIMAL(4,2) CHECK (sono_tempo_horas >= 0 AND sono_tempo_horas <= 12),
  
  -- Ambiente
  ambiente_sol_minutos INTEGER CHECK (ambiente_sol_minutos >= 0 AND ambiente_sol_minutos <= 120),
  ambiente_natureza_minutos INTEGER CHECK (ambiente_natureza_minutos >= 0 AND ambiente_natureza_minutos <= 120),
  
  -- Atividade Física
  atividade_tempo_horas DECIMAL(4,2) CHECK (atividade_tempo_horas >= 0 AND atividade_tempo_horas <= 3),
  atividade_intensidade INTEGER CHECK (atividade_intensidade >= 0 AND atividade_intensidade <= 100),
  
  -- Sistema Nervoso
  sistema_nervoso_estresse INTEGER CHECK (sistema_nervoso_estresse >= 0 AND sistema_nervoso_estresse <= 100),
  sistema_nervoso_mindfulness_minutos INTEGER CHECK (sistema_nervoso_mindfulness_minutos >= 0 AND sistema_nervoso_mindfulness_minutos <= 60),
  
  -- Alimentação
  alimentacao_refeicoes INTEGER CHECK (alimentacao_refeicoes >= 0 AND alimentacao_refeicoes <= 6),
  alimentacao_agua_litros DECIMAL(4,2) CHECK (alimentacao_agua_litros >= 0 AND alimentacao_agua_litros <= 4),
  
  -- Relacionamento
  relacionamento_qualidade INTEGER CHECK (relacionamento_qualidade >= 0 AND relacionamento_qualidade <= 100),
  relacionamento_satisfacao INTEGER CHECK (relacionamento_satisfacao >= 0 AND relacionamento_satisfacao <= 100),
  
  -- Constraint para garantir apenas 1 check-in por dia por paciente
  CONSTRAINT unique_checkin_per_day UNIQUE (paciente_id, data_checkin)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_daily_checkins_paciente ON public.daily_checkins(paciente_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_data ON public.daily_checkins(data_checkin DESC);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_paciente_data ON public.daily_checkins(paciente_id, data_checkin DESC);

-- 2. TABELA: patient_metrics
-- Armazena métricas calculadas/agregadas do paciente
CREATE TABLE IF NOT EXISTS public.patient_metrics (
  id BIGSERIAL PRIMARY KEY,
  paciente_id UUID NOT NULL UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Dashboard - Cards do Topo (média 7 dias)
  equilibrio_geral DECIMAL(4,2) CHECK (equilibrio_geral >= 0 AND equilibrio_geral <= 10),
  equilibrio_geral_variacao DECIMAL(5,2), -- % variação em relação ao período anterior
  
  qualidade_sono_horas DECIMAL(4,2), -- média das horas de sono
  qualidade_sono_variacao_minutos INTEGER, -- minutos de variação
  
  hidratacao_atual_litros DECIMAL(4,2), -- média de litros nos últimos 7 dias
  hidratacao_meta_litros DECIMAL(4,2) DEFAULT 2.4, -- meta diária
  
  mental_energia DECIMAL(4,2) CHECK (mental_energia >= 0 AND mental_energia <= 10),
  mental_energia_variacao DECIMAL(5,2), -- % variação
  
  -- Equilíbrio Integrativo (6 dimensões) - média 7 dias
  equilibrio_sono DECIMAL(4,2) CHECK (equilibrio_sono >= 0 AND equilibrio_sono <= 10),
  equilibrio_ambiente DECIMAL(4,2) CHECK (equilibrio_ambiente >= 0 AND equilibrio_ambiente <= 10),
  equilibrio_atividade_fisica DECIMAL(4,2) CHECK (equilibrio_atividade_fisica >= 0 AND equilibrio_atividade_fisica <= 10),
  equilibrio_sistema_nervoso DECIMAL(4,2) CHECK (equilibrio_sistema_nervoso >= 0 AND equilibrio_sistema_nervoso <= 10),
  equilibrio_alimentacao DECIMAL(4,2) CHECK (equilibrio_alimentacao >= 0 AND equilibrio_alimentacao <= 10),
  equilibrio_relacionamento DECIMAL(4,2) CHECK (equilibrio_relacionamento >= 0 AND equilibrio_relacionamento <= 10),
  
  -- Idade Biológica (a ser implementado)
  idade_biologica INTEGER,
  
  -- Aderência ao Protocolo (% de check-ins realizados)
  aderencia_protocolo DECIMAL(5,2) CHECK (aderencia_protocolo >= 0 AND aderencia_protocolo <= 100)
);

-- Índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_patient_metrics_paciente ON public.patient_metrics(paciente_id);

-- 3. FUNÇÃO: Calcular métricas após cada check-in
CREATE OR REPLACE FUNCTION calculate_patient_metrics(p_paciente_id UUID)
RETURNS VOID AS $$
DECLARE
  v_periodo_dias INTEGER := 7; -- Período para cálculo de médias
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
  
  -- Calcular equilíbrio de cada dimensão (normalizado para escala 0-10)
  SELECT 
    -- Sono: média ponderada de qualidade (70%) e tempo normalizado (30%)
    COALESCE(AVG(sono_qualidade * 0.7 + (sono_tempo_horas / 8 * 10) * 0.3), 0),
    -- Ambiente: média de exposição solar e natureza (normalizados)
    COALESCE(AVG((ambiente_sol_minutos / 30.0 * 10 * 0.5) + (ambiente_natureza_minutos / 60.0 * 10 * 0.5)), 0),
    -- Atividade Física: tempo e intensidade
    COALESCE(AVG((atividade_tempo_horas / 1.5 * 10 * 0.5) + (atividade_intensidade / 10.0 * 0.5)), 0),
    -- Sistema Nervoso: estresse invertido (menos é melhor) + mindfulness
    COALESCE(AVG(((100 - sistema_nervoso_estresse) / 10.0 * 0.6) + (sistema_nervoso_mindfulness_minutos / 20.0 * 10 * 0.4)), 0),
    -- Alimentação: refeições + hidratação
    COALESCE(AVG((alimentacao_refeicoes / 4.0 * 10 * 0.5) + (alimentacao_agua_litros / 2.5 * 10 * 0.5)), 0),
    -- Relacionamento: qualidade e satisfação
    COALESCE(AVG((relacionamento_qualidade / 10.0 * 0.5) + (relacionamento_satisfacao / 10.0 * 0.5)), 0),
    -- Sono em horas
    COALESCE(AVG(sono_tempo_horas), 0),
    -- Hidratação
    COALESCE(AVG(alimentacao_agua_litros), 0),
    -- Contagem de check-ins
    COUNT(*)
  INTO 
    v_equilibrio_sono, v_equilibrio_ambiente, v_equilibrio_atividade,
    v_equilibrio_nervoso, v_equilibrio_alimentacao, v_equilibrio_relacionamento,
    v_sono_horas, v_hidratacao, v_total_checkins
  FROM daily_checkins
  WHERE paciente_id = p_paciente_id
    AND data_checkin >= v_data_inicio;
  
  -- Calcular equilíbrio geral (média das 6 dimensões)
  v_equilibrio_geral := (
    v_equilibrio_sono + v_equilibrio_ambiente + v_equilibrio_atividade +
    v_equilibrio_nervoso + v_equilibrio_alimentacao + v_equilibrio_relacionamento
  ) / 6.0;
  
  -- Mental & Energia: combinação de sono, sistema nervoso e atividade física
  v_mental_energia := (v_equilibrio_sono * 0.4 + v_equilibrio_nervoso * 0.4 + v_equilibrio_atividade * 0.2);
  
  -- Aderência ao protocolo: % de dias com check-in nos últimos 7 dias
  v_aderencia := (v_total_checkins::DECIMAL / v_periodo_dias::DECIMAL) * 100;
  IF v_aderencia > 100 THEN
    v_aderencia := 100;
  END IF;
  
  -- Inserir ou atualizar métricas
  INSERT INTO patient_metrics (
    paciente_id, updated_at,
    equilibrio_geral, equilibrio_geral_variacao,
    qualidade_sono_horas, qualidade_sono_variacao_minutos,
    hidratacao_atual_litros, hidratacao_meta_litros,
    mental_energia, mental_energia_variacao,
    equilibrio_sono, equilibrio_ambiente, equilibrio_atividade_fisica,
    equilibrio_sistema_nervoso, equilibrio_alimentacao, equilibrio_relacionamento,
    aderencia_protocolo
  )
  VALUES (
    p_paciente_id, NOW(),
    v_equilibrio_geral, 0, -- variação será calculada posteriormente
    v_sono_horas, 0, -- variação será calculada posteriormente
    v_hidratacao, 2.4,
    v_mental_energia, 0, -- variação será calculada posteriormente
    v_equilibrio_sono, v_equilibrio_ambiente, v_equilibrio_atividade,
    v_equilibrio_nervoso, v_equilibrio_alimentacao, v_equilibrio_relacionamento,
    v_aderencia
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

-- 4. TRIGGER: Atualizar métricas automaticamente após inserção de check-in
CREATE OR REPLACE FUNCTION trigger_calculate_metrics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_patient_metrics(NEW.paciente_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_checkin_insert ON public.daily_checkins;
CREATE TRIGGER after_checkin_insert
  AFTER INSERT ON public.daily_checkins
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_metrics();

-- 5. Habilitar Row Level Security (RLS) se necessário
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_metrics ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Pacientes podem ver seus próprios check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem inserir seus próprios check-ins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Pacientes podem ver suas próprias métricas" ON public.patient_metrics;

-- Políticas RLS (ajuste conforme sua estratégia de segurança)
-- Os pacientes só podem ver seus próprios dados
CREATE POLICY "Pacientes podem ver seus próprios check-ins"
  ON public.daily_checkins
  FOR SELECT
  USING (paciente_id IN (
    SELECT id FROM patients WHERE user_auth = auth.uid()::text
  ));

CREATE POLICY "Pacientes podem inserir seus próprios check-ins"
  ON public.daily_checkins
  FOR INSERT
  WITH CHECK (paciente_id IN (
    SELECT id FROM patients WHERE user_auth = auth.uid()::text
  ));

CREATE POLICY "Pacientes podem ver suas próprias métricas"
  ON public.patient_metrics
  FOR SELECT
  USING (paciente_id IN (
    SELECT id FROM patients WHERE user_auth = auth.uid()::text
  ));

-- ========================================
-- INSTRUÇÕES DE USO:
-- ========================================
-- 1. Execute este script no Supabase SQL Editor
-- 2. As tabelas e funções serão criadas automaticamente
-- 3. Após cada check-in inserido, as métricas serão recalculadas via trigger
-- 4. Use a função calculate_patient_metrics('paciente_id') para recalcular manualmente se necessário


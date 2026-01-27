-- ========================================
-- VERSÃO MÍNIMA - SEM RLS - PARA TESTE
-- ========================================
-- Esta versão cria as tabelas SEM políticas de segurança
-- Use apenas para testar se as tabelas são criadas corretamente
-- ========================================

-- Limpar tudo que possa existir
DO $$ 
BEGIN
  -- Remover políticas se existirem
  DROP POLICY IF EXISTS "Pacientes podem ver check-ins" ON public.daily_checkins;
  DROP POLICY IF EXISTS "Pacientes podem inserir check-ins" ON public.daily_checkins;
  DROP POLICY IF EXISTS "Pacientes podem ver métricas" ON public.patient_metrics;
  
  -- Desabilitar RLS se existir
  ALTER TABLE IF EXISTS public.daily_checkins DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.patient_metrics DISABLE ROW LEVEL SECURITY;
  
  -- Remover triggers
  DROP TRIGGER IF EXISTS after_checkin_insert ON public.daily_checkins;
  
  -- Remover funções
  DROP FUNCTION IF EXISTS trigger_calculate_metrics() CASCADE;
  DROP FUNCTION IF EXISTS calculate_patient_metrics(UUID) CASCADE;
  DROP FUNCTION IF EXISTS calculate_patient_metrics(TEXT) CASCADE;
  
  -- Remover tabelas
  DROP TABLE IF EXISTS public.daily_checkins CASCADE;
  DROP TABLE IF EXISTS public.patient_metrics CASCADE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erro ao limpar: %', SQLERRM;
END $$;

-- ========================================
-- CRIAR TABELAS
-- ========================================

-- Tabela de check-ins diários
CREATE TABLE public.daily_checkins (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paciente_id UUID NOT NULL,
  data_checkin DATE NOT NULL DEFAULT CURRENT_DATE,
  
  sono_qualidade INTEGER,
  sono_tempo_horas DECIMAL(4,2),
  ambiente_sol_minutos INTEGER,
  ambiente_natureza_minutos INTEGER,
  atividade_tempo_horas DECIMAL(4,2),
  atividade_intensidade INTEGER,
  sistema_nervoso_estresse INTEGER,
  sistema_nervoso_mindfulness_minutos INTEGER,
  alimentacao_refeicoes INTEGER,
  alimentacao_agua_litros DECIMAL(4,2),
  relacionamento_qualidade INTEGER,
  relacionamento_satisfacao INTEGER,
  
  CONSTRAINT unique_checkin_per_day UNIQUE (paciente_id, data_checkin)
);

-- Tabela de métricas
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

-- Índices
CREATE INDEX idx_daily_checkins_paciente ON public.daily_checkins(paciente_id);
CREATE INDEX idx_daily_checkins_data ON public.daily_checkins(data_checkin DESC);
CREATE INDEX idx_patient_metrics_paciente ON public.patient_metrics(paciente_id);

-- ========================================
-- CRIAR FUNÇÃO DE CÁLCULO
-- ========================================

CREATE OR REPLACE FUNCTION calculate_patient_metrics(p_paciente_id UUID)
RETURNS VOID AS $$
DECLARE
  v_equilibrio_geral DECIMAL(4,2);
  v_sono_horas DECIMAL(4,2);
  v_hidratacao DECIMAL(4,2);
BEGIN
  -- Cálculo simplificado para teste
  SELECT 
    COALESCE(AVG((sono_qualidade::DECIMAL + 
                  (ambiente_sol_minutos / 12.0) + 
                  (atividade_tempo_horas * 2) + 
                  ((100 - sistema_nervoso_estresse) / 10.0) + 
                  (alimentacao_refeicoes * 2) + 
                  (relacionamento_qualidade / 10.0)) / 6.0), 0),
    COALESCE(AVG(sono_tempo_horas), 0),
    COALESCE(AVG(alimentacao_agua_litros), 0)
  INTO v_equilibrio_geral, v_sono_horas, v_hidratacao
  FROM daily_checkins
  WHERE paciente_id = p_paciente_id
    AND data_checkin >= CURRENT_DATE - 7;
  
  -- Inserir ou atualizar
  INSERT INTO patient_metrics (
    paciente_id, equilibrio_geral, qualidade_sono_horas, 
    hidratacao_atual_litros, aderencia_protocolo
  ) VALUES (
    p_paciente_id, v_equilibrio_geral, v_sono_horas, v_hidratacao, 100
  )
  ON CONFLICT (paciente_id) DO UPDATE SET
    equilibrio_geral = v_equilibrio_geral,
    qualidade_sono_horas = v_sono_horas,
    hidratacao_atual_litros = v_hidratacao,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- CRIAR TRIGGER
-- ========================================

CREATE OR REPLACE FUNCTION trigger_calculate_metrics()
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

-- ========================================
-- SUCESSO!
-- ========================================
-- Tabelas criadas sem RLS
-- Para adicionar RLS depois, execute o arquivo adicional








import { supabase } from './supabase-client';

/**
 * Verifica se o paciente já fez o check-in de hoje
 * @param {string} pacienteId - ID do paciente
 * @returns {Promise<boolean>} True se já fez check-in hoje
 */
export async function verificarCheckinHoje(pacienteId) {
  try {
    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Garantir que pacienteId seja string UUID
    const pacienteIdStr = String(pacienteId);
    
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('paciente_id', pacienteIdStr)
      .eq('data_checkin', hoje)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar check-in de hoje:', error);
      return false;
    }

    return !!data; // Retorna true se encontrou check-in
  } catch (err) {
    console.error('Erro ao verificar check-in:', err);
    return false;
  }
}

/**
 * Salva um check-in diário no banco de dados
 * @param {string} pacienteId - ID do paciente
 * @param {Object} dados - Dados do check-in
 * @returns {Promise<Object>} Resultado da operação
 */
export async function salvarCheckin(pacienteId, dados) {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const pacienteIdStr = String(pacienteId);

    // Verificar se já existe check-in hoje
    const jaFez = await verificarCheckinHoje(pacienteIdStr);
    if (jaFez) {
      return {
        success: false,
        error: 'Você já realizou o check-in de hoje!',
      };
    }

    // Preparar dados para inserção
    const checkinData = {
      paciente_id: pacienteIdStr,
      data_checkin: hoje,
      sono_qualidade: dados.sono?.qualidade || 0,
      sono_tempo_horas: dados.sono?.tempo || 0,
      ambiente_sol_minutos: dados.ambiente?.sol || 0,
      ambiente_natureza_minutos: dados.ambiente?.natureza || 0,
      atividade_tempo_horas: dados.atividade?.tempo || 0,
      atividade_intensidade: dados.atividade?.intensidade || 0,
      sistema_nervoso_estresse: dados.sistemaNervoso?.estresse || 0,
      sistema_nervoso_mindfulness_minutos: dados.sistemaNervoso?.mindfulness || 0,
      alimentacao_refeicoes: dados.alimentacao?.refeicoes || 0,
      alimentacao_agua_litros: dados.alimentacao?.agua || 0,
      relacionamento_qualidade: dados.relacionamento?.qualidade || 0,
      relacionamento_satisfacao: dados.relacionamento?.tempo || 0, // Nota: era "tempo" no código original
    };

    // Inserir check-in
    const { data: checkinInserido, error: checkinError } = await supabase
      .from('daily_checkins')
      .insert([checkinData])
      .select()
      .single();

    if (checkinError) {
      console.error('Erro ao salvar check-in:', checkinError);
      return {
        success: false,
        error: 'Erro ao salvar check-in. Tente novamente.',
      };
    }

    console.log('✅ Check-in salvo com sucesso:', checkinInserido);

    // As métricas serão atualizadas automaticamente via trigger no banco
    return {
      success: true,
      data: checkinInserido,
    };
  } catch (err) {
    console.error('Erro ao salvar check-in:', err);
    return {
      success: false,
      error: 'Erro inesperado ao salvar check-in.',
    };
  }
}

/**
 * Busca as métricas do paciente
 * @param {string} pacienteId - ID do paciente
 * @returns {Promise<Object|null>} Métricas do paciente ou null
 */
export async function buscarMetricasPaciente(pacienteId) {
  try {
    console.log('🔍 Buscando métricas do paciente:', pacienteId);
    const pacienteIdStr = String(pacienteId);

    const { data, error } = await supabase
      .from('patient_metrics')
      .select('*')
      .eq('paciente_id', pacienteIdStr)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar métricas:', error);
      return null;
    }

    if (!data) {
      console.log('⚠️ Nenhuma métrica encontrada. Paciente ainda não fez check-ins.');
      return null;
    }

    console.log('✅ Métricas encontradas:', data);
    return data;
  } catch (err) {
    console.error('Erro ao buscar métricas:', err);
    return null;
  }
}

/**
 * Busca histórico de check-ins para gráficos
 * @param {string} pacienteId - ID do paciente
 * @param {number} dias - Número de dias para buscar (padrão: 7)
 * @returns {Promise<Array>} Array de check-ins
 */
export async function buscarHistoricoCheckins(pacienteId, dias = 7) {
  try {
    console.log(`🔍 Buscando histórico de check-ins (últimos ${dias} dias):`, pacienteId);
    const pacienteIdStr = String(pacienteId);

    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    const dataInicioStr = dataInicio.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('paciente_id', pacienteIdStr)
      .gte('data_checkin', dataInicioStr)
      .order('data_checkin', { ascending: true });

    if (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }

    console.log(`✅ ${data.length} check-ins encontrados`);
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    return [];
  }
}

/**
 * Calcula equilíbrio geral de um check-in individual
 * @param {Object} checkin - Dados do check-in
 * @returns {number} Equilíbrio geral (0-10)
 */
export function calcularEquilibrioGeral(checkin) {
  // Sono: média ponderada de qualidade (70%) e tempo normalizado (30%)
  const sono = checkin.sono_qualidade * 0.7 + (checkin.sono_tempo_horas / 8 * 10) * 0.3;

  // Ambiente: média de exposição solar e natureza (normalizados)
  const ambiente = (checkin.ambiente_sol_minutos / 30.0 * 10 * 0.5) + (checkin.ambiente_natureza_minutos / 60.0 * 10 * 0.5);

  // Atividade Física: tempo e intensidade
  const atividade = (checkin.atividade_tempo_horas / 1.5 * 10 * 0.5) + (checkin.atividade_intensidade / 10.0 * 0.5);

  // Sistema Nervoso: estresse invertido (menos é melhor) + mindfulness
  const nervoso = ((100 - checkin.sistema_nervoso_estresse) / 10.0 * 0.6) + (checkin.sistema_nervoso_mindfulness_minutos / 20.0 * 10 * 0.4);

  // Alimentação: refeições + hidratação
  const alimentacao = (checkin.alimentacao_refeicoes / 4.0 * 10 * 0.5) + (checkin.alimentacao_agua_litros / 2.5 * 10 * 0.5);

  // Relacionamento: qualidade e satisfação
  const relacionamento = (checkin.relacionamento_qualidade / 10.0 * 0.5) + (checkin.relacionamento_satisfacao / 10.0 * 0.5);

  // Média das 6 dimensões
  const equilibrioGeral = (sono + ambiente + atividade + nervoso + alimentacao + relacionamento) / 6.0;

  return Math.min(Math.max(equilibrioGeral, 0), 10); // Garantir entre 0-10
}

/**
 * Processa histórico de check-ins para gráfico
 * @param {Array} checkins - Array de check-ins
 * @returns {Object} Dados formatados para gráfico
 */
export function processarDadosGrafico(checkins) {
  const labels = [];
  const equilibrioGeralData = [];

  checkins.forEach(checkin => {
    // Formatar data (ex: "01/Jan")
    const data = new Date(checkin.data_checkin + 'T00:00:00');
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    labels.push(`${dia}/${mes}`);

    // Calcular equilíbrio geral
    const equilibrio = calcularEquilibrioGeral(checkin);
    equilibrioGeralData.push(equilibrio.toFixed(1));
  });

  return {
    labels,
    datasets: [
      {
        name: 'Equilíbrio Geral',
        data: equilibrioGeralData,
      },
    ],
  };
}


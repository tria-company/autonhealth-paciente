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
      atividade_tempo_horas: dados.atividade?.tempo || 0,
      atividade_intensidade: dados.atividade?.intensidade || 0,
      alimentacao_refeicoes: dados.alimentacao?.refeicoes || 0,
      alimentacao_agua_litros: dados.alimentacao?.agua || 0,
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
 * Busca as métricas do paciente com timeout e retry
 * @param {string} pacienteId - ID do paciente
 * @param {number} tentativas - Número de tentativas (padrão: 1)
 * @returns {Promise<Object|null>} Métricas do paciente ou null
 */
export async function buscarMetricasPaciente(pacienteId, tentativas = 1) {
  try {
    console.log('🔍 Buscando métricas do paciente:', pacienteId);
    const pacienteIdStr = String(pacienteId);

    // Criar uma promise com timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao buscar métricas')), 8000);
    });

    const queryPromise = supabase
      .from('patient_metrics')
      .select('*')
      .eq('paciente_id', pacienteIdStr)
      .maybeSingle();

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Erro ao buscar métricas:', error);
      
      // Tentar novamente se for erro de rede e ainda tiver tentativas
      if (tentativas > 0 && (error.message?.includes('network') || error.message?.includes('timeout'))) {
        console.log('🔄 Tentando novamente buscar métricas...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        return buscarMetricasPaciente(pacienteId, tentativas - 1);
      }
      
      return null;
    }

    if (!data) {
      console.log('⚠️ Nenhuma métrica encontrada. Paciente ainda não fez check-ins.');
      return null;
    }

    console.log('✅ Métricas encontradas');
    return data;
  } catch (err) {
    console.error('❌ Erro ao buscar métricas:', err);
    
    // Tentar novamente se for timeout e ainda tiver tentativas
    if (tentativas > 0 && err.message?.includes('Timeout')) {
      console.log('🔄 Timeout - tentando novamente buscar métricas...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return buscarMetricasPaciente(pacienteId, tentativas - 1);
    }
    
    return null;
  }
}

/**
 * Busca histórico de check-ins para gráficos com timeout e retry
 * @param {string} pacienteId - ID do paciente
 * @param {number} dias - Número de dias para buscar (padrão: 7)
 * @param {number} tentativas - Número de tentativas (padrão: 1)
 * @returns {Promise<Array>} Array de check-ins
 */
export async function buscarHistoricoCheckins(pacienteId, dias = 7, tentativas = 1) {
  try {
    console.log(`🔍 Buscando histórico de check-ins (últimos ${dias} dias):`, pacienteId);
    const pacienteIdStr = String(pacienteId);

    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    const dataInicioStr = dataInicio.toISOString().split('T')[0];

    // Criar uma promise com timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao buscar histórico')), 8000);
    });

    const queryPromise = supabase
      .from('daily_checkins')
      .select('*')
      .eq('paciente_id', pacienteIdStr)
      .gte('data_checkin', dataInicioStr)
      .order('data_checkin', { ascending: true });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      
      // Tentar novamente se for erro de rede e ainda tiver tentativas
      if (tentativas > 0 && (error.message?.includes('network') || error.message?.includes('timeout'))) {
        console.log('🔄 Tentando novamente buscar histórico...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return buscarHistoricoCheckins(pacienteId, dias, tentativas - 1);
      }
      
      return [];
    }

    console.log(`✅ ${data?.length || 0} check-ins encontrados`);
    return data || [];
  } catch (err) {
    console.error('❌ Erro ao buscar histórico:', err);
    
    // Tentar novamente se for timeout e ainda tiver tentativas
    if (tentativas > 0 && err.message?.includes('Timeout')) {
      console.log('🔄 Timeout - tentando novamente buscar histórico...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return buscarHistoricoCheckins(pacienteId, dias, tentativas - 1);
    }
    
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

  // Atividade Física: tempo e intensidade
  const atividade = (checkin.atividade_tempo_horas / 1.5 * 10 * 0.5) + (checkin.atividade_intensidade / 10.0 * 0.5);

  // Alimentação: refeições + hidratação
  const alimentacao = (checkin.alimentacao_refeicoes / 4.0 * 10 * 0.5) + (checkin.alimentacao_agua_litros / 2.5 * 10 * 0.5);

  // Média das 3 dimensões
  const equilibrioGeral = (sono + atividade + alimentacao) / 3.0;

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


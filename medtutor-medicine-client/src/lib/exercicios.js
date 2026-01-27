import { supabase } from './supabase-client';

/**
 * Busca os exercícios físicos do paciente com timeout
 * @param {string} pacienteId - ID do paciente (UUID)
 * @param {number} tentativas - Número de tentativas (padrão: 1)
 * @returns {Promise<Array>} Array com os exercícios
 */
export async function buscarExerciciosPaciente(pacienteId, tentativas = 1) {
  console.log('🏋️ Buscando exercícios para paciente:', pacienteId);

  try {
    // Criar uma promise com timeout de 8 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao buscar exercícios')), 8000);
    });

    const queryPromise = supabase
      .from('s_exercicios_fisicos')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('id', { ascending: true });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Erro ao buscar exercícios:', error);
      
      // Tentar novamente se for erro de rede e ainda tiver tentativas
      if (tentativas > 0 && (error.message?.includes('network') || error.message?.includes('timeout'))) {
        console.log('🔄 Tentando novamente buscar exercícios...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return buscarExerciciosPaciente(pacienteId, tentativas - 1);
      }
      
      throw error;
    }

    console.log('✅ Exercícios encontrados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Erro na busca de exercícios:', error);
    
    // Tentar novamente se for timeout e ainda tiver tentativas
    if (tentativas > 0 && error.message?.includes('Timeout')) {
      console.log('🔄 Timeout - tentando novamente buscar exercícios...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return buscarExerciciosPaciente(pacienteId, tentativas - 1);
    }
    
    return [];
  }
}

/**
 * Agrupa exercícios por tipo de treino
 * @param {Array} exercicios - Array de exercícios do banco
 * @returns {Object} Exercícios agrupados por tipo de treino
 */
export function agruparExerciciosPorTipo(exercicios) {
  if (!exercicios || exercicios.length === 0) {
    return {};
  }

  const grupos = {};

  exercicios.forEach((exercicio) => {
    const tipo = exercicio.tipo_treino || 'Sem Tipo';
    
    if (!grupos[tipo]) {
      grupos[tipo] = [];
    }

    grupos[tipo].push({
      id: exercicio.id,
      nome: exercicio.nome_exercicio,
      series: exercicio.series,
      repeticoes: exercicio.repeticoes,
      descanso: exercicio.descanso,
      observacoes: exercicio.observacoes,
      grupoMuscular: exercicio.grupo_muscular,
      nomeTreino: exercicio.nome_treino,
      completo: true, // Por padrão, considerar como completo (pode ser customizado futuramente)
      videoUrl: null, // Não temos videoUrl no banco ainda
    });
  });

  return grupos;
}

/**
 * Busca exercícios e retorna já agrupados
 * @param {string} pacienteId - ID do paciente (UUID)
 * @returns {Promise<Object>} Exercícios agrupados por tipo
 */
export async function buscarExerciciosAgrupados(pacienteId) {
  const exercicios = await buscarExerciciosPaciente(pacienteId);
  return agruparExerciciosPorTipo(exercicios);
}



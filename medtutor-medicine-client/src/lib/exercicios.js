import { supabase } from './supabase-client';

/**
 * Busca os exercícios físicos do paciente
 * @param {string} pacienteId - ID do paciente (UUID)
 * @returns {Promise<Array>} Array com os exercícios
 */
export async function buscarExerciciosPaciente(pacienteId) {
  console.log('🏋️ Buscando exercícios para paciente:', pacienteId);

  try {
    const { data, error } = await supabase
      .from('s_exercicios_fisicos')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar exercícios:', error);
      throw error;
    }

    console.log('✅ Exercícios encontrados:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('📋 Primeiro exercício:', data[0]);
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ Erro na busca de exercícios:', error);
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

